import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { configManager } from "./config.js";
import { authManager } from "./auth.js";
import type { ApiResponse } from "../types/index.js";

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: configManager.getEndpoint(),
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = authManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          const refreshToken = authManager.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await axios.post(`${configManager.getEndpoint()}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
              authManager.saveTokens(accessToken, newRefreshToken, expiresIn);

              if (error.config) {
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return this.client.request(error.config);
              }
            } catch {
              authManager.clearAuth();
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setEndpoint(endpoint: string): void {
    this.client.defaults.baseURL = endpoint;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiResponse<never> {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: { message?: string } })?.error?.message || error.message;
      return {
        error: {
          code: error.code || "API_ERROR",
          message,
        },
      };
    }
    return {
      error: {
        code: "UNKNOWN_ERROR",
        message: "An unknown error occurred",
      },
    };
  }
}

export const apiClient = new ApiClient();
