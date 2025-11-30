import crypto from 'crypto';
import { prisma } from '../config/database';

export interface WebhookEvent {
  type: string;
  userId?: string;
  data: any;
  timestamp: Date;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  response?: string;
  error?: string;
}

export class WebhookService {
  private prisma = prisma;

  /**
   * Create a new webhook subscription
   */
  async createWebhook(data: {
    url: string;
    events: string[];
    description?: string;
    createdBy: string;
    timeout?: number;
    retryCount?: number;
  }): Promise<any> {
    const secret = crypto.randomBytes(32).toString('hex');
    
    return await this.prisma.webhook.create({
      data: {
        url: data.url,
        secret,
        events: JSON.stringify(data.events),
        description: data.description,
        timeout: data.timeout || 30000,
        retryCount: data.retryCount || 3,
        createdBy: data.createdBy
      }
    });
  }

  /**
   * Update webhook subscription
   */
  async updateWebhook(id: string, data: Partial<{
    url: string;
    events: string[];
    description: string;
    isActive: boolean;
    timeout: number;
    retryCount: number;
  }>): Promise<any> {
    const updateData: any = { ...data };
    
    if (data.events) {
      updateData.events = JSON.stringify(data.events);
    }

    return await this.prisma.webhook.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete webhook subscription
   */
  async deleteWebhook(id: string): Promise<void> {
    await this.prisma.webhook.delete({
      where: { id }
    });
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(id: string): Promise<any> {
    return await this.prisma.webhook.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, email: true, profile: true }
        },
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  /**
   * List all webhooks
   */
  async listWebhooks(filters?: {
    isActive?: boolean;
    createdBy?: string;
    event?: string;
  }): Promise<any[]> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }
    
    if (filters?.event) {
      where.events = {
        contains: filters.event
      };
    }

    return await this.prisma.webhook.findMany({
      where,
      include: {
        creator: {
          select: { id: true, email: true, profile: true }
        },
        _count: {
          select: { deliveries: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(event: WebhookEvent): Promise<WebhookDeliveryResult[]> {
    // Find all active webhooks that subscribe to this event type
    const webhooks = await this.prisma.webhook.findMany({
      where: {
        isActive: true,
        events: {
          contains: event.type
        }
      }
    });

    const results: WebhookDeliveryResult[] = [];

    for (const webhook of webhooks) {
      const result = await this.deliverWebhook(webhook, event);
      results.push(result);
    }

    return results;
  }

  /**
   * Deliver webhook to specific endpoint
   */
  private async deliverWebhook(webhook: any, event: WebhookEvent): Promise<WebhookDeliveryResult> {
    const payload = {
      id: crypto.randomUUID(),
      event: event.type,
      data: event.data,
      timestamp: event.timestamp.toISOString(),
      signature: null // Will be added below
    };

    // Generate HMAC signature
    const signature = this.generateSignature(webhook.secret, JSON.stringify(payload));
    payload.signature = signature;

    let attempts = 0;
    let lastError: string | undefined;

    while (attempts < webhook.retryCount) {
      attempts++;
      
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Aether-Identity-Webhooks/1.0',
            'X-Webhook-Event': event.type,
            'X-Webhook-Signature': signature,
            'X-Webhook-ID': payload.id
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(webhook.timeout)
        });

        const responseText = await response.text();
        const success = response.ok;

        // Create delivery record
        await this.prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            eventType: event.type,
            payload: JSON.stringify(payload),
            response: responseText,
            statusCode: response.status,
            success,
            attempts,
            maxAttempts: webhook.retryCount,
            deliveredAt: success ? new Date() : null,
            nextRetryAt: !success && attempts < webhook.retryCount 
              ? new Date(Date.now() + Math.pow(2, attempts) * 60000) // Exponential backoff
              : null
          }
        });

        if (success) {
          return {
            success: true,
            statusCode: response.status,
            response: responseText
          };
        } else {
          lastError = `HTTP ${response.status}: ${responseText}`;
        }

      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Create failed delivery record
        await this.prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            eventType: event.type,
            payload: JSON.stringify(payload),
            success: false,
            attempts,
            maxAttempts: webhook.retryCount,
            nextRetryAt: attempts < webhook.retryCount 
              ? new Date(Date.now() + Math.pow(2, attempts) * 60000)
              : null
          }
        });
      }
    }

    return {
      success: false,
      error: lastError
    };
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(secret: string, payload: string): string {
    return 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(secret: string, payload: string, signature: string): boolean {
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Retry failed webhook deliveries
   */
  async retryFailedDeliveries(): Promise<void> {
    const failedDeliveries = await this.prisma.webhookDelivery.findMany({
      where: {
        success: false,
        attempts: { lt: this.prisma.webhookDelivery.fields.maxAttempts },
        nextRetryAt: { lte: new Date() }
      },
      include: {
        webhook: true
      }
    });

    for (const delivery of failedDeliveries) {
      const event: WebhookEvent = {
        type: delivery.eventType,
        data: JSON.parse(delivery.payload).data,
        timestamp: new Date(JSON.parse(delivery.payload).timestamp)
      };

      await this.deliverWebhook(delivery.webhook, event);
    }
  }

  /**
   * Get webhook delivery statistics
   */
  async getWebhookStats(webhookId: string, timeRange?: { from: Date; to: Date }): Promise<any> {
    const where: any = { webhookId };
    
    if (timeRange) {
      where.createdAt = {
        gte: timeRange.from,
        lte: timeRange.to
      };
    }

    const [total, successful, failed, recent] = await Promise.all([
      this.prisma.webhookDelivery.count({ where }),
      this.prisma.webhookDelivery.count({ where: { ...where, success: true } }),
      this.prisma.webhookDelivery.count({ where: { ...where, success: false } }),
      this.prisma.webhookDelivery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      recentDeliveries: recent
    };
  }
}

export const webhookService = new WebhookService();