import{$t as e,an as t,c as n,d as r,en as i,n as a,rn as o,tn as s}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-colour-picker-DS3J7jxN.js";var c=class extends i{constructor(...e){super(...e),this.label=`Colour`,this.visibleLabel=!0,this.colour=[255,255,255],this.disabled=!1,this.selectionActive=!0,this.rememberOnCommit=!0}render(){return o`
      <div class="parameter-group" role="group" aria-label=${this.label}>
        ${this.visibleLabel?o`<span class="parameter-label">${this.label}</span>`:s}
        <govee-colour-picker
          .colour=${this.colour}
          .disabled=${this.disabled}
          .selectionActive=${this.selectionActive}
          .rememberOnCommit=${this.rememberOnCommit}
        ></govee-colour-picker>
      </div>
    `}static{this.styles=[n,r,t`
      :host {
        display: block;
      }

      .parameter-group {
        width: min(460px, 100%);
      }
    `]}};a([e()],c.prototype,`label`,void 0),a([e({type:Boolean})],c.prototype,`visibleLabel`,void 0),a([e({attribute:!1})],c.prototype,`colour`,void 0),a([e({type:Boolean})],c.prototype,`disabled`,void 0),a([e({type:Boolean})],c.prototype,`selectionActive`,void 0),a([e({type:Boolean})],c.prototype,`rememberOnCommit`,void 0),customElements.get(`govee-single-colour-field`)||customElements.define(`govee-single-colour-field`,c);export{c as GoveeSingleColourField};