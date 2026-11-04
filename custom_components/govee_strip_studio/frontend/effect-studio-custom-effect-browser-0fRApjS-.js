import{$t as e,G as t,K as n,Yt as r,an as i,c as a,en as o,f as s,m as c,n as l,q as u,rn as d,tn as f}from"./effect-studio-core-DjubBMwf.js";var p=class extends o{constructor(...e){super(...e),this.category=`single-layer`,this.newSelected=!1,this.isAdmin=!1}updated(e){let t=this.selectionIdentity;t?(t!==this.lastSelectionIdentity||e.has(`category`)||e.has(`context`))&&r(this.shadowRoot?.querySelector(`.item-sidebar`)??null)&&(this.lastSelectionIdentity=t):this.lastSelectionIdentity=void 0}render(){let e=this.context;if(!e)return f;let r=n(e,this.category),i=this.category===`music`&&!!e.catalogue?.music_modes.length||u(e,this.category)!==void 0;return d`
      <aside
        class="sidebar item-sidebar library"
        aria-label=${t(this.category)}
      >
        ${i?d`
              <button
                class="selector item new-effect-action ${this.newSelected?`selected`:``}"
                type="button"
                aria-pressed=${String(this.newSelected)}
                ?disabled=${!this.isAdmin}
                @click=${this.requestNew}
              >
                <span
                  ><span class="new-effect-icon" aria-hidden="true"></span
                  >New</span
                >
              </button>
            `:f}
        ${r.map(e=>this.entryButton(e))}
      </aside>
    `}get selectionIdentity(){return this.newSelected?`new`:this.currentItemId?`saved:${this.currentItemId}`:this.templateSelection}entryButton(e){let t=e.kind===`saved`?this.currentItemId===e.item.id:this.currentItemId===void 0&&this.templateSelection===e.key;return d`
      <button
        class="selector item ${t?`selected`:``}"
        type="button"
        aria-pressed=${String(t)}
        ?disabled=${e.kind!==`saved`&&!this.isAdmin}
        @click=${t=>{this.dispatchEvent(new CustomEvent(`custom-entry-requested`,{detail:{entry:e,returnFocus:t.currentTarget},bubbles:!0,composed:!0}))}}
      >
        <span>${e.label}</span>
        ${e.kind===`saved`?d`
              <span
                class="user-effect-marker"
                title="User-created effect"
                aria-label="User-created effect"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4Z"></path>
                </svg>
              </span>
            `:f}
      </button>
    `}requestNew(e){this.dispatchEvent(new CustomEvent(`custom-new-requested`,{detail:{category:this.category,returnFocus:e.currentTarget},bubbles:!0,composed:!0}))}static{this.styles=[a,s,c,i`
      :host {
        --new-effect-stroke-width: 1.5px;
        display: contents;
      }

      .new-effect-action {
        color: var(--studio-blue);
      }

      .new-effect-icon {
        display: inline-block;
        width: var(--studio-spacing-lg);
        height: var(--studio-spacing-lg);
        margin-inline-end: var(--studio-compact-gap);
        background:
          linear-gradient(currentColor, currentColor) center /
            var(--studio-spacing-lg) var(--new-effect-stroke-width) no-repeat,
          linear-gradient(currentColor, currentColor) center /
            var(--new-effect-stroke-width) var(--studio-spacing-lg) no-repeat;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--studio-compact-gap);
      }

      .user-effect-marker {
        display: inline-grid;
        width: var(--studio-icon-size);
        height: var(--studio-icon-size);
        flex: 0 0 var(--studio-icon-size);
        place-items: center;
        color: var(--studio-muted);
      }

      .user-effect-marker svg {
        width: var(--studio-small-swatch-size);
        height: var(--studio-small-swatch-size);
        fill: currentColor;
      }

      /* Places effects above the editor beside HA's docked sidebar. */
      @media (min-width: 901px) and (max-width: 1320px) {
        .library {
          grid-row: 1;
          grid-column: 2;
          max-height: var(--studio-stacked-list-max-height);
          border-inline-end: 0;
          border-bottom: var(--studio-border-width) solid var(--studio-border);
        }
      }

      /* The panel owns document-flow placement below this width. */
      @media (max-width: 900px) {
        :host {
          display: block;
        }
      }
    `]}};l([e({attribute:!1})],p.prototype,`context`,void 0),l([e()],p.prototype,`category`,void 0),l([e()],p.prototype,`currentItemId`,void 0),l([e()],p.prototype,`templateSelection`,void 0),l([e({type:Boolean})],p.prototype,`newSelected`,void 0),l([e({type:Boolean})],p.prototype,`isAdmin`,void 0),customElements.get(`govee-custom-effect-browser`)||customElements.define(`govee-custom-effect-browser`,p);export{p as GoveeCustomEffectBrowser};