#!/usr/bin/env node

import { Command } from "commander";
import { contextManager } from "./core/context.js";

import { authGroup } from "./commands/auth/index.js";
import { userGroup } from "./commands/user/index.js";
import { deviceGroup } from "./commands/device/index.js";
import { nodeGroup } from "./commands/node/index.js";
import { vaultGroup } from "./commands/vault/index.js";
import { policyGroup } from "./commands/policy/index.js";
import { systemGroup } from "./commands/system/index.js";

const program = new Command();

program
  .name("identity")
  .description("Aether Identity CLI - DevOps and automation interface")
  .version("1.0.0")
  .hook("preAction", () => {
    contextManager.getContext();
  });

program.addCommand(authGroup);
program.addCommand(userGroup);
program.addCommand(deviceGroup);
program.addCommand(nodeGroup);
program.addCommand(vaultGroup);
program.addCommand(policyGroup);
program.addCommand(systemGroup);

program.parse(process.argv);
