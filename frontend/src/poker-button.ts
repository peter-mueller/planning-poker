import { css, html, LitElement } from "lit-element";

export class PokerButton extends LitElement {
    static styles = css`
        :host {
            --background-color: black;
            --border-color: white;
            --text-color: white;
        }

        :host([accent]) {
            --background-color: var(--accent-color);
        }

        .button {

            display: inline-block;
            color: #f1f1f1;
            border-color: white; 
            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 8px dashed white;
            border-color: var(--border-color, white);

            color: var(text-color);
            background-color: var(--background-color, black);

            font-family: monospace;
            font-size: 1.5em;
            font-weight: bolder;

            box-shadow: #eeea -1px -1px 0 1px, 
                    #555a 1px 1px 0 1px,
                    #555a -1px -1px 0 1px;

        }

        .button:hover {
            text-decoration: underline;

        }
    `

    render() {
        return html`
            <div class="button">
                <slot></slot>
            </div>
        `;
    }
}

window.customElements.define('poker-button', PokerButton);