// @ts-check

export class TemplatedElement extends HTMLElement {
    /**
     * @param {HTMLTemplateElement} t
     */
    constructor(t) {
        super()
        let shadow = this.attachShadow({mode: 'open'})
        shadow.append(t.content.cloneNode(true))
    }

    /**
     * @param {any} ids
     */
    scanIds(ids) {
        for (let id in ids) {
        let el = this.root().getElementById(id)
            if (el == null) {
                throw new Error(`id ${id} not found in template`)
            }
            ids[id] = el;
        }
    }

    connectedCallback() {
    }

    /**
     * @returns {ShadowRoot}
     */
    root() {
        if (this.shadowRoot == null) {
            throw new Error("shadow root must be defined")
        }
        return this.shadowRoot;

    }
}