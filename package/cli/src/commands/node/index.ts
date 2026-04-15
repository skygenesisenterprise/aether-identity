import { Command } from "commander";
import inquirer from "inquirer";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { Node, NodeRegisterInput } from "../../types/index.js";

const registerNodeCommand = new Command("register")
  .description("Register a new node")
  .option("--name <name>", "Node name")
  .option("--type <type>", "Node type", "server")
  .option("--address <address>", "Node address")
  .option("--port <port>", "Node port", "3000")
  .action(async (options) => {
    outputManager.setOptions({});

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Registering node...");

    let input: NodeRegisterInput;

    if (options.name && options.address) {
      input = {
        name: options.name,
        type: options.type as Node["type"],
        address: options.address,
        port: parseInt(options.port, 10),
      };
    } else {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Node name:",
          validate: (value: string) => {
            if (!value) return "Node name is required";
            return true;
          },
        },
        {
          type: "list",
          name: "type",
          message: "Node type:",
          choices: ["server", "switch", "router", "endpoint"],
          default: "server",
        },
        {
          type: "input",
          name: "address",
          message: "Node address:",
          validate: (value: string) => {
            if (!value) return "Node address is required";
            return true;
          },
        },
        {
          type: "number",
          name: "port",
          message: "Node port:",
          default: 3000,
        },
      ]);

      input = answers as NodeRegisterInput;
    }

    try {
      const response = await apiClient.post<Node>("/nodes", input);

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        outputManager.success(`Node registered: ${response.data.name}`);
        outputManager.log(`ID: ${response.data.id}`);
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to register node", message);
      process.exit(1);
    }
  });

const statusNodeCommand = new Command("status")
  .description("Get node status")
  .argument("<id>", "Node ID")
  .option("--json", "Output as JSON")
  .action(async (id: string, options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Fetching node status...");

    try {
      const response = await apiClient.get<Node>(`/nodes/${id}`);

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
          outputManager.log(`Name: ${response.data.name}`);
          outputManager.log(`Type: ${response.data.type}`);
          outputManager.log(`Address: ${response.data.address}:${response.data.port}`);
          outputManager.log(`Status: ${response.data.status}`);
          outputManager.log(`Last Seen: ${response.data.lastSeen}`);
        }
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch node status", message);
      process.exit(1);
    }
  });

export const nodeGroup = new Command("node").description("Node management commands");

nodeGroup.addCommand(registerNodeCommand);
nodeGroup.addCommand(statusNodeCommand);

export { registerNodeCommand, statusNodeCommand };
