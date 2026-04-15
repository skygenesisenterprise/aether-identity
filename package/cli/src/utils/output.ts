import chalk from "chalk";
import ora from "ora";
import type { Ora } from "ora";

export interface OutputOptions {
  json?: boolean;
  verbose?: boolean;
}

export class OutputManager {
  private spinner: Ora | null = null;
  private isJson: boolean = false;
  private isVerbose: boolean = false;

  setOptions(options: OutputOptions): void {
    this.isJson = options.json ?? false;
    this.isVerbose = options.verbose ?? false;
  }

  startSpinner(text: string): void {
    this.spinner = ora(text).start();
  }

  stopSpinner(success?: boolean): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed();
      } else {
        this.spinner.fail();
      }
      this.spinner = null;
    }
  }

  success(message: string): void {
    if (this.isJson) {
      console.log(JSON.stringify({ status: "success", message }, null, 2));
    } else {
      console.log(chalk.green("✓") + " " + message);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.isJson) {
      console.error(
        JSON.stringify({ status: "error", message, error: this.formatError(error) }, null, 2)
      );
    } else {
      console.error(chalk.red("✗") + " " + message);
      if (this.isVerbose && error) {
        console.error(chalk.gray(this.formatError(error)));
      }
    }
  }

  warn(message: string): void {
    if (this.isJson) {
      console.log(JSON.stringify({ status: "warning", message }, null, 2));
    } else {
      console.log(chalk.yellow("⚠") + " " + message);
    }
  }

  info(message: string): void {
    if (this.isJson) {
      console.log(JSON.stringify({ status: "info", message }, null, 2));
    } else {
      console.log(chalk.blue("ℹ") + " " + message);
    }
  }

  log(message: string): void {
    console.log(message);
  }

  json<T>(data: T): void {
    console.log(JSON.stringify(data, null, 2));
  }

  table(data: Record<string, unknown>[]): void {
    if (data.length === 0) {
      this.info("No data to display");
      return;
    }

    const keys = Object.keys(data[0]);
    const columnWidths = keys.map((key) => {
      const maxKeyLength = key.length;
      const maxValueLength = Math.max(...data.map((row) => String(row[key] || "").length));
      return Math.max(maxKeyLength, maxValueLength);
    });

    const header = keys.map((key, i) => chalk.bold(key.padEnd(columnWidths[i]))).join(" | ");
    console.log(header);
    console.log(columnWidths.map((w) => "-".repeat(w)).join("-+-"));

    for (const row of data) {
      const line = keys.map((key, i) => String(row[key] || "").padEnd(columnWidths[i])).join(" | ");
      console.log(line);
    }
  }

  private formatError(error?: unknown): string {
    if (!error) return "";
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}

export const outputManager = new OutputManager();
