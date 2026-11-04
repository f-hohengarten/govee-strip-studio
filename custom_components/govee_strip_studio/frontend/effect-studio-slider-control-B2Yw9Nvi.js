import{$t as e,Ft as t,an as n,c as r,d as i,en as a,n as o,rn as s,tn as c}from"./effect-studio-core-DjubBMwf.js";var l=class extends a{constructor(...e){super(...e),this.label=``,this.value=0,this.minimum=0,this.maximum=100,this.step=1,this.disabled=!1,this.hideValueText=!1}render(){let e=t(this.value,this.minimum,this.maximum);return s`
      <label class="slider-field">
        <span class="slider-label">
          <span class="slider-label-context">
            <span class="parameter-label">${this.label}</span>
            <slot name="help"></slot>
          </span>
          ${this.valueText===void 0||this.hideValueText?c:s`<span class="slider-value">${this.valueText}</span>`}
        </span>
        <input
          type="range"
          min=${this.minimum}
          max=${this.maximum}
          step=${this.step}
          .value=${String(e)}
          aria-label=${this.label}
          aria-describedby=${this.describedBy??c}
          aria-valuetext=${this.valueText??c}
          ?disabled=${this.disabled}
          @input=${e=>this.valueChanged(e,`changing`)}
          @change=${e=>this.valueChanged(e,`committed`)}
        />
      </label>
    `}valueChanged(e,t){this.dispatchEvent(new CustomEvent(`value-changed`,{detail:{value:Number(e.target.value),interaction:t},bubbles:!0,composed:!0}))}static{this.styles=[r,i,n`
      :host {
        display: block;
      }

      .slider-field {
        display: grid;
        gap: var(--studio-control-gap);
      }

      .slider-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: var(--studio-info-control-size);
        gap: var(--studio-compact-gap);
      }

      .slider-label-context {
        display: inline-flex;
        align-items: center;
        gap: var(--studio-compact-gap);
      }

      .slider-value {
        color: var(--studio-muted);
        font-variant-numeric: tabular-nums;
      }

      input {
        width: 100%;
        min-width: 0;
        min-height: var(--studio-control-height);
        margin: 0;
      }
    `]}};o([e()],l.prototype,`label`,void 0),o([e({type:Number})],l.prototype,`value`,void 0),o([e({type:Number})],l.prototype,`minimum`,void 0),o([e({type:Number})],l.prototype,`maximum`,void 0),o([e({type:Number})],l.prototype,`step`,void 0),o([e({type:Boolean})],l.prototype,`disabled`,void 0),o([e({attribute:!1})],l.prototype,`describedBy`,void 0),o([e({attribute:!1})],l.prototype,`valueText`,void 0),o([e({type:Boolean})],l.prototype,`hideValueText`,void 0),customElements.get(`govee-slider-control`)||customElements.define(`govee-slider-control`,l);export{l as GoveeSliderControl};