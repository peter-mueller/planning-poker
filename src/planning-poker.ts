import { LitElement, html, css, property } from 'lit-element';

import './poker-card';
import './poker-table';

export class PlanningPoker extends LitElement {

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

    .cardset > poker-card {
        margin: 4px;
    }

    poker-table {
      margin: 64px 16px;
    }

  `;

  render() {
    return html`
      <main>
        <h1>Planning Poker</h1>
        <poker-table></poker-table>


        <div class="cardset">
            <poker-card unknown></poker-card>

            <poker-card number="0"></poker-card>
            <poker-card selected number="1"></poker-card>
            <poker-card number="2"></poker-card>
            <poker-card number="3"></poker-card>
            <poker-card number="5"></poker-card>
            <poker-card number="8"></poker-card>
            <poker-card number="13"></poker-card>
            <poker-card number="21"></poker-card>
            <poker-card number="34"></poker-card>
            <poker-card number="55"></poker-card>
            <poker-card number="84"></poker-card>
        </div>


      </main>
    `;
  }
}

customElements.define('planning-poker', PlanningPoker);
