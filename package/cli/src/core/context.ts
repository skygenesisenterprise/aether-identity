import { configManager } from "./config.js";
import { authManager } from "./auth.js";
import type { Environment } from "../types/index.js";

export interface CliContext {
  endpoint: string;
  environment: Environment;
  isAuthenticated: boolean;
  userId?: string;
}

export class ContextManager {
  getContext(): CliContext {
    return {
      endpoint: configManager.getEndpoint(),
      environment: configManager.getEnvironment(),
      isAuthenticated: authManager.isAuthenticated(),
    };
  }

  setEndpoint(endpoint: string): void {
    configManager.setEndpoint(endpoint);
  }

  setEnvironment(environment: Environment): void {
    configManager.setEnvironment(environment);
  }
}

export const contextManager = new ContextManager();
