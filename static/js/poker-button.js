// @ts-check
import { TemplatedElement } from "./arch.js";

const template = document.createElement('template');
template.innerHTML = `
<style>
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
</style>

<div class="button">
    <slot></slot>
</div>
`


export class PokerButton extends TemplatedElement {

    constructor() {
        super(template)
    }
}

window.customElements.define('poker-button', PokerButton);