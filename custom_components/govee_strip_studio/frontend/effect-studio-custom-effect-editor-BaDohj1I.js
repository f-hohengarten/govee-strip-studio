import{$ as e,$t as t,Qt as n,Rt as r,an as i,c as a,d as o,en as s,l as c,n as l,rn as u,s as d,tn as f}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-checkbox-control-BRcbJ2Y-.js";import"./effect-studio-palette-editor-DXuzIP-k.js";import"./effect-studio-slider-control-B2Yw9Nvi.js";import"./effect-studio-painted-segment-editor-Bxas-lDb.js";import"./effect-studio-single-colour-field-DV9xNfiD.js";function p(e,t,n,i){let a=e.layers.length===t.native_zones?.length;return u`${e.layers.map((o,s)=>{if(o.type===`paint`)return f;let c=t.effects.find(e=>e.family===o.kind),l=a?t.native_zones[s].label:c?.label??`Effect`,d=(t,n)=>i(s,t,e.family,o.kind,n),p=o.type===`diy`&&(o.enabled??!0);return u`
      <section class="card">
        <h3>${l}</h3>
        ${a?u`
          <label>Effect<select .value=${String(o.kind)} ?disabled=${n} @change=${e=>{let n=Number(e.target.value),r=t.templates?.find(e=>e.content.kind===`native_effect`&&e.content.family===n&&e.content.layers.length===1);if(r?.content.kind!==`native_effect`)return;let i=structuredClone(r.content.layers[0]);i.type===`diy`&&d({...i,enabled:o.type!==`diy`||(o.enabled??!0)})}}>
            ${c?f:u`<option value=${o.kind}>Choose an effect</option>`}
            ${t.effects.map(e=>u`<option value=${e.family} ?selected=${e.family===o.kind}>${e.label}</option>`)}
          </select></label>
        `:f}
        ${o.type===`opaque`?u`<p>Unqualified parameters are retained. Select a known effect to replace them.</p>`:u`
          ${a?u`
            <govee-checkbox-control label="Include this effect" .checked=${p} .disabled=${n}
              @checked-changed=${e=>d({enabled:e.detail.checked})}
            ></govee-checkbox-control>
          `:f}
          ${c?u`
            ${c.variations.length>1?u`
              <label>Variation<select .value=${String(o.parameter)} ?disabled=${n} @change=${e=>d({parameter:Number(e.target.value)})}>
                ${c.variations.some(e=>e.variant===o.parameter)?f:u`<option value=${o.parameter}>Unknown variation ${o.parameter}</option>`}
                ${c.variations.map(e=>u`<option value=${e.variant} ?selected=${e.variant===o.parameter}>${e.label}</option>`)}
              </select></label>
            `:f}
            ${c.rate_min===c.rate_max?u`<p>Speed: ${c.rate_min} (fixed)</p>`:u`
              <govee-slider-control label="Speed" .value=${o.speed}
                .minimum=${c.rate_min} .maximum=${c.rate_max} .disabled=${n}
                @value-changed=${e=>d({speed:e.detail.value},e.detail.interaction)}
              ></govee-slider-control>
            `}
            <h4>${c.palette_labels?.[0]??`Colours`}</h4>
            <govee-palette-editor .palette=${o.palette}
              .minColours=${c.palette_min??t.limits.palette_min}
              .maxColours=${c.palette_max??t.limits.palette_max} .disabled=${n}
              @palette-changed=${e=>d({palette:r(e.detail.palette)},e.detail.interaction)}
            ></govee-palette-editor>
            ${c.secondary_palette?u`
              <h4>${c.palette_labels?.[1]??`Secondary colours`}</h4>
              <govee-palette-editor .palette=${o.secondary_palette??[]}
                .minColours=${c.secondary_palette.min} .maxColours=${c.secondary_palette.max} .disabled=${n}
                @palette-changed=${e=>d({secondary_palette:r(e.detail.palette)},e.detail.interaction)}
              ></govee-palette-editor>
            `:f}
          `:u`<p>Select a known effect before applying this definition.</p>`}
        `}
      </section>
    `})}`}function m(e){return e?.kind===`h617a_single`||e?.kind===`h6179_single_diy`||e?.kind===`palette_diy`}function h(e){return e?.kind===`h617a_multi`||e?.kind===`h6179_mixed_diy`}function g(e){return e.kind===`h6179_mixed_diy`?e.components:e.effects}function _(e,t){return e.kind===`h6179_mixed_diy`?{...e,components:t}:{...e,effects:t}}var v=class extends s{constructor(...e){super(...e),this.disabled=!1,this.nativeLayerIndex=0,this.nativePaintColour=[255,0,0],this.nativeErase=!1,this.pointerDragActive=!1,this.pointerStartX=0,this.pointerStartY=0,this.windowPointerDown=e=>{if(this.openRowMenuIndex===void 0)return;let t=this.shadowRoot?.querySelector(`details[data-row-menu-index="${this.openRowMenuIndex}"]`);t&&!e.composedPath().includes(t)&&(this.openRowMenuIndex=void 0)},this.effectDraggedOver=e=>{this.disabled||this.draggedEffectIndex===void 0||(e.preventDefault(),this.shadowRoot?.querySelectorAll(`.effect-row.drop-target`).forEach(e=>e.classList.remove(`drop-target`)),e.currentTarget.classList.add(`drop-target`))},this.effectDragLeft=e=>{let t=e.currentTarget;e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||t.classList.remove(`drop-target`)},this.effectDragEnded=()=>{this.draggedEffectIndex=void 0,this.clearEffectDragClasses()},this.effectPointerMoved=e=>{if(e.pointerId!==this.pointerDragId||this.pointerDragIndex===void 0)return;let t=this.pointerDragHandle;if(!t)return;let n=t?.closest(`.effect-row`);if(!this.pointerDragActive){if(Math.hypot(e.clientX-this.pointerStartX,e.clientY-this.pointerStartY)<8)return;this.pointerDragActive=!0,n?.classList.add(`dragging`)}e.preventDefault();let r=this.shadowRoot?.elementFromPoint(e.clientX,e.clientY)?.closest(`.effect-row`),i=Number(r?.dataset.effectIndex);Number.isInteger(i)&&(this.pointerDropIndex=i,this.shadowRoot?.querySelectorAll(`.effect-row.drop-target`).forEach(e=>e.classList.remove(`drop-target`)),r?.classList.add(`drop-target`))},this.effectPointerFinished=e=>{if(e.pointerId!==this.pointerDragId)return;let t=this.pointerDragIndex,n=this.pointerDropIndex;this.pointerDragId=void 0,this.pointerDragIndex=void 0,this.pointerDropIndex=void 0,this.pointerDragHandle=void 0,this.pointerDragActive=!1,this.clearEffectDragClasses(),e.type!==`pointercancel`&&t!==void 0&&n!==void 0&&this.reorderEffect(t,n)}}connectedCallback(){super.connectedCallback(),window.addEventListener(`pointerdown`,this.windowPointerDown)}disconnectedCallback(){window.removeEventListener(`pointerdown`,this.windowPointerDown),super.disconnectedCallback()}willUpdate(e){e.has(`content`)&&this.openRowMenuIndex!==void 0&&(!h(this.content)||this.openRowMenuIndex>=g(this.content).length)&&(this.openRowMenuIndex=void 0)}updated(){if(this.nativeContent){let e=Math.min(this.nativeLayerIndex,this.nativeContent.layers.length-1),t=this.nativeContent.layers[e],n=this.shadowRoot?.querySelector(`select[data-native-layer]`),r=this.shadowRoot?.querySelector(`select[data-native-action]`);n&&(n.value=String(e)),r&&t.type===`paint`&&(r.value=String(t.action))}else if(this.content){if(m(this.content)){let e=this.shadowRoot?.querySelector(`select[data-single-variation]`);e&&(e.value=String(this.content.variant))}else g(this.content).forEach((e,t)=>{let n=this.effectFamily(e,!0),r=this.shadowRoot?.querySelector(`select[data-effect-index="${t}"]`),i=this.shadowRoot?.querySelector(`select[data-variation-index="${t}"]`);r&&(r.value=n?.id??`unknown:${e.family}`),i&&(i.value=String(e.variant))})}}render(){return this.nativeContent&&this.catalogue?this.catalogue.native_zones?.length?p(this.nativeContent,this.catalogue,this.disabled,(e,t,n,r,i)=>{let a=this.nativeContent,o=a?.layers[e];if(!a||a.family!==n||!o||o.type===`paint`||o.kind!==r)return;let s=structuredClone(a.layers);s[e]=o.type===`opaque`&&t.type===`diy`?structuredClone(t):{...s[e],...t},this.nativeChanged({...a,layers:s,speed_index:null},i)}):this.renderNative():!this.content||!this.catalogue?f:this.renderPaletteContent()}nativeChanged(e,t=`committed`){this.disabled||this.dispatchEvent(new CustomEvent(`native-content-changed`,{detail:{content:e,interaction:t},bubbles:!0,composed:!0}))}nativeLayerChanged(e,t){if(!this.nativeContent)return;let n=structuredClone(this.nativeContent.layers),r=Math.min(this.nativeLayerIndex,n.length-1);n[r]={...n[r],...e},this.nativeChanged({...this.nativeContent,layers:n,speed_index:null},t)}nativeNumber(e,t,n,r){return u`<label>${e}<input type="number" min="0" max=${n} .value=${String(t)}
        ?disabled=${this.disabled} @change=${e=>{let t=e.target;t.validity.valid&&Number.isInteger(t.valueAsNumber)&&r(t.valueAsNumber)}}></label>`}nativeSlider(e,t,n){return u`<govee-slider-control .label=${e} .value=${t} .minimum=${0} .maximum=${Math.max(100,t)}
        .disabled=${this.disabled}
        @value-changed=${e=>n(e.detail.value,e.detail.interaction)}
      ></govee-slider-control>`}paintNativePoint(t,n){if(!this.nativeContent)return;let r=this.nativeContent.layers[Math.min(this.nativeLayerIndex,this.nativeContent.layers.length-1)];r.type!==`paint`||t<0||t>=133||this.nativeLayerChanged(e(r,t,this.nativeErase?null:this.nativePaintColour),n)}renderNativePaint(e){let t=Array.from({length:133},()=>null);for(let n of e.groups)for(let e of n.indices)t[e]=n.colour;let n=this.catalogue?.native_actions??[];return u`
        <govee-painted-segment-editor .segments=${t} .physical=${!0}
          .background=${this.nativeContent.background} .disabled=${this.disabled}
          @segment-selected=${e=>this.paintNativePoint(e.detail.index,e.detail.interaction)}
        ></govee-painted-segment-editor>
        <govee-single-colour-field label="Paint colour" .colour=${this.nativePaintColour} .disabled=${this.disabled}
          @colour-changed=${e=>{this.nativePaintColour=e.detail.colour,this.nativeErase=!1}}
        ></govee-single-colour-field>
        <button type="button" ?disabled=${this.disabled} aria-pressed=${this.nativeErase}
          @click=${()=>{this.nativeErase=!this.nativeErase}}>Background brush</button>
        <label>Action<select data-native-action ?disabled=${this.disabled} @change=${e=>this.nativeLayerChanged({action:Number(e.target.value)})}>
          ${n.some(t=>Number(t.id)===e.action)?f:u`
            <option selected value=${e.action}>Unknown action ${e.action}</option>`}
          ${n.map(t=>u`<option value=${t.id} ?selected=${Number(t.id)===e.action}>${t.label}</option>`)}
        </select></label>
        ${this.nativeSlider(`Layer brightness`,e.brightness,(e,t)=>this.nativeLayerChanged({brightness:e},t))}
        ${this.nativeNumber(`Priority`,e.priority,255,e=>this.nativeLayerChanged({priority:e}))}
        ${this.nativeNumber(`Duration (wire units)`,e.duration,65535,e=>this.nativeLayerChanged({duration:e}))}
      `}renderNative(){let e=this.nativeContent,t=Math.min(this.nativeLayerIndex,e.layers.length-1),n=e.layers[t];return u`
        <section class="card">
          <label>Layer<select data-native-layer ?disabled=${this.disabled} @change=${e=>{this.nativeLayerIndex=Number(e.target.value)}}>
            ${e.layers.map((e,n)=>u`
              <option value=${n} ?selected=${n===t}>Layer ${n+1} (${e.type})</option>`)}
          </select></label>
          <div>
            ${n.type===`opaque`?f:u`
              <button type="button" ?disabled=${this.disabled||e.layers.length===255} @click=${()=>{let t=structuredClone(n);t.type===`paint`&&(t.groups=[]);let r=[...e.layers,t];this.nativeLayerIndex=r.length-1,this.nativeChanged({...e,layers:r,speed_index:null})}}>${n.type===`paint`?`Add empty paint layer`:`Duplicate layer`}</button>
              <button type="button" ?disabled=${this.disabled||e.layers.length===1} @click=${()=>{let n=e.layers.filter((e,n)=>n!==t);this.nativeLayerIndex=Math.min(t,n.length-1),this.nativeChanged({...e,layers:n,speed_index:null})}}>${n.type===`paint`?`Remove paint layer`:`Remove layer`}</button>
            `}
            <button type="button" ?disabled=${this.disabled||t===0} @click=${()=>{let n=[...e.layers];[n[t-1],n[t]]=[n[t],n[t-1]],this.nativeLayerIndex=t-1,this.nativeChanged({...e,layers:n,speed_index:null})}}>Move earlier</button>
            <button type="button" ?disabled=${this.disabled||t===e.layers.length-1} @click=${()=>{let n=[...e.layers];[n[t+1],n[t]]=[n[t],n[t+1]],this.nativeLayerIndex=t+1,this.nativeChanged({...e,layers:n,speed_index:null})}}>Move later</button>
          </div>
          ${n.type===`opaque`?u`<p>Unknown layer ${n.kind} is retained unchanged.</p>`:u`
            ${this.nativeSlider(`Speed`,n.speed,(e,t)=>this.nativeLayerChanged({speed:e},t))}
            ${n.type===`diy`?u`
              <govee-palette-editor .palette=${n.palette} .minColours=${1} .maxColours=${Math.max(8,n.palette.length)}
                .disabled=${this.disabled} @palette-changed=${e=>this.nativeLayerChanged({palette:r(e.detail.palette)},e.detail.interaction)}
              ></govee-palette-editor>
              ${n.kind===4?u`
                ${this.nativeNumber(`Direction (code)`,n.direction,255,e=>this.nativeLayerChanged({direction:e}))}
                ${this.nativeNumber(`Angle`,n.angle,65535,e=>this.nativeLayerChanged({angle:e}))}
              `:f}
            `:this.renderNativePaint(n)}
          `}
        </section>
        <section class="card">
          ${e.family===797?u`
            <h3>Background palette</h3>
            ${this.nativeNumber(`Background flag (code)`,e.background_flag,255,t=>this.nativeChanged({...e,background_flag:t}))}
            <govee-palette-editor .palette=${e.backgrounds} .minColours=${0} .maxColours=${Math.max(8,e.backgrounds.length)}
              .disabled=${this.disabled} @palette-changed=${t=>this.nativeChanged({...e,backgrounds:r(t.detail.palette)},t.detail.interaction)}
            ></govee-palette-editor>
          `:u`
            <govee-single-colour-field label="Background colour" .colour=${e.background} .disabled=${this.disabled}
              @colour-changed=${t=>this.nativeChanged({...e,background:t.detail.colour})}
            ></govee-single-colour-field>
            ${this.nativeSlider(`Background brightness`,e.background_brightness,(t,n)=>this.nativeChanged({...e,background_brightness:t},n))}
            ${this.nativeNumber(`Show type (code)`,e.show_type,255,t=>this.nativeChanged({...e,show_type:t}))}
          `}
        </section>
      `}renderPaletteContent(){if(!this.content||!this.catalogue)return f;let e=m(this.content)&&this.effectFamily(this.content)?.rate===`sensitivity`?`Sensitivity`:`Speed`,t=h(this.content)?g(this.content):m(this.content)?[this.content]:[],n=Math.max(this.content.kind===`h617a_multi`?this.catalogue.limits.speed_min:0,...t.map(e=>this.content?.kind===`h617a_multi`?this.effectFamily(e)?.multi_rate_min??this.effectFamily(e)?.rate_min??0:this.effectFamily(e)?.rate_min??0)),r=Math.min(this.content.kind===`h617a_multi`?this.catalogue.limits.speed_max:100,...t.map(e=>this.effectFamily(e)?.rate_max??100));return u`
      ${h(this.content)?u`
            <section class="card effect-card">
              <h3 class="section-title">
                ${this.content.kind===`h6179_mixed_diy`?`Effect Components`:`Effect Layers`}
              </h3>
              ${this.renderSequence(this.content)}
            </section>
          `:f}

      <section class="card parameters-card">
        <div class="parameter-stack">
          ${this.renderSingleVariation()}
          <div class="parameter-group">
            <span class="parameter-label">Colours</span>
            ${this.renderPalette()}
          </div>
          ${n===r?f:u`<govee-slider-control
            .label=${e}
            .value=${this.content.speed}
            .minimum=${n}
            .maximum=${r}
            .disabled=${this.disabled||n>r}
            @value-changed=${e=>this.emitContent({...this.content,speed:e.detail.value},e.detail.interaction)}
          ></govee-slider-control>`}
        </div>
      </section>
    `}renderSingleVariation(){if(!this.content||!m(this.content))return f;let e=this.content,t=this.effectFamily(e)?.variations??[],n=t.some(t=>t.variant===e.variant);return n&&t.length<=1?f:u`
      <label class="field parameter-group">
        <span class="parameter-label">Variation</span>
        <select
          aria-label="Variation"
          data-single-variation
          ?disabled=${this.disabled}
          @change=${t=>{let n=Number(t.target.value);this.emitContent({...e,variant:n})}}
        >
          ${n?f:u`
                <option value=${String(e.variant)} .selected=${!0}>
                  Unknown variation ${e.variant}
                </option>
              `}
          ${t.map(t=>u`
              <option
                value=${String(t.variant)}
                .selected=${t.variant===e.variant}
              >
                ${t.label}
              </option>
            `)}
        </select>
      </label>
    `}renderSequence(e){let t=g(e).length>=this.catalogue.limits.multi_max;return u`
      <div class="sequence-table">
        <div class="sequence-header" aria-hidden="true">
          <span>Order</span>
          <span>Effect</span>
          <span>Variation</span>
          <span></span>
        </div>
        <ol class="sequence">
          ${g(e).map((e,t)=>this.effectRow(e,t))}
        </ol>
      </div>
      ${t?f:u`
            <button
              class="add-step"
              type="button"
              title="Add layer"
              aria-label="Add layer"
              ?disabled=${this.disabled}
              @click=${this.addEffect}
            >
              +
            </button>
          `}
    `}effectRow(e,t){let n=this.effectFamily(e,!0),r=n?.variations??[];return u`
      <li
        class="effect-row"
        data-effect-index=${t}
        @dragover=${this.effectDraggedOver}
        @dragleave=${this.effectDragLeft}
        @drop=${e=>this.effectDropped(t,e)}
      >
        <div class="order-cell">
          ${this.disabled?f:u`
                <button
                  class="drag-handle"
                  type="button"
                  draggable="true"
                  title="Drag Layer ${t+1} to reorder"
                  aria-label="Reorder Layer ${t+1}. Drag or use Arrow Up and Arrow Down."
                  @dragstart=${e=>this.effectDragStarted(t,e)}
                  @dragend=${this.effectDragEnded}
                  @pointerdown=${e=>this.effectPointerStarted(t,e)}
                  @pointermove=${this.effectPointerMoved}
                  @pointerup=${this.effectPointerFinished}
                  @pointercancel=${this.effectPointerFinished}
                  @keydown=${e=>this.effectDragKeyPressed(t,e)}
                >
                  ⋮⋮
                </button>
              `}
          <span class="layer-heading">Layer ${t+1}</span>
        </div>
        <label class="field effect-field">
          <span class="field-label">Effect</span>
          <select
            aria-label="Layer ${t+1} effect"
            data-effect-index=${t}
            ?disabled=${this.disabled}
            @change=${e=>this.effectFamilyChanged(t,e.target.value)}
          >
            ${n?f:u`
                  <option
                    value=${`unknown:${e.family}`}
                    .selected=${!0}
                  >
                    Unknown effect ${e.family}
                  </option>
                `}
            ${this.multiFamilies.map(e=>u`
                <option
                  value=${e.id}
                  .selected=${e.id===n?.id}
                >
                  ${e.label}
                </option>
              `)}
          </select>
        </label>
        <label class="field effect-field">
          <span class="field-label">Variation</span>
          <select
            aria-label="Layer ${t+1} variation"
            data-variation-index=${t}
            ?disabled=${this.disabled}
            @change=${e=>this.effectVariationChanged(t,Number(e.target.value))}
          >
            ${r.some(t=>t.variant===e.variant)?f:u`
                  <option value=${String(e.variant)} .selected=${!0}>
                    Unknown variation ${e.variant}
                  </option>
                `}
            ${r.map(t=>u`
                <option
                  value=${String(t.variant)}
                  .selected=${t.variant===e.variant}
                >
                  ${t.label}
                </option>
              `)}
          </select>
        </label>
        ${h(this.content)&&g(this.content).length>1?this.disabled?u`
                <button
                  class="row-menu-trigger"
                  type="button"
                  aria-label="Layer actions for Layer ${t+1}"
                  disabled
                >
                  ⋮
                </button>
              `:u`
                <details
                  class="row-menu"
                  data-row-menu-index=${t}
                  ?open=${this.openRowMenuIndex===t}
                  @toggle=${e=>this.rowMenuToggled(t,e)}
                  @keydown=${e=>this.rowMenuKeyPressed(t,e)}
                >
                  <summary aria-label="Layer actions for Layer ${t+1}">
                    ⋮
                  </summary>
                  <div class="row-menu-popover">
                    <button
                      class="danger delete-action"
                      type="button"
                      @click=${()=>{this.openRowMenuIndex=void 0,this.removeEffect(t)}}
                    >
                      Remove
                    </button>
                  </div>
                </details>
              `:f}
      </li>
    `}get multiFamilies(){return this.catalogue?.effects.filter(e=>e.supports_multi)??[]}renderPalette(){return u`
      <govee-palette-editor
        .palette=${this.content.palette}
        .minColours=${this.catalogue.limits.palette_min}
        .maxColours=${this.content.kind===`h617a_multi`?this.catalogue.limits.palette_max:this.effectFamily(this.content)?.palette_max??this.catalogue.limits.palette_max}
        .disabled=${this.disabled}
        @palette-changed=${e=>{this.emitContent({...this.content,palette:r(e.detail.palette)},e.detail.interaction)}}
      ></govee-palette-editor>
    `}effectFamilyChanged(e,t){let n=this.multiFamilies.find(e=>e.id===t),r=n?.variations[0];n&&r&&this.replaceEffect(e,{family:n.family,variant:r.variant})}effectVariationChanged(e,t){if(!h(this.content))return;let n=g(this.content)[e];n&&this.replaceEffect(e,{...n,variant:t})}replaceEffect(e,t){if(!h(this.content))return;let n=g(this.content).map((n,r)=>r===e?t:n);this.emitContent(_(this.content,n))}addEffect(){if(this.disabled||!h(this.content)||g(this.content).length>=this.catalogue.limits.multi_max)return;let e=this.multiFamilies[g(this.content).length]??this.multiFamilies[0],t=e?.variations[0];if(!e||!t)return;let n=[...g(this.content),{family:e.family,variant:t.variant}];this.emitContent(_(this.content,n))}removeEffect(e){if(!h(this.content))return;let t=g(this.content).filter((t,n)=>n!==e);this.emitContent(_(this.content,t));let n=Math.min(e,t.length-1);this.updateComplete.then(()=>{requestAnimationFrame(()=>{this.shadowRoot?.querySelector(`[data-effect-index="${n}"] select`)?.focus()})})}reorderEffect(e,t){if(this.disabled||!h(this.content)||e===t)return;let n=[...g(this.content)],[r]=n.splice(e,1);n.splice(t,0,r),this.emitContent(_(this.content,n))}effectDragStarted(e,t){if(this.disabled){t.preventDefault();return}this.draggedEffectIndex=e;let n=t.currentTarget.closest(`.effect-row`);if(t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,String(e)),n&&typeof t.dataTransfer.setDragImage==`function`)){let e=n.getBoundingClientRect();t.dataTransfer.setDragImage(n,Math.max(0,t.clientX-e.left),Math.max(0,t.clientY-e.top))}n?.classList.add(`dragging`)}effectDropped(e,t){t.preventDefault(),this.draggedEffectIndex!==void 0&&(this.reorderEffect(this.draggedEffectIndex,e),this.draggedEffectIndex=void 0,this.clearEffectDragClasses())}effectPointerStarted(e,t){this.disabled||t.pointerType===`mouse`||(this.pointerDragId=t.pointerId,this.pointerDragIndex=e,this.pointerDropIndex=e,this.pointerDragHandle=t.currentTarget,this.pointerDragActive=!1,this.pointerStartX=t.clientX,this.pointerStartY=t.clientY)}effectDragKeyPressed(e,t){if(t.key!==`ArrowUp`&&t.key!==`ArrowDown`)return;t.preventDefault();let n=e+(t.key===`ArrowUp`?-1:1);!this.content||!h(this.content)||n<0||n>=g(this.content).length||(this.reorderEffect(e,n),this.updateComplete.then(()=>{this.shadowRoot?.querySelectorAll(`.drag-handle`)[n]?.focus()}))}clearEffectDragClasses(){this.shadowRoot?.querySelectorAll(`.effect-row.dragging, .effect-row.drop-target`).forEach(e=>e.classList.remove(`dragging`,`drop-target`))}rowMenuToggled(e,t){t.currentTarget.open?this.openRowMenuIndex=e:this.openRowMenuIndex===e&&(this.openRowMenuIndex=void 0)}rowMenuKeyPressed(e,t){t.key===`Escape`&&(t.preventDefault(),this.openRowMenuIndex=void 0,this.updateComplete.then(()=>{this.shadowRoot?.querySelectorAll(`.row-menu summary`)[e]?.focus()}))}effectFamily(e,t=!1){return(t?this.multiFamilies:this.catalogue?.effects)?.find(t=>t.family===e.family)}emitContent(e,t=`committed`){this.dispatchEvent(new CustomEvent(`content-changed`,{detail:{content:e,interaction:t},bubbles:!0,composed:!0}))}static{this.styles=[a,c,d,o,i`
    :host {
      --effect-layer-drag-handle-width: 32px;
      --effect-layer-drag-icon-size: 18px;
      --effect-layer-drag-letter-spacing: -5px;
      --effect-layer-order-min-width: 72px;
      --effect-layer-menu-icon-size: 22px;
      --effect-layer-menu-width: 120px;
      display: block;
    }

    p {
      margin-top: 0;
    }

    .parameters-card {
      margin-top: var(--studio-section-gap);
    }

    .sequence-table {
      --effect-layer-columns:
        minmax(var(--effect-layer-order-min-width), 0.45fr)
        minmax(0, 1fr)
        minmax(0, 1fr)
        var(--studio-control-height);
      container-type: inline-size;
    }

    .sequence-header,
    .effect-row {
      display: grid;
      grid-template-columns: var(--effect-layer-columns);
      align-items: center;
      gap: var(--studio-spacing-lg);
    }

    .sequence-header {
      margin-bottom: var(--studio-spacing-sm);
      color: var(--studio-muted);
      font-size: var(--studio-caption-size);
      font-weight: var(--studio-font-weight-bold);
    }

    .sequence {
      display: grid;
      gap: var(--studio-compact-gap);
      margin: 0 0 var(--studio-spacing-sm);
      padding: 0;
      list-style: none;
    }

    .effect-row {
      position: relative;
      transition:
        background-color var(--studio-transition-duration) ease,
        box-shadow var(--studio-transition-duration) ease,
        opacity var(--studio-transition-duration) ease;
    }

    .effect-row.dragging {
      opacity: 0.5;
    }

    .effect-row.drop-target {
      border-radius: var(--studio-control-radius);
      background: var(--studio-blue-soft);
      box-shadow: inset 0 calc(0px - var(--studio-strong-border-width))
        var(--studio-blue);
    }

    .order-cell {
      display: flex;
      align-items: center;
      gap: var(--studio-compact-gap);
      min-width: 0;
    }

    .drag-handle {
      display: grid;
      width: var(--effect-layer-drag-handle-width);
      height: var(--studio-control-height);
      flex: 0 0 var(--effect-layer-drag-handle-width);
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: var(--studio-control-radius);
      color: var(--studio-muted);
      background: transparent;
      cursor: grab;
      font-size: var(--effect-layer-drag-icon-size);
      letter-spacing: var(--effect-layer-drag-letter-spacing);
      touch-action: none;
      user-select: none;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .drag-handle:focus-visible {
      outline: var(--studio-focus-width) solid var(--studio-blue);
      outline-offset: var(--studio-focus-offset);
    }

    .layer-heading {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: var(--studio-subheading-size);
      font-weight: var(--studio-font-weight-emphasis);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .effect-field {
      margin-top: 0;
      min-width: 0;
    }

    .field-label {
      display: none;
      font-size: var(--studio-caption-size);
      font-weight: var(--studio-font-weight-emphasis);
    }

    .effect-field select {
      width: 100%;
      min-height: var(--studio-control-height);
      padding: var(--studio-field-padding);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-control-radius);
      color: var(--primary-text-color);
      background: var(--secondary-background-color, #f5f6f8);
    }

    .row-menu {
      position: relative;
      width: var(--studio-control-height);
      justify-self: end;
    }

    .row-menu summary,
    .row-menu-trigger {
      display: grid;
      width: var(--studio-control-height);
      height: var(--studio-control-height);
      place-items: center;
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-round-radius);
      color: var(--studio-muted);
      background: var(--studio-card);
      cursor: pointer;
      list-style: none;
    }

    .row-menu-trigger {
      cursor: not-allowed;
      font-size: var(--effect-layer-menu-icon-size);
    }

    .row-menu summary::-webkit-details-marker {
      display: none;
    }

    .row-menu-popover {
      position: absolute;
      z-index: var(--studio-z-popover);
      top: calc(var(--studio-control-height) + var(--studio-tight-gap));
      right: 0;
      display: grid;
      width: var(--effect-layer-menu-width);
      padding: var(--studio-tight-gap);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-popover-radius);
      background: var(--studio-card);
      box-shadow: var(--studio-popover-shadow);
    }

    .row-menu-popover button {
      padding: var(--studio-field-padding);
      border: 0;
      border-radius: var(--studio-swatch-radius);
      color: var(--primary-text-color);
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .row-menu-popover .danger.delete-action {
      border: var(--studio-border-width) solid var(--studio-danger);
      color: var(--text-primary-color, #fff);
      background: var(--studio-danger);
    }

    .row-menu-popover .danger.delete-action:hover,
    .row-menu-popover .danger.delete-action:focus-visible {
      background: color-mix(in srgb, var(--studio-danger) 84%, #000);
    }

    .add-step {
      display: grid;
      width: var(--studio-control-height);
      height: var(--studio-control-height);
      place-items: center;
      padding: 0;
      border: var(--studio-border-width) dashed var(--studio-border);
      border-radius: var(--studio-control-radius);
      color: var(--studio-blue);
      background: transparent;
      cursor: pointer;
      font-size: var(--studio-editor-heading-size);
    }

    /* Converts the effect-layer table into labelled cards when its own column is narrow. */
    @container (max-width: 520px) {
      .sequence {
        gap: var(--studio-spacing-lg);
      }

      .sequence-header {
        display: none;
      }

      .effect-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        gap: var(--studio-control-gap);
        padding: var(--studio-spacing-lg);
        border: var(--studio-border-width) solid var(--studio-border);
        border-radius: var(--studio-control-radius);
        background: var(--secondary-background-color, #f5f6f8);
      }

      .order-cell {
        align-self: center;
      }

      .effect-field {
        grid-column: 1 / -1;
      }

      .row-menu {
        grid-column: 2;
        grid-row: 1;
      }
    }

  `]}};l([t({attribute:!1})],v.prototype,`content`,void 0),l([t({attribute:!1})],v.prototype,`nativeContent`,void 0),l([t({attribute:!1})],v.prototype,`catalogue`,void 0),l([t({type:Boolean})],v.prototype,`disabled`,void 0),l([n()],v.prototype,`openRowMenuIndex`,void 0),l([n()],v.prototype,`nativeLayerIndex`,void 0),l([n()],v.prototype,`nativePaintColour`,void 0),l([n()],v.prototype,`nativeErase`,void 0),customElements.get(`govee-custom-effect-editor`)||customElements.define(`govee-custom-effect-editor`,v);export{v as GoveeCustomEffectEditor};