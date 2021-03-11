import { css, html, LitElement } from "lit-element";

export class PokerTable extends LitElement {
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
                    <poker-card flipped mini number="0"></poker-card>
                    <poker-card mini number="1"></poker-card>
                    <poker-card unknown mini number="2"></poker-card>

                </div>
                <div class="midline"></div>
                <div class="bottomrow">
                    <poker-card mini number="3"></poker-card>
                    <poker-card mini number="5"></poker-card>
                    <poker-card mini number="8"></poker-card>
                </div>
                
               
            </div>
        `;
    }
}

window.customElements.define('poker-table', PokerTable);