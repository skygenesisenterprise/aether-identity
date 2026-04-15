import { Command } from "commander";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";

import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { WhoamiResponse } from "../../types/index.js";

export const whoamiCommand = new Command("whoami")
  .description("Show current user info")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    if (options.json) {
      outputManager.startSpinner("Fetching user info...");
    }

    try {
      const response = await apiClient.get<WhoamiResponse>("/auth/whoami");

      if (response.error) {
        if (options.json) outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        if (options.json) {
          outputManager.stopSpinner(true);
          outputManager.json(response.data);
        } else {
          outputManager.stopSpinner(true);
          outputManager.log("User Information:");
          outputManager.log(`  Email: ${response.data.user.email}`);
          outputManager.log(`  Name: ${response.data.user.name}`);
          outputManager.log(`  Organizations: ${response.data.organizations.join(", ")}`);
          outputManager.log(`  Permissions: ${response.data.permissions.join(", ")}`);
        }
      }
    } catch (error) {
      if (options.json) outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch user info", message);
      process.exit(1);
    }
  });
