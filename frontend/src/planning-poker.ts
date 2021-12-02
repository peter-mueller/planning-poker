import { LitElement, html, css, property, query, queryAsync } from 'lit-element';

import '@material/mwc-dialog';
import {Dialog} from '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';
import {TextField} from '@material/mwc-textfield';
import '@material/mwc-snackbar';
import {Snackbar} from '@material/mwc-snackbar';
import './poker-card';
import './poker-table';
import './poker-button';
import { Kartenwert, MitspielerEntity, PokerrundeAggregate } from './api/Pokerrunde';
import { PokerrundeService } from './api/PokerrundeService';
import { PokerrundeRepository } from './api/PokerrundeRepository';

export class PlanningPoker extends LitElement {

  private repo: PokerrundeRepository;

  constructor() {
    super();
    const service = new PokerrundeService();
    this.repo = new PokerrundeRepository(service);
  }

  @property({type: Object})
  pokerrunde: PokerrundeAggregate = new PokerrundeAggregate();

  @property({type: String})
  private pokerrundeID = "";

  @property({type: String})
  mitspielerID = "";

  @queryAsync("#registerDialog")
  registerDialog?: Promise<Dialog>;

  @queryAsync("#nameInput")
  nameInput?: Promise<TextField>;

  @queryAsync("#snackbar")
  snackbar?: Promise<Snackbar>;


  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', () => { this._parseURL(); });
    setInterval( () => this._parseURL(), 1000);
  }

  _parseURL() {
    const params = new URLSearchParams(document.location.hash.slice(1));
    this.pokerrundeID = params.get("p") || "";
    this.mitspielerID = params.get("m") || "";
    
    if (!this.pokerrundeID) {
      this.pokerrunde = new PokerrundeAggregate({
        mitspieler: [
          {id: "1", name: "H", karte: {aufgedeckt: true, wert: "H"}},
          {id: "2", name: "E", karte: {aufgedeckt: true, wert: "❄️"}},
          {id: "3", name: "I", karte: {aufgedeckt: true, wert: "I"}},
          {id: "4", name: "L", karte: {aufgedeckt: true, wert: "🎁"}},
          {id: "5", name: "!", karte: {aufgedeckt: true, wert: "!"}},
        ],
        kartenwerte: ["", "?", ":-)", "1", "2","3","4", "XX", "☕"]
      });
      this.mitspielerID = "";
      return;
    }
    this.repo.findByID(this.pokerrundeID)
      .then(p => this.pokerrunde = p);

    if (!this.mitspielerID) {
      this.registerDialog?.then(d => d.show());
      return;
    }
  }

  static styles = css`
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

    .cardset {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;


    }

    .controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }

    .controls #link {
      flex-grow: 1;
    }

    poker-button {
      margin: 0 16px;
    }

    .cardset > poker-card {
        margin: 4px;
    }

    poker-table {
      margin: 64px 16px;
    }

  `;

  public async neuePokerrunde() {
    this.pokerrunde = await this.repo.createPokerrunde();
    this.pokerrundeID = this.pokerrunde.id;
    const params = new URLSearchParams(document.location.hash.slice(1));
    params.set('p', this.pokerrundeID);
    window.location.hash = params.toString();
  }

  render() {
    return html`
      <main>
        <h1>Planning Poker</h1>

        <div class="controls">
          <mwc-textfield outlined id="link" label="Link zur Pokerrunde" readOnly value=${window.origin + '/#?p=' + this.pokerrundeID}
            @click=${(e: any) => {
              const input = e.target;
              input.select();
              document.execCommand('copy');
              this.snackbar?.then(s => {
                s.labelText = 'Link kopiert!';
                s.show();
              })
            }}
          ></mwc-textfield>

          ${this.pokerrundeID !== "" ? 
              html`
                <poker-button id="show" @click=${async () => {
                  if (!this.pokerrundeID) {return};
                  await this.repo.aufdeckenByID(this.pokerrundeID);
                  this._parseURL();
                }}>SHOW</poker-button>
                <poker-button accent id="reset" @click=${async () => {
                  if (!this.pokerrundeID) {return};
                  await this.repo.resetByID(this.pokerrundeID);
                  this._parseURL();
                }}>RESET</poker-button>`
              : html`
                <poker-button id="new" @click=${() => this.neuePokerrunde()}>NEW</poker-button>`
          } 
          

          
        </div>

        <mwc-dialog 
          id="registerDialog" 
          heading="Namen eingeben" 
          scrimClickAction="" 
          escapeKeyAction="">
          <mwc-textfield
            id="nameInput"
            required
            minLength="1"
            dialogInitialFocus 
            label="Name">
          </mwc-textfield>
          <mwc-button
            slot="primaryAction"
            @click="${async () => {
              const dialog = await this.registerDialog;
              const input = await this.nameInput;
              const ok = input?.checkValidity();
              if (!ok) {
                input?.reportValidity();
                return;
              }

              let m = new MitspielerEntity({
                name: input?.value,
                
              });
              m = await this.repo.createMitspieler(this.pokerrundeID, m);
              this.mitspielerID = m.id;
              const params = new URLSearchParams(document.location.hash.slice(1));
              params.set('m', this.mitspielerID);
              window.location.hash = params.toString();
              
              dialog?.close();              
            }}"
            >OK</mwc-button>
        </mwc-dialog>

        <poker-table .pokerrunde=${this.pokerrunde}></poker-table>


        <div class="cardset">
            

            ${this.pokerrunde.kartenwerte.map(wert => {
                const m = this.pokerrunde.mitspieler.find(m => m.id === this.mitspielerID);
                const selectedWert = m?.karte.wert || "";
                const selected = selectedWert === wert;

                if (wert === "") {
                  return html``
                }

                return html`<poker-card ?selected=${selected} value=${wert} @click=${async () => {
                  if (!this.pokerrundeID) {return};
                  if (!this.mitspielerID) {return};

                  await this.repo.putKartenWert(this.pokerrundeID, this.mitspielerID, wert);
                  this._parseURL();
                }}></poker-card>`
            })}
        </div>


      </main>

      <mwc-snackbar id="snackbar"></mwc-snackbar>
    `;
  }
}

customElements.define('planning-poker', PlanningPoker);
