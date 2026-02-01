import { CreateVaultClient } from "aether-vault";

const vaultClient = CreateVaultClient({
  url: process.env.VAULT_URL,
  token: process.env.VAULT_TOKEN,
});

export default vaultClient;