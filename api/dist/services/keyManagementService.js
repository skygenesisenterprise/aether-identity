"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyManagementService = exports.KeyManagementService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class KeyManagementService {
    constructor() {
        this.keys = new Map();
        this.currentKeyId = null;
        this.keysDir = process.env.JWT_KEYS_DIR || path_1.default.resolve(process.cwd(), 'keys');
        this.keyRotationInterval = 20 * 24 * 60 * 60 * 1000; // 20 days (1.73B ms - within 32-bit limit) (2.59B ms - within 32-bit limit)
        this.rotationTimer = null;
        this.initializeKeys();
        // Only start key rotation in production
        if (process.env.NODE_ENV === 'production') {
            this.startKeyRotation();
        }
        else {
            console.log('🔑 Key rotation disabled in development mode');
        }
    }
    /**
     * Initialize key management system
     */
    async initializeKeys() {
        try {
            await this.ensureKeysDirectory();
            await this.loadExistingKeys();
            if (this.keys.size === 0) {
                await this.generateNewKeyPair();
            }
            this.setActiveKey();
        }
        catch (error) {
            console.error('Failed to initialize key management:', error);
            // Fallback to in-memory key generation
            await this.generateNewKeyPair();
            this.setActiveKey();
        }
    }
    /**
     * Ensure keys directory exists
     */
    async ensureKeysDirectory() {
        try {
            await promises_1.default.access(this.keysDir);
        }
        catch {
            await promises_1.default.mkdir(this.keysDir, { recursive: true });
        }
    }
    /**
     * Load existing keys from disk
     */
    async loadExistingKeys() {
        try {
            const files = await promises_1.default.readdir(this.keysDir);
            const keyFiles = files.filter(file => file.endsWith('.json'));
            for (const file of keyFiles) {
                const filePath = path_1.default.join(this.keysDir, file);
                const content = await promises_1.default.readFile(filePath, 'utf-8');
                const keyData = JSON.parse(content);
                this.keys.set(keyData.keyId, {
                    ...keyData,
                    createdAt: new Date(keyData.createdAt)
                });
            }
        }
        catch (error) {
            console.warn('Failed to load existing keys:', error);
        }
    }
    /**
     * Generate new RSA key pair
     */
    async generateNewKeyPair() {
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
        const keyId = this.generateKeyId();
        const keyPair = {
            keyId,
            publicKey,
            privateKey,
            createdAt: new Date(),
            isActive: false
        };
        this.keys.set(keyId, keyPair);
        await this.saveKeyToDisk(keyPair);
        return keyPair;
    }
    /**
     * Save key pair to disk
     */
    async saveKeyToDisk(keyPair) {
        try {
            const filePath = path_1.default.join(this.keysDir, `${keyPair.keyId}.json`);
            await promises_1.default.writeFile(filePath, JSON.stringify(keyPair, null, 2));
        }
        catch (error) {
            console.error('Failed to save key to disk:', error);
        }
    }
    /**
     * Generate unique key ID
     */
    generateKeyId() {
        const timestamp = Date.now().toString(36);
        const random = crypto_1.default.randomBytes(4).toString('hex');
        return `key_${timestamp}_${random}`;
    }
    /**
     * Set the most recent key as active
     */
    setActiveKey() {
        if (this.keys.size === 0)
            return;
        // Find the most recent key or use environment override
        const envKeyId = process.env.JWT_KEY_ID;
        if (envKeyId && this.keys.has(envKeyId)) {
            this.currentKeyId = envKeyId;
            return;
        }
        // Find the most recently created key
        let mostRecentKey = null;
        for (const key of this.keys.values()) {
            if (!mostRecentKey || key.createdAt > mostRecentKey.createdAt) {
                mostRecentKey = key;
            }
        }
        if (mostRecentKey) {
            this.currentKeyId = mostRecentKey.keyId;
            mostRecentKey.isActive = true;
        }
    }
    /**
     * Start automatic key rotation
     */
    startKeyRotation() {
        if (this.rotationTimer) {
            clearTimeout(this.rotationTimer);
        }
        // Schedule first rotation after interval (25 days)
        this.rotationTimer = setTimeout(async () => {
            await this.rotateKeys();
            // After rotation, schedule next one
            this.startKeyRotation();
        }, this.keyRotationInterval);
        console.log(`Key rotation scheduled in ${this.keyRotationInterval / (24 * 60 * 60 * 1000)} days`);
    }
    /**
     * Rotate keys - create new key and deactivate old ones
     */
    async rotateKeys() {
        try {
            console.log('Starting key rotation...');
            // Deactivate all current keys
            for (const key of this.keys.values()) {
                key.isActive = false;
            }
            // Generate new key
            const newKey = await this.generateNewKeyPair();
            newKey.isActive = true;
            this.currentKeyId = newKey.keyId;
            // Clean up old keys (older than 90 days)
            await this.cleanupOldKeys();
            console.log(`Key rotation completed. New key ID: ${newKey.keyId}`);
        }
        catch (error) {
            console.error('Key rotation failed:', error);
        }
    }
    /**
     * Clean up old keys
     */
    async cleanupOldKeys() {
        const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
        const keysToDelete = [];
        for (const [keyId, key] of this.keys.entries()) {
            if (key.createdAt < cutoffDate && !key.isActive) {
                keysToDelete.push(keyId);
            }
        }
        for (const keyId of keysToDelete) {
            this.keys.delete(keyId);
            try {
                const filePath = path_1.default.join(this.keysDir, `${keyId}.json`);
                await promises_1.default.unlink(filePath);
            }
            catch (error) {
                console.error(`Failed to delete key file ${keyId}:`, error);
            }
        }
        if (keysToDelete.length > 0) {
            console.log(`Cleaned up ${keysToDelete.length} old keys`);
        }
    }
    /**
     * Get current active key ID
     */
    getCurrentKeyId() {
        if (!this.currentKeyId) {
            throw new Error('No active key available');
        }
        return this.currentKeyId;
    }
    /**
     * Get private key for signing
     */
    getPrivateKey(keyId) {
        const targetKeyId = keyId || this.currentKeyId;
        if (!targetKeyId) {
            throw new Error('No key ID specified and no active key available');
        }
        const key = this.keys.get(targetKeyId);
        if (!key) {
            throw new Error(`Key not found: ${targetKeyId}`);
        }
        return key.privateKey;
    }
    /**
     * Get public key for verification
     */
    getPublicKey(keyId) {
        const targetKeyId = keyId || this.currentKeyId;
        if (!targetKeyId) {
            throw new Error('No key ID specified and no active key available');
        }
        const key = this.keys.get(targetKeyId);
        if (!key) {
            throw new Error(`Key not found: ${targetKeyId}`);
        }
        return key.publicKey;
    }
    /**
     * Get all active keys for JWKS endpoint
     */
    getJWKS() {
        const jwksKeys = Array.from(this.keys.values())
            .filter(key => key.isActive || key.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) // Include keys from last 24h
            .map(key => ({
            kty: 'RSA',
            use: 'sig',
            alg: 'RS256',
            kid: key.keyId,
            n: this.extractModulus(key.publicKey),
            e: 'AQAB',
            x5t: this.generateX5t(key.publicKey),
            x5c: [this.extractBase64(key.publicKey)]
        }));
        return { keys: jwksKeys };
    }
    /**
     * Extract modulus from RSA public key
     */
    extractModulus(publicKey) {
        try {
            const key = crypto_1.default.createPublicKey(publicKey);
            const keyDetails = key.asymmetricKeyDetails;
            // For production, implement proper modulus extraction
            // For now, return a placeholder
            return 'placeholder_modulus';
        }
        catch (error) {
            console.error('Failed to extract modulus:', error);
            return 'placeholder_modulus';
        }
    }
    /**
     * Generate x509 thumbprint
     */
    generateX5t(publicKey) {
        try {
            const keyBuffer = Buffer.from(publicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, ''), 'base64');
            return crypto_1.default.createHash('sha1').update(keyBuffer).digest('base64');
        }
        catch (error) {
            console.error('Failed to generate x5t:', error);
            return 'placeholder_x5t';
        }
    }
    /**
     * Extract base64 content from PEM
     */
    extractBase64(publicKey) {
        return publicKey
            .replace(/-----BEGIN PUBLIC KEY-----/, '')
            .replace(/-----END PUBLIC KEY-----/, '')
            .replace(/\s/g, '');
    }
    /**
     * Manually trigger key rotation (for testing/admin)
     */
    async forceKeyRotation() {
        await this.rotateKeys();
    }
    /**
     * Get key information for debugging
     */
    getKeyInfo() {
        return Array.from(this.keys.values()).map(key => ({
            keyId: key.keyId,
            createdAt: key.createdAt,
            isActive: key.isActive
        }));
    }
    /**
     * Cleanup on shutdown
     */
    shutdown() {
        if (this.rotationTimer) {
            clearTimeout(this.rotationTimer);
            this.rotationTimer = null;
        }
    }
}
exports.KeyManagementService = KeyManagementService;
exports.keyManagementService = new KeyManagementService();
// Graceful shutdown
process.on('SIGTERM', () => exports.keyManagementService.shutdown());
process.on('SIGINT', () => exports.keyManagementService.shutdown());
