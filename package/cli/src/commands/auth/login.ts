import { Command } from "commander";
import inquirer from "inquirer";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";

import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { LoginRequest, LoginResponse } from "../../types/index.js";

export const loginCommand = new Command("login")
  .description("Login to Aether Identity")
  .action(async () => {
    outputManager.setOptions({});
    outputManager.startSpinner("Authenticating...");

    try {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Email:",
          validate: (value: string) => {
            if (!value || !value.includes("@")) {
              return "Please enter a valid email";
            }
            return true;
          },
        },
        {
          type: "password",
          name: "password",
          message: "Password:",
          validate: (value: string) => {
            if (!value || value.length < 8) {
              return "Password must be at least 8 characters";
            }
            return true;
          },
        },
      ]);

      const response = await apiClient.post<LoginResponse>("/auth/login", answers as LoginRequest);

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        authManager.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.expiresIn
        );
        outputManager.stopSpinner(true);
        outputManager.success(`Logged in as ${response.data.user.email}`);
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Login failed", message);
      process.exit(1);
    }
  });
