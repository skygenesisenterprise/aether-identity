class TokenCache {
    cache;
    maxSize;
    ttl;
    constructor(maxSize, ttlSeconds) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttlSeconds * 1000;
    }
    get(token) {
        this.cleanup();
        const entry = this.cache.get(token);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(token);
            return null;
        }
        return entry.value;
    }
    set(token, user, tokenExpiresAt) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        const cachedAt = Date.now();
        const cacheExpiresAt = cachedAt + this.ttl;
        const effectiveExpiresAt = Math.min(tokenExpiresAt, cacheExpiresAt);
        this.cache.set(token, {
            value: {
                user,
                expiresAt: tokenExpiresAt,
                cachedAt,
            },
            expiresAt: effectiveExpiresAt,
        });
    }
    delete(token) {
        this.cache.delete(token);
    }
    clear() {
        this.cache.clear();
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
    get size() {
        return this.cache.size;
    }
}
export { TokenCache };
//# sourceMappingURL=cache.js.map