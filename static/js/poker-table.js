// @ts-check

import { Pokerrunde } from "./api/Pokerrunde.js";
import { TemplatedElement } from "./arch.js";
import { PokerCard } from "./poker-card.js";

let template = document.createElement('template');
template.innerHTML = `
<style>
:host {
    display: block;
    margin: 8px 16px;
}

.table {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 8px 48px;
    margin: 0 auto;
    max-width: 512px;
    height: 192px;
    background-color: var(--alternative-color, grey);
    border-radius: 96px;

    border: 16px solid var(--accent-color);

    box-shadow: #eeea -1px -1px 0 1px, 
                #555a 2px 2px 0 4px,
                #555a -1px -1px 0 3px;

}

.midline {
    background-color: #eeeea580;;
    border-radius: 2px;
    height: 2px;
    width: 100%;
}

#toprow {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}
#bottomrow {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}

poker-card {
    padding: 3px;
    border-radius: 8px;
    border: 2px solid #eeeea580;
}
</style>

<div class="table">
    <div id="toprow">
    </div>
    <div class="midline"></div>
    <div id="bottomrow">
    </div>
</div>
`

class ids {
    /** @type {HTMLDivElement} */
    toprow;
    /** @type {HTMLDivElement} */
    bottomrow;
}

export class PokerTable extends TemplatedElement {

    ids = new ids()

    constructor() {
        super(template)
        this.scanIds(this.ids)
        this.render(new Pokerrunde())
    }


    /**
     * @param {Pokerrunde} runde
     */
    set pokerrunde(runde) {
        this.render(runde)
    }

    
    /**
     * @param {Pokerrunde} runde
     */
    render(runde) {
        /** @type {PokerCard[]} */
        let toprow =  []
        /** @type {PokerCard[]} */
        let bottomrow = []

        for (let i = 0; i < runde.mitspieler.length; i++) {
            let row = toprow
            if (i%2 === 1) {
                row = bottomrow
            }
            let m = runde.mitspieler[i]
            let card = new PokerCard()
            card.setAttribute('mini', '')
            card.karte = m.karte;
            row.push(card)
        }
        this.ids.toprow.replaceChildren(...toprow);
        this.ids.bottomrow.replaceChildren(...bottomrow)
    }
}

window.customElements.define('poker-table', PokerTable);