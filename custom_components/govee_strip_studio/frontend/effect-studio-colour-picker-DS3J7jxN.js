import{$t as e,Jt as t,Wt as n,a as r,an as i,c as a,en as o,i as s,n as c,rn as l}from"./effect-studio-core-DjubBMwf.js";var u=class extends o{constructor(...e){super(...e),this.colour=[255,255,255],this.disabled=!1,this.selectionActive=!0,this.rememberOnCommit=!0,this.displayedRecentColours=s()}connectedCallback(){super.connectedCallback(),this.displayedRecentColours=s()}render(){let e=this.selectionActive?t(this.colour):``,r=this.selectionActive&&!this.displayedRecentColours.some(n=>t(n)===e);return l`
      <div class="preset-grid">
        ${this.displayedRecentColours.map(n=>l`
            <button
              class=${t(n)===e?`selected`:``}
              type="button"
              style="--preset-colour: ${t(n)}"
              aria-label="Use ${t(n)}"
              aria-pressed=${t(n)===e}
              ?disabled=${this.disabled}
              @click=${()=>this.commit(n)}
            ></button>
          `)}
        <label
          class="custom-colour ${r?`selected`:``}"
          style="--custom-colour: ${t(this.colour)}"
        >
          <input
            type="color"
            aria-label="Custom colour"
            .value=${t(this.colour)}
            ?disabled=${this.disabled}
            @input=${e=>this.emit(`colour-changing`,n(e.target.value))}
            @change=${e=>this.commit(n(e.target.value))}
          />
        </label>
      </div>
    `}commit(e){this.rememberOnCommit&&r(e),this.emit(`colour-changed`,e)}emit(e,t){this.colour=[...t],this.dispatchEvent(new CustomEvent(e,{detail:{colour:[...t]},bubbles:!0,composed:!0}))}static{this.styles=[a,i`
    :host {
      --custom-colour-ring-width: 5px;
      --custom-colour-inner-ring-width: 3px;
      display: block;
    }

    .preset-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--studio-micro-gap);
    }

    .preset-grid button,
    .custom-colour {
      position: relative;
      min-height: var(--studio-control-height);
      border: var(--studio-border-width) solid rgb(0 0 0 / 12%);
      border-radius: var(--studio-swatch-radius);
      cursor: pointer;
    }

    .preset-grid button.selected,
    .custom-colour.selected {
      border-color: var(--studio-blue);
      box-shadow:
        inset 0 0 0 var(--studio-strong-border-width) var(--studio-card),
        0 0 0 var(--studio-strong-border-width) var(--studio-blue);
    }

    .preset-grid button {
      background: var(--preset-colour);
    }

    .custom-colour {
      overflow: hidden;
      background: var(--custom-colour);
      box-shadow:
        inset 0 0 0 var(--custom-colour-inner-ring-width)
          var(--studio-card),
        inset 0 0 0 var(--custom-colour-ring-width) rgb(0 0 0 / 32%);
    }

    .custom-colour input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: 0;
      border: 0;
      opacity: 0;
      cursor: pointer;
    }

    .custom-colour:focus-within {
      outline: var(--studio-focus-width) solid var(--studio-blue);
      outline-offset: var(--studio-focus-offset);
    }
  `]}};c([e({attribute:!1})],u.prototype,`colour`,void 0),c([e({type:Boolean})],u.prototype,`disabled`,void 0),c([e({type:Boolean})],u.prototype,`selectionActive`,void 0),c([e({type:Boolean})],u.prototype,`rememberOnCommit`,void 0),customElements.get(`govee-colour-picker`)||customElements.define(`govee-colour-picker`,u);