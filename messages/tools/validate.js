const Ajv = require("ajv");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const ajv = new Ajv({ allErrors: true });

class MessageValidator {
  constructor() {
    this.schemaPath = path.join(__dirname, "../schema/message-schema.json");
    this.definitionsPath = path.join(__dirname, "../definitions");
    this.errors = [];
  }

  async validate() {
    console.log(chalk.blue("🔍 Validating Aether Vault messages..."));

    try {
      // Load schema
      const schema = await fs.readJson(this.schemaPath);
      const validate = ajv.compile(schema);

      // Validate all language files
      const languages = await fs.readdir(this.definitionsPath);

      for (const lang of languages) {
        const langPath = path.join(this.definitionsPath, lang);
        const stat = await fs.stat(langPath);

        if (!stat.isDirectory()) continue;

        console.log(chalk.gray(`  Validating ${lang}...`));

        const domainFiles = await fs.readdir(langPath);

        for (const file of domainFiles) {
          if (!file.endsWith(".json")) continue;

          const filePath = path.join(langPath, file);
          const messages = await fs.readJson(filePath);

          // Validate each message
          for (const [messageId, message] of Object.entries(messages)) {
            if (!validate(message)) {
              this.errors.push({
                language: lang,
                file,
                messageId,
                errors: validate.errors,
              });
            }
          }
        }
      }

      // Report results
      if (this.errors.length > 0) {
        console.log(
          chalk.red(
            `\n❌ Validation failed with ${this.errors.length} errors:`,
          ),
        );

        for (const error of this.errors) {
          console.log(
            chalk.red(`  ${error.language}/${error.file}:${error.messageId}`),
          );
          for (const err of error.errors) {
            console.log(chalk.red(`    - ${err.instancePath} ${err.message}`));
          }
        }

        process.exit(1);
      } else {
        console.log(chalk.green("✅ All messages validated successfully!"));
      }
    } catch (error) {
      console.error(chalk.red("Validation error:"), error);
      process.exit(1);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MessageValidator();
  validator.validate();
}

module.exports = MessageValidator;
