"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationManager = exports.MigrationManager = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const database_1 = require("../config/database");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class MigrationManager {
    constructor() {
        this.prismaClient = database_1.prisma;
        this.schemaPath = path.join(process.cwd(), 'api', 'prisma', 'schema.prisma');
    }
    /**
     * Check if database needs migration
     */
    async needsMigration() {
        try {
            // Check if migrations table exists
            const result = await this.prismaClient.$queryRaw `
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='_prisma_migrations'
      `;
            if (result.length === 0) {
                return true; // No migrations table, needs migration
            }
            // Check if schema is up to date
            const { stdout: statusOutput } = await execAsync(`npx prisma migrate status --schema ${this.schemaPath}`);
            return !statusOutput.includes('Your database is up to date');
        }
        catch (error) {
            console.log('⚠️ Could not check migration status, assuming migration needed');
            return true;
        }
    }
    /**
     * Create backup before migration (production only)
     */
    async createBackup() {
        if (database_1.config.nodeEnv !== 'production') {
            return null;
        }
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(process.cwd(), 'backups', `backup-${timestamp}.sql`);
            // Ensure backups directory exists
            await fs.promises.mkdir(path.dirname(backupPath), { recursive: true });
            if (database_1.config.database.provider === 'postgresql') {
                const { stdout } = await execAsync(`pg_dump "${database_1.config.database.url}" > "${backupPath}"`);
                console.log(`✅ Database backup created: ${backupPath}`);
                return backupPath;
            }
            else {
                // SQLite backup
                const dbPath = database_1.config.database.url.replace('file:', '');
                await fs.promises.copyFile(dbPath, backupPath);
                console.log(`✅ SQLite backup created: ${backupPath}`);
                return backupPath;
            }
        }
        catch (error) {
            console.error('⚠️ Backup creation failed:', error);
            return null;
        }
    }
    /**
     * Apply migrations safely
     */
    async applyMigrations(options = {}) {
        const { force = false, backup = true } = options;
        const isProduction = database_1.config.nodeEnv === 'production';
        try {
            console.log(`🔄 Starting migration process for ${database_1.config.database.provider}...`);
            // Safety checks for production
            if (isProduction && !force) {
                console.log('🔒 Production environment detected, performing safety checks...');
                // Check if we can connect
                await this.prismaClient.$queryRaw `SELECT 1`;
                console.log('✅ Database connection verified');
                // Create backup if requested
                if (backup) {
                    const backupPath = await this.createBackup();
                    if (!backupPath) {
                        return {
                            success: false,
                            message: 'Failed to create backup - aborting migration for safety',
                        };
                    }
                }
            }
            // Check if migration is needed
            const needsMigration = await this.needsMigration();
            if (!needsMigration) {
                return {
                    success: true,
                    message: 'Database is already up to date',
                };
            }
            console.log('📦 Applying database migrations...');
            // Generate Prisma client first
            await execAsync(`npx prisma generate --schema ${this.schemaPath}`);
            // Apply migrations based on environment
            if (isProduction) {
                // Production: use migrate deploy (safer)
                await execAsync(`npx prisma migrate deploy --schema ${this.schemaPath}`);
            }
            else {
                // Development: use migrate dev (creates migration files)
                try {
                    await execAsync(`npx prisma migrate dev --schema ${this.schemaPath} --name auto-migration`);
                }
                catch (error) {
                    // If migrate dev fails, try db push as fallback
                    console.log('⚠️ migrate dev failed, trying db push...');
                    await execAsync(`npx prisma db push --schema ${this.schemaPath}`);
                }
            }
            // Regenerate client after migration
            await execAsync(`npx prisma generate --schema ${this.schemaPath}`);
            // Get applied migrations
            const appliedMigrations = await this.getAppliedMigrations();
            console.log(`✅ Migration completed successfully. Applied ${appliedMigrations.length} migrations.`);
            return {
                success: true,
                message: 'Migration completed successfully',
                appliedMigrations,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown migration error';
            console.error('❌ Migration failed:', errorMessage);
            return {
                success: false,
                message: 'Migration failed',
                error: errorMessage,
            };
        }
    }
    /**
     * Get list of applied migrations
     */
    async getAppliedMigrations() {
        try {
            const migrations = await this.prismaClient.$queryRaw `
        SELECT migration_name FROM _prisma_migrations ORDER BY finished_at
      `;
            return migrations.map((m) => m.migration_name);
        }
        catch (error) {
            console.log('⚠️ Could not retrieve applied migrations');
            return [];
        }
    }
    /**
     * Reset database (development only)
     */
    async resetDatabase() {
        if (database_1.config.nodeEnv === 'production') {
            return {
                success: false,
                message: 'Database reset is not allowed in production',
            };
        }
        try {
            console.log('🔄 Resetting development database...');
            // Drop and recreate database
            await execAsync(`npx prisma migrate reset --schema ${this.schemaPath} --force`);
            // Regenerate client
            await execAsync(`npx prisma generate --schema ${this.schemaPath}`);
            console.log('✅ Database reset completed');
            return {
                success: true,
                message: 'Database reset completed successfully',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown reset error';
            console.error('❌ Database reset failed:', errorMessage);
            return {
                success: false,
                message: 'Database reset failed',
                error: errorMessage,
            };
        }
    }
    /**
     * Validate database schema
     */
    async validateSchema() {
        try {
            // Check if we can connect to the database
            await this.prismaClient.$queryRaw `SELECT 1`;
            // Try to validate schema
            const { stderr } = await execAsync(`npx prisma validate --schema ${this.schemaPath}`);
            if (stderr && !stderr.includes('warnings')) {
                return {
                    valid: false,
                    issues: [stderr],
                };
            }
            return {
                valid: true,
                issues: [],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
            return {
                valid: false,
                issues: [errorMessage],
            };
        }
    }
    /**
     * Get migration status
     */
    async getMigrationStatus() {
        try {
            const { stdout: statusOutput } = await execAsync(`npx prisma migrate status --schema ${this.schemaPath}`);
            const appliedMigrations = await this.getAppliedMigrations();
            const appliedCount = appliedMigrations.length;
            const lastMigration = appliedMigrations[appliedMigrations.length - 1];
            if (statusOutput.includes('Your database is up to date')) {
                return {
                    status: 'up-to-date',
                    appliedCount,
                    pendingCount: 0,
                    lastMigration,
                };
            }
            else if (statusOutput.includes('pending')) {
                return {
                    status: 'pending',
                    appliedCount,
                    pendingCount: 1, // Simplified - could parse actual count
                    lastMigration,
                };
            }
            else {
                return {
                    status: 'error',
                    appliedCount,
                    pendingCount: 0,
                    lastMigration,
                };
            }
        }
        catch (error) {
            return {
                status: 'error',
                appliedCount: 0,
                pendingCount: 0,
            };
        }
    }
}
exports.MigrationManager = MigrationManager;
// Export singleton instance
exports.migrationManager = new MigrationManager();
