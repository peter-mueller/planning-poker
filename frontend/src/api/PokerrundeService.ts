export interface PokerrundeServiceConfig {
    baseURL?: string;
} 

export class PokerrundeService {
    public baseURL: string;

    constructor(config?: PokerrundeServiceConfig) {
        this.baseURL = config?.baseURL || window.origin;
    }

    urlWithPath(path: string): URL {
        if (!path.startsWith("/")) {
            throw Error(`Path must start with a forward slash. Was: ${path}`);
        }
        return new URL(`${this.baseURL}${path}`);
    }
}