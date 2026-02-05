import type { CachedToken, UserContext } from "./types";
declare class TokenCache {
    private cache;
    private maxSize;
    private ttl;
    constructor(maxSize: number, ttlSeconds: number);
    get(token: string): CachedToken | null;
    set(token: string, user: UserContext, tokenExpiresAt: number): void;
    delete(token: string): void;
    clear(): void;
    private cleanup;
    get size(): number;
}
export { TokenCache };
//# sourceMappingURL=cache.d.ts.map