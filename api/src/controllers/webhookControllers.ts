import { Request, Response } from 'express';
import { webhookService } from '../services/webhookService';
import { prisma } from '../config/database';

export class WebhookController {
  /**
   * Create a new webhook subscription
   */
  async createWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { url, events, description, timeout, retryCount } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate required fields
      if (!url || !events || !Array.isArray(events)) {
        res.status(400).json({ 
          error: 'Bad Request',
          message: 'URL and events array are required'
        });
        return;
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        res.status(400).json({ 
          error: 'Bad Request',
          message: 'Invalid URL format'
        });
        return;
      }

      const webhook = await webhookService.createWebhook({
        url,
        events,
        description,
        createdBy: userId,
        timeout,
        retryCount
      });

      // Return webhook without secret
      const { secret, ...webhookResponse } = webhook;
      
      res.status(201).json({
        success: true,
        webhook: webhookResponse
      });

    } catch (error) {
      console.error('Create webhook error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create webhook'
      });
    }
  }

  /**
   * Update webhook subscription
   */
  async updateWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { url, events, description, isActive, timeout, retryCount } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check if webhook exists and user has permission
      const existingWebhook = await prisma.webhook.findUnique({
        where: { id }
      });

      if (!existingWebhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }

      if (existingWebhook.createdBy !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      const webhook = await webhookService.updateWebhook(id, {
        url,
        events,
        description,
        isActive,
        timeout,
        retryCount
      });

      res.json({
        success: true,
        webhook
      });

    } catch (error) {
      console.error('Update webhook error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update webhook'
      });
    }
  }

  /**
   * Delete webhook subscription
   */
  async deleteWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check if webhook exists and user has permission
      const existingWebhook = await prisma.webhook.findUnique({
        where: { id }
      });

      if (!existingWebhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }

      if (existingWebhook.createdBy !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      await webhookService.deleteWebhook(id);

      res.json({
        success: true,
        message: 'Webhook deleted successfully'
      });

    } catch (error) {
      console.error('Delete webhook error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete webhook'
      });
    }
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const webhook = await webhookService.getWebhook(id);

      if (!webhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }

      // Check if user has permission (admin or creator)
      if (webhook.createdBy !== userId && (req as any).user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Return webhook without secret
      const { secret, ...webhookResponse } = webhook;

      res.json({
        success: true,
        webhook: webhookResponse
      });

    } catch (error) {
      console.error('Get webhook error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get webhook'
      });
    }
  }

  /**
   * List webhooks
   */
  async listWebhooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const filters: any = {};
      
      // Non-admin users can only see their own webhooks
      if (userRole !== 'ADMIN') {
        filters.createdBy = userId;
      }

      // Apply query filters
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }

      if (req.query.event) {
        filters.event = req.query.event as string;
      }

      const webhooks = await webhookService.listWebhooks(filters);

      // Remove secrets from response
      const webhooksResponse = webhooks.map(webhook => {
        const { secret, ...webhookWithoutSecret } = webhook;
        return webhookWithoutSecret;
      });

      res.json({
        success: true,
        webhooks: webhooksResponse,
        count: webhooksResponse.length
      });

    } catch (error) {
      console.error('List webhooks error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to list webhooks'
      });
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check if webhook exists and user has permission
      const webhook = await prisma.webhook.findUnique({
        where: { id }
      });

      if (!webhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }

      if (webhook.createdBy !== userId && (req as any).user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Parse time range from query parameters
      let timeRange;
      if (req.query.from && req.query.to) {
        timeRange = {
          from: new Date(req.query.from as string),
          to: new Date(req.query.to as string)
        };
      }

      const stats = await webhookService.getWebhookStats(id, timeRange);

      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Get webhook stats error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get webhook statistics'
      });
    }
  }

  /**
   * Test webhook delivery
   */
  async testWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { eventType, testData } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check if webhook exists and user has permission
      const webhook = await prisma.webhook.findUnique({
        where: { id }
      });

      if (!webhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }

      if (webhook.createdBy !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Create test event
      const testEvent = {
        type: eventType || 'webhook.test',
        userId,
        data: testData || { message: 'Test webhook delivery', timestamp: new Date() },
        timestamp: new Date()
      };

      const results = await webhookService.triggerEvent(testEvent);

      res.json({
        success: true,
        testEvent: eventType || 'webhook.test',
        results
      });

    } catch (error) {
      console.error('Test webhook error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to test webhook'
      });
    }
  }

  /**
   * Retry failed webhook deliveries
   */
  async retryFailedDeliveries(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;

      if (!userId || userRole !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
        return;
      }

      await webhookService.retryFailedDeliveries();

      res.json({
        success: true,
        message: 'Failed webhook deliveries retry initiated'
      });

    } catch (error) {
      console.error('Retry webhook deliveries error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retry webhook deliveries'
      });
    }
  }
}