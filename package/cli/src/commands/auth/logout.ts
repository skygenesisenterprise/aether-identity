import { Command } from "commander";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";

export const logoutCommand = new Command("logout")
  .description("Logout from Aether Identity")
  .action(async () => {
    outputManager.setOptions({});

    if (!authManager.isAuthenticated()) {
      outputManager.info("Not logged in");
      return;
    }

    authManager.clearAuth();
    outputManager.success("Logged out successfully");
  });
