<div align="center">

# 🌐 Aether Identity i18n

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-identity/blob/main/LICENSE) [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![i18n](https://img.shields.io/badge/i18n-Ready-orange?style=for-the-badge)](https://en.wikipedia.org/wiki/Internationalization_and_localization)

**🌍 Internationalization & Localization Infrastructure for Aether Identity Ecosystem**

A comprehensive internationalization system providing multi-language support, message validation, and code generation for the Aether Identity platform. Built with TypeScript and designed for enterprise-grade localization workflows.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🛠️ Tools](#️-tools) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is Aether Identity i18n?

**Aether Identity i18n** is the official internationalization (i18n) and localization (l10n) infrastructure for the Aether Identity ecosystem. It provides a structured, type-safe approach to managing translations across multiple languages and domains.

### 🎯 Key Capabilities

- **🌍 Multi-Language Support** - Structured translations for global applications
- **✅ Schema Validation** - JSON Schema-based message validation with AJV
- **🔄 Auto-Generation** - TypeScript type definitions and index files
- **📦 Domain Organization** - Logical grouping by feature/domain
- **🔍 Translation Checking** - Automated completeness verification
- **⚡ Developer Tools** - CLI utilities for validation and sync
- **🐳 Docker Ready** - Containerized development environment
- **📝 TypeScript Native** - Full type safety and IntelliSense support

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (recommended)
- **Docker** (optional, for containerized development)

### 🔧 Installation & Setup

1. **Navigate to the messages directory**

   ```bash
   cd messages
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build and validate messages**

   ```bash
   pnpm run build
   ```

4. **Generate checksums for translation tracking**

   ```bash
   pnpm run generate:checksums
   ```

### 🐳 Docker Development

```bash
# Development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Production build
docker-compose up -d
```

---

## 📋 Features

### 🌍 Internationalization Infrastructure

```
Aether Messages
├── 🗂️ Domain Organization
│   ├── auth/              # Authentication messages
│   ├── errors/            # Error messages
│   ├── ui/                # UI component messages
│   └── validation/        # Form validation messages
├── 🌐 Multi-Language Support
│   ├── en/               # English (default)
│   ├── fr/               # French
│   ├── es/               # Spanish
│   └── de/               # German
└── 📦 Type Generation
    ├── TypeScript types
    ├── Index exports
    └── Checksum tracking
```

### ✅ Validation System

- **JSON Schema Validation** - Strict message structure enforcement
- **AJV Integration** - High-performance validation engine
- **Multi-Language Checks** - Ensures all languages have required keys
- **Error Reporting** - Detailed validation feedback with chalk-colored output

### 🔄 Synchronization Tools

- **Translation Checking** - Identifies missing translations across languages
- **Checksum Generation** - Tracks translation changes and versions
- **Auto-Generation** - Creates TypeScript definitions automatically
- **Sync Utilities** - Keeps translations consistent across domains

---

## 🏗️ Architecture

### 📁 Directory Structure

```
messages/
├── 📁 definitions/           # Message definitions by language
│   ├── en/                  # English messages
│   │   ├── auth.json        # Authentication domain
│   │   ├── errors.json      # Error messages
│   │   ├── ui.json          # UI components
│   │   └── validation.json  # Form validation
│   ├── fr/                  # French messages
│   ├── es/                  # Spanish messages
│   └── de/                  # German messages
├── 📁 generated/            # Auto-generated outputs
│   ├── index.ts            # Main export file
│   ├── index.d.ts          # TypeScript declarations
│   └── checksums.json      # Translation checksums
├── 📁 schema/               # JSON Schema definitions
│   └── message-schema.json # Message validation schema
├── 📁 tools/                # Development utilities
│   ├── validate.js         # Schema validation
│   ├── generate.js         # TypeScript generation
│   ├── sync.js            # Translation synchronization
│   ├── check-translations.js  # Completeness checker
│   └── generate-checksums.js  # Checksum generator
├── 🐳 docker-compose.yml    # Production Docker setup
├── 🐳 docker-compose.dev.yml # Development Docker setup
├── 🐳 Dockerfile           # Production container
├── 🐳 Dockerfile.dev       # Development container
└── 📄 package.json         # Package configuration
```

### 🔄 Message Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Definition    │    │   Validation     │    │   Generation    │
│   (YAML/JSON)   │───►│   (AJV Schema)   │───►│   (TypeScript)  │
│                 │    │                  │    │                 │
│  en/auth.json   │    │  Schema Check    │    │  Types + Index  │
│  fr/auth.json   │    │  Language Sync   │    │  Checksums      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
   │   Domain Split  │    │   Error Report   │    │   Package Export│
   │   By Feature    │    │   (chalk/cli)    │    │   (@aether-     │
   │                 │    │                  │    │   identity/     │
   │  auth/ui/errors │    │  Validation      │    │   messages)     │
   └─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🛠️ Tools

### 🔍 Validation (`validate.js`)

Validates all message files against JSON Schema:

```bash
pnpm run validate
# or
node tools/validate.js
```

**Features:**

- Multi-language validation
- Detailed error reporting
- Schema compliance checking
- Exit code for CI/CD integration

### 🔄 Generation (`generate.js`)

Generates TypeScript types and index files:

```bash
pnpm run generate
# or
node tools/generate.js
```

**Output:**

- `generated/index.ts` - Main exports
- `generated/index.d.ts` - TypeScript declarations
- Type-safe message accessors

### 🌐 Translation Check (`check-translations.js`)

Identifies missing translations:

```bash
pnpm run check:translations
# or
node tools/check-translations.js
```

**Features:**

- Cross-language comparison
- Missing key detection
- Coverage reporting
- Translation completeness metrics

### 🔢 Checksum Generation (`generate-checksums.js`)

Tracks translation versions:

```bash
pnpm run generate:checksums
# or
node tools/generate-checksums.js
```

**Output:**

- `generated/checksums.json` - Translation fingerprints
- Change detection for CI/CD
- Version tracking

### ⚡ Synchronization (`sync.js`)

Synchronizes translations across domains:

```bash
pnpm run sync
# or
node tools/sync.js
```

**Features:**

- Cross-domain consistency
- Template synchronization
- Key propagation

---

## 📝 Usage

### 📦 As a Package

```typescript
import { messages } from "@aether-identity/messages";

// Get message for current locale
const greeting = messages.en.auth.login_title;
const error = messages.fr.errors.invalid_credentials;
```

### 🏗️ In Applications

```typescript
import { useMessages } from "@aether-identity/messages";

function LoginComponent() {
  const { t } = useMessages("auth");

  return (
    <div>
      <h1>{t("login_title")}</h1>
      <p>{t("login_description")}</p>
    </div>
  );
}
```

### 🔧 Schema Definition

```json
{
  "messageId": {
    "text": "Welcome to Aether Identity",
    "description": "Login page main heading",
    "context": "auth",
    "variables": ["username"]
  }
}
```

---

## 🗺️ Development Workflow

### 🎯 Adding New Messages

1. **Edit domain file** (e.g., `definitions/en/auth.json`)

   ```json
   {
     "new_feature_title": {
       "text": "New Feature",
       "description": "Title for new feature page",
       "context": "auth"
     }
   }
   ```

2. **Validate changes**

   ```bash
   pnpm run validate
   ```

3. **Generate types**

   ```bash
   pnpm run generate
   ```

4. **Check translations**

   ```bash
   pnpm run check:translations
   ```

5. **Generate checksums**

   ```bash
   pnpm run generate:checksums
   ```

### 🌍 Adding a New Language

1. **Create language directory**

   ```bash
   mkdir definitions/it  # Italian
   ```

2. **Copy and translate from English**

   ```bash
   cp definitions/en/*.json definitions/it/
   # Translate each file
   ```

3. **Validate new language**

   ```bash
   pnpm run validate
   ```

4. **Check completeness**

   ```bash
   pnpm run check:translations
   ```

---

## 📊 Project Status

| Component               | Status         | Description                              |
| ----------------------- | -------------- | ---------------------------------------- |
| **Message Schema**      | ✅ Working     | JSON Schema validation with AJV          |
| **Validation Tool**     | ✅ Working     | Multi-language validation engine         |
| **Generation Tool**     | ✅ Working     | TypeScript types and index generation    |
| **Translation Checker** | ✅ Working     | Cross-language completeness verification |
| **Checksum Generator**  | ✅ Working     | Translation version tracking             |
| **Sync Tool**           | 🔄 In Progress | Cross-domain synchronization             |
| **Docker Support**      | ✅ Working     | Containerized development environment    |
| **TypeScript Types**    | ✅ Working     | Full type safety and IntelliSense        |
| **English (en)**        | ✅ Working     | Default language - complete              |
| **French (fr)**         | 📋 Planned     | Translation in progress                  |
| **Spanish (es)**        | 📋 Planned     | Translation planned                      |
| **German (de)**         | 📋 Planned     | Translation planned                      |

---

## 🤝 Contributing

We welcome contributions to expand language support and improve the i18n infrastructure!

### 🎯 Areas to Contribute

- **Translations** - Add support for new languages
- **Domain Coverage** - Expand message definitions
- **Tooling** - Enhance validation and generation tools
- **Documentation** - Improve guides and examples
- **Testing** - Add automated tests for tools

### 📝 Contribution Process

1. **Fork the repository** and create a feature branch
2. **Add or update messages** following the schema
3. **Run validation** - `pnpm run validate`
4. **Check translations** - `pnpm run check:translations`
5. **Generate types** - `pnpm run generate`
6. **Submit a pull request** with clear description

---

## 📞 Support

### 💬 Get Help

- 📖 **[Documentation](../../docs/)** - Comprehensive guides
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-identity/issues)** - Bug reports and requests
- 💡 **[Discussions](https://github.com/skygenesisenterprise/aether-identity/discussions)** - Questions and ideas

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../../LICENSE) file for details.

---

<div align="center">

### 🌍 **Making Aether Identity Accessible Worldwide**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-identity) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-identity/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-identity/discussions)

---

**Built with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Empowering global identity management through internationalization_

</div>
