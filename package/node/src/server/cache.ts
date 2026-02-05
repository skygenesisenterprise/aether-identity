import type { CachedToken, UserContext } from "./types";

interface CacheEntry {
  value: CachedToken;
  expiresAt: number;
}

class TokenCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number, ttlSeconds: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttlSeconds * 1000;
  }

  get(token: string): CachedToken | null {
    this.cleanup();

    const entry = this.cache.get(token);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(token);
      return null;
    }

    return entry.value;
  }

  set(token: string, user: UserContext, tokenExpiresAt: number): void {
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

  delete(token: string): void {
    this.cache.delete(token);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  get size(): number {
    return this.cache.size;
  }
}

export { TokenCache };
