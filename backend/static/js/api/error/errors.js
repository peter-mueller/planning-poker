// @ts-check

/** @typedef {string} PokerrundeErrorKind */ 

export class PokerrundeError {
    /** @type {string} */
    message = ""
    /** @type {PokerrundeErrorKind}  */
    kind = ""
}

export class Errors {
    /**
     * 
     * @param {any} err 
     * @param {PokerrundeErrorKind} kind 
     * @returns boolean
     */
    static isKindOf(err, kind) {
        if (err?.kind() === undefined) {
            return false;
        }
        return err?.kind() === kind;
    }
}

/** Bad Connections */
/** @type {PokerrundeErrorKind} */
const ErrFetchConnection = "ErrFetchConnection";
/** 400 Group */
/** @type {PokerrundeErrorKind} */
const ErrFetchUnauthorized = "ErrFetchUnauthorized";
/** @type {PokerrundeErrorKind} */
const ErrFetchForbidden = "ErrFetchForbidden";
/** @type {PokerrundeErrorKind} */
const ErrFetchNotFound = "ErrFetchNotFound";
/** 500 Group or Unknown */
/** @type {PokerrundeErrorKind} */
const ErrFetchInternalServerError = "ErrFetchInternalServerError";


/**
 * 
 * @param {any} e 
 * @returns {Promise<never>}
 */
export function handleFetchConnectionError(e) {
    const err = new PokerrundeError()
    err.message = "Konnte keine Netzwerkverbindung herstellen, bitte überprüfen Sie ihre Internetverbindung"
    err.kind = ErrFetchConnection
    return Promise.reject(err);
}

/**
 * @param {Response} r 
 * @returns {Promise<Response>}
 */
export function checkFetchResponse(r){
    if (r.ok) {
        return Promise.resolve(r);
    }
    if (r.status === 404) {
        const err = new PokerrundeError()
        err.message = "Die angefrage Information wurde nicht gefunden, bitte informieren Sie ihren Administrator"
        err.kind = ErrFetchNotFound
        Promise.reject(err);
    }
    if (r.status === 401) {
        const err = new PokerrundeError()
        err.message = "Sie sind nicht korrekt angemeldet, deshalb dürfen sie nicht auf die Information zugreifen"
        err.kind = ErrFetchUnauthorized
        Promise.reject(err);
    }
    if (r.status === 403) {
        const err = new PokerrundeError()
        err.message = "Sie haben nicht die notwendige Berechtigung"
        err.kind = ErrFetchForbidden
        Promise.reject(err);
    }

    const err = new PokerrundeError()
    err.message = "Es gab ein internes Problem, bitte informieren Sie ihren Administrator", 
    err.kind = ErrFetchInternalServerError
    return Promise.reject(err);
}