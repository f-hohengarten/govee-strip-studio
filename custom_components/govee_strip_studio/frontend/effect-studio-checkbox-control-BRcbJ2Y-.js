import{$t as e,an as t,c as n,d as r,en as i,n as a,rn as o}from"./effect-studio-core-DjubBMwf.js";var s=class extends i{constructor(...e){super(...e),this.label=``,this.checked=!1,this.disabled=!1}render(){return o`
      <div class="check-control">
        <label class="check-field">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            @change=${this.checkedChanged}
          />
          <span class="parameter-label">${this.label}</span>
        </label>
        <slot name="help"></slot>
      </div>
    `}checkedChanged(e){this.dispatchEvent(new CustomEvent(`checked-changed`,{detail:{checked:e.target.checked},bubbles:!0,composed:!0}))}static{this.styles=[n,r,t`
      :host {
        display: block;
      }

      .check-control {
        display: flex;
        align-items: center;
        gap: var(--studio-compact-gap);
      }

      .check-field {
        flex: 0 1 auto;
      }
    `]}};a([e()],s.prototype,`label`,void 0),a([e({type:Boolean})],s.prototype,`checked`,void 0),a([e({type:Boolean})],s.prototype,`disabled`,void 0),customElements.get(`govee-checkbox-control`)||customElements.define(`govee-checkbox-control`,s);