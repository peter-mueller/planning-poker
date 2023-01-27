// @ts-check
import { checkFetchResponse, Errors, handleFetchConnectionError } from "./error/errors.js";
import { Mitspieler, Pokerrunde } from "./Pokerrunde.js";
import { PokerrundeService } from "./PokerrundeService.js";


export class PokerrundeRepository {
    /** @type {PokerrundeService} */
    service;

    /**
     * @param {PokerrundeService} service 
     */
    constructor(service) {
        this.service = service
    }

    /**
     * @returns {Promise<Pokerrunde>}
     */
    async createPokerrunde() {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde`);
        
        return fetch(url.href, {method: 'POST', body: JSON.stringify({}), headers: {"Content-Type": "application/json"}})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => {
                let r = new Pokerrunde()
                r.unmarshalJson(data)
                return r
            })
    }

    /**
     * 
     * @param {string} id 
     * @returns {Promise<Pokerrunde>}
     */
    async findByID(id) {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}`);
        return fetch(url.href, {method: 'GET'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => {
                let r = new Pokerrunde()
                r.unmarshalJson(data)
                return r
            })
    }

    /**
     * 
     * @param {string} idPokerrunde 
     * @param {Mitspieler} m 
     * @returns {Promise<Mitspieler>}
     */
    async createMitspieler(idPokerrunde, m) {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${idPokerrunde}/mitspieler`);
        return fetch(url.href, {method: 'POST', body: JSON.stringify(m.marshalJson())})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => {
                let m = new Mitspieler()
                m.unmarshalJson(data)
                return m
            })
    }

    /**
     * @param {string} idPokerrunde 
     * @param {string} idMitspieler 
     * @param {import("./Pokerrunde").Kartenwert} wert 
     * @returns {Promise<import("./Pokerrunde").Kartenwert>}
     */
    async putKartenWert(idPokerrunde, idMitspieler, wert) {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${idPokerrunde}/mitspieler/${idMitspieler}/karte/wert`);
        return fetch(url.href, {method: 'PUT', body: JSON.stringify(wert)})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(res => res.json())
            .then(data => /** @type {import("./Pokerrunde").Kartenwert} */ (data))
    }


    /**
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async resetByID(id) {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}/command/reset`);
        return fetch(url.href, {method: 'POST'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(() => { return; })
    }

    /**
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async aufdeckenByID(id) {
        const url = this.service.urlWithPath(`/v1/api/pokerrunde/${id}/command/aufdecken`);
        return fetch(url.href, {method: 'POST'})
            .catch(handleFetchConnectionError)
            .then(checkFetchResponse)
            .then(() => { return; })
    }
}