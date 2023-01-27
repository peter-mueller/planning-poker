// @ts-check

export class PokerrundeService {
    /** @type {string} */
    baseURL = "";

    /**
     * 
     * @param {string} path 
     * @returns {URL}
     */
    urlWithPath(path) {
        if (!path.startsWith("/")) {
            throw Error(`Path must start with a forward slash. Was: ${path}`);
        }
        return new URL(`${this.baseURL}${path}`);
    }
}