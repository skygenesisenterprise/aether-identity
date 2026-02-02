import { createErrorFromResponse, NetworkError, ServerError } from "../errors";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function isRetryableError(error) {
    if (error instanceof NetworkError)
        return true;
    if (error instanceof ServerError)
        return true;
    return false;
}
class Transport {
    config;
    constructor(config) {
        this.config = {
            maxRetries: DEFAULT_MAX_RETRIES,
            retryDelay: DEFAULT_RETRY_DELAY,
            ...config,
        };
    }
    async request(endpoint, options, retries = this.config.maxRetries) {
        const url = `${this.config.baseUrl}${endpoint}`;
        try {
            const response = await this.config.fetcher(url, options);
            if (!response.ok) {
                let data;
                try {
                    data = await response.json();
                }
                catch {
                    data = {};
                }
                const error = createErrorFromResponse(response.status, data);
                if (isRetryableError(error) && retries > 0) {
                    await sleep(this.config.retryDelay * (this.config.maxRetries - retries + 1));
                    return this.request(endpoint, options, retries - 1);
                }
                throw error;
            }
            return (await response.json());
        }
        catch (error) {
            if (error && typeof error === "object" && "code" in error) {
                throw error;
            }
            if (retries > 0) {
                await sleep(this.config.retryDelay * (this.config.maxRetries - retries + 1));
                return this.request(endpoint, options, retries - 1);
            }
            throw new NetworkError("Network error occurred");
        }
    }
    async get(endpoint, accessToken) {
        const headers = {
            "Content-Type": "application/json",
            "X-Client-ID": this.config.clientId,
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (this.config.systemKey) {
            headers["X-System-Key"] = this.config.systemKey;
        }
        return this.request(endpoint, {
            method: "GET",
            headers,
        });
    }
    async post(endpoint, data, accessToken, useSystemKeyAsAuth) {
        const headers = {
            "Content-Type": "application/json",
            "X-Client-ID": this.config.clientId,
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        else if (useSystemKeyAsAuth && this.config.systemKey) {
            headers["Authorization"] = `Bearer ${this.config.systemKey}`;
        }
        return this.request(endpoint, {
            method: "POST",
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    async put(endpoint, data, accessToken) {
        const headers = {
            "Content-Type": "application/json",
            "X-Client-ID": this.config.clientId,
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return this.request(endpoint, {
            method: "PUT",
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    async delete(endpoint, accessToken) {
        const headers = {
            "Content-Type": "application/json",
            "X-Client-ID": this.config.clientId,
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (this.config.systemKey) {
            headers["X-System-Key"] = this.config.systemKey;
        }
        return this.request(endpoint, {
            method: "DELETE",
            headers,
        });
    }
}
export { Transport };
//# sourceMappingURL=transport.js.map