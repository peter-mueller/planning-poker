import { checkFetchResponse, Errors, handleFetchConnectionError } from "./error/errors";
import { Kartenwert, MitspielerEntity, Pokerrunde, PokerrundeAggregate } from "./Pokerrunde";
import { PokerrundeService } from "./PokerrundeService";


export class PokerrundeRepository {
    private service: PokerrundeService;

    constructor(service?: PokerrundeService) {
        this.service = service || new PokerrundeService();
    }

    public async createPokerrunde(): Promise<PokerrundeAggregate> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde`);
        return fetch(url.href, {method: 'POST', body: JSON.stringify({}), headers: {"Content-Type": "application/json"}})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => new PokerrundeAggregate(data))
    }

    public async findByID(id: string): Promise<PokerrundeAggregate> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}`);
        return fetch(url.href, {method: 'GET'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => new PokerrundeAggregate(data))
    }

    public async createMitspieler(idPokerrunde: string, m: MitspielerEntity): Promise<MitspielerEntity> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${idPokerrunde}/mitspieler`);
        return fetch(url.href, {method: 'POST', body: m.toJSON()})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => new MitspielerEntity(data))
    }

    public async putKartenWert(idPokerrunde: string, idMitspieler: string, wert: Kartenwert): Promise<Kartenwert> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${idPokerrunde}/mitspieler/${idMitspieler}/karte/wert`);
        return fetch(url.href, {method: 'PUT', body: JSON.stringify(wert)})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => data as Kartenwert)
    }


    public async resetByID(id: string): Promise<void> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}/command/reset`);
        return fetch(url.href, {method: 'POST'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(() => { return; })
    }

    public async aufdeckenByID(id: string): Promise<void> {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}/command/aufdecken`);
        return fetch(url.href, {method: 'POST'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(() => { return; })
    }
}