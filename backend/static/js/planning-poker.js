// @ts-check

import './poker-card.js';
import './poker-table.js';
import './poker-button.js';
import { PokerrundeService } from './api/PokerrundeService.js';
import { PokerrundeRepository } from './api/PokerrundeRepository.js';
import { TemplatedElement } from './arch.js';
import { PokerButton } from './poker-button.js';
import { PokerTable } from './poker-table.js';
import { Karte, Mitspieler, Pokerrunde } from './api/Pokerrunde.js';
import { PokerCard } from './poker-card.js';


let template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  /* Color scheme */
  --light-background-color: #f4f1deff;
  --accent-color: #e07a5fff;
  --secondary-color: #3d405bff;
  --alternative-color: #81b29aff;
  --primary-color: #f2cc8fff;

  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--light-background-color);
}

main {
  width: 100%;
  flex-grow: 1;
  max-width: 768px;
  margin: 0 auto;
}

h1 {
  border-bottom: 2px solid black;
}

#cardset {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;


}

#controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

#controls #link {
  flex-grow: 1;
}

poker-button {
  margin: 0 16px;
}

#cardset > poker-card {
    margin: 4px;
}

poker-table {
  margin: 64px 16px;
}
</style>


<main>
  <h1>Planning Poker</h1>

  <div id="controls">
    <label for="linkInput">Link zur Pokerrunde</label>
    <input id="linkInput" readonly>
    <button id="linkCopyButton">COPY</button>    

    <!-- dynamic controls -->
    
  </div>

  <poker-table id="pokertable"></poker-table>


  <div id="cardset">
      <!-- poker cards -->

  </div>


</main>

`

class Ids {
  /** @type {HTMLInputElement} */
  linkInput;
  /** @type {HTMLButtonElement} */
  linkCopyButton;
  /** @type {HTMLDivElement} */
  controls;
  /** @type {PokerTable} */
  pokertable;
  /** @type {HTMLDivElement} */
  cardset;
}

/**
 * @param {PokerrundeRepository} repo
 * @param {string} pokerrundeId 
 * @returns {Promise<string>}
 */
async function register(repo, pokerrundeId) {
  let m = new Mitspieler();
  m = await repo.createMitspieler(pokerrundeId, m);
  const params = new URLSearchParams(document.location.hash.slice(1));
  params.set('m', m.id);
  window.location.hash = params.toString();
  return m.id
}

export class PlanningPoker extends TemplatedElement {

  ids = new Ids();
  /** @type {PokerrundeRepository} */
  repo;
  pokerrunde = new Pokerrunde();
  pokerrundeID = "";
  mitspielerID = "";

  
  currentControls = [];
  
  constructor() {
    super(template)
    this.scanIds(this.ids)

    const service = new PokerrundeService()
    service.baseURL = location.origin
    this.repo = new PokerrundeRepository(service)

    this.ids.linkInput.addEventListener('click', (e) => {
      const input = e.target;
      this.ids.linkInput.select();
    })
    this.ids.linkCopyButton.addEventListener('click', () => {
      let link = this.ids.linkInput.value
      navigator.clipboard.writeText(link)
    })
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('hashchange', () => { this._parseURL(); });
    setInterval(async () => await this._parseURL(), 1000);
    this._parseURL()
  }

  async _parseURL() {
    const params = new URLSearchParams(document.location.hash.slice(1));
    this.pokerrundeID = params.get("p") || "";
    this.mitspielerID = params.get("m") || "";
    
    if (!this.pokerrundeID) {
      let r = new Pokerrunde()
      r.unmarshalJson({
        mitspieler: [
          {id: "1", karte: {aufgedeckt: true, wert: "H"}},
          {id: "2", karte: {aufgedeckt: true, wert: "💃"}},
          {id: "3", karte: {aufgedeckt: true, wert: "I"}},
          {id: "4", karte: {aufgedeckt: true, wert: "🕺"}},
          {id: "5", karte: {aufgedeckt: true, wert: "!"}},
        ],
        kartenwerte: ["", "?", ":-)", "1", "2", "3" ,"4", "XX", "☕"]
      })
      this.pokerrunde = r
      this.mitspielerID = "" 
      let newButton = new PokerButton()
      newButton.setAttribute("id", "new")
      newButton.innerText = 'NEW'
      newButton.addEventListener('click', () => {
        this.neuePokerrunde()
      })

      this.update(this.pokerrunde, [newButton])
      return;
      
    }

    this.pokerrunde = await this.repo.findByID(this.pokerrundeID)
    if (!this.mitspielerID) {
      let mitspielerId = await register(this.repo, this.pokerrundeID)
      this.mitspielerID = mitspielerId
    }
    
    let showButton = new PokerButton()
    showButton.setAttribute('id', "show")
    showButton.innerText = "SHOW"
    showButton.addEventListener('click',async () => {
      if (!this.pokerrundeID) {return};
      await this.repo.aufdeckenByID(this.pokerrundeID);
      this._parseURL();
    })

    let resetButton = new PokerButton()
    resetButton.setAttribute('id', "reset")
    resetButton.setAttribute("accent", "")
    resetButton.innerText = "RESET"
    resetButton.addEventListener('click',async () => {
      if (!this.pokerrundeID) {return};
      await this.repo.resetByID(this.pokerrundeID);
      this._parseURL();
    })

    this.update(this.pokerrunde, [showButton, resetButton])
  }
  
  async neuePokerrunde() {
    this.pokerrunde = await this.repo.createPokerrunde();
    this.pokerrundeID = this.pokerrunde.id;
    const params = new URLSearchParams(document.location.hash.slice(1));
    params.set('p', this.pokerrundeID);
    window.location.hash = params.toString();
  }

  /**
   * 
   * @param {Pokerrunde} pokerrunde
   * @param {HTMLElement[]} controls 
   * @returns 
   */
  update(pokerrunde, controls) {
    this.ids.linkInput.value = window.origin + '/#?p=' + this.pokerrunde.id
    this.ids.pokertable.pokerrunde = pokerrunde
    
    for (let el of this.currentControls) {
     this.ids.controls.removeChild(el)
    }
    this.ids.controls.append(...controls)
    this.currentControls = controls
    
    let karten = [];
    let m = pokerrunde.mitspieler.find(m => m.id === this.mitspielerID)
    for (let wert of pokerrunde.kartenwerte) {
      const selectedWert = m?.karte.wert || "";
      const selected = selectedWert === wert;
      if (wert === "") {
        continue
      }
      
      let card = new PokerCard()
      if (selected) {
        card.setAttribute("selected", "")
      }
      let k = new Karte()
      k.aufgedeckt = true
      k.wert = wert
      card.karte = k

      card.addEventListener("click", async () => {
        if (!this.pokerrunde) {
          return
        }
        if (!this.mitspielerID) {
          return
        }
        await this.repo.putKartenWert(pokerrunde.id, this.mitspielerID, wert)
        this._parseURL()
      })
      karten.push(card)
    }
    this.ids.cardset.replaceChildren(...karten)
  }
}

customElements.define('planning-poker', PlanningPoker);
