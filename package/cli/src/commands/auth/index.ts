import { Command } from "commander";
import { loginCommand } from "./login.js";
import { logoutCommand } from "./logout.js";
import { whoamiCommand } from "./whoami.js";

export const authGroup = new Command("auth").description("Authentication commands");

authGroup.addCommand(loginCommand);
authGroup.addCommand(logoutCommand);
authGroup.addCommand(whoamiCommand);

export { loginCommand, logoutCommand, whoamiCommand };
