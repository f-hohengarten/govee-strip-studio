import{$t as e,It as t,an as n,c as r,d as i,en as a,l as o,n as s,ot as c,rn as l,rt as u,st as d,tn as f}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-checkbox-control-BRcbJ2Y-.js";import"./effect-studio-slider-control-B2Yw9Nvi.js";var p=[{key:`left`,label:`Left`},{key:`top`,label:`Top`},{key:`right`,label:`Right`},{key:`bottom`,label:`Bottom`}];function m(e){let t=Object.values(e);return t.every(e=>e===t[0])?t[0]:void 0}function h(e){let n=m(e);return n===void 0?t(Object.values(e).reduce((e,t)=>e+t,0)/Object.values(e).length,1,100):n}function g(e,n){let r=t(e,1,100);return{left:r,top:r,right:r,bottom:r,...n.strip_left===void 0?{}:{strip_left:r,strip_right:r}}}var _=class extends a{constructor(...e){super(...e),this.settings=[],this.disabled=!1,this.interaction=`committed`}render(){if(!this.content)return l`
        <section class="card empty-state" role="status">
          <h3 class="section-title">Video profile unavailable</h3>
          <p class="muted">
            Load a video profile to edit video-sync settings.
          </p>
        </section>
      `;let e=this.settings.includes(`capture_region`)&&this.content.full_screen!==null,n=this.settings.includes(`saturation`)&&this.content.saturation!==null,r=this.settings.includes(`sound_effects`)&&this.content.sound_effects!==null&&this.content.sound_effects_softness!==null,i=this.settings.includes(`white_balance`)&&(this.content.white_balance_position!==null||this.content.white_balance_value!==void 0),a=this.settings.includes(`blank_screen`)&&this.content.blank_screen!==null,o=this.settings.includes(`black_border`)&&this.content.black_border!==void 0,s=this.settings.includes(`relative_brightness`)&&this.content.relative_brightness!==null,u=this.content.relative_brightness??{left:100,top:100,right:100,bottom:100},_=m(u)===void 0,v=h(u);return l`
      <div class="editor-grid">
        ${Object.entries(this.applicability??{}).filter(([e,t])=>this.settings.includes(e)&&t!==`supported`).map(([e,t])=>l`
          <p role="status">${e.replaceAll(`_`,` `)}: ${t===`evidence_gap`?`firmware identity unavailable`:`unavailable on this device`}.
            A profile requesting this setting cannot be applied.</p>`)}
        <section class="card">
          <h3 class="section-title">Included settings</h3>
          <p class="muted">Unchecked settings are left unchanged on the device.</p>
          ${this.settings.map(t=>this.renderCheckboxField(`Include ${t.replaceAll(`_`,` `)}`,t===`white_balance`?i:t===`relative_brightness`?s:t===`blank_screen`?a:t===`capture_region`?e:t===`black_border`?o:t===`saturation`?n:r,e=>this.updateContent(n=>{switch(t){case`capture_region`:n.full_screen=e?!0:null;break;case`saturation`:n.saturation=e?50:null;break;case`sound_effects`:n.sound_effects=!e&&null,n.sound_effects_softness=e?50:null;break;case`blank_screen`:n.blank_screen=!e&&null,e||(delete n.blank_screen_detection,delete n.blank_screen_low_brightness_duration_seconds,delete n.blank_screen_same_tone_duration_seconds);break;case`black_border`:e?n.black_border=!1:delete n.black_border;break;case`white_balance`:if(n.white_balance_position=null,delete n.white_balance_value,e){let e=this.controls?.white_balance.default??17;this.controls?.white_balance.representation===`scalar`?n.white_balance_value=e:n.white_balance_position=e}break;case`relative_brightness`:n.relative_brightness=e?{left:100,top:100,right:100,bottom:100,...this.controls?.brightness_zones.length===6?{strip_left:100,strip_right:100}:{}}:null}})))}
        </section>
        <section
          class="card"
          ?hidden=${!e&&!r&&!a&&!o}
        >
          <div class="parameter-stack">
            <label class="field" ?hidden=${!e}>
              <span>Capture area</span>
              <select
                aria-label="Capture area"
                ?disabled=${this.disabled}
                @change=${e=>this.updateContent(t=>{t.full_screen=c(e.target.value)})}
              >
                <option
                  value="full"
                  .selected=${d(this.content.full_screen??!0)===`full`}
                >
                  Full screen
                </option>
                <option
                  value="part"
                  .selected=${d(this.content.full_screen??!0)===`part`}
                >
                  Part screen
                </option>
              </select>
            </label>
            ${r?this.renderCheckboxField(`Sound effects`,this.content.sound_effects??!1,e=>this.updateContent(t=>{t.sound_effects=e})):f}
            ${r&&this.content.sound_effects?this.renderRangeField(`Softness`,this.content.sound_effects_softness??50,1,100,e=>this.updateContent(n=>{n.sound_effects_softness=t(e,1,100)})):f}
            ${a?this.renderCheckboxField(`Blank screen`,this.content.blank_screen??!1,e=>this.updateContent(t=>{t.blank_screen=e})):f}
            ${o?this.renderCheckboxField(`Black-border removal`,this.content.black_border??!1,e=>this.updateContent(t=>{t.black_border=e})):f}
            ${a?l`
              ${this.renderCheckboxField(`Edit blank-screen policy`,this.content.blank_screen_detection!==void 0,e=>this.updateContent(t=>{e?(t.blank_screen_detection=2,t.blank_screen_low_brightness_duration_seconds=10,t.blank_screen_same_tone_duration_seconds=120):(delete t.blank_screen_detection,delete t.blank_screen_low_brightness_duration_seconds,delete t.blank_screen_same_tone_duration_seconds)}))}
              <p class="muted">Without policy editing, the device's detection and durations are retained.</p>
              ${this.content.blank_screen_detection===void 0?f:l`
                <label class="field"><span>Blank-screen detection</span>
                  <select aria-label="Blank-screen detection" ?disabled=${this.disabled}
                    @change=${e=>this.updateContent(t=>{t.blank_screen_detection=Number(e.target.value)})}>
                    <option value="1" .selected=${this.content.blank_screen_detection===1}>Low brightness</option>
                    <option value="2" .selected=${this.content.blank_screen_detection===2}>Same tone</option>
                  </select>
                </label>
                ${[`blank_screen_low_brightness_duration_seconds`,`blank_screen_same_tone_duration_seconds`].map((e,t)=>l`
                    <label class="field"><span>${t===0?`Low-brightness seconds`:`Same-tone seconds`}</span>
                      <input type="number" min="0" max="65535" step="1" ?disabled=${this.disabled}
                        .value=${String(this.content?.[e]??0)}
                        @change=${t=>{let n=t.target;n.value!==``&&n.reportValidity()&&this.updateContent(t=>{t[e]=n.valueAsNumber})}} />
                    </label>`)}
              `}
            `:f}
          </div>
        </section>

        <section class="card" ?hidden=${!n&&!i}>
          <h3 class="section-title">Image</h3>
          <div class="parameter-stack">
            ${n?this.renderRangeField(`Saturation`,this.content.saturation??50,this.controls?.saturation_min??0,100,e=>this.updateContent(n=>{n.saturation=t(e,this.controls?.saturation_min??0,100)})):f}
            ${i?this.renderWhiteBalanceField(this.content.white_balance_value??this.content.white_balance_position??this.controls?.white_balance.default??17):f}
          </div>
        </section>

        <section
          class="card brightness-card"
          ?hidden=${!s}
        >
          <div class="card-heading">
            <h3 class="section-title">Relative brightness</h3>
            ${_?l`<span class="status-chip">Mixed edges</span>`:f}
          </div>
          <div class="parameter-stack">
            ${this.renderRangeField(`Uniform brightness`,v,1,100,e=>this.updateContent(t=>{t.relative_brightness=g(e,u)}),_?`relative-brightness-note`:void 0)}
            ${_?l`
                  <p class="section-note muted" id="relative-brightness-note">
                    Zones differ. Adjust Uniform brightness to align all zones,
                    or adjust them individually.
                  </p>
                `:f}
            <div
              class="screen-brightness"
              role="group"
              aria-label="Screen edge brightness"
            >
              ${this.renderScreenEdgeControl(`top`,`Top`,u.top)}
              ${this.renderScreenEdgeControl(`left`,`Left`,u.left)}
              <div class="virtual-screen" aria-hidden="true">
                ${p.map(({key:e})=>l`
                    <span
                      class="screen-edge screen-edge-${e}"
                      style=${`--edge-level: ${u[e]/100}`}
                    ></span>
                  `)}
                <div class="screen-image">
                  <span>Screen</span>
                </div>
                <div class="screen-stand"></div>
              </div>
              ${this.renderScreenEdgeControl(`right`,`Right`,u.right)}
              ${this.renderScreenEdgeControl(`bottom`,`Bottom`,u.bottom)}
            </div>
            ${(this.controls?.brightness_zones??[]).filter(e=>e===`strip_left`||e===`strip_right`).map(e=>this.renderRangeField(e===`strip_left`?`Strip left`:`Strip right`,u[e]??100,1,100,t=>this.updateRelativeBrightnessEdge(e,t)))}
          </div>
        </section>
      </div>
    `}renderCheckboxField(e,t,n){return l`
      <govee-checkbox-control
        .label=${e}
        .checked=${t}
        .disabled=${this.disabled}
        @checked-changed=${e=>n(e.detail.checked)}
      ></govee-checkbox-control>
    `}renderRangeField(e,t,n,r,i,a){return l`
      <govee-slider-control
        .label=${e}
        .value=${t}
        .minimum=${n}
        .maximum=${r}
        .describedBy=${a}
        .disabled=${this.disabled}
        @value-changed=${e=>this.runInteraction(e.detail.interaction,()=>i(e.detail.value))}
      ></govee-slider-control>
    `}renderWhiteBalanceField(e){let n=this.controls?.white_balance.minimum??1,r=this.controls?.white_balance.maximum??20;return l`
      <label class="range-field white-balance-field">
        <span class="parameter-label">White balance</span>
        <div class="slider-with-endpoints">
          <input
            type="range"
            min=${n}
            max=${r}
            .value=${String(t(e,n,r))}
            aria-label="White balance"
            ?disabled=${this.disabled}
            @input=${e=>this.updateContent(i=>{let a=t(Number(e.target.value),n,r);this.controls?.white_balance.representation===`scalar`?i.white_balance_value=a:i.white_balance_position=a},`changing`)}
          />
          <div class="endpoint-labels" aria-hidden="true">
            <span>Cool</span>
            <span>Warm</span>
          </div>
        </div>
      </label>
    `}renderScreenEdgeControl(e,t,n){return l`
      <label class="screen-edge-control edge-control-${e}">
        <span class="parameter-label">${t}</span>
        <input
          type="range"
          min="1"
          max="100"
          .value=${String(n)}
          aria-label=${t}
          ?disabled=${this.disabled}
          @input=${t=>this.updateRelativeBrightnessEdge(e,Number(t.target.value))}
        />
      </label>
    `}updateRelativeBrightnessEdge(e,n){this.updateContent(r=>{r.relative_brightness!==null&&(r.relative_brightness[e]=t(n,1,100))},`changing`)}updateContent(e,t=this.interaction){if(!this.content)return;let n=u(this.content);e(n),this.emitContent(n,t)}emitContent(e,t=`committed`){this.dispatchEvent(new CustomEvent(`content-changed`,{detail:{content:u(e),interaction:t},bubbles:!0,composed:!0}))}runInteraction(e,t){this.interaction=e;try{t()}finally{this.interaction=`committed`}}static{this.styles=[r,o,i,n`
      :host {
        --video-edge-control-width: 72px;
        --video-screen-min-width: 260px;
        --video-screen-max-width: 560px;
        --video-screen-row-min-height: 220px;
        --video-screen-padding: var(--studio-spacing-md);
        --video-screen-radius: 14px;
        --video-screen-image-radius: 7px;
        --video-screen-shadow-offset: 18px;
        --video-screen-shadow-blur: 34px;
        --video-stand-offset: 18px;
        --video-stand-width: 28%;
        --video-stand-height: 14px;
        --video-stand-stroke: 4px;
        --video-edge-inset: var(--studio-spacing-2xl);
        --video-edge-thickness: 5px;
        --video-edge-border-inset: 3px;
        --video-horizontal-label-width: 48px;
        --video-horizontal-slider-min-width: 120px;
        --video-range-label-min-width: 118px;
        --video-vertical-slider-min-height: 130px;
        --video-mobile-edge-control-width: 52px;
        --video-mobile-screen-size: 160px;
        --video-mobile-horizontal-label-width: 42px;
        --video-mobile-vertical-slider-min-height: 90px;
        --video-screen-label-letter-spacing: 0.08em;
        --video-edge-near-glow-blur: 8px;
        --video-edge-near-glow-spread: 2px;
        --video-edge-far-glow-blur: 20px;
        --video-edge-far-glow-spread: 5px;
        --video-status-chip-inline-padding: 9px;
        display: block;
        color: var(--primary-text-color);
      }

      p {
        margin-top: 0;
      }

      .editor-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--studio-section-gap);
      }

      .brightness-card {
        grid-column: 1 / -1;
      }

      .muted,
      .endpoint-labels {
        color: var(--studio-muted);
        font-size: var(--studio-parameter-label-size);
        line-height: var(--studio-muted-line-height);
      }

      .section-note {
        margin: calc(0px - var(--studio-tight-gap)) 0 0;
      }

      .screen-brightness {
        display: grid;
        grid-template:
          ". top ." auto
          "left screen right" minmax(var(--video-screen-row-min-height), 1fr)
          ". bottom ." auto
          / var(--video-edge-control-width)
          minmax(var(--video-screen-min-width), var(--video-screen-max-width))
          var(--video-edge-control-width);
        align-items: center;
        justify-content: center;
        gap: var(--studio-spacing-lg);
        padding: var(--studio-spacing-lg) 0 var(--studio-spacing-4xl);
      }

      .virtual-screen {
        position: relative;
        grid-area: screen;
        width: 100%;
        aspect-ratio: 16 / 10;
        padding: var(--video-screen-padding);
        border: var(--studio-border-width) solid
          color-mix(in srgb, var(--studio-muted) 55%, transparent);
        border-radius: var(--video-screen-radius);
        background: #181b22;
        box-shadow:
          0 var(--video-screen-shadow-offset) var(--video-screen-shadow-blur)
            rgb(15 23 42 / 18%),
          inset 0 0 0 var(--studio-border-width) rgb(255 255 255 / 6%);
      }

      .screen-image {
        display: grid;
        width: 100%;
        height: 100%;
        place-items: center;
        overflow: hidden;
        border-radius: var(--video-screen-image-radius);
        color: rgb(255 255 255 / 62%);
        background:
          radial-gradient(circle at 72% 24%, rgb(64 186 255 / 42%), transparent 31%),
          radial-gradient(circle at 25% 72%, rgb(126 87 255 / 38%), transparent 36%),
          linear-gradient(145deg, #24334b, #101724 62%, #1e1633);
        font-size: var(--studio-parameter-label-size);
        font-weight: var(--studio-font-weight-emphasis);
        letter-spacing: var(--video-screen-label-letter-spacing);
        text-transform: uppercase;
      }

      .screen-stand {
        position: absolute;
        bottom: calc(0px - var(--video-stand-offset));
        left: 50%;
        width: var(--video-stand-width);
        height: var(--video-stand-height);
        border-bottom: var(--video-stand-stroke) solid #353b47;
        transform: translateX(-50%);
      }

      .screen-stand::before {
        position: absolute;
        top: 0;
        left: 50%;
        width: var(--video-stand-stroke);
        height: var(--studio-spacing-lg);
        background: #353b47;
        content: "";
        transform: translateX(-50%);
      }

      .screen-edge {
        position: absolute;
        z-index: var(--studio-z-raised);
        border-radius: var(--studio-pill-radius);
        background: rgb(67 168 255);
        box-shadow:
          0 0 var(--video-edge-near-glow-blur)
            var(--video-edge-near-glow-spread) rgb(67 168 255 / 72%),
          0 0 var(--video-edge-far-glow-blur)
            var(--video-edge-far-glow-spread) rgb(67 168 255 / 34%);
        opacity: calc(0.12 + var(--edge-level) * 0.88);
        pointer-events: none;
      }

      .screen-edge-top,
      .screen-edge-bottom {
        right: var(--video-edge-inset);
        left: var(--video-edge-inset);
        height: var(--video-edge-thickness);
      }

      .screen-edge-top {
        top: var(--video-edge-border-inset);
      }

      .screen-edge-bottom {
        bottom: var(--video-edge-border-inset);
      }

      .screen-edge-left,
      .screen-edge-right {
        top: var(--video-edge-inset);
        bottom: var(--video-edge-inset);
        width: var(--video-edge-thickness);
      }

      .screen-edge-left {
        left: var(--video-edge-border-inset);
      }

      .screen-edge-right {
        right: var(--video-edge-border-inset);
      }

      .screen-edge-control {
        display: grid;
        align-items: center;
        gap: var(--studio-compact-gap);
        min-width: 0;
      }

      .screen-edge-control input {
        min-width: 0;
      }

      .edge-control-top,
      .edge-control-bottom {
        grid-template-columns:
          var(--video-horizontal-label-width)
          minmax(var(--video-horizontal-slider-min-width), 1fr);
      }

      .edge-control-top input,
      .edge-control-bottom input {
        min-height: var(--studio-control-height);
      }

      .edge-control-top {
        grid-area: top;
      }

      .edge-control-bottom {
        grid-area: bottom;
      }

      .edge-control-left,
      .edge-control-right {
        grid-template-rows:
          auto
          minmax(var(--video-vertical-slider-min-height), 1fr);
        justify-items: center;
        height: 100%;
      }

      .edge-control-left {
        grid-area: left;
      }

      .edge-control-right {
        grid-area: right;
      }

      .edge-control-left input,
      .edge-control-right input {
        width: var(--studio-control-height);
        height: 100%;
        writing-mode: vertical-lr;
        direction: rtl;
      }

      .card-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--studio-spacing-lg);
        margin-bottom: var(--studio-section-title-gap);
      }

      .card-heading h3 {
        margin-bottom: 0;
      }

      .range-field {
        grid-template-columns:
          minmax(var(--video-range-label-min-width), auto)
          minmax(0, 1fr);
        align-items: center;
        gap: var(--studio-control-gap);
        margin-top: 0;
      }

      .range-field input[type="range"] {
        width: 100%;
        min-width: 0;
      }

      .white-balance-field {
        align-items: start;
      }

      .slider-with-endpoints {
        display: grid;
        gap: var(--studio-tight-gap);
        min-width: 0;
      }

      .endpoint-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--studio-caption-size);
        font-weight: var(--studio-font-weight-semibold);
      }

      .status-chip {
        padding: var(--studio-micro-gap)
          var(--video-status-chip-inline-padding);
        border-radius: var(--studio-pill-radius);
        color: var(--studio-blue);
        background: var(--studio-blue-soft);
        font-size: var(--studio-caption-size);
        font-weight: var(--studio-font-weight-emphasis);
        white-space: nowrap;
      }

      .empty-state h3,
      .empty-state p {
        margin-bottom: 0;
      }

      .empty-state h3 {
        margin-bottom: var(--studio-compact-gap);
      }

      /* Uses one card column when HA's docked sidebar reduces the editor workspace. */
      @media (max-width: 1320px) {
        .editor-grid {
          grid-template-columns: 1fr;
        }

        .brightness-card {
          grid-column: auto;
        }
      }

      /* Compresses the screen-edge visualisation to the minimum usable phone geometry. */
      @media (max-width: 560px) {
        .range-field {
          grid-template-columns: 1fr;
        }

        .screen-brightness {
          grid-template:
            ". top ." auto
            "left screen right" minmax(var(--video-mobile-screen-size), 1fr)
            ". bottom ." auto
            / var(--video-mobile-edge-control-width)
            minmax(var(--video-mobile-screen-size), 1fr)
            var(--video-mobile-edge-control-width);
          gap: var(--studio-compact-gap);
        }

        .edge-control-top,
        .edge-control-bottom {
          grid-template-columns:
            minmax(0, 1fr)
            var(--video-mobile-horizontal-label-width);
        }

        .edge-control-top .parameter-label,
        .edge-control-bottom .parameter-label {
          grid-column: 1 / -1;
        }

        .edge-control-left,
        .edge-control-right {
          grid-template-rows:
            auto
            minmax(var(--video-mobile-vertical-slider-min-height), 1fr)
            auto;
        }
      }
    `]}};s([e({attribute:!1})],_.prototype,`content`,void 0),s([e({attribute:!1})],_.prototype,`settings`,void 0),s([e({attribute:!1})],_.prototype,`controls`,void 0),s([e({attribute:!1})],_.prototype,`applicability`,void 0),s([e({type:Boolean})],_.prototype,`disabled`,void 0),customElements.get(`govee-video-profile-editor`)||customElements.define(`govee-video-profile-editor`,_);export{_ as GoveeVideoProfileEditor};