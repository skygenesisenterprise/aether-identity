import Conf from "conf";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { StoredConfig, Environment } from "../types/index.js";

const CONFIG_VERSION = "1.0.0";

class ConfigManager {
  private config: Conf<StoredConfig>;

  constructor() {
    const homeDir = os.homedir();
    const configDir = path.join(homeDir, ".identity");

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    this.config = new Conf<StoredConfig>({
      cwd: configDir,
      fileName: "config.json",
      defaults: {
        version: CONFIG_VERSION,
        endpoint: "http://localhost:3000",
        environment: "dev",
      },
    });
  }

  get<K extends keyof StoredConfig>(key: K): StoredConfig[K] {
    return this.config.get(key);
  }

  set<K extends keyof StoredConfig>(key: K, value: StoredConfig[K]): void {
    this.config.set(key, value);
  }

  getEndpoint(): string {
    return this.config.get("endpoint");
  }

  setEndpoint(endpoint: string): void {
    this.config.set("endpoint", endpoint);
  }

  getEnvironment(): Environment {
    return this.config.get("environment");
  }

  setEnvironment(environment: Environment): void {
    this.config.set("environment", environment);
  }

  getAuth() {
    return this.config.get("auth");
  }

  setAuth(auth: StoredConfig["auth"]): void {
    if (auth) {
      this.config.set("auth", auth);
    } else {
      this.config.delete("auth");
    }
  }

  hasAuth(): boolean {
    const auth = this.config.get("auth");
    return !!auth && !!auth.accessToken;
  }

  clearAuth(): void {
    this.config.delete("auth");
  }

  getAll(): StoredConfig {
    return {
      version: this.config.get("version"),
      endpoint: this.config.get("endpoint"),
      environment: this.config.get("environment"),
      auth: this.config.get("auth"),
    };
  }

  reset(): void {
    this.config.clear();
    this.config.set("version", CONFIG_VERSION);
    this.config.set("endpoint", "http://localhost:3000");
    this.config.set("environment", "dev");
  }
}

export const configManager = new ConfigManager();
