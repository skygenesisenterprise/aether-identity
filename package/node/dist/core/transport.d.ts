import type { FetchLike } from "../types";
interface TransportConfig {
    baseUrl: string;
    fetcher: FetchLike;
    clientId: string;
    maxRetries?: number;
    retryDelay?: number;
}
declare class Transport {
    private config;
    constructor(config: TransportConfig);
    private request;
    get<T>(endpoint: string, accessToken?: string): Promise<T>;
    post<T>(endpoint: string, data?: any, accessToken?: string): Promise<T>;
    put<T>(endpoint: string, data?: any, accessToken?: string): Promise<T>;
    delete<T>(endpoint: string, accessToken?: string): Promise<T>;
}
export { Transport };
//# sourceMappingURL=transport.d.ts.map