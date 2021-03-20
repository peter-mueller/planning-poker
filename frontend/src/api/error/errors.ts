type PokerrundeErrorKind = string; 

export interface PokerrundeError {
    message: string
    kind: PokerrundeErrorKind
}

export class Errors {
    static isKindOf(err: any, kind: PokerrundeErrorKind): boolean {
        if (err?.kind() === undefined) {
            return false;
        }
        return err?.kind() === kind;
    }
}

/** Bad Connections */
const ErrFetchConnection: PokerrundeErrorKind = "ErrFetchConnection";
/** 400 Group */
const ErrFetchUnauthorized: PokerrundeErrorKind = "ErrFetchUnauthorized";
const ErrFetchForbidden: PokerrundeErrorKind = "ErrFetchForbidden";
const ErrFetchNotFound: PokerrundeErrorKind = "ErrFetchNotFound";
/** 500 Group or Unknown */
const ErrFetchInternalServerError: PokerrundeErrorKind = "ErrFetchInternalServerError";


export function handleFetchConnectionError(e: any): Promise<never> {
    const err: PokerrundeError = {
        message: "Konnte keine Netzwerkverbindung herstellen, bitte überprüfen Sie ihre Internetverbindung", 
        kind: ErrFetchConnection
    };
    return Promise.reject(err);
}

export function checkFetchResponse(r: Response): Promise<Response> {
    if (r.ok) {
        return Promise.resolve(r);
    }
    if (r.status === 404) {
        const err: PokerrundeError = {
            message: "Die angefrage Information wurde nicht gefunden, bitte informieren Sie ihren Administrator", 
            kind: ErrFetchNotFound
        };
        Promise.reject(err);
    }
    if (r.status === 401) {
        const err: PokerrundeError = {
            message: "Sie sind nicht korrekt angemeldet, deshalb dürfen sie nicht auf die Information zugreifen", 
            kind: ErrFetchUnauthorized
        };
        Promise.reject(err);
    }
    if (r.status === 403) {
        const err: PokerrundeError = {
            message: "Sie haben nicht die notwendige Berechtigung", 
            kind: ErrFetchForbidden
        };
        Promise.reject(err);
    }

    const err: PokerrundeError = {
        message: "Es gab ein internes Problem, bitte informieren Sie ihren Administrator", 
        kind: ErrFetchInternalServerError
    };
    return Promise.reject(err);
}