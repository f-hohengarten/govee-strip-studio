import{$t as e,At as t,Ct as n,Dt as r,Et as i,It as a,Jt as o,Mt as s,Nt as c,Ot as l,Qt as u,Rt as ee,St as d,Tt as f,_t as p,an as m,bt as te,c as h,ct as g,d as ne,dt as re,en as _,ft as v,gt as y,ht as b,jt as x,kt as S,l as ie,lt as C,mt as ae,n as w,p as oe,pt as se,qt as ce,rn as T,s as E,tn as D,ut as O,vt as k,wt as A,xt as j,yt as M}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-info-control-DsAgXfqF.js";import"./effect-studio-palette-editor-DXuzIP-k.js";import"./effect-studio-checkbox-control-BRcbJ2Y-.js";import"./effect-studio-segmented-control-CUN174gm.js";import"./effect-studio-slider-control-B2Yw9Nvi.js";var N={0:`Segment`,1:`Continuous`,2:`Random`,3:`Custom`},P={0:[[`quantity`,`Selection Quantity`]],1:[[`quantity`,`IC Quantity`]],2:[[`param_2`,`Random Minimum IC Count`],[`param_1`,`Random Maximum IC Count`]],3:[[`param_1`,`Piece IC Count`],[`param_2`,`Gap IC Count`]]},F=[{key:`colour_retention`,label:`Colour Retention`,help:`colourRetention`},{key:`colour_speed`,label:`Colour Speed`,help:`colourSpeed`}];function I(e){return d(e)?P[e]:[]}function L(e){return B(e,`layer`,`Layer`,`advanced-layer-tab`,`advanced-layer-panel`,`Drag to reorder or use the Left and Right Arrow keys.`)}function R(e){return B(Array.from({length:e},(e,t)=>t+1),`pattern`,`Pattern`,`advanced-pattern-tab`,`advanced-pattern-panel`)}function z(e,t=!1){return[{kind:`copy`,label:`Copy current layer`,icon:`mdi:content-copy`,danger:!1,disabled:t||e>=5,visible:!0},{kind:`renumber`,label:`Renumber layers`,icon:`mdi:format-list-numbered`,danger:!1,disabled:t,visible:e>1},{kind:`delete`,label:`Delete current layer`,glyph:`×`,danger:!0,disabled:t,visible:e>1}]}function B(e,t,n,r,i,a){return e.map((e,o)=>({key:`${t}-${o}`,label:String(e),ariaLabel:`${n} ${e}`,ariaDescription:a,id:`${r}-${o}`,ariaControls:i}))}var V=class{constructor(){this.activeLayerIndex=0,this.activePatternIndex=0,this.disabled=!1}sync(e,t){if(this.content=e,this.disabled=t,!e?.layers.length){this.activateLayer(0);return}te(e,v(e)),this.activeLayerIndex=a(this.activeLayerIndex,0,e.layers.length-1);let n=this.activeLayer.brightness_patterns.length;this.activePatternIndex=n?a(this.activePatternIndex,0,n-1):0}get activeLayer(){return this.content.layers[this.activeLayerIndex]}get layerLabels(){return this.content?v(this.content):[]}isCurrentContent(e){return this.content===e}updateLayer(e){if(!this.canEditLayer())return;let t=k(this.activeLayer);return Object.assign(t,e),this.replaceActive(t)}replaceActiveLayer(e){if(this.canEditLayer())return S(e,this.layerLabels[this.activeLayerIndex]),this.replaceActive(e)}updateBrightnessPattern(e){if(!this.canEditLayer())return;let t=this.activeLayer.brightness_patterns.map((t,n)=>n===this.activePatternIndex?{...t,...e}:{...t});return this.updateLayer({brightness_patterns:t})}updatePalette(e){return this.updateLayer({palette:ee(e)})}updateNested(e,t){if(this.canEditLayer()){if(e===`distribution`){let e=this.activeLayer.distribution,n=(e.extensions??0)|e.method&112;return this.updateLayer({distribution:{...e,method:e.method&15,...n?{extensions:n}:{},...t}})}return this.updateLayer({[e]:{...this.activeLayer[e],...t}})}}addLayer(){if(!this.content||this.disabled||this.content.layers.length>=5)return;let e=y();e.excess=this.content.layers[this.activeLayerIndex]?.excess??``,S(e,r(this.content));let t=[...this.content.layers.map(k),e];return this.activateLayer(t.length-1),this.contentChange(t,!0)}copyLayer(){if(!this.canEditLayer()||this.content.layers.length>=5)return;let e=this.content.layers.map(k),t=this.activeLayerIndex+1,n=k(this.activeLayer);return S(n,r(this.content)),e.splice(t,0,n),this.activateLayer(t),this.contentChange(e,!0)}deleteLayer(){if(!this.canEditLayer()||this.content.layers.length===1)return;let e=this.content.layers.filter((e,t)=>t!==this.activeLayerIndex).map(k);return this.activateLayer(Math.min(this.activeLayerIndex,e.length-1)),this.contentChange(e)}reorderLayer(e,t){if(!this.canEditLayer()||e<0||e>=this.content.layers.length||t<0||t>=this.content.layers.length||e===t)return;let n=this.content.layers.map(k),[r]=n.splice(e,1);return n.splice(t,0,r),this.activeLayerIndex=ce(this.activeLayerIndex,e,t),this.contentChange(n)}renumberLayers(){if(!this.canEditLayer())return;let e=this.content.layers.map((e,t)=>{let n=k(e);return S(n,t+1),n});return this.contentChange(e)}addBrightnessPattern(){if(!this.canEditLayer()||this.activeLayer.brightness_patterns.length>=3)return;let e=[...this.activeLayer.brightness_patterns.map(e=>({...e})),b()];return this.activePatternIndex=e.length-1,this.updateLayer({brightness_patterns:e})}deleteBrightnessPattern(){if(!this.canEditLayer()||this.activeLayer.brightness_patterns.length===1)return;let e=this.activeLayer.brightness_patterns.filter((e,t)=>t!==this.activePatternIndex).map(e=>({...e}));return this.activePatternIndex=Math.min(this.activePatternIndex,e.length-1),this.updateLayer({brightness_patterns:e})}selectLayer(e){return e!==this.activeLayerIndex&&(this.activateLayer(e),!0)}selectPattern(e){return e!==this.activePatternIndex&&(this.activePatternIndex=e,!0)}visiblePatternIndex(e){return a(this.activePatternIndex,0,Math.max(0,e-1))}canEditLayer(){return!(!this.content?.layers.length||this.disabled)}activateLayer(e){this.activeLayerIndex=e,this.activePatternIndex=0}replaceActive(e){return this.contentChange(this.content.layers.map((t,n)=>n===this.activeLayerIndex?k(e):k(t)))}contentChange(e,t=!1){let n={...this.content,kind:`advanced`,layers:e};return t&&(this.content=n),n}},H={appliedArea:{label:`Applied area information`,text:`Sets the layer's area index and width in tenths. Logical segments are a visual guide, not a physical IC count.`},fillPattern:{label:`Fill pattern information`,text:`Controls how LEDs inside the applied area take part in the effect.`},fillPatternType:{label:`Fill pattern type information`,text:`Segment and Continuous use a two-byte selection or IC quantity (0–65535). Random uses separate minimum and maximum IC counts. Custom uses piece and gap IC counts. These are not Home Assistant logical segment counts.`},segmentCount:{label:`Segment Count information`,text:`Sets how many repeated sections divide the applied area for the Segmented fill pattern.`},distribution:{label:`Distribution information`,text:`Controls whether participating LEDs share colours or receive colours by IC or segment.`},distributionMethod:{label:`Distribution method information`,text:`Unified gives all participating LEDs the same colour.  By IC assigns colours by independently controlled LED group.  By Segment assigns colours by fill-pattern segment.`},colourSpeed:{label:`Colour speed information`,text:`Controls how quickly the layer changes between palette colours.`},colourRetention:{label:`Colour retention information`,text:`Controls how long a palette colour is retained before the next change.`},patterns:{label:`Brightness patterns information`,text:`Each pattern defines an ordered brightness change for this layer.`},brightnessScopeLow:{label:`Scope low information`,text:`Sets the lowest brightness the pattern can use.`},brightnessScopeHigh:{label:`Scope high information`,text:`Sets the highest brightness the pattern can use.`},changingSpeed:{label:`Brightness changing speed information`,text:`Controls how quickly the brightness pattern changes.`},brightestRetention:{label:`Brightest retention information`,text:`Controls how long the pattern remains at its brightest level before continuing.`},darkestRetention:{label:`Darkest retention information`,text:`Controls how long the pattern remains at its darkest level before continuing.`},inAreaMovement:{label:`In-area movement information`,text:`Moves the effect inside the applied area.`},wholeLayerMovement:{label:`Whole-layer movement information`,text:`Moves the complete layer.`},icsPerStep:{label:`ICs per Step information`,text:`Sets how many independently controlled LED groups are advanced for each movement step.`},pauseBeforeReentry:{label:`Pause before re-entry information`,text:`Pauses the moving effect before it enters the applied area again.`},priority:{label:`Layer overlap priority information`,text:`When layers target the same LEDs, the layer with the higher priority is shown.  A dash leaves the layer without an explicit overlap priority.`}};function U(e,t,n){let r=e.selection,i=d(r.type),a=I(r.type);return T`
    <div class="fill-pattern-controls parameter-stack">
      <div class="subsection-heading">
        <h4>Fill Pattern</h4>
        ${J(`fillPattern`)}
      </div>
      <label class="field">
        ${q(`Type`,`fillPatternType`)}
        <select
          aria-label="Fill pattern type"
          .value=${i?String(r.type):``}
          ?disabled=${t}
          @change=${e=>n({type:Number(e.target.value)})}
        >
          ${i?D:T`<option value="" disabled .selected=${!0}>Choose a type</option>`}
          ${C.map(e=>T`
            <option value=${e} .selected=${r.type===e}>${N[e]}</option>
          `)}
        </select>
      </label>
      ${a.map(([e,i,a])=>K(i,e===`quantity`?l(r):r[e],t=>n(e===`quantity`?c(t):{[e]:t}),t,{help:a,maximum:e===`quantity`?65535:255}))}
    </div>
  `}function W(e,t,n,r){let i=e.distribution.method&15,a=i>=0&&i<=3;return T`
    <section class="card">
      <div class="section-heading">
        <h3 class="section-title">Distribution</h3>
        ${J(`distribution`)}
      </div>
      <div class="parameter-stack">
        <label class="field">
          ${q(`Method`,`distributionMethod`)}
          <select
            .value=${a?String(i):``}
            ?disabled=${t}
            @change=${e=>n({method:Number(e.target.value)})}
          >
            ${a?D:T`<option value="" disabled .selected=${!0}>Choose a method</option>`}
            <option value="0">Unified</option>
            <option value="1">By IC</option>
            <option value="2">By Segment</option>
            <option value="3">By Segment with Gradient</option>
          </select>
        </label>
        ${i>=1&&i<=3?T`
              <label class="field">
                <span>Direction</span>
                <select
                  .value=${e.distribution.backwards?`backwards`:`forwards`}
                  ?disabled=${t}
                  @change=${e=>n({backwards:e.target.value===`backwards`})}
                >
                  <option value="forwards">Forward</option>
                  <option value="backwards">Backward</option>
                </select>
              </label>
            `:D}
        <div class="parameter-grid">
          ${F.map(n=>G(n.label,e[n.key],e=>r({[n.key]:e}),t,n.help))}
        </div>
      </div>
    </section>
  `}function G(e,t,n,r,i){return T`
    <govee-slider-control
      .label=${e}
      .value=${t}
      .minimum=${0}
      .maximum=${255}
      .valueText=${String(t)}
      .hideValueText=${!0}
      .disabled=${r}
      @value-changed=${e=>n(e.detail.value)}
    >
      ${i?J(i,`help`):D}
    </govee-slider-control>
  `}function K(e,t,n,r,i={}){let{minimum:o=0,maximum:s=255,help:c}=i;return T`
    <label class="field">
      ${q(e,c)}
      <input
        type="number"
        min=${o}
        max=${s}
        .value=${String(t)}
        ?disabled=${r}
        @change=${e=>n(a(Number(e.target.value),o,s))}
      />
    </label>
  `}function q(e,t){return T`
    <span class="field-label-with-help">
      <span>${e}</span>
      ${t?J(t):D}
    </span>
  `}function J(e,t){let n=H[e];return T`
    <govee-info-control
      slot=${t??D}
      .label=${n.label}
      .text=${n.text}
    ></govee-info-control>
  `}var le=[h,ie,E,ne,oe,m`
    :host {
      display: block;
    }

    p {
      margin-top: 0;
    }

    .layer-card {
      margin-bottom: var(--studio-section-gap);
    }

    .selected-record-panel {
      padding-top: var(--studio-section-gap);
      border-top: var(--studio-border-width) solid var(--studio-border);
    }

    .layer-strip,
    .pattern-strip {
      --strip-label-min-width: var(--studio-compact-action-size);
    }

    .layer-card > .section-title {
      margin-bottom: var(--studio-section-title-gap);
    }

    .card-heading,
    .section-heading,
    .subsection-heading {
      display: flex;
      align-items: center;
      gap: var(--studio-compact-gap);
    }

    .section-heading {
      margin-bottom: var(--studio-section-title-gap);
    }

    .section-heading .section-title {
      margin: 0;
    }

    .subsection-heading h4 {
      margin: 0;
      font-size: var(--studio-subheading-size);
      font-weight: var(--studio-font-weight-semibold);
    }

    .add-button {
      flex: 0 0 auto;
      padding: var(--studio-spacing-sm) var(--studio-spacing-xl);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-control-radius);
      color: var(--studio-blue);
      background: var(--studio-card);
      font-weight: var(--studio-font-weight-semibold);
      border-style: dashed;
      cursor: pointer;
    }

    .muted {
      color: var(--studio-muted);
      font-size: var(--studio-parameter-label-size);
      line-height: var(--studio-muted-line-height);
    }

    .empty-state .add-button {
      margin-top: var(--studio-spacing-lg);
    }

    .control-grid {
      column-width: 500px;
      column-gap: var(--studio-section-gap);
      column-fill: balance;
    }

    .control-grid > .card {
      display: inline-block;
      width: 100%;
      margin: 0 0 var(--studio-section-gap);
      break-inside: avoid;
      break-inside: avoid-column;
    }

    .fill-pattern-controls {
      margin-top: var(--studio-section-gap);
      padding-top: var(--studio-section-gap);
      border-top: var(--studio-border-width) solid var(--studio-border);
    }

    .parameter-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, 220px), 1fr)
      );
      gap: var(--studio-parameter-gap) var(--studio-section-gap);
    }

    .parameter-grid > .field {
      margin-top: 0;
    }

    .patterns-section {
      display: grid;
      gap: var(--studio-parameter-gap);
    }

    .brightness-fields {
      padding-top: var(--studio-parameter-gap);
      border-top: var(--studio-border-width) solid var(--studio-border);
    }

    .compact-action-icon {
      --mdc-icon-size: var(--studio-icon-size);
      display: inline-flex;
      width: var(--studio-icon-size);
      height: var(--studio-icon-size);
      align-items: center;
      justify-content: center;
      line-height: 0;
    }

    .card-heading {
      justify-content: space-between;
      margin-bottom: var(--studio-section-title-gap);
    }

    .card-heading .section-heading {
      margin-bottom: 0;
    }

    .field-label-with-help {
      display: inline-flex;
      align-items: center;
      gap: var(--studio-compact-gap);
      justify-self: start;
    }

    /* Advanced cards become single-column when controls no longer fit. */
    @media (max-width: 760px) {
      .add-button {
        width: 100%;
      }
    }

    /* Recovers phone-width card space without reducing control hit targets. */
    @media (max-width: 480px) {
      .card {
        padding: var(--studio-spacing-2xl);
      }

      .secondary {
        min-width: 0;
      }
    }
  `],Y=15,X=class extends _{constructor(...e){super(...e),this.disabled=!1,this.segmentCount=Y,this.pointerMoved=e=>{let t=this.drag;if(!t||t.pointerId!==e.pointerId)return;e.preventDefault();let n=t.track.getBoundingClientRect(),r=t.control===`move`?t.start+Math.round((e.clientX-t.pointerStart)/n.width*this.validSegmentCount):Math.round((e.clientX-n.left)/n.width*this.validSegmentCount);this.applyControl(t.control,t.start,t.end,r,`changing`)},this.finishDrag=e=>{let t=this.drag;if(t?.pointerId!==e.pointerId)return;let r=e.currentTarget;r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId);let i=this.layer?n(this.layer,this.validSegmentCount):void 0,a=i!==void 0&&(i.start!==t.start||i.end!==t.end);this.drag=void 0,this.activeControl=void 0,a&&this.emitAreaChange(`committed`)},this.setFullStrip=()=>{this.layer&&!this.disabled&&this.setArea(0,this.validSegmentCount,`committed`)}}disconnectedCallback(){this.drag=void 0,this.activeControl=void 0,super.disconnectedCallback()}render(){let e=this.layer;if(!e)return D;let t=se(e.area.width_tenths),r=e.area.start_tenths>=0&&e.area.start_tenths<=9&&t>=1&&t<=10-e.area.start_tenths,i=this.validSegmentCount,a=o(e.palette[0]??[47,111,237]),s=n(e,i),c=s.start/i*100,l=s.end/i*100;return T`
      <div class="area-control">
        <div
          class="area-range"
          style="--area-segment-count: ${i}; --area-colour: ${a};"
          aria-label="Applied area"
        >
          <div class="area-segments" aria-hidden="true">
            ${Array.from({length:i},(e,t)=>T`
                <span
                  class=${r&&t>=s.start&&t<s.end?`covered`:``}
                ></span>
              `)}
          </div>
          ${r?T`
                <div
                  class="area-window"
                  style="left: ${c}%; width: ${l-c}%;"
                >
                  ${this.renderSlider(`move`,`Move applied area`,s.start,0,i-s.length,`Segments ${s.start+1} to ${s.end}`,s.start+1)}
                  ${this.renderSlider(`left`,`Applied area left edge`,s.start,0,s.end-1,`Segment ${s.start+1}`,s.start+1)}
                  ${this.renderSlider(`right`,`Applied area right edge`,s.end,s.start+1,i,`Segment ${s.end}`,s.end)}
                </div>
              `:D}
        </div>
      </div>
      ${r?D:T`
            <p class="muted">
              This loaded layer uses an applied area that is not editable here.
              It remains preserved until replaced.
            </p>
            <button
              class="secondary"
              type="button"
              ?disabled=${this.disabled}
              @click=${this.setFullStrip}
            >
              Set full strip
            </button>
          `}
    `}renderSlider(e,t,n,r,i,a,o){return T`
      <div
        class=${e===`move`?`area-move`:`area-handle area-handle-${e}`}
        role="slider"
        tabindex=${this.disabled?-1:0}
        aria-label=${t}
        aria-orientation="horizontal"
        aria-valuemin=${r}
        aria-valuemax=${i}
        aria-valuenow=${n}
        aria-valuetext=${a}
        aria-disabled=${this.disabled?`true`:`false`}
        @keydown=${t=>this.keyPressed(t,e)}
        @pointerdown=${t=>this.startDrag(t,e)}
        @pointermove=${this.pointerMoved}
        @pointerup=${this.finishDrag}
        @pointercancel=${this.finishDrag}
      >
        ${e!==`move`&&this.activeControl===e?T`<span class="area-drag-value" aria-hidden="true"
              >${o}</span
            >`:D}
      </div>
    `}keyPressed(e,t){let{start:n,end:r}=this.renderedSegments(e.currentTarget),i=e.key===`ArrowLeft`||e.key===`ArrowDown`?-1:e.key===`ArrowRight`||e.key===`ArrowUp`?1:void 0,a;if(e.key===`Home`)a=t===`right`?n+1:0;else if(e.key===`End`)a=t===`left`?r-1:t===`right`?this.validSegmentCount:this.validSegmentCount-(r-n);else if(i!==void 0)a=(t===`right`?r:n)+i;else return;e.preventDefault(),this.applyControl(t,n,r,a,`committed`)}startDrag(e,t){if(this.disabled||e.button!==0&&e.pointerType!==`touch`)return;let n=e.currentTarget,r=n.closest(`.area-range`);if(!r)return;let{start:i,end:a}=this.renderedSegments(n);n.focus(),e.preventDefault(),e.stopPropagation(),n.setPointerCapture(e.pointerId),this.activeControl=t,this.drag={control:t,pointerId:e.pointerId,pointerStart:e.clientX,start:i,end:a,track:r}}applyControl(e,t,n,r,i){let a=e===`left`?O(n,r,this.validSegmentCount):e===`right`?re(t,r,this.validSegmentCount):f(t,n,r,this.validSegmentCount);this.setArea(a.start,a.end,i)}setArea(e,t,n){this.layer&&!this.disabled&&(this.layer=x(this.layer,e,t,this.validSegmentCount),this.emitAreaChange(n))}emitAreaChange(e){this.layer&&!this.disabled&&this.dispatchEvent(new CustomEvent(`area-changed`,{detail:{layer:this.layer,interaction:e},bubbles:!0,composed:!0}))}renderedSegments(e){let t=e.closest(`.area-window`),r=Number(t?.querySelector(`.area-handle-left`)?.getAttribute(`aria-valuenow`)),i=Number(t?.querySelector(`.area-handle-right`)?.getAttribute(`aria-valuenow`));if(Number.isInteger(r)&&Number.isInteger(i)&&r>=0&&i>r&&i<=this.validSegmentCount)return{start:r,end:i};let a=n(this.layer,this.validSegmentCount);return{start:a.start,end:a.end}}get validSegmentCount(){return Number.isInteger(this.segmentCount)&&this.segmentCount>0?this.segmentCount:Y}static{this.styles=[h,E,m`
      :host {
        --area-control-horizontal-padding: var(--studio-spacing-5xl);
        --area-control-mobile-padding: var(--studio-spacing-3xl);
        --area-track-height: 64px;
        --area-segment-gap: var(--studio-spacing-xxs);
        --area-segment-radius: var(--studio-swatch-radius);
        --area-move-indicator-width: var(--studio-spacing-2xl);
        --area-move-indicator-height: var(--studio-spacing-md);
        --area-move-indicator-radius: 5px;
        --area-move-dot-size: 1.5px;
        --area-move-dot-fade-size: 1.8px;
        --area-move-dot-period: var(--studio-spacing-xs);
        --area-handle-hit-width: var(--studio-touch-target-size);
        --area-handle-hit-height: 56px;
        --area-handle-grip-width: var(--studio-compact-gap);
        --area-handle-grip-height: var(--studio-spacing-6xl);
        --area-handle-body-width: var(--studio-spacing-5xl);
        --area-handle-body-height: 44px;
        --area-handle-body-radius: 10px;
        --area-tooltip-gap: 7px;
        --area-tooltip-min-width: var(--studio-spacing-7xl);
        --area-z-move-target: 1;
        --area-z-window: 2;
        --area-z-handle: 3;
        --area-z-tooltip: 5;
        --area-z-handle-background: -1;
        display: block;
      }

      .area-control {
        margin-bottom: var(--studio-spacing-2xl);
        padding: var(--studio-micro-gap)
          var(--area-control-horizontal-padding) 0;
      }

      .area-range {
        position: relative;
        min-height: var(--area-track-height);
        touch-action: pan-y;
      }

      .area-segments {
        display: grid;
        grid-template-columns: repeat(
          var(--area-segment-count),
          minmax(0, 1fr)
        );
        gap: var(--area-segment-gap);
        min-height: var(--area-track-height);
        pointer-events: none;
      }

      .area-segments span {
        min-width: 0;
        min-height: var(--area-track-height);
        border: var(--studio-border-width) solid
          color-mix(in srgb, var(--area-colour) 35%, var(--studio-border));
        border-radius: var(--area-segment-radius);
        background: color-mix(
          in srgb,
          var(--area-colour) 14%,
          var(--studio-card)
        );
      }

      .area-segments span.covered {
        border-color: color-mix(
          in srgb,
          var(--area-colour) 42%,
          var(--studio-border)
        );
        background: color-mix(
          in srgb,
          var(--area-colour) 24%,
          var(--studio-card)
        );
      }

      .area-window {
        position: absolute;
        z-index: var(--area-z-window);
        top: 0;
        bottom: 0;
        min-width: var(--studio-border-width);
        border-block: var(--studio-strong-border-width) solid
          color-mix(in srgb, var(--area-colour) 48%, var(--studio-border));
        background: color-mix(in srgb, var(--area-colour) 5%, transparent);
      }

      .area-move {
        position: absolute;
        inset: 0;
        z-index: var(--area-z-move-target);
        min-width: var(--area-handle-hit-width);
        cursor: grab;
      }

      .area-move::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--area-move-indicator-width);
        height: var(--area-move-indicator-height);
        border-radius: var(--area-move-indicator-radius);
        background-image: radial-gradient(
          circle,
          color-mix(in srgb, var(--area-colour) 52%, #000)
            var(--area-move-dot-size),
          transparent var(--area-move-dot-fade-size)
        );
        background-position: 0 0;
        background-size:
          var(--area-move-dot-period)
          var(--area-move-dot-period);
        content: "";
        opacity: 0.72;
        transform: translate(-50%, -50%);
      }

      .area-move:active {
        cursor: grabbing;
      }

      .area-handle {
        position: absolute;
        z-index: var(--area-z-handle);
        top: 50%;
        width: var(--area-handle-hit-width);
        min-height: var(--area-handle-hit-height);
        border: 0;
        background: transparent;
        cursor: ew-resize;
        transform: translateY(-50%);
      }

      .area-handle::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--area-handle-grip-width);
        height: var(--area-handle-grip-height);
        border-inline: var(--studio-strong-border-width) solid
          color-mix(in srgb, var(--area-colour) 72%, #000);
        content: "";
        transform: translate(-50%, -50%);
      }

      .area-handle::after {
        position: absolute;
        z-index: var(--area-z-handle-background);
        top: 50%;
        left: 50%;
        width: var(--area-handle-body-width);
        height: var(--area-handle-body-height);
        border: var(--studio-strong-border-width) solid
          color-mix(in srgb, var(--area-colour) 78%, #000);
        border-radius: var(--area-handle-body-radius);
        background: var(--studio-card);
        box-shadow: 0 var(--studio-strong-border-width)
          var(--studio-compact-gap) rgb(0 0 0 / 18%);
        content: "";
        transform: translate(-50%, -50%);
      }

      .area-handle-left {
        left: 0;
        transform: translate(-50%, -50%);
      }

      .area-handle-right {
        right: 0;
        transform: translate(50%, -50%);
      }

      .area-move:focus-visible,
      .area-handle:focus-visible {
        outline: var(--studio-focus-width) solid var(--studio-blue);
        outline-offset: var(--studio-focus-offset);
      }

      .area-move[aria-disabled="true"],
      .area-handle[aria-disabled="true"] {
        cursor: default;
        opacity: var(--studio-disabled-opacity);
      }

      .area-drag-value {
        position: absolute;
        z-index: var(--area-z-tooltip);
        bottom: calc(100% + var(--area-tooltip-gap));
        left: 50%;
        min-width: var(--area-tooltip-min-width);
        padding: var(--studio-micro-gap) var(--area-tooltip-gap);
        border: var(--studio-border-width) solid var(--studio-border);
        border-radius: var(--studio-control-radius);
        color: var(--primary-text-color);
        background: var(--studio-card);
        box-shadow: var(--studio-popover-shadow);
        font-size: var(--studio-caption-size);
        font-weight: var(--studio-font-weight-emphasis);
        font-variant-numeric: tabular-nums;
        line-height: var(--studio-icon-line-height);
        text-align: center;
        transform: translateX(-50%);
      }

      .muted {
        color: var(--studio-muted);
        font-size: var(--studio-parameter-label-size);
        line-height: var(--studio-muted-line-height);
      }

      /* Narrows side padding while retaining full handle hit targets. */
      @media (max-width: 760px) {
        .area-control {
          padding-inline: var(--area-control-mobile-padding);
        }
      }
    `]}};w([e({attribute:!1})],X.prototype,`layer`,void 0),w([e({type:Boolean})],X.prototype,`disabled`,void 0),w([e({type:Number})],X.prototype,`segmentCount`,void 0),w([u()],X.prototype,`activeControl`,void 0),customElements.get(`govee-applied-area-control`)||customElements.define(`govee-applied-area-control`,X);var Z=class extends _{constructor(...e){super(...e),this.label=``,this.checked=!1,this.disabled=!1}render(){return T`
      <button
        class=${this.checked?`on`:``}
        type="button"
        role="switch"
        aria-checked=${this.checked}
        aria-label=${this.label}
        ?disabled=${this.disabled}
        @click=${this.toggle}
      >
        <span aria-hidden="true"></span>
      </button>
    `}toggle(){this.dispatchEvent(new CustomEvent(`checked-changed`,{detail:{checked:!this.checked},bubbles:!0,composed:!0}))}static{this.styles=[h,m`
      :host {
        display: inline-block;
        flex: 0 0 auto;
      }

      button {
        --studio-switch-track-width: var(--studio-compact-switch-track-width);
        --studio-switch-thumb-travel: calc(
          var(--studio-switch-track-width) - var(--studio-switch-thumb-inset) -
            var(--studio-switch-thumb-inset) -
            var(--studio-switch-thumb-size)
        );
        position: relative;
        width: var(--studio-switch-track-width);
        min-height: var(--studio-switch-track-height);
        height: var(--studio-switch-track-height);
        padding: 0;
        border: 0;
        border-radius: var(--studio-pill-radius);
        background: var(--studio-switch-track-off);
        cursor: pointer;
        transition: background var(--studio-switch-transition-duration)
          var(--studio-switch-transition-easing);
      }

      button span {
        position: absolute;
        top: var(--studio-switch-thumb-inset);
        left: var(--studio-switch-thumb-inset);
        width: var(--studio-switch-thumb-size);
        height: var(--studio-switch-thumb-size);
        border-radius: var(--studio-round-radius);
        background: var(--studio-switch-thumb-off);
        box-shadow: 0 var(--studio-border-width)
          var(--studio-strong-border-width) rgb(0 0 0 / 20%);
        transition:
          transform var(--studio-switch-transition-duration)
            var(--studio-switch-transition-easing),
          background var(--studio-switch-transition-duration)
            var(--studio-switch-transition-easing);
      }

      button.on {
        background: var(--studio-switch-track-on);
      }

      button.on span {
        background: var(--studio-switch-thumb-on);
        transform: translateX(var(--studio-switch-thumb-travel));
      }

      button:focus-visible {
        outline: var(--studio-focus-width) solid var(--studio-blue);
        outline-offset: var(--studio-focus-offset);
      }

      @media (prefers-reduced-motion: reduce) {
        button,
        button span {
          transition: none;
        }
      }
    `]}};w([e()],Z.prototype,`label`,void 0),w([e({type:Boolean})],Z.prototype,`checked`,void 0),w([e({type:Boolean})],Z.prototype,`disabled`,void 0),customElements.get(`govee-switch-control`)||customElements.define(`govee-switch-control`,Z);var ue=[{value:0,label:`-`,ariaLabel:`No priority`},...[1,2,3,4,5].map(e=>({value:e,label:String(e)}))],de={0:`Brightest to Darkest`,1:`Brightest, Darkest, Brightest`,2:`Darkest to Brightest`,3:`Darkest, Brightest, Darkest`},Q={0:`Forward`,1:`Backward`,2:`Forward and Back`,3:`Back and Forward`},$=class extends _{constructor(...e){super(...e),this.disabled=!1,this.segmentCount=15,this.movementAnnouncement=``,this.controller=new V,this.previewInteraction=`committed`,this.capturePreviewInteraction=e=>{let t=e.composedPath()[0];if(e.type===`value-changed`&&t instanceof HTMLElement&&t.tagName===`GOVEE-SLIDER-CONTROL`){let t=e.detail.interaction;this.previewInteraction=t??`committed`}else if(e.type===`palette-changed`){let t=e.detail.interaction;t&&(this.previewInteraction=t)}}}connectedCallback(){super.connectedCallback(),this.addEventListener(`value-changed`,this.capturePreviewInteraction,!0),this.addEventListener(`palette-changed`,this.capturePreviewInteraction,!0)}disconnectedCallback(){this.removeEventListener(`value-changed`,this.capturePreviewInteraction,!0),this.removeEventListener(`palette-changed`,this.capturePreviewInteraction,!0),super.disconnectedCallback()}willUpdate(e){(e.has(`content`)||e.has(`disabled`))&&this.controller.sync(this.content,this.disabled)}render(){if(!this.content)return D;if(this.content.layers.length===0)return this.renderEmptyLayers();if(this.content.native_diy!==void 0&&this.content.native_diy>=17&&this.content.native_diy<=19)return this.renderNativeDiy();let e=this.activeLayer,t=L(this.controller.layerLabels),n=z(this.content.layers.length,this.disabled).filter(e=>e.visible&&(!this.content?.native_diy||e.kind===`renumber`));return T`
      <div class="visually-hidden" aria-live="polite">
        ${this.movementAnnouncement}
      </div>
      ${this.renderNativeDiy()}

      <section class="card layer-card">
        <h3 class="section-title">Layers</h3>
        <govee-reorderable-strip
          class="layer-strip"
          .items=${t}
          .activeIndex=${this.controller.activeLayerIndex}
          ariaLabel="Effect layers"
          itemRole="tab"
          addLabel="Add layer"
          .addDisabled=${this.disabled}
          .addHidden=${!!this.content.native_diy||this.content.layers.length>=5}
          .reorderDisabled=${this.disabled||!!this.content.native_diy}
          .separateActions=${n.length>0}
          @item-selected=${e=>this.selectLayer(e.detail.index)}
          @items-reordered=${e=>this.reorderLayer(e.detail.from,e.detail.to)}
          @item-added=${this.addLayer}
        >
          ${n.map(e=>T`
                  <button
                    slot="actions"
                    class=${e.danger?`compact-action danger-action`:`compact-action`}
                    type="button"
                    title=${e.label}
                    aria-label=${e.label}
                    ?disabled=${e.disabled}
                    @click=${e.kind===`copy`?this.copyLayer:e.kind===`renumber`?this.renumberLayers:this.deleteLayer}
                  >
                    ${e.icon?T`
                          <ha-icon
                            class="compact-action-icon"
                            icon=${e.icon}
                            aria-hidden="true"
                          ></ha-icon>
                        `:T`<span aria-hidden="true">${e.glyph}</span>`}
                  </button>
                `)}
        </govee-reorderable-strip>
      </section>

      <section
        class="selected-record-panel"
        id="advanced-layer-panel"
        role="tabpanel"
        aria-labelledby="advanced-layer-tab-${this.controller.activeLayerIndex}"
      >
        <div class="control-grid">
          ${this.renderPriority(e)}
          ${this.renderPalette(e)}
          ${this.renderAppliedArea(e)}
          ${this.renderBrightness(e)}
          ${W(e,this.disabled,e=>this.applyContentChange(this.controller.updateNested(`distribution`,e)),e=>this.updateLayer(e))}
          ${this.renderMovement(e,`selected_movement`,`Move Effect within Applied Area`,!0)}
          ${this.renderMovement(e,`overall_movement`,`Move Entire Layer`,!1)}
        </div>
      </section>
    `}renderEmptyLayers(){return T`
      <section class="card empty-state" role="status">
        <h3 class="section-title">No Layer Records</h3>
        <p class="muted">
          This layered content contains no layer records. It remains preserved
          until you add one.
        </p>
        <button
          class="add-button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.addLayer}
        >
          Add layer
        </button>
      </section>
    `}get activeLayer(){return this.controller.activeLayer}renderAppliedArea(e){let t=this.nativeGeometryUnknown;return T`
      <section class="card">
        <div class="section-heading">
          <h3 class="section-title">Applied Area</h3>
          ${J(`appliedArea`)}
        </div>
        <govee-applied-area-control
          .layer=${e}
          .disabled=${this.disabled||t&&this.content?.native_diy===506}
          .segmentCount=${this.segmentCount}
          @area-changed=${e=>this.applyContentChange(this.controller.replaceActiveLayer(e.detail.layer),e.detail.interaction)}
        ></govee-applied-area-control>
        ${U(e,this.disabled||t,e=>this.applyContentChange(this.controller.updateNested(`selection`,e)))}
        ${t?T`<p>Physical IC count is unknown. This template's IC-dependent area/selection controls retain their preset values.</p>`:D}
      </section>
    `}renderPalette(e){let t=this.content?.native_diy===503,n=t?this.physicalIcCount==null?e.palette.length:Math.min(8,Math.max(1,Math.floor(this.physicalIcCount/5))):8;return T`
      <section class="card">
        <h3 class="section-title">Colours</h3>
        <govee-palette-editor
          .palette=${e.palette}
          .minColours=${t&&this.physicalIcCount==null?e.palette.length:1}
          .maxColours=${n}
          .disabled=${this.disabled}
          @palette-changed=${e=>this.applyContentChange(this.controller.updatePalette(e.detail.palette))}
        ></govee-palette-editor>
      </section>
    `}renderBrightness(e){if(e.brightness_patterns.length===0)return T`
        <section class="card empty-state" role="status">
          <h3 class="section-title">No Brightness Pattern Records</h3>
          <p class="muted">
            This layer contains no brightness pattern records. It remains
            preserved until you add one.
          </p>
          <button
            class="add-button"
            type="button"
            ?disabled=${this.disabled}
            @click=${this.addBrightnessPattern}
          >
            Add brightness pattern
          </button>
        </section>
      `;let t=this.controller.visiblePatternIndex(e.brightness_patterns.length),n=e.brightness_patterns[t],r=j(n.order),i=A(e);return T`
      <section class="card">
        <h3 class="section-title">Brightness</h3>
        <div class="parameter-stack">
          ${[`algorithm`,`type`].map(t=>T`
            <label class="field">
              <span>Brightness ${t}</span>
              <select aria-label=${`Brightness ${t}`} ?disabled=${this.disabled}
                @change=${n=>this.updateLayer(s(e,{[t]:Number(n.target.value)}))}>
                ${i[t]>(t===`algorithm`?2:3)?T`<option selected disabled>Unknown (${i[t]})</option>`:D}
                ${(t===`algorithm`?[0,1,2]:[0,1,2,3]).map(e=>T`
                  <option value=${e} .selected=${i[t]===e}>${e}</option>
                `)}
              </select>
            </label>
          `)}

          <div class="patterns-section">
            <div class="subsection-heading">
              <h4>Patterns</h4>
              ${J(`patterns`)}
            </div>
            <govee-reorderable-strip
              class="pattern-strip"
              .items=${R(e.brightness_patterns.length)}
              .activeIndex=${t}
              ariaLabel="Patterns"
              itemRole="tab"
              addLabel="Add brightness pattern"
              .addDisabled=${this.disabled}
              .addHidden=${e.brightness_patterns.length>=3}
              .reorderDisabled=${!0}
              .separateActions=${e.brightness_patterns.length>1}
              @item-selected=${e=>this.selectPattern(e.detail.index)}
              @item-added=${this.addBrightnessPattern}
            >
              ${e.brightness_patterns.length>1?T`
                    <button
                      slot="actions"
                      class="compact-action danger-action"
                      type="button"
                      title="Delete current brightness pattern"
                      aria-label="Delete current brightness pattern"
                      ?disabled=${this.disabled}
                      @click=${this.deleteBrightnessPattern}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  `:D}
            </govee-reorderable-strip>

            <div
              class="brightness-fields parameter-stack"
              id="advanced-pattern-panel"
              role="tabpanel"
              aria-labelledby="advanced-pattern-tab-${t}"
            >
              <label class="field">
                <span>Order</span>
                <select
                  aria-label="Brightness order"
                  ?disabled=${this.disabled}
                  @change=${e=>this.updateBrightnessPattern({order:Number(e.target.value)})}
                >
                  ${r?D:T`<option value="" disabled .selected=${!0}>
                        Choose an order
                      </option>`}
                  ${g.map(e=>T`<option
                        value=${e}
                        .selected=${n.order===e}
                      >
                        ${de[e]}
                      </option>`)}
                </select>
              </label>
              <div class="parameter-grid">
                ${G(`Scope Low`,n.scope_low,e=>this.updateBrightnessPattern({scope_low:e}),this.disabled,`brightnessScopeLow`)}
                ${G(`Scope High`,n.scope_high,e=>this.updateBrightnessPattern({scope_high:e}),this.disabled,`brightnessScopeHigh`)}
              </div>
              <div class="parameter-grid">
                ${G(`Changing Speed`,n.change_speed,e=>this.updateBrightnessPattern({change_speed:e}),this.disabled,`changingSpeed`)}
              </div>
              <div class="parameter-grid">
                ${G(`Brightest Retention`,n.brightest_retention,e=>this.updateBrightnessPattern({brightest_retention:e}),this.disabled,`brightestRetention`)}
                ${G(`Darkest Retention`,n.darkest_retention,e=>this.updateBrightnessPattern({darkest_retention:e}),this.disabled,`darkestRetention`)}
              </div>
            </div>
          </div>
        </div>
      </section>
    `}renderMovement(e,t,n,r){let i=e[t],a=t===`selected_movement`?`inAreaMovement`:`wholeLayerMovement`,o=Object.hasOwn(Q,i.direction);return T`
      <section class="card">
        <div class="card-heading">
          <div class="section-heading">
            <h3 class="section-title">${n}</h3>
            ${J(a)}
          </div>
          <govee-switch-control
            .label=${`${n} enabled`}
            .checked=${i.enabled}
            .disabled=${this.disabled}
            @checked-changed=${e=>this.updateMovement(t,{enabled:e.detail.checked},`${n} ${e.detail.checked?`enabled`:`disabled`}.`)}
          ></govee-switch-control>
        </div>
        ${i.enabled?T`
              <div class="parameter-stack">
                ${K(`ICs per Step`,i.distance,e=>this.updateMovement(t,{distance:e},`${n} distance ${e}.`),this.disabled,{help:`icsPerStep`})}
                <label class="field">
                  <span>Direction</span>
                  <select
                    .value=${o?String(i.direction):``}
                    ?disabled=${this.disabled||this.nativeGeometryUnknown&&this.content?.native_diy===506}
                    @change=${e=>{let r=Number(e.target.value);this.updateMovement(t,{direction:r},`${n} direction ${Q[r]}.`)}}
                  >
                    ${o?D:T`<option value="" disabled .selected=${!0}>
                          Choose a direction
                        </option>`}
                    ${Object.entries(Q).map(([e,t])=>T`<option
                          value=${e}
                          .selected=${i.direction===Number(e)}
                        >
                          ${t}
                        </option>`)}
                  </select>
                </label>
                ${G(`Speed`,i.speed,e=>this.updateMovement(t,{speed:e},`${n} speed ${e}.`),this.disabled)}
                ${r?T`
                      <govee-checkbox-control
                        label="Pause Before Re-entering"
                        .checked=${i.enter_exit}
                        .disabled=${this.disabled}
                        @checked-changed=${e=>{let r=e.detail.checked;this.updateMovement(t,{enter_exit:r},`${n} pause before re-entering ${r?`enabled`:`disabled`}.`)}}
                      >
                        ${J(`pauseBeforeReentry`,`help`)}
                      </govee-checkbox-control>
                    `:D}
              </div>
            `:D}
      </section>
    `}renderPriority(e){return T`
      <section class="card">
        <div class="section-heading">
          <h3 class="section-title">Priority</h3>
          ${J(`priority`)}
        </div>
        <div class="parameter-stack">
          <govee-segmented-control
            label="Priority"
            .value=${e.priority}
            .options=${ue}
            .disabled=${this.disabled}
            .hideLabel=${!0}
            @value-changed=${e=>this.updateLayer({priority:e.detail.value})}
          ></govee-segmented-control>
        </div>
      </section>
    `}get nativeGeometryUnknown(){let e=this.content?.native_diy;return this.physicalIcCount==null&&(e===502||e===504||e===506&&this.controller.activeLayerIndex>=2)}renderNativeDiy(){let e=this.content,n=e.native_diy;if(n===void 0)return D;if(n>=17&&n<=19){let r=i(e),a=n===19?e.layers[0].colour_speed:e.layers[0].selected_movement.speed;return T`<section class="card">
        <h3>${n===17?`Spin 1`:n===18?`Spin 2`:`Ribbon`} · Native DIY ${n}</h3>
        <govee-palette-editor
          .palette=${r}
          .minColours=${1}
          .maxColours=${8}
          .disabled=${this.disabled}
          @palette-changed=${n=>this.applyContentChange(t(e,{palette:n.detail.palette}))}
        ></govee-palette-editor>
        ${K(`Template rate`,a,n=>this.applyContentChange(t(e,{speed:n})),this.disabled,{minimum:150,maximum:n===19?253:250})}
      </section>`}let r=e.layers,a=[`Brilliant / Colorful`,`Colorful Sky`,`Meteor`,`Meteor Shower`,`Shine`,`Bloom DIY`,`Stack`],o=n=>this.applyContentChange(t(e,n,this.physicalIcCount)),s=(t,r=!1)=>{let a=i(e,r),s=n===501?4:n===502||n===506?2:n===504?3:1,c=n===503&&this.physicalIcCount==null,l=n===503&&this.physicalIcCount!=null?Math.min(8,Math.max(1,Math.floor(this.physicalIcCount/5))):8;return T`<h4>${t}</h4><govee-palette-editor
        .palette=${a} .minColours=${c?a.length:s}
        .maxColours=${c?a.length:l} .disabled=${this.disabled}
        @palette-changed=${e=>o({[r?`secondary`:`palette`]:e.detail.palette})}
      ></govee-palette-editor>`},c=r[+(n===501)],l=c.brightness_patterns[0];return T`<section class="card">
      <h3>${a[n-501]} · Native DIY ${n}</h3>
      <p>Template preset. Playback and rendering await device qualification.</p>
      ${s(n===506?`Bloom colours`:n===507?`Moving colours`:`Effect colours`)}
      ${n===506||n===507?s(n===506?`Moving colours`:`Stack colours`,!0):D}
      ${n===501||n===505?T`<h4>Background</h4><govee-palette-editor
        .palette=${r[n===501?0:1].palette} .minColours=${1} .maxColours=${1} .disabled=${this.disabled}
        @palette-changed=${e=>o({background:e.detail.palette[0]})}
      ></govee-palette-editor>`:D}
      ${n<=505?K(`Template speed`,n===503||n===504?c.overall_movement.speed:c.colour_speed,e=>o({speed:e}),this.disabled,{minimum:n===501?0:n===502?150:200,maximum:n===505?245:255}):D}
      ${l&&(n===501||n===505)?T`
        ${K(`Minimum brightness`,l.scope_low,e=>o({low:e}),this.disabled,{maximum:Math.max(0,l.scope_high-76)})}
        ${K(`Maximum brightness`,l.scope_high,e=>o({high:e}),this.disabled,{minimum:Math.min(255,l.scope_low+76)})}
      `:D}
      ${l&&(n===502||n===506||n===507)?K(`Template brightness`,l.scope_high,e=>o({brightness:e}),this.disabled,{minimum:n===507?25:50}):D}
      ${n===501?T`<label><input type="checkbox" .checked=${c.colour_retention===50} ?disabled=${this.disabled}
        @change=${e=>o({gradient:e.target.checked})}>Colour gradient</label>`:D}
      ${n===502?T`
        ${K(`Minimum star IC count`,c.selection.param_2,e=>o({starMin:e}),this.disabled||this.physicalIcCount==null,{minimum:1,maximum:c.selection.param_1})}
        ${K(`Maximum star IC count`,c.selection.param_1,e=>o({starMax:e}),this.disabled||this.physicalIcCount==null,{minimum:c.selection.param_2,maximum:this.physicalIcCount==null?c.selection.param_1:Math.min(25,Math.floor(this.physicalIcCount*4/5))})}
      `:D}
      ${n===503||n===504||n===506||n===507?T`<label class="field"><span>Template direction</span>
        <select aria-label="Template direction" ?disabled=${this.disabled||n===506&&this.physicalIcCount==null}
          @change=${e=>o({direction:Number(e.target.value)})}>
          <option value="" selected disabled>Choose direction</option>
          <option value="0">Clockwise</option><option value="1">Counterclockwise</option>
          ${n===506?T`<option value="2">Two-way</option>`:D}
        </select></label>`:D}
      ${this.physicalIcCount==null&&[502,503,504,506].includes(n)?T`<p>Physical IC count is unknown; dependent controls retain the template seed. Logical segment count is not used as IC geometry.</p>`:D}
    </section>`}updateLayer(e,t){this.applyContentChange(this.controller.updateLayer(e),t)}updateBrightnessPattern(e,t){this.applyContentChange(this.controller.updateBrightnessPattern(e),t)}updateMovement(e,t,n){this.applyContentChange(this.controller.updateNested(e,t)),n&&(this.movementAnnouncement=n)}addLayer(){this.applyLayerChange(this.controller.addLayer())}copyLayer(){this.applyLayerChange(this.controller.copyLayer())}renumberLayers(){this.applyLayerChange(this.controller.renumberLayers())}deleteLayer(){this.applyLayerChange(this.controller.deleteLayer())}reorderLayer(e,t){this.applySelectionChange(this.controller.reorderLayer(e,t))}addBrightnessPattern(){this.applySelectionChange(this.controller.addBrightnessPattern())}deleteBrightnessPattern(){this.applySelectionChange(this.controller.deleteBrightnessPattern())&&this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`.pattern-strip`)?.focusItem(this.controller.activePatternIndex)})}selectLayer(e){this.controller.selectLayer(e)&&this.requestUpdate()}selectPattern(e){this.controller.selectPattern(e)&&this.requestUpdate()}focusActiveTab(){this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`govee-reorderable-strip`)?.focusItem(this.controller.activeLayerIndex)})}applyLayerChange(e){this.applySelectionChange(e)&&this.focusActiveTab()}applySelectionChange(e){return this.applyContentChange(e)?(this.requestUpdate(),!0):!1}applyContentChange(e,t){return e?(this.controller.isCurrentContent(e)&&(this.content=e),this.emitContent(e,t),!0):!1}emitContent(e,t=this.previewInteraction){this.previewInteraction=`committed`,this.dispatchEvent(new CustomEvent(`content-changed`,{detail:{content:e,interaction:t},bubbles:!0,composed:!0}))}static{this.styles=le}};w([e({attribute:!1})],$.prototype,`content`,void 0),w([e({type:Boolean})],$.prototype,`disabled`,void 0),w([e({type:Number})],$.prototype,`segmentCount`,void 0),w([e({attribute:!1})],$.prototype,`physicalIcCount`,void 0),w([u()],$.prototype,`movementAnnouncement`,void 0),customElements.get(`govee-advanced-effect-editor`)||customElements.define(`govee-advanced-effect-editor`,$);export{$ as GoveeAdvancedEffectEditor,ae as blankAdvancedContent,p as cloneAdvancedContent,M as cloneLayeredSceneContent};