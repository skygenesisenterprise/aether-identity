import { Command } from "commander";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { User, ListResponse } from "../../types/index.js";

const listUsersCommand = new Command("list")
  .description("List all users")
  .option("--json", "Output as JSON")
  .option("--page <number>", "Page number", "1")
  .option("--page-size <number>", "Page size", "20")
  .action(async (options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Fetching users...");

    try {
      const response = await apiClient.get<ListResponse<User>>(
        `/users?page=${options.page}&pageSize=${options.pageSize}`
      );

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        if (options.json) {
          outputManager.json(response.data);
        } else {
          outputManager.log(`Total: ${response.data.total}`);
          const tableData = response.data.data.map((user) => ({
            ID: user.id.slice(0, 8),
            Email: user.email,
            Name: user.name,
            Verified: user.emailVerified ? "Yes" : "No",
          }));
          outputManager.table(tableData);
        }
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch users", message);
      process.exit(1);
    }
  });

const getUserCommand = new Command("get")
  .description("Get user by ID")
  .argument("<id>", "User ID")
  .option("--json", "Output as JSON")
  .action(async (id: string, options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Fetching user...");

    try {
      const response = await apiClient.get<User>(`/users/${id}`);

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        if (options.json) {
          outputManager.json(response.data);
        } else {
          outputManager.log(`Email: ${response.data.email}`);
          outputManager.log(`Name: ${response.data.name}`);
          outputManager.log(`Email Verified: ${response.data.emailVerified}`);
          outputManager.log(`Created: ${response.data.createdAt}`);
        }
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch user", message);
      process.exit(1);
    }
  });

export const userGroup = new Command("user").description("User management commands");

userGroup.addCommand(listUsersCommand);
userGroup.addCommand(getUserCommand);

export { listUsersCommand, getUserCommand };
