import type { FetchLike } from "../types";
import { createErrorFromResponse, NetworkError, ServerError } from "../errors";

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface TransportConfig {
  baseUrl: string;
  fetcher: FetchLike;
  clientId: string;
  systemKey?: string;
  maxRetries?: number;
  retryDelay?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;
  if (error instanceof ServerError) return true;
  return false;
}

class Transport {
  private config: TransportConfig;

  constructor(config: TransportConfig) {
    this.config = {
      maxRetries: DEFAULT_MAX_RETRIES,
      retryDelay: DEFAULT_RETRY_DELAY,
      ...config,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions,
    retries = this.config.maxRetries,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    try {
      const response = await this.config.fetcher(url, options);

      if (!response.ok) {
        let data: unknown;
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        const error = createErrorFromResponse(response.status, data);

        if (isRetryableError(error) && retries! > 0) {
          await sleep(
            this.config.retryDelay! * (this.config.maxRetries! - retries! + 1),
          );
          return this.request<T>(endpoint, options, retries! - 1);
        }

        throw error;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        throw error;
      }

      if (retries! > 0) {
        await sleep(
          this.config.retryDelay! * (this.config.maxRetries! - retries! + 1),
        );
        return this.request<T>(endpoint, options, retries! - 1);
      }

      throw new NetworkError("Network error occurred");
    }
  }

  async get<T>(endpoint: string, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client-ID": this.config.clientId,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (this.config.systemKey) {
      headers["X-System-Key"] = this.config.systemKey;
    }

    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    accessToken?: string,
    useSystemKeyAsAuth?: boolean,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client-ID": this.config.clientId,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else if (useSystemKeyAsAuth && this.config.systemKey) {
      headers["Authorization"] = `Bearer ${this.config.systemKey}`;
    }

    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    accessToken?: string,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client-ID": this.config.clientId,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return this.request<T>(endpoint, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client-ID": this.config.clientId,
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (this.config.systemKey) {
      headers["X-System-Key"] = this.config.systemKey;
    }

    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export { Transport };
