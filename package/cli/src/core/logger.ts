import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerConfig {
  level: LogLevel;
  output?: "console" | "file" | "both";
  filePath?: string;
}

class Logger {
  private level: LogLevel = "info";
  private output: "console" | "file" | "both" = "console";
  private filePath: string;

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    const homeDir = os.homedir();
    const logDir = path.join(homeDir, ".identity", "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.filePath = path.join(logDir, "identity.log");
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setOutput(output: "console" | "file" | "both"): void {
    this.output = output;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  private writeToFile(message: string): void {
    fs.appendFileSync(this.filePath, message + os.EOL);
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("debug")) return;
    const formatted = this.formatMessage("debug", message);
    if (this.output === "console" || this.output === "both") {
      console.debug(formatted, ...args);
    }
    if (this.output === "file" || this.output === "both") {
      this.writeToFile(formatted);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("info")) return;
    const formatted = this.formatMessage("info", message);
    if (this.output === "console" || this.output === "both") {
      console.info(formatted, ...args);
    }
    if (this.output === "file" || this.output === "both") {
      this.writeToFile(formatted);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("warn")) return;
    const formatted = this.formatMessage("warn", message);
    if (this.output === "console" || this.output === "both") {
      console.warn(formatted, ...args);
    }
    if (this.output === "file" || this.output === "both") {
      this.writeToFile(formatted);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("error")) return;
    const formatted = this.formatMessage("error", message);
    if (this.output === "console" || this.output === "both") {
      console.error(formatted, ...args);
    }
    if (this.output === "file" || this.output === "both") {
      this.writeToFile(formatted);
    }
  }
}

export const logger = new Logger();
