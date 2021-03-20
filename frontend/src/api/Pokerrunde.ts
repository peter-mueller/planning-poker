export interface Pokerrunde {
    id: string,
    mitspieler: Mitspieler[],
    kartenwerte: Kartenwert[]
}

export interface Mitspieler {
    id: string,
    name: string,
    karte: Karte
}

export interface Karte {
    aufgedeckt: boolean,
    wert: Kartenwert
}

export type Kartenwert = string;

export class PokerrundeAggregate {
    private pokerrunde: Pokerrunde;

    private static default: Pokerrunde = {
        id: "",
        mitspieler: [],
        kartenwerte: [],
    };

    constructor(pokerrunde?: Partial<Pokerrunde>) {
        this.pokerrunde = { ...PokerrundeAggregate.default, ...pokerrunde };
    }

    clone(): PokerrundeAggregate {
        return new PokerrundeAggregate(this.pokerrunde);
    }

    get id(): string { return this.pokerrunde.id };
    get mitspieler(): MitspielerEntity[] { return this.pokerrunde.mitspieler.map(m => new MitspielerEntity(m)) };
    get kartenwerte(): Kartenwert[] { return this.pokerrunde.kartenwerte };
}

export class MitspielerEntity {
    private mitspieler: Mitspieler;

    private static default: Mitspieler = {
        id: "",
        name: "",
        karte: { aufgedeckt: false, wert: "" },
    };

    constructor(mitspieler?: Partial<Mitspieler>) {
        this.mitspieler = { ...MitspielerEntity.default, ...mitspieler };
    }

    get id(): string { return this.mitspieler.id };
    get name(): string { return this.mitspieler.name };
    get karte(): Karte { return this.mitspieler.karte };

    toJSON(): string {
        return JSON.stringify(this.mitspieler);
    }
}