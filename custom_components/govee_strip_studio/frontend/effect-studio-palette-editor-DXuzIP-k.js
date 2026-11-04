import{$t as e,Jt as t,Qt as n,Rt as r,an as i,c as a,en as o,n as s,qt as c,r as l,rn as u,tn as d}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-colour-picker-DS3J7jxN.js";import{i as f,n as p}from"./effect-studio-info-control-model-DlRcuhyW.js";function m(e,t,n,r){return{listRole:e===`tab`?`tablist`:void 0,addAction:r?void 0:{label:t,disabled:n}}}function h(e,t,n,r,i){if(t!==`ArrowLeft`&&t!==`ArrowRight`)return;let a=e+(t===`ArrowLeft`?-1:1);if(!(a<0||a>=n))return r?i===`tab`?{kind:`select`,index:a,focusIndex:a}:void 0:{kind:`reorder`,from:e,to:a,focusIndex:a}}function g(e,t,n,r=10){let i=Math.abs(e),a=Math.abs(t);return Math.max(i,a)<r?`pending`:n||a>i?`cancel`:`reorder`}var _=class extends o{constructor(...e){super(...e),this.items=[],this.ariaLabel=`Items`,this.itemRole=`button`,this.addLabel=`Add item`,this.addDisabled=!1,this.addHidden=!1,this.reorderDisabled=!1,this.separateActions=!1,this.popoverDismissDisabled=!1,this.pointerX=0,this.pointerY=0,this.pointerMoved=!1,this.pointerTapCancelled=!1,this.suppressClick=!1,this.popoverTracking=!1,this.viewportResized=()=>{this.schedulePopoverPosition()},this.viewportScrolled=()=>{this.mobilePopover&&this.activeItem&&(f(this.activeItem.getBoundingClientRect(),this.viewportBounds())?this.schedulePopoverPosition():this.popoverDismissDisabled||this.dispatchEvent(new CustomEvent(`item-popover-dismissed`,{bubbles:!0,composed:!0})))}}connectedCallback(){super.connectedCallback(),window.addEventListener(`resize`,this.viewportResized,{passive:!0}),window.visualViewport?.addEventListener(`resize`,this.viewportResized,{passive:!0}),window.visualViewport?.addEventListener(`scroll`,this.viewportResized,{passive:!0})}disconnectedCallback(){this.stopPopoverTracking(),window.removeEventListener(`resize`,this.viewportResized),window.visualViewport?.removeEventListener(`resize`,this.viewportResized),window.visualViewport?.removeEventListener(`scroll`,this.viewportResized),super.disconnectedCallback()}updated(){this.popoverElement?(this.startPopoverTracking(),this.schedulePopoverPosition()):this.stopPopoverTracking()}render(){let e=m(this.itemRole,this.addLabel,this.addDisabled,this.addHidden),t=e.listRole===`tablist`;return u`
      <div class="strip ${this.separateActions?`separate-actions`:``}">
        <div class="strip-items">
          ${t?u`
                <div
                  class="item-list"
                  role="tablist"
                  aria-label=${this.ariaLabel}
                >
                  ${this.items.map((e,t)=>this.renderItemButton(e,t,!0))}
                </div>
              `:u`
                <ul class="item-list" aria-label=${this.ariaLabel}>
                  ${this.items.map((e,t)=>u`
                      <li class="item-container">
                        ${this.renderItemButton(e,t,!1)}
                        <slot name="item-${t}"></slot>
                      </li>
                    `)}
                </ul>
              `}
          ${e.addAction?u`
                <button
                  class="compact-action add"
                  type="button"
                  title=${e.addAction.label}
                  aria-label=${e.addAction.label}
                  ?disabled=${e.addAction.disabled}
                  @click=${this.addClicked}
                >
                  <span aria-hidden="true">+</span>
                </button>
              `:d}
        </div>
        <div class="strip-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `}renderItemButton(e,t,n){return u`
      <button
        id=${e.id??d}
        class="item item-wrapper ${e.colour?`colour`:`label`} ${t===this.activeIndex?`selected`:``} ${e.removeReady?`remove-ready`:``}"
        type="button"
        role=${n?`tab`:d}
        aria-label=${e.ariaLabel}
        aria-description=${e.ariaDescription??d}
        aria-selected=${n?String(t===this.activeIndex):d}
        aria-controls=${e.ariaControls??d}
        tabindex=${n?t===this.activeIndex?`0`:`-1`:d}
        data-item-index=${t}
        draggable=${this.reorderDisabled?`false`:`true`}
        style=${e.colour?`--item-colour: ${e.colour}`:d}
        ?disabled=${e.disabled}
        @click=${e=>this.itemClicked(t,e)}
        @keydown=${e=>this.keyPressed(t,e)}
        @dragstart=${e=>this.dragStarted(t,e)}
        @dragover=${e=>{this.reorderDisabled||e.preventDefault()}}
        @drop=${e=>this.dropped(t,e)}
        @pointerdown=${e=>this.pointerStarted(t,e)}
        @pointermove=${this.pointerMovedOver}
        @pointerup=${this.pointerCompleted}
        @pointercancel=${this.pointerCancelled}
      >
        ${e.colour?d:e.label}
      </button>
    `}focusItem(e){this.updateComplete.then(()=>{this.shadowRoot?.querySelectorAll(`.item`)[e]?.focus()})}startPopoverTracking(){this.popoverTracking||=(window.addEventListener(`scroll`,this.viewportScrolled,{capture:!0,passive:!0}),!0)}stopPopoverTracking(){this.positionFrame!==void 0&&(cancelAnimationFrame(this.positionFrame),this.positionFrame=void 0),this.popoverTracking&&=(window.removeEventListener(`scroll`,this.viewportScrolled,!0),!1)}schedulePopoverPosition(){this.positionFrame!==void 0&&cancelAnimationFrame(this.positionFrame),this.positionFrame=requestAnimationFrame(()=>{this.positionFrame=void 0,this.positionPopover()})}positionPopover(){let e=this.popoverElement,t=this.activeItem;if(!e||!t)return;if(!this.mobilePopover){this.resetPopoverPosition(e);return}e.classList.remove(`mobile-positioned`),e.style.left=`0`,e.style.top=`0`,e.style.maxHeight=`none`;let n=e.getBoundingClientRect(),r=e.scrollHeight+e.offsetHeight-e.clientHeight,i=p(t.getBoundingClientRect(),{width:n.width,height:Math.max(n.height,r)},this.viewportBounds(),8,12);e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`,e.classList.add(`mobile-positioned`)}resetPopoverPosition(e){e.classList.remove(`mobile-positioned`),e.style.removeProperty(`left`),e.style.removeProperty(`top`),e.style.removeProperty(`max-height`)}viewportBounds(){let e=window.visualViewport;return{left:e?.offsetLeft??0,top:e?.offsetTop??0,width:e?.width??window.innerWidth,height:e?.height??window.innerHeight}}get mobilePopover(){return window.matchMedia(`(max-width: 600px)`).matches}get activeItem(){if(this.activeIndex!==void 0)return this.shadowRoot?.querySelectorAll(`.item`)[this.activeIndex]}get popoverElement(){return this.querySelector(`.strip-popover`)}itemClicked(e,t){this.suppressClick&&t.detail!==0?this.suppressClick=!1:(this.suppressClick=!1,this.selectItem(e))}selectItem(e){this.dispatchEvent(new CustomEvent(`item-selected`,{detail:{index:e},bubbles:!0,composed:!0}))}addClicked(){this.dispatchEvent(new CustomEvent(`item-added`,{bubbles:!0,composed:!0}))}dragStarted(e,t){this.reorderDisabled||(this.draggedIndex=e,t.dataTransfer?.setData(`text/plain`,String(e)))}dropped(e,t){t.preventDefault(),this.draggedIndex!==void 0&&(this.reorder(this.draggedIndex,e),this.draggedIndex=void 0)}keyPressed(e,t){if(t.key!==`ArrowLeft`&&t.key!==`ArrowRight`)return;t.preventDefault();let n=h(e,t.key,this.items.length,this.reorderDisabled,this.itemRole);n&&(n.kind===`select`?(this.selectItem(n.index),this.focusItem(n.focusIndex)):this.reorder(n.from,n.to,!0))}pointerStarted(e,t){if(!t.isPrimary||this.pointerId!==void 0)return;this.suppressClick=!1;let n=t.currentTarget;n.draggable=t.pointerType===`mouse`&&!this.reorderDisabled,t.pointerType===`mouse`||t.target.closest(`.strip-popover`)||(this.pointerId=t.pointerId,this.pointerIndex=e,this.pointerTarget=n,this.pointerX=t.clientX,this.pointerY=t.clientY,this.pointerMoved=!1,this.pointerTapCancelled=!1)}pointerMovedOver(e){if(e.pointerId!==this.pointerId||this.pointerIndex===void 0)return;let t=e.clientX-this.pointerX,n=e.clientY-this.pointerY;if(!this.pointerMoved&&!this.pointerTapCancelled){let r=g(t,n,this.reorderDisabled);if(r===`pending`)return;if(r===`cancel`){this.pointerTapCancelled=!0;return}this.pointerMoved=!0,this.pointerTarget?.setPointerCapture(e.pointerId)}if(this.pointerTapCancelled)return;e.preventDefault();let r=this.shadowRoot?.elementFromPoint(e.clientX,e.clientY)?.closest(`[data-item-index]`),i=Number(r?.dataset.itemIndex);Number.isInteger(i)&&i!==this.pointerIndex&&(this.reorder(this.pointerIndex,i),this.pointerIndex=i)}pointerCompleted(e){if(e.pointerId!==this.pointerId)return;let t=this.pointerIndex,n=t!==void 0&&!this.pointerMoved&&!this.pointerTapCancelled;this.finishPointer(e),this.suppressClick=!0,n&&this.selectItem(t)}pointerCancelled(e){e.pointerId===this.pointerId&&(this.finishPointer(e),this.suppressClick=!0)}finishPointer(e){let t=this.pointerTarget;t?.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),this.pointerId=void 0,this.pointerIndex=void 0,this.pointerTarget=void 0,this.pointerMoved=!1,this.pointerTapCancelled=!1}reorder(e,t,n=!1){this.reorderDisabled||e===t||(this.dispatchEvent(new CustomEvent(`items-reordered`,{detail:{from:e,to:t},bubbles:!0,composed:!0})),n&&this.focusItem(t))}static{this.styles=[a,i`
    :host {
      --strip-label-min-width: 76px;
      --strip-popover-default-width: 280px;
      --strip-remove-icon-size: 26px;
      display: block;
    }

    .strip {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--studio-control-gap);
    }

    .strip-items,
    .item-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--studio-control-gap);
    }

    .strip-items {
      align-items: flex-start;
    }

    .item-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .strip-actions {
      display: flex;
      flex: 0 0 auto;
      gap: var(--studio-control-gap);
    }

    .strip.separate-actions .strip-actions {
      margin-inline-start: var(--studio-compact-gap);
      padding-inline-start: var(--studio-control-gap);
      border-inline-start: var(--studio-border-width) solid
        var(--studio-border);
    }

    .item-container,
    .item-wrapper {
      position: relative;
    }

    .item-wrapper {
      touch-action: pan-y;
    }

    .item-wrapper[draggable="true"] {
      cursor: grab;
    }

    .item {
      height: var(--studio-control-height);
      padding: 0;
      border-radius: var(--studio-control-radius);
      cursor: pointer;
    }

    .compact-action,
    ::slotted(.compact-action) {
      width: var(--studio-compact-action-size);
      height: var(--studio-compact-action-size);
      min-height: var(--studio-compact-action-size);
      padding: 0;
      border-radius: var(--studio-control-radius);
      cursor: pointer;
    }

    .item {
      border: var(--studio-border-width) solid rgb(0 0 0 / 14%);
    }

    .item.colour {
      width: var(--studio-control-height);
    }

    .item.colour {
      background: var(--item-colour);
    }

    .item.label {
      min-width: var(--strip-label-min-width);
      padding: 0 var(--studio-spacing-xl);
      color: var(--primary-text-color);
      background: var(--studio-card);
      font-weight: var(--studio-font-weight-semibold);
    }

    .item.label.selected {
      color: var(--studio-blue);
      border-color: var(--studio-blue);
      background: var(--studio-blue-soft);
    }

    .item.remove-ready {
      position: relative;
      outline: var(--studio-strong-border-width) solid
        rgb(255 255 255 / 95%);
      outline-offset: calc(0px - var(--studio-micro-gap));
    }

    .item.remove-ready::after {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: #fff;
      font-size: var(--strip-remove-icon-size);
      font-weight: var(--studio-font-weight-medium);
      text-shadow: 0 var(--studio-border-width) var(--studio-micro-gap)
        rgb(0 0 0 / 80%);
      content: "×";
      pointer-events: none;
    }

    .compact-action,
    ::slotted(.compact-action) {
      display: grid;
      place-items: center;
      border: var(--studio-border-width) solid var(--studio-border);
      background: var(--studio-card);
      font-size: var(--studio-action-glyph-size);
      font-weight: var(--studio-font-weight-semibold);
      line-height: 0;
    }

    .compact-action > span {
      display: inline-grid;
      width: var(--studio-icon-size);
      height: var(--studio-icon-size);
      place-items: center;
      line-height: 0;
    }

    .add {
      color: var(--studio-blue);
    }

    ::slotted(.compact-action) {
      color: var(--primary-text-color);
    }

    ::slotted(.compact-action.danger-action) {
      border-color: var(--studio-danger);
      color: var(--text-primary-color, #fff);
      background: var(--studio-danger);
      font-size: var(--strip-remove-icon-size);
      font-weight: var(--studio-font-weight-medium);
      line-height: var(--studio-icon-line-height);
    }

    ::slotted(.compact-action.danger-action:hover),
    ::slotted(.compact-action.danger-action:focus-visible) {
      border-color: var(--studio-danger);
      background: color-mix(in srgb, var(--studio-danger) 84%, #000);
    }

    .item:focus-visible,
    .compact-action:focus-visible,
    ::slotted(.compact-action:focus-visible) {
      outline: var(--studio-focus-width) solid var(--studio-blue);
      outline-offset: var(--studio-focus-offset);
    }

    ::slotted(.strip-popover) {
      position: absolute;
      z-index: var(--studio-z-popover);
      top: calc(var(--studio-control-height) + var(--studio-compact-gap));
      left: 0;
      width: min(
        var(--strip-popover-width, var(--strip-popover-default-width)),
        calc(100vw - var(--studio-dialog-viewport-gutter))
      );
      padding: var(--studio-popover-padding);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-popover-radius);
      background: var(--studio-card);
      box-shadow: var(--studio-popover-shadow);
    }

    /* Promotes popovers to viewport overlays on phones to avoid clipping. */
    @media (max-width: 600px) {
      .strip.separate-actions {
        flex-direction: column;
      }

      .strip.separate-actions .strip-actions {
        margin-block-start: var(--studio-compact-gap);
        margin-inline-start: 0;
        padding-block-start: var(--studio-control-gap);
        padding-inline-start: 0;
        border-block-start: var(--studio-border-width) solid
          var(--studio-border);
        border-inline-start: 0;
      }

      ::slotted(.strip-popover) {
        position: fixed;
        top: 0;
        right: auto;
        left: 0;
        width: min(
          var(--strip-popover-width, var(--strip-popover-default-width)),
          calc(100vw - var(--studio-dialog-viewport-gutter))
        );
        overflow: auto;
        visibility: hidden;
        transform: none;
      }

      ::slotted(.strip-popover.mobile-positioned) {
        visibility: visible;
      }
    }
  `]}};s([e({attribute:!1})],_.prototype,`items`,void 0),s([e({attribute:!1})],_.prototype,`activeIndex`,void 0),s([e()],_.prototype,`ariaLabel`,void 0),s([e()],_.prototype,`itemRole`,void 0),s([e()],_.prototype,`addLabel`,void 0),s([e({type:Boolean})],_.prototype,`addDisabled`,void 0),s([e({type:Boolean})],_.prototype,`addHidden`,void 0),s([e({type:Boolean})],_.prototype,`reorderDisabled`,void 0),s([e({type:Boolean})],_.prototype,`separateActions`,void 0),s([e({type:Boolean})],_.prototype,`popoverDismissDisabled`,void 0),customElements.get(`govee-reorderable-strip`)||customElements.define(`govee-reorderable-strip`,_);var v=class extends o{constructor(...e){super(...e),this.palette=[],this.minColours=1,this.maxColours=8,this.disabled=!1,this.persistentPicker=!1,this.ariaLabel=`Colours`,this.itemName=`colour`,this.colourInteractionActive=!1,this.windowPointerDown=e=>{this.editingIndex!==void 0&&!e.composedPath().includes(this)&&!this.colourInteractionActive&&this.closePicker()},this.dismissPicker=()=>{this.colourInteractionActive||this.closePicker()}}connectedCallback(){super.connectedCallback(),window.addEventListener(`pointerdown`,this.windowPointerDown)}disconnectedCallback(){window.removeEventListener(`pointerdown`,this.windowPointerDown),super.disconnectedCallback()}willUpdate(e){e.has(`palette`)&&this.editingIndex!==void 0&&this.editingIndex>=this.palette.length&&this.closePicker()}render(){let e=this.persistentPicker?this.selectedIndex:this.editingIndex,n=this.palette.map((e,n)=>({key:`${n}-${t(e)}`,label:`${y(this.itemName)} ${n+1}`,ariaLabel:this.itemAriaLabel(e,n),colour:t(e),removeReady:!this.persistentPicker&&this.editingIndex===n&&this.palette.length>this.minColours,disabled:this.disabled}));return u`
      <govee-reorderable-strip
        .items=${n}
        .activeIndex=${e}
        .itemRole=${this.persistentPicker?`tab`:`button`}
        .ariaLabel=${this.ariaLabel}
        .addLabel=${`Add ${this.itemName}`}
        .addDisabled=${this.disabled}
        .addHidden=${this.palette.length>=this.maxColours}
        .reorderDisabled=${this.disabled||this.persistentPicker}
        .popoverDismissDisabled=${this.colourInteractionActive}
        @item-selected=${e=>this.swatchClicked(e.detail.index)}
        @items-reordered=${e=>this.reorder(e.detail.from,e.detail.to)}
        @item-added=${this.addColour}
        @item-popover-dismissed=${this.dismissPicker}
        @keydown=${this.paletteKeyPressed}
        @focusout=${this.paletteFocusOut}
      >
        ${this.persistentPicker||this.editingIndex===void 0?d:u`
              <div
                slot="item-${this.editingIndex}"
                class="strip-popover colour-popover"
                role="dialog"
                aria-label="Edit colour"
              >
                ${this.renderPicker(this.editingIndex,this.palette[this.editingIndex])}
              </div>
            `}
      </govee-reorderable-strip>
      ${this.persistentPicker&&e!==void 0?u`
            <div
              class="persistent-picker"
              role="group"
              aria-label="Edit ${this.itemName} ${e+1}"
            >
              ${this.renderPicker(e,this.palette[e])}
            </div>
          `:d}
    `}itemAriaLabel(e,n){let r=`${y(this.itemName)} ${n+1}`;return this.persistentPicker?`${r}, ${t(e)}${n===this.selectedIndex?`, selected`:``}`:this.editingIndex===n&&this.palette.length>this.minColours?`Remove colour ${n+1}`:`Edit colour ${n+1}, ${t(e)}. Drag to reorder or use arrow keys.`}renderPicker(e,t){return u`
      <govee-colour-picker
        .colour=${t}
        .disabled=${this.disabled}
        @colour-changing=${t=>{this.colourInteractionActive=!0,this.updateColour(e,t.detail.colour,`changing`)}}
        @colour-changed=${t=>this.commitColour(e,t.detail.colour)}
      ></govee-colour-picker>
    `}commitColour(e,t){this.colourInteractionActive=!1,this.updateColour(e,t,`committed`),this.persistentPicker||(this.closePicker(),this.focusSwatchAfterUpdate(e))}updateColour(e,t,n){let i=r(this.palette);i[e]=[...t],this.emitPalette(i,n)}addColour(){if(this.disabled||this.palette.length>=this.maxColours)return;let e=this.palette[this.palette.length-1]??l(this.palette.length),t=[...r(this.palette),[...e]],n=t.length-1;this.persistentPicker?this.selectColour(n,t[n]):(this.editingIndex=n,this.focusPickerAfterUpdate()),this.emitPalette(t,`committed`)}removeColour(e){if(this.disabled||this.palette.length<=this.minColours)return;let t=this.palette.filter((t,n)=>n!==e).map(e=>[...e]),n=Math.min(e,t.length-1);this.closePicker(),this.emitPalette(t,`committed`),this.focusSwatchAfterUpdate(n)}reorder(e,t){if(this.disabled||e===t)return;let n=r(this.palette),[i]=n.splice(e,1);if(n.splice(t,0,i),this.editingIndex=this.editingIndex===e?t:c(this.editingIndex,e,t),this.persistentPicker){let r=c(this.selectedIndex,e,t);r!==void 0&&this.selectColour(r,n[r])}this.emitPalette(n,`committed`)}focusSwatchAfterUpdate(e){this.updateComplete.then(()=>{this.shadowRoot?.querySelector(`govee-reorderable-strip`)?.focusItem(e)})}paletteKeyPressed(e){let t=this.editingIndex;e.key===`Escape`&&t!==void 0&&(e.preventDefault(),e.stopPropagation(),this.closePicker(),this.focusSwatchAfterUpdate(t))}paletteFocusOut(e){let t=e.currentTarget;if(this.editingIndex!==void 0&&e.relatedTarget instanceof Node&&!t.contains(e.relatedTarget)){if(this.colourInteractionActive)return;this.closePicker()}}closePicker(){this.colourInteractionActive=!1,this.editingIndex=void 0}swatchClicked(e){this.persistentPicker?this.selectColour(e,this.palette[e]):this.editingIndex===e&&this.palette.length>this.minColours?this.removeColour(e):this.editingIndex===e?this.closePicker():(this.editingIndex=e,this.focusPickerAfterUpdate())}focusPickerAfterUpdate(){this.updateComplete.then(()=>{requestAnimationFrame(()=>{(this.shadowRoot?.querySelector(`.colour-popover govee-colour-picker`))?.shadowRoot?.querySelector(`button:not(:disabled), input:not(:disabled)`)?.focus()})})}selectColour(e,t){this.selectedIndex=e,this.dispatchEvent(new CustomEvent(`colour-selected`,{detail:{index:e,colour:[...t]},bubbles:!0,composed:!0}))}emitPalette(e,t){this.palette=e,this.dispatchEvent(new CustomEvent(`palette-changed`,{detail:{palette:e,interaction:t},bubbles:!0,composed:!0}))}static{this.styles=[a,i`
    :host {
      display: block;
    }

    .persistent-picker {
      margin-top: var(--studio-section-gap);
      padding-top: var(--studio-section-gap);
      border-top: var(--studio-border-width) solid var(--studio-border);
    }
  `]}};s([e({attribute:!1})],v.prototype,`palette`,void 0),s([e({type:Number})],v.prototype,`minColours`,void 0),s([e({type:Number})],v.prototype,`maxColours`,void 0),s([e({type:Boolean})],v.prototype,`disabled`,void 0),s([e({type:Boolean})],v.prototype,`persistentPicker`,void 0),s([e({type:Number})],v.prototype,`selectedIndex`,void 0),s([e()],v.prototype,`ariaLabel`,void 0),s([e()],v.prototype,`itemName`,void 0),s([n()],v.prototype,`editingIndex`,void 0),s([n()],v.prototype,`colourInteractionActive`,void 0);function y(e){return e.charAt(0).toUpperCase()+e.slice(1)}customElements.get(`govee-palette-editor`)||customElements.define(`govee-palette-editor`,v);