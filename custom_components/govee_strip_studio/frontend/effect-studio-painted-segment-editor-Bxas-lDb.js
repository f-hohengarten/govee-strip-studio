import{$t as e,Jt as t,an as n,c as r,en as i,l as a,n as o,rn as s}from"./effect-studio-core-DjubBMwf.js";var c=class extends i{constructor(...e){super(...e),this.segments=[],this.background=[0,0,0],this.physical=!1,this.disabled=!1}render(){return s`
      <section class="card" aria-labelledby="painted-segments-heading">
        <h3 class="section-title" id="painted-segments-heading">
          ${this.physical?`Physical ICs`:`Painted segments`}
        </h3>
        <div class="segments">
          ${this.segments.map((e,n)=>{let r=e===null,i=t(r?this.background:e);return s`
              <button
                type="button"
                data-segment=${n}
                class=${r?`off`:``}
                style="--segment-colour: ${i}"
                aria-label=${r?`${this.physical?`IC`:`Segment`} ${n+1}, ${this.emptyLabel??(this.physical?`background`:`off`)}`:`${this.physical?`IC`:`Segment`} ${n+1}, ${i}`}
                ?disabled=${this.disabled}
                @pointerdown=${e=>this.pointerStarted(n,e)}
                @pointermove=${this.pointerMoved}
                @pointerup=${this.pointerCompleted}
                @pointercancel=${this.pointerCancelled}
                @click=${e=>this.segmentClicked(n,e)}
              ></button>
            `})}
        </div>
      </section>
    `}pointerStarted(e,t){if(this.disabled||!t.isPrimary||this.paintingPointerId!==void 0||t.button!==0&&t.pointerType!==`touch`)return;t.preventDefault();let n=t.currentTarget;this.paintingPointerId=t.pointerId,this.paintingPointerTarget=n,this.lastPaintedSegment=e,n.setPointerCapture(t.pointerId),this.selectSegment(e,`changing`)}pointerMoved(e){if(e.pointerId!==this.paintingPointerId||!this.shadowRoot)return;let t=this.shadowRoot.elementFromPoint(e.clientX,e.clientY)?.closest(`[data-segment]`),n=Number(t?.dataset.segment);Number.isInteger(n)&&n!==this.lastPaintedSegment&&(this.lastPaintedSegment=n,this.selectSegment(n,`changing`))}pointerCompleted(e){if(e.pointerId!==this.paintingPointerId)return;let t=this.lastPaintedSegment;this.finishPointer(e),t!==void 0&&this.selectSegment(t,`committed`)}pointerCancelled(e){if(e.pointerId!==this.paintingPointerId)return;let t=this.lastPaintedSegment;this.finishPointer(e),t!==void 0&&this.selectSegment(t,`committed`)}finishPointer(e){this.paintingPointerTarget?.hasPointerCapture(e.pointerId)&&this.paintingPointerTarget.releasePointerCapture(e.pointerId),this.paintingPointerId=void 0,this.paintingPointerTarget=void 0,this.lastPaintedSegment=void 0}segmentClicked(e,t){!this.disabled&&t.detail===0&&this.selectSegment(e,`committed`)}selectSegment(e,t){this.dispatchEvent(new CustomEvent(`segment-selected`,{detail:{index:e,interaction:t},bubbles:!0,composed:!0}))}static{this.styles=[r,a,n`
    :host {
      display: block;
    }

    .segments {
      display: grid;
      grid-template-columns: repeat(15, minmax(0, 1fr));
      gap: var(--studio-micro-gap);
      touch-action: none;
    }

    button {
      min-width: 0;
      min-height: var(--studio-paint-segment-height);
      padding: 0;
      border: var(--studio-border-width) solid
        color-mix(in srgb, var(--segment-colour) 70%, #000);
      border-radius: var(--studio-swatch-radius);
      background: var(--segment-colour);
      cursor: crosshair;
    }

    button:focus-visible {
      outline: var(--studio-focus-width) solid var(--studio-blue);
      outline-offset: var(--studio-focus-offset);
    }

    button.off {
      border-color: color-mix(in srgb, #000 70%, var(--studio-border));
      box-shadow: inset 0 0 0 var(--studio-border-width)
        rgb(255 255 255 / 12%);
    }

    /* Three rows of five segments preserve paint targets on phones. */
    @media (max-width: 600px) {
      .segments {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }
  `]}};o([e({attribute:!1})],c.prototype,`segments`,void 0),o([e({attribute:!1})],c.prototype,`background`,void 0),o([e({type:Boolean})],c.prototype,`physical`,void 0),o([e({attribute:!1})],c.prototype,`emptyLabel`,void 0),o([e({type:Boolean})],c.prototype,`disabled`,void 0),customElements.get(`govee-painted-segment-editor`)||customElements.define(`govee-painted-segment-editor`,c);export{c as GoveePaintedSegmentEditor};