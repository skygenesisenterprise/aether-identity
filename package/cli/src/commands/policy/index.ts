import { Command } from "commander";
import { outputManager } from "../../utils/output.js";

const listPolicyCommand = new Command("list")
  .description("List all policies")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    outputManager.setOptions({ json: options.json });
    outputManager.info("Policy management coming soon");
  });

export const policyGroup = new Command("policy").description("Policy management commands");

policyGroup.addCommand(listPolicyCommand);

export { listPolicyCommand };
