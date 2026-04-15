import { Command } from "commander";
import inquirer from "inquirer";
import { apiClient } from "../../core/api.js";
import { authManager } from "../../core/auth.js";
import { outputManager } from "../../utils/output.js";
import { handleError } from "../../utils/errors.js";
import type { Device, DeviceRegisterInput, ListResponse } from "../../types/index.js";

const registerDeviceCommand = new Command("register")
  .description("Register a new device")
  .action(async () => {
    outputManager.setOptions({});

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Registering device...");

    try {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Device name:",
          validate: (value: string) => {
            if (!value) return "Device name is required";
            return true;
          },
        },
        {
          type: "list",
          name: "type",
          message: "Device type:",
          choices: ["server", "desktop", "laptop", "mobile", "tablet", "iot"],
        },
        {
          type: "input",
          name: "publicKey",
          message: "Public key (PEM):",
          validate: (value: string) => {
            if (!value) return "Public key is required";
            return true;
          },
        },
      ]);

      const response = await apiClient.post<Device>("/devices", answers as DeviceRegisterInput);

      if (response.error) {
        outputManager.stopSpinner(false);
        outputManager.error(response.error.message);
        process.exit(1);
      }

      if (response.data) {
        outputManager.stopSpinner(true);
        outputManager.success(`Device registered: ${response.data.name}`);
        outputManager.log(`ID: ${response.data.id}`);
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to register device", message);
      process.exit(1);
    }
  });

const listDevicesCommand = new Command("list")
  .description("List all devices")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    outputManager.setOptions({ json: options.json });

    if (!authManager.isAuthenticated()) {
      outputManager.error("Not authenticated. Run 'identity login' first.");
      process.exit(1);
    }

    outputManager.startSpinner("Fetching devices...");

    try {
      const response = await apiClient.get<ListResponse<Device>>("/devices");

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
          const tableData = response.data.data.map((device) => ({
            Name: device.name,
            Type: device.type,
            LastSeen: device.lastSeen,
          }));
          outputManager.table(tableData);
        }
      }
    } catch (error) {
      outputManager.stopSpinner(false);
      const { message } = handleError(error);
      outputManager.error("Failed to fetch devices", message);
      process.exit(1);
    }
  });

export const deviceGroup = new Command("device").description("Device management commands");

deviceGroup.addCommand(registerDeviceCommand);
deviceGroup.addCommand(listDevicesCommand);

export { registerDeviceCommand, listDevicesCommand };
