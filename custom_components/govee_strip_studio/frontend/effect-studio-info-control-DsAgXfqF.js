import{$t as e,Qt as t,an as n,c as r,en as i,n as a,rn as o,tn as s}from"./effect-studio-core-DjubBMwf.js";import{i as c,r as l,t as u}from"./effect-studio-info-control-model-DlRcuhyW.js";var d=Object.defineProperty,f=((e,t)=>{let n={};for(var r in e)d(n,r,{get:e[r],enumerable:!0});return t||d(n,Symbol.toStringTag,{value:`Module`}),n})({GoveeInfoControl:()=>p}),p=class extends i{constructor(...e){super(...e),this.label=`More information`,this.text=``,this.variant=`info`,this.open=!1,this.scrollTargets=[],this.toggleFallback=()=>{this.open=!this.open,this.open?this.updateComplete.then(()=>this.startTracking()):this.stopTracking()},this.popoverToggled=e=>{this.open=e.newState===`open`,this.open?this.startTracking():this.stopTracking()},this.viewportChanged=()=>{let e=this.trigger;!e||!c(e.getBoundingClientRect(),this.viewportBounds())?this.closePopover():this.schedulePosition()}}disconnectedCallback(){this.stopTracking(),super.disconnectedCallback()}render(){let e=this.supportsNativePopover();return o`
      <button
        class="info-trigger"
        type="button"
        aria-label=${this.label}
        aria-controls="information"
        aria-expanded=${String(this.open)}
        title=${this.label}
        popovertarget=${e?`information`:s}
        @click=${e?s:this.toggleFallback}
      >
        ${this.variant===`error`?o`
              <svg
                class="error"
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7.5v6"></path>
                <circle class="info-dot" cx="12" cy="16.5" r="0.75"></circle>
              </svg>
            `:o`<span class="info-glyph" aria-hidden="true">${u}</span>`}
      </button>
      <div
        id="information"
        class="info-popover ${this.open?`fallback-open`:``}"
        popover=${e?`auto`:s}
        role="note"
        aria-label=${this.label}
        ?hidden=${!e&&!this.open}
        @toggle=${this.popoverToggled}
      >
        ${this.text}
        <slot name="actions"></slot>
      </div>
    `}supportsNativePopover(){return`showPopover`in HTMLElement.prototype}startTracking(){this.stopTracking();let e=this.trigger;if(e){this.scrollTargets=this.scrollAncestors(e);for(let e of this.scrollTargets)e.addEventListener(`scroll`,this.viewportChanged,{passive:!0});window.addEventListener(`resize`,this.viewportChanged,{passive:!0}),window.visualViewport?.addEventListener(`resize`,this.viewportChanged,{passive:!0}),window.visualViewport?.addEventListener(`scroll`,this.viewportChanged,{passive:!0}),`IntersectionObserver`in window&&(this.intersectionObserver=new IntersectionObserver(([e])=>{e?.isIntersecting||this.closePopover()},{threshold:0}),this.intersectionObserver.observe(e)),this.schedulePosition()}}stopTracking(){this.positionFrame!==void 0&&(cancelAnimationFrame(this.positionFrame),this.positionFrame=void 0);for(let e of this.scrollTargets)e.removeEventListener(`scroll`,this.viewportChanged);this.scrollTargets=[],window.removeEventListener(`resize`,this.viewportChanged),window.visualViewport?.removeEventListener(`resize`,this.viewportChanged),window.visualViewport?.removeEventListener(`scroll`,this.viewportChanged),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.popoverElement?.classList.remove(`positioned`)}schedulePosition(){this.positionFrame!==void 0&&cancelAnimationFrame(this.positionFrame),this.positionFrame=requestAnimationFrame(()=>{this.positionFrame=void 0,this.positionPopover()})}positionPopover(){let e=this.trigger,t=this.popoverElement;if(!e||!t||!this.open)return;let n=l(e.getBoundingClientRect(),t.getBoundingClientRect(),this.viewportBounds(),8,12);t.style.left=`${n.left}px`,t.style.top=`${n.top}px`,t.classList.add(`positioned`)}closePopover(){let e=this.popoverElement;this.supportsNativePopover()&&e?.matches(`:popover-open`)?e.hidePopover():this.open&&(this.open=!1,this.stopTracking())}viewportBounds(){let e=window.visualViewport;return{left:e?.offsetLeft??0,top:e?.offsetTop??0,width:e?.width??window.innerWidth,height:e?.height??window.innerHeight}}scrollAncestors(e){let t=new Set,n=e;for(;n;){if(n instanceof HTMLElement){let e=getComputedStyle(n);/(auto|scroll|overlay)/.test(`${e.overflow}${e.overflowX}${e.overflowY}`)&&t.add(n)}n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode}return t.add(window),[...t]}get trigger(){return this.shadowRoot?.querySelector(`.info-trigger`)??null}get popoverElement(){return this.shadowRoot?.querySelector(`.info-popover`)??null}static{this.styles=[r,n`
      :host {
        display: inline-flex;
        flex: 0 0 auto;
      }

      .info-trigger {
        display: inline-grid;
        width: var(--studio-info-control-size);
        min-height: var(--studio-info-control-size);
        padding: 0;
        place-items: center;
        border: var(--studio-border-width) solid var(--studio-border);
        border-radius: var(--studio-round-radius);
        color: var(--studio-muted);
        background: var(--studio-card);
        font-size: var(--studio-info-control-font-size);
        font-weight: var(--studio-font-weight-semibold);
        line-height: var(--studio-icon-line-height);
        cursor: help;
      }

      .info-trigger:hover,
      .info-trigger:focus-visible {
        color: var(--studio-blue);
        border-color: var(--studio-blue);
      }

      .info-trigger:has(svg.error) {
        color: var(--error-color, #db4437);
        border-color: var(--error-color, #db4437);
      }

      .info-trigger:focus-visible {
        outline: var(--studio-focus-width) solid var(--studio-blue);
        outline-offset: var(--studio-focus-offset);
      }

      svg {
        display: block;
        fill: none;
        stroke: currentcolor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1.75;
      }

      .info-glyph {
        display: block;
        line-height: 1;
      }

      .info-dot {
        fill: currentcolor;
        stroke: none;
      }

      .info-popover {
        position: fixed;
        inset: auto;
        width: min(
          var(--studio-info-popover-width),
          calc(100vw - var(--studio-dialog-viewport-gutter))
        );
        max-height: calc(100vh - var(--studio-dialog-viewport-gutter));
        margin: 0;
        padding: var(--studio-popover-padding);
        overflow: auto;
        border: var(--studio-border-width) solid var(--studio-border);
        border-radius: var(--studio-popover-radius);
        color: var(--primary-text-color);
        background: var(--studio-card);
        box-shadow: var(--studio-popover-shadow);
        font-size: var(--studio-parameter-label-size);
        line-height: var(--studio-muted-line-height);
        visibility: hidden;
      }

      .info-popover.positioned {
        visibility: visible;
      }

      .info-popover.fallback-open {
        z-index: var(--studio-z-popover);
      }

      ::slotted([slot="actions"]) {
        display: flex;
        flex-wrap: wrap;
        gap: var(--studio-action-gap);
        margin-top: var(--studio-control-gap);
      }

    `]}};a([e()],p.prototype,`label`,void 0),a([e()],p.prototype,`text`,void 0),a([e()],p.prototype,`variant`,void 0),a([t()],p.prototype,`open`,void 0),customElements.get(`govee-info-control`)||customElements.define(`govee-info-control`,p);export{f as t};