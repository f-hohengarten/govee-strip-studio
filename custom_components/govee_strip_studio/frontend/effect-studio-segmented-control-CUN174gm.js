import{$t as e,an as t,c as n,d as r,en as i,n as a,rn as o,tn as s}from"./effect-studio-core-DjubBMwf.js";var c=class extends i{constructor(...e){super(...e),this.label=``,this.options=[],this.value=``,this.disabled=!1,this.hideLabel=!1}render(){return o`
      <div class="parameter-group">
        ${this.hideLabel?s:o`<span class="parameter-label">${this.label}</span>`}
        <div class="parameter-options" role="group" aria-label=${this.label}>
          ${this.options.map(e=>{let t=e.value===this.value;return o`
              <button
                class=${t?`selected`:``}
                type="button"
                aria-pressed=${t}
                aria-label=${e.ariaLabel??s}
                title=${e.ariaLabel??s}
                ?disabled=${this.disabled}
                @click=${()=>this.select(e.value)}
              >
                ${e.label}
              </button>
            `})}
        </div>
      </div>
    `}select(e){this.disabled||e===this.value||this.dispatchEvent(new CustomEvent(`value-changed`,{detail:{value:e},bubbles:!0,composed:!0}))}static{this.styles=[n,r,t`
      :host {
        display: block;
      }
    `]}};a([e()],c.prototype,`label`,void 0),a([e({attribute:!1})],c.prototype,`options`,void 0),a([e({attribute:!1})],c.prototype,`value`,void 0),a([e({type:Boolean})],c.prototype,`disabled`,void 0),a([e({type:Boolean})],c.prototype,`hideLabel`,void 0),customElements.get(`govee-segmented-control`)||customElements.define(`govee-segmented-control`,c);