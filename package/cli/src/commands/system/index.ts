import { Command } from "commander";
import inquirer from "inquirer";
import { configManager } from "../../core/config.js";
import { contextManager } from "../../core/context.js";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";
import type { Environment } from "../../types/index.js";

const configCommand = new Command("config")
  .description("Manage CLI configuration")
  .action(async () => {
    outputManager.setOptions({});

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "endpoint",
        message: "API Endpoint:",
        default: configManager.getEndpoint(),
        choices: [
          "http://localhost:3000",
          "https://api.dev.aetheridentity.io",
          "https://api.staging.aetheridentity.io",
          "https://api.aetheridentity.io",
          "custom",
        ],
      },
      {
        type: "list",
        name: "environment",
        message: "Environment:",
        default: configManager.getEnvironment(),
        choices: ["dev", "staging", "prod"],
      },
    ]);

    if (answers.endpoint === "custom") {
      const customEndpoint = await inquirer.prompt([
        {
          type: "input",
          name: "endpoint",
          message: "Enter custom endpoint URL:",
        },
      ]);
      contextManager.setEndpoint(customEndpoint.endpoint);
    } else {
      contextManager.setEndpoint(answers.endpoint);
    }

    contextManager.setEnvironment(answers.environment as Environment);
    outputManager.success("Configuration updated");
  });

const doctorCommand = new Command("doctor")
  .description("Diagnose CLI configuration")
  .action(async () => {
    outputManager.setOptions({});

    outputManager.log("Running diagnostics...\n");

    outputManager.log("Configuration:");
    const config = configManager.getAll();
    outputManager.log(`  Endpoint: ${config.endpoint}`);
    outputManager.log(`  Environment: ${config.environment}`);
    outputManager.log(`  Auth: ${config.auth ? "configured" : "not configured"}`);

    const isAuth = authManager.isAuthenticated();
    outputManager.log(`\nAuthentication: ${isAuth ? "✓ valid" : "✗ not authenticated"}`);

    const endpoint = config.endpoint;
    const url = new URL(endpoint);
    const net = await import("net");

    const checkPort = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);
        socket.on("connect", () => {
          socket.destroy();
          resolve(true);
        });
        socket.on("timeout", () => {
          socket.destroy();
          resolve(false);
        });
        socket.on("error", () => {
          socket.destroy();
          resolve(false);
        });
        socket.connect(String(url.port || (url.protocol === "https:" ? 443 : 80)), url.hostname);
      });
    };

    outputManager.log("\nConnectivity:");
    outputManager.startSpinner(`Checking ${endpoint}...`);
    const reachable = await checkPort();
    outputManager.stopSpinner(reachable);

    if (reachable) {
      outputManager.success(`Endpoint ${endpoint} is reachable`);
    } else {
      outputManager.error(`Endpoint ${endpoint} is not reachable`);
    }
  });

export const systemGroup = new Command("system").description("System commands");

systemGroup.addCommand(configCommand);
systemGroup.addCommand(doctorCommand);

export { configCommand, doctorCommand };
