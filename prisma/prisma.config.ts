import { defineConfig } from '@prisma/client'

// Load database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aether_identity'

export default defineConfig({
  datasourceUrl: databaseUrl,
})
