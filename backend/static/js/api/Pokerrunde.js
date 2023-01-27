// @ts-check

export class Pokerrunde {
    /** @type {string} */
    id = ""
    /** @type {Mitspieler[]} */
    mitspieler = []
    /** @type {Kartenwert[]} */
    kartenwerte = []


    /**
     * 
     * @param {any} data 
     */
    unmarshalJson(data) {
        this.id = data.id || ""
        this.mitspieler = []
        for (let e of data.mitspieler) {
            let m = new Mitspieler()
            m.unmarshalJson(e)
            this.mitspieler.push(m)
        }
        this.kartenwerte = []
        for (let e of data.kartenwerte) {
            this.kartenwerte.push(e)
        }
    }
}

export class Mitspieler {
    /** @type {string} */
    id = ""
    /** @type {string} */
    name = ""
    /** @type {Karte} */
    karte = new Karte()

    /**
     * @param {any} data 
     */
    unmarshalJson(data) {
        this.id = data.id || ""
        this.name = data.name || ""
        this.karte.unmarshalJson(data.karte)
    }

    /**
     * @returns {any}
     */
    marshalJson() {
        return {
            id: this.id,
            name: this.name,
            karte: this.karte.marshalJson()
        }
    }
}

export class Karte {
    /** @type {boolean} */
    aufgedeckt = false
    /** @type {Kartenwert} */
    wert = ""
    /**
 * @param {any} data 
 */
    unmarshalJson(data) {
        this.aufgedeckt = data.aufgedeckt;
        this.wert = data.wert;
    }

    /**
     * @returns {any}
     */
    marshalJson() {
        return {
            aufgedeckt: this.aufgedeckt,
            wert: this.wert
        }
    }
}

/** @typedef {string} Kartenwert */
