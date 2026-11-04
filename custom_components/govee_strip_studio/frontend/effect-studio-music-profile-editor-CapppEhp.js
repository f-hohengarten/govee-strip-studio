import{$t as e,It as t,Qt as n,Rt as r,an as i,at as a,c as o,d as s,en as c,et as l,in as u,it as d,l as f,n as p,nn as m,nt as h,r as g,rn as _,tn as v,tt as y,zt as b}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-checkbox-control-BRcbJ2Y-.js";import"./effect-studio-info-control-DsAgXfqF.js";import"./effect-studio-palette-editor-DXuzIP-k.js";import"./effect-studio-single-colour-field-DV9xNfiD.js";import"./effect-studio-slider-control-B2Yw9Nvi.js";var x={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},S=e=>(...t)=>({_$litDirective$:e,values:t}),C=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},{I:w}=u,T=e=>e.strings===void 0,E={},D=(e,t=E)=>e._$AH=t,O=S(class extends C{constructor(e){if(super(e),e.type!==x.PROPERTY&&e.type!==x.ATTRIBUTE&&e.type!==x.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!T(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===m||t===v)return t;let n=e.element,r=e.name;if(e.type===x.PROPERTY){if(t===n[r])return m}else if(e.type===x.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(r))return m}else if(e.type===x.ATTRIBUTE&&n.getAttribute(r)===t+``)return m;return D(e),t}}),k=class extends c{constructor(...e){super(...e),this.disabled=!1,this.modeSelectionEnabled=!1,this.showSensitivity=!0,this.retainedParameters={},this.interaction=`committed`}clearRetainedEdits(){this.retainedParameters={},this.retainedCalm=void 0}willUpdate(e){let t=e.get(`retainedEdit`);(e.has(`configEntryId`)||e.has(`content`)&&e.get(`content`)?.mode!==this.content?.mode||e.has(`retainedEdit`)&&(t?.mode!==this.retainedEdit?.mode||t?.revision!==this.retainedEdit?.revision))&&this.clearRetainedEdits(),e.has(`content`)&&this.content?.colour!=null&&(this.lastFixedColour=b(this.content.colour))}render(){if(!this.content)return v;let e=this.catalogue?.limits.music_sensitivity_min??0,n=this.catalogue?.limits.music_sensitivity_max??100,i=t(this.content.sensitivity,e,n),o=this.content.colour===null?`automatic`:`fixed`,s=this.content.colour??this.lastFixedColour??g(0),c=this.settings?.colour&&!(`left_colour`in(this.settings.parameters??{}));return _`
      <section class="card">
        <div class="parameter-stack">
          ${this.renderModeSelector()}
          ${this.showSensitivity?this.renderRangeField(`Sensitivity`,i,e,n,void 0,e=>this.updateContent(t=>(t.sensitivity=e,t))):v}

          ${c?_`<label class="field">
            <span>Colour mode</span>
            <select
              aria-label="Colour mode"
              ?disabled=${this.disabled}
              @change=${e=>this.colourModeChanged(e.target.value===`fixed`)}
            >
              <option
                value="automatic"
                .selected=${o===`automatic`}
              >
                Automatic
              </option>
              <option value="fixed" .selected=${o===`fixed`}>
                Fixed
              </option>
            </select>
          </label>`:v}

          ${c&&o===`fixed`?_`
                <govee-single-colour-field
                  label="Fixed colour"
                  .visibleLabel=${!1}
                  .colour=${s}
                  .disabled=${this.disabled}
                  .selectionActive=${!0}
                  .rememberOnCommit=${!0}
                  @colour-changing=${e=>this.fixedColourChanged(e.detail.colour,`changing`)}
                  @colour-changed=${e=>this.fixedColourChanged(e.detail.colour,`committed`)}
                ></govee-single-colour-field>
              `:v}

          ${this.settings?.style?_`
                <label class="field">
                  <span class="field-label-with-help">
                    <span>Style</span>
                    <govee-info-control
                      .label=${y.label}
                      .text=${y.text}
                    ></govee-info-control>
                  </span>
                  <select
                    aria-label="Style"
                    ?disabled=${this.disabled}
                    @change=${e=>this.styleChanged(d(e.target.value))}
                  >
                    <option
                      value="dynamic"
                      .selected=${a(this.content.calm??this.settings.calm_default)===`dynamic`}
                    >
                      Dynamic
                    </option>
                    <option
                      value="calm"
                      .selected=${a(this.content.calm??this.settings.calm_default)===`calm`}
                    >
                      Calm
                    </option>
                  </select>
                </label>
              `:v}

          ${this.renderModeParameters(this.content)}
          ${this.settings?.palette?_`
            <div class="field">
              <span>Music colours</span>
              <govee-palette-editor
                .palette=${this.content.palette??this.settings.palette.default}
                .minColours=${this.settings.palette.min}
                .maxColours=${this.settings.palette.max}
                .disabled=${this.disabled}
                .ariaLabel=${`Music colours`}
                @palette-changed=${e=>{this.updateContent(t=>({...t,palette:r(e.detail.palette)}),e.detail.interaction)}}
              ></govee-palette-editor>
              ${this.content.palette===void 0?v:_`
                <button type="button" ?disabled=${this.disabled} @click=${()=>this.updateContent(e=>(delete e.palette,e))}>Use default colours</button>
              `}
            </div>
          `:v}
        </div>
      </section>
      ${this.renderZones()}
      ${this.retainedEdit?.mode===this.content.mode?_`
        <section class="card">
          <h3>Edit retained device music</h3>
          <p>Preserves the last complete body, including its palette and geometry. This is retained data, not readback.</p>
          ${this.renderModeParameters({...this.content,parameters:{...this.retainedEdit.parameters,...this.retainedParameters}},this.retainedEdit.settings,(e,t)=>{this.retainedParameters={...this.retainedParameters,[e]:t}})}
          ${this.retainedEdit.settings.style?_`
            <label class="field">Style
              <select aria-label="Retained music style" ?disabled=${this.disabled}
                @change=${e=>{let t=e.target.value;this.retainedCalm=t===`preserve`?void 0:t===`calm`}}>
                <option value="preserve" .selected=${this.retainedCalm===void 0}>Preserve</option>
                <option value="dynamic" .selected=${this.retainedCalm===!1}>Dynamic</option>
                <option value="calm" .selected=${this.retainedCalm===!0}>Calm</option>
              </select>
            </label>`:v}
          <button type="button" ?disabled=${this.disabled||!Object.keys(this.retainedParameters).length&&this.retainedCalm===void 0}
            @click=${()=>this.dispatchEvent(new CustomEvent(`retained-music-edit`,{detail:{edit:this.retainedEdit,parameters:this.retainedParameters,calm:this.retainedCalm},bubbles:!0,composed:!0}))}>Apply retained-body edits</button>
        </section>`:v}
    `}renderZones(){let e=this.content,t=this.catalogue;if(!e?.zones||!t?.native_zones)return v;let n={...t,music_modes:t.music_modes.filter(t=>t.id!==e.mode)};return _`${e.zones.map((r,i)=>_`
      <section class="card">
        <h3>${t.native_zones[i]?.label??r.id}</h3>
        <govee-music-profile-editor .content=${{kind:`music_profile`,model:e.model,mode:r.mode,sensitivity:e.sensitivity,colour:null,calm:null,parameters:r.parameters,...r.palette===void 0?{}:{palette:r.palette}}}
          .catalogue=${n} .disabled=${this.disabled} .modeSelectionEnabled=${!0} .showSensitivity=${!1}
          @mode-changed=${e=>{e.stopPropagation(),n.music_modes.some(t=>t.id===e.detail.mode)&&this.updateZone(i,r.mode,{id:r.id,mode:e.detail.mode,parameters:{}})}}
          @content-changed=${e=>{e.stopPropagation();let t=e.detail.content;this.updateZone(i,r.mode,{...r,parameters:t.parameters,...t.palette===void 0?{}:{palette:t.palette}},e.detail.interaction,t.palette===void 0)}}
        ></govee-music-profile-editor>
      </section>
    `)}`}updateZone(e,t,n,r=`committed`,i=!1){this.content?.zones?.[e]?.mode===t&&this.updateContent(r=>{let a=r.zones[e];return n.mode===t&&(n={...a,parameters:{...a.parameters,...n.parameters},...n.palette===void 0?{}:{palette:n.palette}}),i&&delete n.palette,r.zones[e]=n,r},r)}renderRangeField(e,t,n,r,i,a){return _`
      <govee-slider-control
        .label=${e}
        .value=${t}
        .minimum=${n}
        .maximum=${r}
        .valueText=${i?l(i,t):void 0}
        .disabled=${this.disabled}
        @value-changed=${e=>{this.interaction=e.detail.interaction;try{a(e.detail.value)}finally{this.interaction=`committed`}}}
      ></govee-slider-control>
    `}renderModeSelector(){if(!this.modeSelectionEnabled||!this.content||!this.catalogue)return v;let e=this.catalogue.music_modes.some(e=>e.id===this.content.mode);return _`
      <label class="field">
        <span>Reactive effect</span>
        <select
          aria-label="Reactive effect"
          .value=${O(this.content.mode)}
          ?disabled=${this.disabled}
          @change=${e=>this.dispatchEvent(new CustomEvent(`mode-changed`,{detail:{mode:e.target.value},bubbles:!0,composed:!0}))}
        >
          ${e?v:_`<option value=${this.content.mode}>${this.content.mode}</option>`}
          ${this.catalogue.music_modes.map(e=>_`<option value=${e.id}>${e.label}</option>`)}
        </select>
      </label>
    `}renderModeParameters(e,t=this.settings,n=(e,t)=>this.updateParameter(e,t)){return Object.entries(t?.parameters??{}).map(([t,r])=>{let i=M(t);if((t===`background`||t===`left_colour`||t===`right_colour`)&&r.kind===`number`){let a=A(e.parameters,t,r.default,r.min,r.max),o=[a>>16,a>>8&255,a&255],s=(e,r)=>{let[i,a,o]=e.detail.colour;this.interaction=r;try{n(t,i<<16|a<<8|o)}finally{this.interaction=`committed`}};return _`
          <div class="field">
            <govee-single-colour-field
              label=${t===`background`?`Background colour`:i}
              .colour=${o}
              .disabled=${this.disabled}
              @colour-changing=${e=>s(e,`changing`)}
              @colour-changed=${e=>s(e,`committed`)}
            ></govee-single-colour-field>
            ${t===`background`?_`
              <button type="button" ?disabled=${this.disabled} @click=${()=>n(t,65793)}>
                No colour
              </button>`:v}
          </div>
        `}if(r.kind===`number`)return this.renderRangeField(i,A(e.parameters,t,r.default,r.min,r.max),r.min,r.max,t,e=>n(t,e));if(r.kind===`switch`)return this.renderCheckboxField(i,j(e.parameters,t,r.default),e=>n(t,e));let a=e.parameters[t],o=typeof a==`string`&&r.options.includes(a)?a:r.default;return _`
        <label class="field">
          <span class="parameter-label">${i}</span>
          <select
            aria-label=${i}
            .value=${O(o)}
            ?disabled=${this.disabled}
            @change=${e=>n(t,e.target.value)}
          >
            ${r.options.map(e=>_`
              <option value=${e} .selected=${e===o}>${M(e)}</option>
            `)}
          </select>
        </label>
      `})}get settings(){return this.content?this.catalogue?.music_settings[this.content.mode]:void 0}renderCheckboxField(e,t,n){return _`
      <govee-checkbox-control
        .label=${e}
        .checked=${t}
        .disabled=${this.disabled}
        @checked-changed=${e=>n(e.detail.checked)}
      ></govee-checkbox-control>
    `}colourModeChanged(e){this.updateContent(t=>{if(!e)return this.lastFixedColour=t.colour===null?this.lastFixedColour:b(t.colour),t.colour=null,t;let n=t.colour??this.lastFixedColour??g(0);return this.lastFixedColour=b(n),t.colour=b(n),t})}fixedColourChanged(e,t){this.lastFixedColour=b(e),this.updateContent(t=>(t.colour=b(e),t),t)}styleChanged(e){this.updateContent(t=>(this.settings?.style&&(t.calm=e),t))}updateParameter(e,t){this.updateContent(n=>{let r=structuredClone(n.parameters);if(r[e]=t,e===`fixed_colour`&&t===!0)for(let e of[`left_colour`,`right_colour`]){let t=this.settings?.parameters?.[e];t?.kind===`number`&&(r[e]=A(r,e,t.default,t.min,t.max))}return(e===`left_colour`||e===`right_colour`)&&(r.fixed_colour=!0),n.parameters=r,n})}updateContent(e,t=this.interaction){if(!this.content)return;let n=h(e(h(this.content)));this.content=n,this.dispatchEvent(new CustomEvent(`content-changed`,{detail:{content:h(n),interaction:t},bubbles:!0,composed:!0}))}static{this.styles=[o,f,s,i`
      :host {
        display: block;
      }

      .field-label-with-help {
        display: inline-flex;
        align-items: center;
        gap: var(--studio-compact-gap);
        justify-self: start;
      }

    `]}};p([e({attribute:!1})],k.prototype,`content`,void 0),p([e({attribute:!1})],k.prototype,`catalogue`,void 0),p([e({type:Boolean})],k.prototype,`disabled`,void 0),p([e({type:Boolean})],k.prototype,`modeSelectionEnabled`,void 0),p([e({type:Boolean})],k.prototype,`showSensitivity`,void 0),p([e({attribute:!1})],k.prototype,`retainedEdit`,void 0),p([e({attribute:!1})],k.prototype,`configEntryId`,void 0),p([n()],k.prototype,`retainedParameters`,void 0),p([n()],k.prototype,`retainedCalm`,void 0);function A(e,n,r,i,a){let o=e[n];return typeof o!=`number`||!Number.isFinite(o)?r:t(o,i,a)}function j(e,t,n){return typeof e[t]==`boolean`?e[t]:n}function M(e){return e===`two_way`?`Two-way`:e.replaceAll(`_`,` `).replace(/^./,e=>e.toUpperCase())}customElements.get(`govee-music-profile-editor`)||customElements.define(`govee-music-profile-editor`,k);export{k as GoveeMusicProfileEditor};