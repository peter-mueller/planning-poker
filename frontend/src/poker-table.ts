import { css, html, LitElement, property } from "lit-element";
import { PokerrundeAggregate } from "./api/Pokerrunde";

export class PokerTable extends LitElement {

    @property({type: PokerrundeAggregate})
    pokerrunde: PokerrundeAggregate = new PokerrundeAggregate();

    static styles = css`
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

        .toprow {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .bottomrow {
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
    `;
    
    render() {
        return html`
            <div class="table">
                <div class="toprow">
                    ${this.pokerrunde.mitspieler.filter((_, index) => index % 2 === 0).map(m => 
                        html`<poker-card ?flipped=${!m.karte.aufgedeckt && m.karte.wert !== ""} ?unknown=${m.karte.wert === ""} mini value=${m.karte.wert}></poker-card>`
                    )}
                </div>
                <div class="midline"></div>
                <div class="bottomrow">
                    ${this.pokerrunde.mitspieler.filter((_, index) => index % 2 === 1).map(m => 
                        html`<poker-card ?flipped=${!m.karte.aufgedeckt && m.karte.wert !== ""} ?unknown=${m.karte.wert === ""} mini value=${m.karte.wert}></poker-card>`
                    )}
                </div>
                
               
            </div>
        `;
    }
}

window.customElements.define('poker-table', PokerTable);