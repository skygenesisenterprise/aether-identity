<div align="center">

# 🗄️ Aether Identity Database

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-mailer/blob/main/LICENSE) [![Prisma](https://img.shields.io/badge/Prisma-5+-blue?style=for-the-badge&logo=prisma)](https://prisma.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)](https://postgresql.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

**🔥 Database Layer Foundation - Complete ORM Integration with Prisma & PostgreSQL**

A robust database schema and migration system providing the foundation for Aether Identity's data persistence layer with type-safe database operations, auto-generated client, and comprehensive migration management.

[🚀 Quick Start](#-quick-start) • [📋 Schema Overview](#-schema-overview) • [🛠️ Commands](#️-commands) • [📁 Structure](#-structure)

</div>

---

## 🌟 What is Aether Identity Database?

**Aether Identity Database** is the database layer of the Aether Mailer ecosystem, providing a complete **Prisma ORM** integration with **PostgreSQL**. It handles all database schema definitions, migrations, and type-safe client generation for the entire application stack.

### 🎯 Key Features

- **📐 Complete Schema Definition** - All database models and relationships defined in `schema.prisma`
- **🔄 Auto-Migration System** - Prisma Migrate for version-controlled schema changes
- **📝 Type-Safe Client** - Auto-generated TypeScript client for database operations
- **🎨 Prisma Studio** - Visual database management interface
- **🔐 Security First** - Proper field constraints and validation at database level
- **⚡ Connection Pooling** - Optimized database connections for performance
- **🐳 Docker Ready** - PostgreSQL container configuration included

---

## 🚀 Quick Start

### 📋 Prerequisites

- **PostgreSQL** 14.0 or higher
- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher

### 🔧 Setup

1. **Environment Configuration**

   Ensure your `.env` file contains:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/aether_identity?schema=public"
   ```

2. **Database Initialization**

   ```bash
   # Generate Prisma client
   make db-generate

   # Run migrations
   make db-migrate

   # (Optional) Seed development data
   make db-seed
   ```

3. **Open Prisma Studio**

   ```bash
   make db-studio
   ```

---

## 📋 Schema Overview

### 🗄️ Database Models

The Prisma schema defines the core data models for Aether Mailer:

```prisma
// User Management
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  domains   Domain[]
  emails    Email[]
}

model Domain {
  id          String   @id @default(cuid())
  name        String   @unique
  verified    Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  mailboxes   Mailbox[]
}

model Mailbox {
  id          String   @id @default(cuid())
  email       String   @unique
  domainId    String
  createdAt   DateTime @default(now())

  // Relations
  domain      Domain   @relation(fields: [domainId], references: [id])
  emails      Email[]
}

model Email {
  id          String   @id @default(cuid())
  subject     String
  body        String
  from        String
  to          String
  userId      String
  mailboxId   String?
  createdAt   DateTime @default(now())

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  mailbox     Mailbox? @relation(fields: [mailboxId], references: [id])
}
```

### 🔗 Relationships

- **User → Domain**: One-to-Many (User can own multiple domains)
- **Domain → Mailbox**: One-to-Many (Domain can have multiple mailboxes)
- **User → Email**: One-to-Many (User can send/receive multiple emails)
- **Mailbox → Email**: One-to-Many (Mailbox can contain multiple emails)

---

## 🛠️ Commands

### 📦 Make Commands

```bash
# 🗄️ Database Operations
make db-generate          # Generate Prisma client
make db-migrate           # Run database migrations
make db-studio            # Open Prisma Studio GUI
make db-seed              # Seed development data
make db-reset             # Reset database (drops and recreates)

# 🔧 Development
make dev                  # Start development servers (includes DB)
make quick-start          # Full setup with database

# 🏗️ Build & Deploy
make build                # Build application with DB client
make docker-run           # Start PostgreSQL in Docker
```

### 🎯 Direct Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Deploy migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Introspect existing database
npx prisma db pull

# Seed database
npx prisma db seed
```

---

## 📁 Structure

### 🏗️ Directory Layout

```
prisma/
├── schema.prisma          # Main database schema definition
├── config.ts              # Prisma client configuration
├── README.md              # This file
├── migrations/            # Migration files (auto-generated)
│   ├── 20250101000000_init/
│   │   └── migration.sql
│   └── migration_lock.toml
└── seed.ts                # Database seeding script
```

### 📄 Key Files

#### `schema.prisma`

The heart of the database layer. Defines all models, fields, relationships, and database configuration.

#### `config.ts`

Prisma client configuration and singleton instance management:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### `seed.ts`

Development data seeding for testing and local development.

---

## 🔐 Configuration

### Environment Variables

```env
# Required
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Optional - for connection pooling
DATABASE_URL_POOLER="postgresql://username:password@pooler-host:port/database?schema=public"
```

### Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

---

## 🔄 Migration Workflow

### Development

1. **Modify Schema**

   ```prisma
   // Add new field to schema.prisma
   model User {
     // ... existing fields
     avatar String?  // New field
   }
   ```

2. **Generate Migration**

   ```bash
   npx prisma migrate dev --name add_user_avatar
   ```

3. **Apply Migration**
   ```bash
   make db-migrate
   ```

### Production

```bash
# Deploy migrations (non-destructive)
npx prisma migrate deploy

# Verify deployment
npx prisma migrate status
```

---

## 📝 Usage Examples

### Basic CRUD Operations

```typescript
import { prisma } from "@/prisma/config";

// Create user
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    password: "hashed_password",
    name: "John Doe",
  },
});

// Read with relations
const userWithDomains = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    domains: true,
    emails: true,
  },
});

// Update
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: "Jane Doe" },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

### Complex Queries

```typescript
// Find users with specific domain
const users = await prisma.user.findMany({
  where: {
    domains: {
      some: {
        name: {
          endsWith: "@company.com",
        },
      },
    },
  },
  include: {
    domains: {
      include: {
        mailboxes: true,
      },
    },
  },
});

// Count emails by user
const stats = await prisma.user.groupBy({
  by: ["id"],
  _count: {
    emails: true,
  },
});
```

---

## 🐳 Docker Integration

### PostgreSQL Container

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: aether
      POSTGRES_PASSWORD: aether_password
      POSTGRES_DB: aether_mailer
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start PostgreSQL
make docker-run

# Or manually
docker-compose up -d postgres
```

---

## 🧪 Development Tips

### Reset Database

```bash
# Complete reset (drops and recreates)
make db-reset
```

### View Database

```bash
# Open Prisma Studio
make db-studio
```

### Schema Changes Checklist

- [ ] Update `schema.prisma`
- [ ] Run `npx prisma format`
- [ ] Run `npx prisma validate`
- [ ] Create migration with `npx prisma migrate dev`
- [ ] Regenerate client with `npx prisma generate`
- [ ] Update TypeScript types if needed
- [ ] Test changes locally
- [ ] Commit migration files

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Workflow](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

<div align="center">

### 🚀 **Database Layer for Modern Email Infrastructure**

**Part of the [Aether Mailer](https://github.com/skygenesisenterprise/aether-mailer) Ecosystem**

</div>
