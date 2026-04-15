import { Command } from "commander";
import inquirer from "inquirer";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { VaultSecret } from "../../types/index.js";

const getSecretCommand = new Command("get")
  .description("Get a secret from vault")
  .argument("<key>", "Secret key")
  .option("--json", "Output as JSON")
  .option("--show", "Show secret value")
  .action(async (key: string, options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Fetching secret...");

    try {
      const response = await apiClient.get<VaultSecret>(`/vault/${key}`);

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        if (options.json) {
          outputManager.json(response.data);
        } else if (options.show) {
          outputManager.log(`Key: ${response.data.key}`);
          outputManager.log(`Value: ${response.data.value}`);
          outputManager.log(`Updated: ${response.data.updatedAt}`);
        } else {
          outputManager.info(`Secret '${key}' exists`);
          outputManager.log(`Updated: ${response.data.updatedAt}`);
        }
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch secret", message);
      process.exit(1);
    }
  });

const setSecretCommand = new Command("set")
  .description("Set a secret in vault")
  .argument("<key>", "Secret key")
  .option("--value <value>", "Secret value")
  .option("--file <file>", "Read value from file")
  .action(async (key: string, options) => {
    outputManager.setOptions({});

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    let value: string;

    if (options.file) {
      try {
        const fs = await import("fs");
        value = fs.readFileSync(options.file, "utf-8").trim();
      } catch {
        outputManager.error(`Could not read file: ${options.file}`);
        process.exit(1);
      }
    } else if (options.value) {
      value = options.value;
    } else {
      const answers = await inquirer.prompt([
        {
          type: "password",
          name: "value",
          message: `Secret value for '${key}':`,
          validate: (v: string) => {
            if (!v) return "Secret value is required";
            return true;
          },
        },
      ]);
      value = answers.value;
    }

    outputManager.startSpinner("Setting secret...");

    try {
      const response = await apiClient.post<VaultSecret>(`/vault/${key}`, { value });

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        outputManager.success(`Secret '${key}' set successfully`);
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to set secret", message);
      process.exit(1);
    }
  });

export const vaultGroup = new Command("vault").description("Vault secret management commands");

vaultGroup.addCommand(getSecretCommand);
vaultGroup.addCommand(setSecretCommand);

export { getSecretCommand, setSecretCommand };
