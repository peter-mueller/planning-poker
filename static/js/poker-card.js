// @ts-check
import { Karte } from "./api/Pokerrunde.js";
import { TemplatedElement } from "./arch.js";

let template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: inline-block;
    position: relative;
    color: inherit;
}
.card {

    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;

    border: 1px solid #e5e5e5;

    box-shadow: #1111 0 0 1px 2px;

    /* bridge size cards */
    width: calc(56px * 1.5);
    height: calc(88.9px * 1.5);
    background-color: white;
    border-radius: 8px;

    transition: color 100ms;

}

.card:hover {
    background: linear-gradient(
        135deg,
        #efefef 0%,
        #efefef 20%,
        white 20%,
        white 80%,
        #efefef 80%,
        #efefef 100%
    );
}


.number {
    font-size: calc(42px * 1.5);
    transform: scaleX(0.8)
}


.card:hover .number {
    color: var(--accent-color, blue);
}

.number.smallleft {
    position: absolute;
    top: 4px;
    left: 4px;
    
    transform: scale(0.25) scaleX(0.8);
    transform-origin: top left;
}
.number.smallright {
    position: absolute;
    bottom: 4px;
    right: 4px;
    
    transform: scale(0.25) scaleX(0.8) rotate(180deg) translate(100%,100%);
    transform-origin: bottom right;

}


@media only screen and (max-width: 600px) {
    .card  {
        /* bridge size cards */
        width: calc(56px * 1);
        height: calc(88.9px * 1);
    }

    .number {
        font-size: calc(42px * 1);
    }
}

:host([mini]) .card {
    /* bridge size cards */
    width: calc(56px * 0.75);
    height: calc(88.9px * 0.75);
    border-radius: 4px;
}

:host([selected]) .card {
    box-shadow: 0px 0px 0 4px var(--secondary-color, red);     
    background: linear-gradient(
        135deg,
        var(--primary-color) 0%,
        var(--primary-color) 20%,
        white 20%,
        white 80%,
        var(--accent-color) 80%,
        var(--accent-color) 100%
    );
}

:host([unknown]) .card {
    border: 1px dashed black;
    background-color: transparent;
}

:host([flipped]) .card {
    box-shadow: inset 0px 0px 0px 4px white;            
    background-color: hsl(34, 53%, 82%);
    background-image: repeating-linear-gradient(45deg, transparent 5px, hsla(197, 62%, 11%, 0.5) 5px, hsla(197, 62%, 11%, 0.5) 10px,
            hsla(5, 53%, 63%, 0) 10px, hsla(5, 53%, 63%, 0) 35px, hsla(5, 53%, 63%, 0.5) 35px, hsla(5, 53%, 63%, 0.5) 40px,
            hsla(197, 62%, 11%, 0.5) 40px, hsla(197, 62%, 11%, 0.5) 50px, hsla(197, 62%, 11%, 0) 50px, hsla(197, 62%, 11%, 0) 60px,
            hsla(5, 53%, 63%, 0.5) 60px, hsla(5, 53%, 63%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 80px,
            hsla(35, 91%, 65%, 0) 80px, hsla(35, 91%, 65%, 0) 90px, hsla(5, 53%, 63%, 0.5) 90px, hsla(5, 53%, 63%, 0.5) 110px,
            hsla(5, 53%, 63%, 0) 110px, hsla(5, 53%, 63%, 0) 120px, hsla(197, 62%, 11%, 0.5) 120px, hsla(197, 62%, 11%, 0.5) 140px
        ),
        repeating-linear-gradient(135deg, transparent 5px, hsla(197, 62%, 11%, 0.5) 5px, hsla(197, 62%, 11%, 0.5) 10px,
            hsla(5, 53%, 63%, 0) 10px, hsla(5, 53%, 63%, 0) 35px, hsla(5, 53%, 63%, 0.5) 35px, hsla(5, 53%, 63%, 0.5) 40px,
            hsla(197, 62%, 11%, 0.5) 40px, hsla(197, 62%, 11%, 0.5) 50px, hsla(197, 62%, 11%, 0) 50px, hsla(197, 62%, 11%, 0) 60px,
            hsla(5, 53%, 63%, 0.5) 60px, hsla(5, 53%, 63%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 70px, hsla(35, 91%, 65%, 0.5) 80px,
            hsla(35, 91%, 65%, 0) 80px, hsla(35, 91%, 65%, 0) 90px, hsla(5, 53%, 63%, 0.5) 90px, hsla(5, 53%, 63%, 0.5) 110px,
            hsla(5, 53%, 63%, 0) 110px, hsla(5, 53%, 63%, 0) 140px, hsla(197, 62%, 11%, 0.5) 140px, hsla(197, 62%, 11%, 0.5) 160px
        );
}

:host([flipped]) .card > * {
    display: none;
}

:host([mini]) .number {
    font-size: calc(42px * 0.75);
}
</style>

<div class="card">
    <div id="number" class="number"></div>
    <div id="smallleft" class="number smallleft"></div>
    <div id="smallright" class="number smallright"></div>
</div>
`

class ids {
    /** @type {HTMLDivElement} */
    number;
    /** @type {HTMLDivElement} */
    smallleft;
    /** @type {HTMLDivElement} */
    smallright;
}

export class PokerCard extends TemplatedElement {
    ids = new ids()

    constructor() {
        super(template)
        this.scanIds(this.ids)

        let k = new Karte()
        this.render(k)
    }

    /**
     * @param {import("./api/Pokerrunde").Karte} v
     */
    set karte(v) {
        this.render(v)
    }

    /**
     * 
     * @param {import("./api/Pokerrunde").Karte} karte
     * @returns 
     */
    render(karte) {
        let wert = karte.wert;

        if (wert === "") {
            this.setAttribute('unknown', '')
            wert = "?";
        } else {
            this.removeAttribute('unknown')
        }

        if (karte.aufgedeckt) {
            this.removeAttribute('flipped')
        } else {
            this.setAttribute('flipped', '')
        }

        this.ids.number.innerText = wert;
        this.ids.smallleft.innerText = wert;
        this.ids.smallright.innerText = wert;
    }
}

window.customElements.define('poker-card', PokerCard);