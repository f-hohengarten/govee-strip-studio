const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./effect-studio-custom-effect-browser-0fRApjS-.js","./effect-studio-core-DjubBMwf.js","./effect-studio-info-control-DsAgXfqF.js","./effect-studio-info-control-model-DlRcuhyW.js","./effect-studio-scene-browser-CrZ7pjlT.js","./effect-studio-segmented-control-CUN174gm.js","./effect-studio-video-profile-editor--s9ovAzJ.js","./effect-studio-checkbox-control-BRcbJ2Y-.js","./effect-studio-slider-control-B2Yw9Nvi.js","./effect-studio-music-profile-editor-CapppEhp.js","./effect-studio-palette-editor-DXuzIP-k.js","./effect-studio-colour-picker-DS3J7jxN.js","./effect-studio-single-colour-field-DV9xNfiD.js","./effect-studio-advanced-effect-editor-DBPhzen-.js","./effect-studio-painted-segment-editor-Bxas-lDb.js","./effect-studio-custom-effect-editor-BaDohj1I.js"])))=>i.map(i=>d[i]);
import{$t as e,Bt as t,Gt as n,H as r,J as i,Kt as a,Lt as o,Pt as s,Qt as c,Ut as l,V as u,W as d,X as f,Xt as p,Y as m,Yt as h,Z as g,Zt as _,_ as v,a as y,en as b,g as x,h as S,n as C,o as w,rn as T,t as E,tn as D,v as O,y as k}from"./effect-studio-core-DjubBMwf.js";var A=`govee_strip_studio/effect_studio/hidden_feedback`,j={shell:()=>Promise.all([E(()=>import(`./effect-studio-custom-effect-browser-0fRApjS-.js`),__vite__mapDeps([0,1]),import.meta.url),E(()=>import(`./effect-studio-info-control-DsAgXfqF.js`).then(e=>e.t),__vite__mapDeps([2,1,3]),import.meta.url)]),scenes:()=>E(()=>import(`./effect-studio-scene-browser-CrZ7pjlT.js`),__vite__mapDeps([4,1,5]),import.meta.url),video:()=>E(()=>import(`./effect-studio-video-profile-editor--s9ovAzJ.js`),__vite__mapDeps([6,1,7,8]),import.meta.url),music:()=>E(()=>import(`./effect-studio-music-profile-editor-CapppEhp.js`),__vite__mapDeps([9,1,7,2,3,10,11,12,8]),import.meta.url),advanced:()=>E(()=>import(`./effect-studio-advanced-effect-editor-DBPhzen-.js`),__vite__mapDeps([13,1,2,3,10,11,7,5,8]),import.meta.url),painted:()=>Promise.all([E(()=>import(`./effect-studio-painted-segment-editor-Bxas-lDb.js`),__vite__mapDeps([14,1]),import.meta.url),E(()=>import(`./effect-studio-single-colour-field-DV9xNfiD.js`),__vite__mapDeps([12,1,11]),import.meta.url),E(()=>import(`./effect-studio-slider-control-B2Yw9Nvi.js`),__vite__mapDeps([8,1]),import.meta.url)]),custom:()=>E(()=>import(`./effect-studio-custom-effect-editor-BaDohj1I.js`),__vite__mapDeps([15,1,7,10,11,3,8,14,12]),import.meta.url)},M=class extends b{constructor(){super(),this.narrow=!1,this.modelRevision=0,this.staticPalette=[],this.staticScale=100,this.staticApplying=!1,this.model=new x(()=>{this.loadComponentsForCurrentView(),this.syncUnloadProtection(),this.modelRevision+=1}),this.preview=new S(this.model),this.modal=new v(this.model,{updateComplete:()=>this.updateComplete,root:()=>this.shadowRoot,canMutate:()=>this.controller?.api!==void 0}),this.requestedComponentGroups=new Set,this.unloadListenerRegistered=!1,this.redispatchingNavigation=!1,this.keyDown=e=>{if(!(e.defaultPrevented||e.repeat||e.isComposing||e.key.toLocaleLowerCase()!==`s`||!e.ctrlKey&&!e.metaKey||this.modal.open)){if(e.shiftKey){if(this.section===`scenes`&&!this.model.sceneEditorOpen||!this.model.editorAction(`saveAs`)?.enabled)return;e.preventDefault();let t=this.model.name.trim()||this.catalogueSourceLabel||`Effect`;this.modal.requestSaveAs(this,`${t} copy`)}else if(this.section===`scenes`){if(this.model.sceneEditorOpen){if(!this.model.canSaveCurrentDraft||this.model.saving||this.model.deletingCurrentItem)return;e.preventDefault(),this.controller.cancelPendingAutoSave(),this.modal.requestSave(()=>void this.controller.save());return}(this.shadowRoot?.querySelector(`govee-scene-browser`))?.invokeSaveShortcut?.()&&e.preventDefault()}else this.model.editorAction(`save`)?.enabled&&(e.preventDefault(),this.controller.cancelPendingAutoSave(),this.modal.requestSave(()=>void this.controller.save()))}},this.sceneInitialSelectionOpened=()=>{this.controller.sceneInitialSelectionOpened()},this.sceneInitialSelectionFailed=()=>{this.controller.sceneInitialSelectionFailed()},this.navigationClick=e=>{if(this.redispatchingNavigation||!this.controller.unloadProtectionRequired||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;let t=e.composedPath().find(e=>e instanceof HTMLAnchorElement&&e.href!==``&&e.target!==`_blank`&&!e.hasAttribute(`download`));t&&t.href!==window.location.href&&(e.preventDefault(),e.stopImmediatePropagation(),this.controller.requestTransition(()=>{this.redispatchingNavigation=!0;try{t.click()}finally{this.redispatchingNavigation=!1}},t))},this.beforeUnload=e=>{e.preventDefault(),e.returnValue=``},this.editor=new O(this.model,this.preview,this.modal,{apiReady:()=>this.controller?.api!==void 0,selectItem:e=>void this.controller.selectItem(e),editorTransitionStarted:()=>this.controller?.cancelPendingAutoSave(),contentCommitted:e=>this.controller?.contentCommitted(e),selectCatalogueTemplate:(e,t,n)=>void this.controller?.selectCatalogueTemplate(e,t,n)}),this.controller=new k(this.model,this.editor,this.preview,this.modal,{connected:()=>this.isConnected,pathname:()=>window.location.pathname,replacePath:e=>{window.history.replaceState(window.history.state,``,e)},saveSceneWork:()=>this.shadowRoot?.querySelector(`govee-scene-browser`)?.savePendingWork()??Promise.resolve(!1)})}get section(){return this.model.section}get catalogueSourceLabel(){return this.model.catalogueSourceLabel}get editorSource(){return this.model.editorSource}get currentItem(){return this.model.currentItem}get content(){return this.model.content}get isAdmin(){return this.hass?.user?.is_admin===!0}get editorReadOnly(){return this.model.editorReadOnly}get editorDisabled(){return this.editorReadOnly||this.model.saving}get canMutate(){return this.isAdmin&&!this.model.stateUpdatesUnavailable}connectedCallback(){super.connectedCallback(),this.restoreFeedbackVisibility(),this.addEventListener(`keydown`,this.keyDown),window.addEventListener(`click`,this.navigationClick,!0),this.syncUnloadProtection(),this.loadComponentsForCurrentView(),this.model.syncAdmin(this.hass),this.hass&&!this.controller.api&&this.controller.load(this.hass,this.isAdmin)}disconnectedCallback(){this.removeEventListener(`keydown`,this.keyDown),window.removeEventListener(`click`,this.navigationClick,!0),this.setUnloadListener(!1),this.modal.releaseScrollLock(),super.disconnectedCallback(),this.editor.beginTransition(),this.controller.disconnect()}shouldUpdate(e){return e.size!==1||!e.has(`hass`)||l(this.hass,e.get(`hass`),a(this.model.selectedDevice))}updated(e){if(e.has(`hass`)&&this.model.syncAdmin(this.hass),e.has(`hass`)&&this.hass&&!this.controller.api&&this.controller.load(this.hass,this.isAdmin),e.has(`modelRevision`)){let e=this.model.selectedDevice;this.staticDeviceId!==void 0&&e&&(this.staticDeviceId!==e.config_entry_id||this.staticPalette.length!==e.segment_count)&&(this.staticDeviceId=e.config_entry_id,this.staticPalette=Array.from({length:e.segment_count},()=>null),this.staticScale=100),this.modal.syncScrollLock(),this.syncSingleEffectSelects(),this.syncVideoSelectionVisibility()}}loadComponentsForCurrentView(){if(this.requestComponentGroup(`shell`),this.model.section===`scenes`&&this.requestComponentGroup(`scenes`),this.model.section===`video`&&this.requestComponentGroup(`video`),this.model.editorOwnedByActiveView)switch(this.model.content.kind){case`advanced`:case`scene_layered`:case`workshop`:this.requestComponentGroup(`advanced`);break;case`h617a_painted`:this.requestComponentGroup(`painted`);break;case`h617a_single`:case`h617a_multi`:case`h6179_single_diy`:case`h6179_mixed_diy`:case`palette_diy`:case`native_effect`:this.requestComponentGroup(`custom`);break;case`music_profile`:this.requestComponentGroup(`music`);break;case`video_profile`:this.requestComponentGroup(`video`)}}requestComponentGroup(e){this.requestedComponentGroups.has(e)||(this.requestedComponentGroups.add(e),j[e]().catch(t=>{console.error(`Effect Studio could not load the ${e} controls.`,t),this.modal.showError(`Effect Studio could not load all controls. Reload the page to try again.`,{title:`Controls unavailable`,key:`component-load:${e}`})}))}render(){return this.model.loading?T`
        ${this.renderHomeAssistantHeader()}
        <div class="centred" role="status">Loading effect studio...</div>
      `:this.model.error?T`
        ${this.renderHomeAssistantHeader()}
        ${this.renderFatalError()}
      `:T`
      <div class="panel-content" ?inert=${this.modal.open}>
        ${this.renderHomeAssistantHeader()}
        <h1 class="visually-hidden">Effect Studio</h1>

        ${this.renderStudioToolbar()}
        ${this.model.showFeedbackNotice?T`
              <p class="support-notice" role="note">
                <span title="Experimental support"><strong>Experimental</strong></span>
                ${this.model.selectedDevice?.confirmation_issue?T`<button
                      class="secondary"
                      type="button"
                      @click=${e=>this.modal.requestFeedback(e.currentTarget)}
                    >Feedback</button>`:D}
                <button
                  class="secondary"
                  type="button"
                  aria-label="Hide feedback for this session"
                  title="Hide until this tab or app view closes"
                  @click=${()=>this.hideFeedbackNotice()}
                >Hide</button>
              </p>
            `:D}

        ${this.model.selectedDevice?this.model.selectedDevice.effect_categories.length?this.renderStudio():this.renderNoEffectCategories():this.renderMissingDevice()}
      </div>
      ${this.model.saveNameDialogOpen?this.renderSaveNameDialog():D}
      ${this.model.deleteCandidate?this.renderDeleteConfirmation():D}
      ${this.model.pendingTransitionDialog?this.renderPendingTransitionDialog():D}
      ${this.model.modalState?.kind===`overwrite`?this.renderOverwriteDialog():D}
      ${this.model.modalState?.kind===`error`?this.renderErrorDialog():D}
      ${this.model.modalState?.kind===`feedback`?this.renderFeedbackDialog():D}
    `}renderHomeAssistantHeader(){return p(this.narrow,this.hass?.dockedSidebar,this.hass?.kioskMode)?T`
      <header class="home-assistant-header">
        <button
          class="home-assistant-menu"
          type="button"
          aria-label="Open Home Assistant navigation"
          @click=${this.toggleHomeAssistantMenu}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>
        <span>Effect Studio (Experte)</span>
      </header>
    `:D}toggleHomeAssistantMenu(){this.dispatchEvent(new CustomEvent(`hass-toggle-menu`,{bubbles:!0,composed:!0}))}renderStudio(){return T`
      <main
        class="studio ${this.section}-mode"
      >
        <nav class="primary-nav" aria-label="Create">
          ${u(this.model.scenesAvailable,this.model.videoAvailable,this.model.customEffectsAvailable?d(this.model.customEffectListContext).filter(({category:e})=>this.model.customEffectCategoryAvailable(e)):[]).map(e=>this.navButton(e))}
        </nav>

        <govee-scene-browser
          ?hidden=${this.section!==`scenes`}
          .externalEditActive=${this.model.sceneEditorOpen}
          .editorTransitionEpoch=${this.model.editorTransitionEpoch}
          .api=${this.controller.api}
          .device=${this.model.selectedDevice}
          .library=${this.model.library}
          .previewStatus=${this.model.previewStatus}
          .stateUpdatesAvailable=${!this.model.stateUpdatesUnavailable}
          .isAdmin=${this.canMutate}
          .autoSaveEnabled=${this.model.autoSaveEnabled}
          .autoSaveFailed=${this.model.autoSaveFailed}
          .liveApplyEnabled=${this.model.liveApplyEnabled}
          .savedSceneSelection=${this.model.savedSceneSelection}
          .initialSelection=${this.model.sceneInitialSelection}
          .requestTransition=${(e,t,n)=>this.controller.selectScene(e,t,n)}
          @library-item-saved=${this.sceneLibraryItemSaved}
          @library-item-delete-requested=${this.sceneLibraryItemDeleteRequested}
          @scene-edit-selected=${this.sceneTemplateSelected}
          @scene-preview-requested=${e=>this.preview.scheduleScene(e.detail)}
          @scene-external-edit-cancelled=${this.cancelSceneEdit}
          @scene-initial-selection-opened=${this.sceneInitialSelectionOpened}
          @scene-initial-selection-failed=${this.sceneInitialSelectionFailed}
          @studio-error=${e=>this.modal.showError(e.detail.message,e.detail)}
          @scene-work-state-changed=${e=>this.model.patch({sceneWorkDirty:!this.model.sceneEditorOpen&&e.detail.dirty})}
        ></govee-scene-browser>
        ${this.section===`scenes`&&this.model.sceneEditorOpen?T`
              <section class="editor-surface editor">
                ${this.renderAdvancedEditor()}
              </section>
            `:D}
        ${this.section===`video`?this.renderVideo():D}
        ${this.section===`custom`?this.renderCustomEffects():D}
      </main>
    `}renderMissingDevice(){let e=this.model.selectedDeviceId!==void 0;return T`
      <main class="empty-state">
        <h2>${e?`This Govee light is unavailable`:`No Govee lights are available`}</h2>
        <p>
          ${e?`Choose another light or wait for this config entry to load.`:`Add or enable a supported Govee Bluetooth light to use Effect Studio.`}
        </p>
        <a href=${this.panel?.config?.configuration_path??`/config/integrations`}>
          Open integration configuration
        </a>
      </main>
    `}renderNoEffectCategories(){return T`
      <main class="empty-state">
        <h2>No Effect Studio categories are enabled</h2>
        <p>Enable one or more categories in this light's integration settings.</p>
        ${this.model.selectedDevice?this.renderIntegrationSettings(this.model.selectedDevice.display_name,this.model.selectedDevice.config_entry_id):D}
      </main>
    `}renderStudioToolbar(){let e=this.model.selectedDevice,t=a(e),n=this.isAdmin&&e!==void 0,r=e!==void 0&&t!==void 0;return!this.model.showDeviceSelector&&!n&&!r?D:T`
      <div class="studio-toolbar">
        <div class="studio-toolbar-device">
          ${this.model.showDeviceSelector?this.renderDeviceSelector():D}
        </div>
        <div class="studio-toolbar-controls">
          ${n?this.renderLiveApplyControl():D}
          ${n?this.renderAutoSaveControl():D}
          ${r&&e&&t?this.renderLightControl(e.display_name,t):D}
          ${n&&e?this.renderIntegrationSettings(e.display_name,e.config_entry_id):D}
        </div>
      </div>
      ${n&&e?.static_composition&&t?this.renderStaticComposition(t):D}
    `}renderStaticComposition(e){let t=this.model.selectedDevice,n=this.staticDeviceId===t.config_entry_id&&this.staticPalette.length===t.segment_count;return T`
      <details @toggle=${e=>{e.target.open&&(this.requestComponentGroup(`painted`),n||(this.staticDeviceId=t.config_entry_id,this.staticPalette=Array.from({length:t.segment_count},()=>null),this.staticScale=100))}}>
        <summary>Static RGB composition</summary>
        <p>Paint explicit logical segments, then Apply. Unpainted segments are left unchanged.
          This replaces the active effect. RGB scale is an input, not measured brightness.</p>
        <govee-painted-segment-editor .segments=${n?this.staticPalette:[]} .emptyLabel=${`unchanged`} .disabled=${this.staticApplying}
          @segment-selected=${e=>{if(!n||this.staticApplying)return;let t=[...this.staticPalette];t[e.detail.index]=[...this.model.paintColour],this.staticPalette=t}}
        ></govee-painted-segment-editor>
        <govee-single-colour-field label="Static paint colour" .colour=${this.model.paintColour}
          .disabled=${this.staticApplying}
          @colour-changed=${e=>this.editor.paintColourChanged(e.detail.colour)}
        ></govee-single-colour-field>
        <button type="button" ?disabled=${!n||this.staticApplying} @click=${()=>{this.staticPalette=this.staticPalette.map(()=>[...this.model.paintColour])}}>Fill all logical segments</button>
        <button type="button" ?disabled=${!n||this.staticApplying} @click=${()=>{this.staticPalette=this.staticPalette.map(()=>null)}}>Clear selection</button>
        <govee-slider-control label="RGB scale" .value=${this.staticScale} .minimum=${0} .maximum=${100}
          .disabled=${this.staticApplying}
          @value-changed=${e=>{this.staticScale=e.detail.value}}
        ></govee-slider-control>
        <button type="button" ?disabled=${!n||this.staticApplying||!this.staticPalette.some(e=>e!==null)}
          @click=${()=>void this.applyStaticComposition(e)}>Apply static RGB</button>
      </details>
    `}async applyStaticComposition(e){if(this.hass&&this.isAdmin&&!this.staticApplying&&this.staticDeviceId===this.model.selectedDeviceId&&this.model.selectedDevice?.static_composition){this.staticApplying=!0;try{this.model.patch({liveApplyEnabled:!1}),this.preview.beginEditorTransition(!1),await this.preview.cancel(this.staticDeviceId,!0),await this.hass.callWS(_(e,this.staticPalette,this.staticScale))}catch(e){this.modal.showError(e instanceof Error?e.message:`Static RGB composition failed.`)}finally{this.staticApplying=!1}}}renderLightControl(e,t){let n=this.hass?.states?.[t],r=o(this.hass?.states,t),i=n?.attributes?.brightness,a=s(r===`on`&&typeof i==`number`&&Number.isFinite(i)?i:0),c=`Control ${e} (${r})`;return T`
      <button
        class="toolbar-control light-control-button native-light-control light-state-${r}"
        type="button"
        aria-label=${c}
        title=${c}
        style=${`--native-light-fill: ${a}%`}
        @click=${()=>this.showLightControls(t)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            class="native-light-brightness-ring"
            fill-rule="evenodd"
            d="M20 15.31 23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69ZM12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12Z"
          ></path>
        </svg>
      </button>
    `}showLightControls(e){this.dispatchEvent(new CustomEvent(`hass-more-info`,{bubbles:!0,composed:!0,detail:{entityId:e}}))}renderIntegrationSettings(e,t){let r=this.panel?.config?.configuration_path??`/config/integrations/integration/govee_strip_studio`;return T`
      <a
        class="toolbar-control light-control-button"
        href=${n(r,t)}
        aria-label=${`Configure visible effects for ${e}`}
        title=${`Configure visible effects for ${e}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58-1.92-3.32-2.39.96a7.2 7.2 0 0 0-1.62-.94L14.87 3h-3.84l-.36 3.18c-.59.24-1.13.56-1.62.94l-2.39-.96-1.92 3.32 2.03 1.58c-.05.31-.08.64-.08.94s.03.63.08.94l-2.03 1.58 1.92 3.32 2.39-.96c.49.38 1.03.7 1.62.94l.36 3.18h3.84l.36-3.18c.59-.24 1.13-.56 1.62-.94l2.39.96 1.92-3.32-2.02-1.58M13 15.5A3.5 3.5 0 1 1 13 8a3.5 3.5 0 0 1 0 7.5"
          ></path>
        </svg>
      </a>
    `}renderDeviceSelector(){if(!this.model.showDeviceSelector)return D;let e=this.model.selectedDeviceId!==void 0&&this.model.selectedDevice===void 0;return T`
      <label class="device-selector">
        <select
          aria-label="Light"
          .value=${this.model.selectedDeviceId??``}
          @change=${e=>{let t=e.currentTarget;this.controller.deviceChanged(t.value,t).finally(()=>r(t,this.model.selectedDeviceId))}}
        >
          ${e?T`
                <option
                  value=${this.model.selectedDeviceId}
                  .selected=${!0}
                >
                  Unavailable light
                </option>
              `:D}
          ${[...this.model.devices].sort((e,n)=>t(e.display_name,n.display_name)).map(e=>T`
                <option
                  value=${e.config_entry_id}
                  .selected=${e.config_entry_id===this.model.selectedDeviceId}
                >
                  ${e.display_name} (${e.model})
                </option>
              `)}
        </select>
      </label>
    `}renderLiveApplyControl(){let e=this.model.previewStatus?.phase,t=this.model.previewProgressVisible&&(e===`queued`||e===`writing`),n=t?`Applying changes`:void 0,r=this.model.h6179DiyCodeRequired&&this.model.h6179DiyCode===void 0;return T`
      <div class="live-apply-control">
        <span
          class="live-apply-status ${t?`pending`:`idle`}"
          title=${n??D}
          aria-hidden="true"
        ></span>
        <button
          class="toolbar-control toolbar-mode-button"
          type="button"
          aria-pressed=${this.model.liveApplyEnabled}
          ?disabled=${this.model.stateUpdatesUnavailable||!this.model.liveApplyEnabled&&r}
          title=${r?this.model.h6179DiyApprovalMessage:`Apply committed changes automatically`}
          @click=${()=>void this.controller.toggleLive(this.currentScenePreviewRequest())}
        >
          Live
        </button>
        ${n?T`<span class="visually-hidden" role="status"
              >${n}</span
            >`:D}
      </div>
    `}renderAutoSaveControl(){return T`
      <button
        class="toolbar-control toolbar-mode-button ${this.model.autoSaveInProgress?`pending`:``}"
        type="button"
        aria-pressed=${this.model.autoSaveEnabled}
        aria-busy=${this.model.autoSaveInProgress}
        ?disabled=${this.model.stateUpdatesUnavailable}
        aria-label="Auto Save"
        title=${this.model.autoSaveInProgress?`Saving committed changes automatically`:`Save committed changes automatically`}
        @click=${()=>this.controller.toggleAutoSave(this.currentScenePreviewRequest())}
      >
        <ha-icon
          class="toolbar-mode-icon"
          icon="mdi:content-save"
          aria-hidden="true"
        ></ha-icon>
      </button>
      ${this.model.autoSaveInProgress?T`<span class="visually-hidden" role="status"
            >Saving changes automatically</span
          >`:D}
    `}renderFatalError(){return T`
      <main class="fatal">
        <h1>Effect Studio is unavailable</h1>
        <p role="alert">${this.model.error}</p>
        <p>Existing light controls are unaffected.</p>
        <a href=${this.panel?.config?.configuration_path??`/config/integrations`}>
          Open integration configuration
        </a>
      </main>
    `}navButton(e){let t=this.section===e.section&&(e.section!==`custom`||e.category===this.model.customEffectCategory);return T`
      <button
        class="selector ${t?`selected`:``}"
        type="button"
        aria-current=${t?`page`:D}
        @click=${t=>void this.controller.selectSection(e.section,e.category,t.currentTarget)}
      >
        ${e.label}
      </button>
    `}renderCustomEffects(){let e=this.model.editorOwnedByActiveView&&(this.model.name!==``||this.currentItem!==void 0);return T`
      <govee-custom-effect-browser
        .context=${this.model.customEffectListContext}
        .category=${this.model.customEffectCategory}
        .currentItemId=${this.currentItem?.id}
        .templateSelection=${this.model.templateSelection}
        .newSelected=${this.model.newCustomEffectSelected}
        .isAdmin=${this.canMutate}
        @custom-entry-requested=${e=>void this.controller.selectCustomEffectEntry(e.detail.entry,e.detail.returnFocus)}
        @custom-new-requested=${e=>void this.controller.newCustomEffect(e.detail.category,e.detail.returnFocus)}
      ></govee-custom-effect-browser>

      ${e?T`
            <section class="editor-surface editor">
              ${this.renderCurrentCustomEditor()}
            </section>
          `:D}
    `}renderCurrentCustomEditor(){return this.content.kind===`native_effect`?this.renderNativeEditor():g(this.content)?this.content.kind===`h617a_painted`?this.renderPaintedEditor():this.renderPaletteEffectEditor():this.content.kind===`palette_diy`?this.renderPaletteEffectEditor():this.content.kind===`music_profile`?this.renderMusicProfileEditor():f(this.content)?this.renderAdvancedEditor():this.content.kind===`opaque`?this.renderOpaqueEditor(this.content):D}renderVideo(){if(!this.model.modelCatalogue||!this.model.videoAvailable)return D;let e=this.model.library.items.filter(e=>e.kind===`video_profile`&&this.libraryItemAvailable(e)).sort((e,n)=>t(e.name,n.name));return T`
      <aside class="sidebar item-sidebar library" aria-label="Video profiles">
        ${this.model.videoTemplates.map(e=>this.videoListButton(e.id,e.label,t=>void this.controller.selectVideoTemplate(e.id,e.label,t)))}
        ${e.map(e=>this.videoListButton(`saved:${e.id}`,e.name,t=>void this.controller.selectItemFromList(e.id,t),e))}
      </aside>
      ${this.model.editorOwnedByActiveView&&this.content.kind===`video_profile`?T`
            <section class="editor-surface editor">
              ${this.renderVideoProfileEditor()}
            </section>
          `:D}
    `}syncVideoSelectionVisibility(){if(this.section!==`video`){this.visibleVideoSelection=void 0;return}let e=this.currentItem?`saved:${this.currentItem.id}`:this.model.templateSelection;e&&e!==this.visibleVideoSelection&&h(this.shadowRoot?.querySelector(`.item-sidebar[aria-label="Video profiles"]`)??null)&&(this.visibleVideoSelection=e)}videoListButton(e,t,n,r){let i=r?this.currentItem?.id===r.id:!this.currentItem&&this.model.templateSelection===e;return T`
      <button
        class="selector item ${i?`selected`:``}"
        type="button"
        ?disabled=${!r&&!this.canMutate}
        @click=${e=>n(e.currentTarget)}
      >
        <span>${t}</span>
      </button>
    `}renderVideoProfileEditor(){return this.content.kind===`video_profile`?T`
      ${this.renderProfileHeading()}
      <govee-video-profile-editor
        .content=${this.content}
        .settings=${this.model.modelCatalogue?.video_settings??[]}
        .controls=${this.model.modelCatalogue?.video_controls}
        .applicability=${this.model.selectedDevice?.video_control_states}
        .disabled=${this.editorDisabled}
        @content-changed=${e=>{this.editor.videoContentChanged(e.detail.content,e.detail.interaction)}}
      ></govee-video-profile-editor>
    `:D}renderMusicProfileEditor(){return this.content.kind===`music_profile`?T`
      ${this.renderProfileHeading()}
      <govee-music-profile-editor
        .content=${this.content}
        .catalogue=${this.model.modelCatalogue}
        .retainedEdit=${this.model.selectedDevice?.retained_music_edit}
        .configEntryId=${this.model.selectedDeviceId}
        @retained-music-edit=${async e=>{let t=this.model.selectedDevice,n=e.currentTarget;if(t&&this.controller.api&&this.canMutate)try{this.model.patch({applying:!0}),t.retained_music_edit=await this.controller.api.editRetainedMusic(t.config_entry_id,e.detail.edit,e.detail.parameters,e.detail.calm),n.configEntryId===t.config_entry_id&&n.retainedEdit?.mode===e.detail.edit.mode&&n.retainedEdit?.revision===e.detail.edit.revision&&n.clearRetainedEdits()}catch(e){this.model.reportError(String(e))}finally{this.model.patch({applying:!1})}}}
        .disabled=${this.editorDisabled||this.model.applying}
        .modeSelectionEnabled=${this.model.showReactiveEffectSelector}
        @mode-changed=${e=>this.editor.musicModeChanged(e.detail.mode)}
        @content-changed=${e=>{this.editor.musicContentChanged(e.detail.content,e.detail.interaction)}}
      ></govee-music-profile-editor>
    `:D}renderProfileHeading(){return this.renderEditorHeading()}libraryItemAvailable(e){return this.model.libraryItemAvailable(e)}customEffectKindAvailable(e){return this.model.customEffectKindAvailable(e)}renderDeleteConfirmation(){let e=this.model.deleteCandidate,t=e.discardsOpenEdits===!0||this.currentItem?.id===e.id&&this.model.dirty;return T`
      <div class="dialog-backdrop" @click=${this.cancelDelete}>
        <section
          class="dialog-card delete-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-effect-title"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${this.deleteDialogKeyDown}
        >
          <h2 id="delete-effect-title">Delete effect?</h2>
          <p>
            <strong>${e.name}</strong> will be permanently removed
            from the shared Effect Studio library. This cannot be undone.
          </p>
          ${t?T`<p>Unsaved changes in the open effect will be discarded.</p>`:D}
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              @click=${this.cancelDelete}
            >
              Cancel
            </button>
            <button
              class="danger delete-action"
              type="button"
              @click=${()=>void this.controller.confirmDelete()}
            >
              Delete effect
            </button>
          </div>
        </section>
      </div>
    `}renderSaveNameDialog(){return T`
      <div class="dialog-backdrop" @click=${this.cancelSaveName}>
        <form
          class="dialog-card save-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-effect-title"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${this.saveNameDialogKeyDown}
          @submit=${e=>{e.preventDefault(),this.modal.confirmNamedSave(e=>this.controller.saveAs(e))}}
        >
          <h2 id="save-effect-title">Save Effect As</h2>
          <label class="field">
            <span>Name</span>
            <input
              aria-label="Name"
              maxlength="128"
              autocomplete="off"
              .value=${this.model.saveNameValue}
              ?disabled=${this.model.modalState?.kind===`save-name`&&this.model.modalState.busy}
              @input=${e=>{this.modal.saveNameChanged(e.target.value)}}
            />
          </label>
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              ?disabled=${this.model.modalState?.kind===`save-name`&&this.model.modalState.busy}
              @click=${this.cancelSaveName}
            >
              Cancel
            </button>
            <button
              class="primary"
              type="submit"
              ?disabled=${this.model.modalState?.kind===`save-name`&&this.model.modalState.busy}
            >
              ${this.model.modalState?.kind===`save-name`&&this.model.modalState.busy?`Saving...`:`Save As`}
            </button>
          </div>
        </form>
      </div>
    `}renderPendingTransitionDialog(){let e=this.model.pendingTransitionDialog;return T`
      <div
        class="dialog-backdrop"
        @click=${()=>this.controller.cancelPendingTransition()}
      >
        <section
          class="dialog-card transition-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pending-transition-title"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${e=>this.modal.dialogKeyDown(e,()=>this.controller.cancelPendingTransition())}
        >
          <h2 id="pending-transition-title">Save changes?</h2>
          <p>
            This effect has unsaved changes.  Save them before leaving,
            discard the local draft, or cancel to keep editing.
          </p>
          ${e.requiresName?T`
                <label class="field">
                  <span>Name</span>
                  <input
                    aria-label="Name"
                    maxlength="128"
                    autocomplete="off"
                    .value=${e.saveName}
                    ?disabled=${e.busy}
                    @input=${e=>this.modal.updateTransitionName(e.target.value)}
                  />
                </label>
              `:D}
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              ?disabled=${e.busy}
              @click=${()=>this.controller.cancelPendingTransition()}
            >
              Cancel
            </button>
            <button
              class="secondary"
              type="button"
              ?disabled=${e.busy}
              @click=${()=>void this.controller.declinePendingTransition()}
            >
              Discard
            </button>
            <button
              class="primary"
              type="button"
              ?disabled=${e.busy}
              @click=${()=>void this.controller.savePendingTransition()}
            >
              ${e.primaryLabel}
            </button>
          </div>
        </section>
      </div>
    `}renderOverwriteDialog(){let e=this.model.modalState;return e?.kind===`overwrite`?T`
      <div class="dialog-backdrop" @click=${()=>this.modal.cancelOverwrite()}>
        <section
          class="dialog-card overwrite-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="overwrite-effect-title"
          aria-describedby="overwrite-effect-description"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${e=>this.modal.dialogKeyDown(e,()=>this.modal.cancelOverwrite())}
        >
          <h2 id="overwrite-effect-title">Effect already exists</h2>
          <p id="overwrite-effect-description">
            An effect named <strong>${e.effectName}</strong> already
            exists. Overwrite it with this effect?
          </p>
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              @click=${()=>this.modal.cancelOverwrite()}
            >
              Cancel
            </button>
            <button
              class="danger delete-action"
              type="button"
              @click=${()=>this.modal.confirmOverwrite()}
            >
              Overwrite
            </button>
          </div>
        </section>
      </div>
    `:D}renderErrorDialog(){let e=this.model.modalState;return e?.kind===`error`?T`
      <div class="dialog-backdrop" @click=${()=>this.modal.closeError()}>
        <section
          class="dialog-card error-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="effect-error-title"
          aria-describedby="effect-error-description"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${e=>this.modal.dialogKeyDown(e,()=>this.modal.closeError())}
        >
          <h2 id="effect-error-title">${e.title}</h2>
          <p id="effect-error-description">${e.message}</p>
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              @click=${()=>this.modal.closeError()}
            >
              Close
            </button>
          </div>
        </section>
      </div>
    `:D}renderFeedbackDialog(){let e=this.model.modalState;if(e?.kind!==`feedback`)return D;let t=e.device;return T`
      <div class="dialog-backdrop" @click=${()=>this.modal.closeFeedback()}>
        <section
          class="dialog-card feedback-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          aria-describedby="feedback-description"
          tabindex="-1"
          @click=${e=>e.stopPropagation()}
          @keydown=${e=>this.modal.dialogKeyDown(e,()=>this.modal.closeFeedback())}
        >
          <h2 id="feedback-title">Device feedback</h2>
          <p id="feedback-description">
            Support for this model has not yet been confirmed on actual hardware.
            If you can, share what works and what doesn't to help other owners.
          </p>
          <label class="field">
            Details
            <textarea readonly rows="8" spellcheck="false" .value=${e.report}></textarea>
          </label>
          <button class="secondary feedback-copy" type="button" @click=${()=>void this.copyFeedbackReport()}>Copy details</button>
          ${e.copyMessage?T`<p role="status">${e.copyMessage}</p>`:D}
          <p>Copy these details and paste them into the model issue on GitHub.</p>
          <div class="dialog-actions">
            <button
              class="secondary"
              type="button"
              @click=${()=>window.open(`https://github.com/teh-hippo/govee-strip-studio/issues/${t.confirmation_issue}`,`_blank`,`noopener,noreferrer`)}
              aria-label="Open GitHub (new tab)"
            >Open GitHub</button>
            <button class="secondary" type="button" @click=${()=>this.modal.closeFeedback()}>Close</button>
          </div>
        </section>
      </div>
    `}async copyFeedbackReport(){let e=this.model.modalState;if(e?.kind!==`feedback`)return;let t=`Copied.`;if(!navigator.clipboard?.writeText)t=`Copying is unavailable.  Select and copy the details manually.`;else try{await navigator.clipboard.writeText(e.report)}catch{t=`Copying failed.  Select and copy the details manually.`}this.model.modalState===e&&this.model.patch({modalState:{...e,copyMessage:t}})}restoreFeedbackVisibility(){try{let e=sessionStorage.getItem(A);if(e===null)return;let t=JSON.parse(e);if(!Array.isArray(t)||t.length>512||!t.every(e=>typeof e==`string`&&e.length>0&&e.length<=255))throw Error(`Invalid feedback session preference`);this.model.patch({sessionHiddenFeedback:new Set(t)})}catch(e){console.warn(`Could not restore the feedback session preference.`,e)}}hideFeedbackNotice(){let e=this.model.selectedDevice;if(!e)return;let t=new Set(this.model.sessionHiddenFeedback).add(e.config_entry_id);this.model.patch({sessionHiddenFeedback:t});try{sessionStorage.setItem(A,JSON.stringify([...t]))}catch(e){console.warn(`Could not remember hidden feedback for this session.`,e)}}renderAdvancedEditor(){return this.content.kind===`native_effect`?this.renderNativeEditor():f(this.content)?T`
      ${this.renderEditorHeading()}

      <govee-advanced-effect-editor
        .content=${i(this.content)}
        .disabled=${this.editorDisabled}
        .physicalIcCount=${this.model.selectedDevice?.physical_ic_count}
        .segmentCount=${this.model.selectedDevice?.segment_count??15}
        @content-changed=${e=>{this.editor.advancedContentChanged(e.detail.content,e.detail.interaction,this.currentScenePreviewRequest())}}
      ></govee-advanced-effect-editor>
    `:D}renderNativeEditor(){return this.content.kind===`native_effect`?T`
      ${this.renderEditorHeading()}
      <govee-custom-effect-editor .nativeContent=${this.content} .catalogue=${this.model.modelCatalogue}
        .disabled=${this.editorDisabled}
        @native-content-changed=${e=>this.editor.nativeContentChanged(e.detail.content,e.detail.interaction,this.currentScenePreviewRequest())}
      ></govee-custom-effect-editor>
    `:D}renderOpaqueEditor(e){return T`
      ${this.renderEditorHeading({save:!1,title:T`<div class="mobile-redundant-heading">
          <h2>${this.model.name}</h2>
        </div>`})}
      <p class="read-only-copy">
        This effect definition can be inspected, but this editor cannot change,
        save or preview it.
      </p>
      <section class="card opaque-content">
        <h3 class="section-title">Source kind</h3>
        <p><code>${e.source_kind}</code></p>
        <h3 class="section-title">Preserved content</h3>
        <pre aria-label="Preserved opaque content">${JSON.stringify(e.body,null,2)}</pre>
      </section>
    `}renderPaintedEditor(){if(this.content.kind!==`h617a_painted`)return D;let e=this.content,t=e.addressing===`physical_ic`;return T`
      ${this.renderEditorHeading()}

      ${this.renderSingleEffectSelector()}

      ${t&&!this.model.selectedDevice?.physical_ic_count?T`
        <p role="status">Graffiti requires the device's physical IC count. Refresh the device before painting or applying.</p>
      `:D}

      <govee-painted-segment-editor
        .segments=${this.content.segments}
        .background=${e.background??[0,0,0]}
        .physical=${t}
        .disabled=${this.editorDisabled}
        @segment-selected=${e=>{this.editor.setSegmentColour(e.detail.index,e.detail.interaction)&&!this.model.paintBrushOff&&y(this.model.paintColour)}}
      ></govee-painted-segment-editor>

      <div class="controls">
        <section class="card">
          <govee-single-colour-field
            label="Paint colour"
            .colour=${this.model.paintColour}
            .disabled=${this.editorDisabled}
            .selectionActive=${!this.model.paintBrushOff}
            .rememberOnCommit=${!1}
            @colour-changing=${e=>this.editor.paintColourChanged(e.detail.colour)}
            @colour-changed=${e=>this.editor.paintColourChanged(e.detail.colour)}
          ></govee-single-colour-field>
          <div class="paint-actions">
            <button
              class="paint-off ${this.model.paintBrushOff?`active`:``}"
              type="button"
              ?disabled=${this.editorDisabled}
              aria-pressed=${this.model.paintBrushOff}
              @click=${()=>this.editor.selectPaintOff()}
            >
              <span class="paint-off-swatch" aria-hidden="true"></span>
              ${t?`Background`:`Off`}
            </button>
          </div>
        </section>

        <section class="card">
          <div class="parameter-stack">
            ${this.renderPaintedVariationField()}
            ${t?T`
              <govee-single-colour-field
                label="Background colour"
                .colour=${e.background??[255,255,255]}
                .disabled=${this.editorDisabled}
                @colour-changing=${e=>this.editor.updatePaintedContent({background:e.detail.colour},`changing`)}
                @colour-changed=${e=>this.editor.updatePaintedContent({background:e.detail.colour},`committed`)}
              ></govee-single-colour-field>
            `:D}
            ${this.sliderField(`Speed`,`speed`,this.content.speed)}
            ${this.sliderField(`Brightness`,`brightness`,this.content.brightness)}
          </div>
        </section>
      </div>
    `}renderPaletteEffectEditor(){if(this.content.kind!==`h617a_single`&&this.content.kind!==`h617a_multi`&&this.content.kind!==`h6179_single_diy`&&this.content.kind!==`h6179_mixed_diy`&&this.content.kind!==`palette_diy`)return D;let e=this.content;return T`
      ${this.renderEditorHeading()}

      ${this.renderH6179DiyApproval()}

      ${this.renderSingleEffectSelector()}

      <govee-custom-effect-editor
        .content=${e}
        .catalogue=${this.model.modelCatalogue}
        .disabled=${this.editorDisabled}
        @content-changed=${e=>{this.editor.customContentChanged(e.detail.content,e.detail.interaction)}}
      ></govee-custom-effect-editor>
    `}renderSingleEffectSelector(){if(!this.model.customCatalogue||!this.model.showSingleEffectSelector||this.content.kind!==`h617a_painted`&&this.content.kind!==`h617a_single`&&this.content.kind!==`h6179_single_diy`&&this.content.kind!==`palette_diy`)return D;let e=this.selectedSingleEffectFamily,t=this.currentItem?.content.kind===`h617a_painted`?[]:this.model.modelCatalogue?.effects.filter(e=>e.category===`single_layer`)??[],n=t.some(t=>t.family===e?.family),r=this.content.kind===`h617a_painted`?`paint`:e&&n?e.id:`unknown:${this.content.family}`,i=this.customEffectKindAvailable(`h617a_painted`)&&this.currentItem?.content.kind!==`h617a_single`;return T`
      <section class="card single-effect-settings">
        <label class="field">
          <span>Effect</span>
          <select
            aria-label="Effect"
            .value=${r}
            ?disabled=${this.editorDisabled}
            @change=${e=>this.editor.selectSingleEffect(e.target.value)}
          >
            ${(this.content.kind===`h617a_single`||this.content.kind===`h6179_single_diy`||this.content.kind===`palette_diy`)&&!n?T`
                  <option value=${r}>
                    Unknown effect ${this.content.family}
                  </option>
                `:D}
            ${i?T`
                  <option
                    value="paint"
                    ?selected=${r===`paint`}
                  >
                    Paint
                  </option>
                `:D}
            ${t.map(e=>T`
                <option
                  value=${e.id}
                  ?selected=${r===e.id}
                >
                  ${e.label}
                </option>
              `)}
          </select>
        </label>
      </section>
    `}renderH6179DiyApproval(){if(!this.model.h6179DiyCodeRequired)return D;let e=this.model.h6179ObservedDiyCode,t=this.model.h6179DiyCode===e;return T`
      <section class="card h6179-diy-approval" role="note">
        <h3 class="section-title">Disposable DIY item required</h3>
        <p>
          Apply and Live preview overwrite the explicitly approved device DIY
          item. The approved code is sent only with the action and is not saved
          with the effect.
        </p>
        ${e===void 0?T`
              <p class="approval-status">
                No DIY item is currently observed. Select a disposable DIY item
                in the Govee app, then refresh or return to Effect Studio before
                Apply or Live can be enabled.
              </p>
            `:T`
              <div class="observed-diy-code">
                <p class="approval-status">
                  Currently observed DIY code: <code>${e}</code>
                </p>
                <button
                  class="secondary"
                  type="button"
                  ?disabled=${this.editorDisabled||t}
                  @click=${()=>void this.controller.useObservedH6179DiyCode()}
                >
                  ${t?`Disposable item approved`:`Use observed disposable item`}
                </button>
              </div>
            `}
      </section>
    `}renderPaintedVariationField(){if(!this.model.customCatalogue||this.content.kind!==`h617a_painted`)return D;let e=this.content,t=this.model.modelCatalogue?.painted_effects??[],n=t.some(t=>t.id===e.effect);return n&&t.length<=1?D:T`
      <label class="field">
        <span class="parameter-label">Variation</span>
        <select
          aria-label="Variation"
          .value=${e.effect}
          ?disabled=${this.editorDisabled}
          @change=${e=>this.editor.updatePaintedContent({effect:e.target.value},`committed`)}
        >
          ${n?D:T`
                <option value=${e.effect}>
                  Unknown variation ${e.effect}
                </option>
              `}
          ${t.map(t=>T`
              <option
                value=${t.id}
                ?selected=${t.id===e.effect}
              >
                ${t.label}
              </option>
            `)}
        </select>
      </label>
    `}renderEffectName(){let e=this.currentItem?m(this.currentItem.origin):void 0,t=this.model.dirty&&this.editorSource.kind!==`catalogue`?T`<span class="dirty-marker" aria-label="Unsaved changes">*</span>`:D;return this.editorSource.kind===`catalogue`||this.editorSource.kind===`scene`&&this.editorSource.itemId===void 0?T`
        <div class="editor-title mobile-redundant-heading">
          <h2>
            ${this.editorSource.kind===`catalogue`?this.editorSource.label:this.model.name}
          </h2>
          ${e?T`<small class="origin-name">${e}</small>`:D}
        </div>
      `:T`
      <div class="editor-title mobile-editable-heading">
        <span class="mobile-name-label">Name</span>
        <div class="editable-title">
          <input
            class="editor-name"
            aria-label="Effect name"
            maxlength="128"
            .value=${this.model.name}
            ?disabled=${this.editorDisabled}
            @input=${e=>this.model.patch({name:e.target.value})}
            @change=${()=>this.controller.contentCommitted(`committed`)}
          />
          ${t}
        </div>
        ${e?T`<small class="origin-name">${e}</small>`:D}
      </div>
    `}renderEditorHeading(e={}){return T`
      <div class="editor-heading">
        <div class="editor-heading-title">
          ${e.title??this.renderEffectName()}
        </div>
        <div class="actions">
          ${this.model.editorActions.filter(t=>t.visible&&(e.save!==!1||t.id!==`save`&&t.id!==`saveAs`)).map(e=>this.renderEditorAction(e))}
        </div>
      </div>
    `}renderEditorAction(e){switch(e.id){case`apply`:return T`
          <button
            class="${this.editorActionClass(e)} apply-action"
            type="button"
            ?disabled=${!e.enabled}
            @click=${()=>void this.controller.applyCurrentDraft()}
          >
            ${this.model.applying?`Applying...`:e.label}
          </button>
        `;case`saveAs`:{let t=this.model.name.trim()||this.catalogueSourceLabel||`Effect`;return T`
          <button
            class=${this.editorActionClass(e)}
            type="button"
            ?disabled=${!e.enabled}
            @click=${e=>this.modal.requestSaveAs(e.currentTarget,`${t} copy`)}
          >
            ${e.label}
          </button>
        `}case`reset`:return T`
          <button
            class=${this.editorActionClass(e)}
            type="button"
            ?disabled=${!e.enabled}
            @click=${()=>this.editor.resetContent()}
          >
            ${e.label}
          </button>
        `;case`cancel`:return T`
          <button
            class=${this.editorActionClass(e)}
            type="button"
            ?disabled=${!e.enabled}
            @click=${this.cancelSceneEdit}
          >
            ${e.label}
          </button>
        `;case`delete`:return this.renderEditorDeleteButton(e);case`save`:return T`
          <button
            class=${this.editorActionClass(e)}
            type="button"
            ?disabled=${!e.enabled}
            @click=${()=>this.modal.requestSave(()=>void this.controller.save())}
          >
            ${this.model.saving?`Saving...`:e.label}
          </button>
        `}}editorActionClass(e){return e.style===`delete`?`danger delete-action`:e.style}get selectedSingleEffectFamily(){return this.model.selectedSingleEffectFamily}syncSingleEffectSelects(){if(this.content.kind!==`h617a_painted`&&this.content.kind!==`h617a_single`&&this.content.kind!==`h6179_single_diy`&&this.content.kind!==`palette_diy`)return;let e=this.shadowRoot?.querySelector(`select[aria-label="Effect"]`);if(e&&(e.value=this.content.kind===`h617a_painted`?`paint`:this.selectedSingleEffectFamily?.id??`unknown:${this.content.family}`),this.content.kind===`h617a_painted`){let e=this.shadowRoot?.querySelector(`select[aria-label="Variation"]`);e&&(e.value=this.content.effect)}}sliderField(e,t,n){return T`
      <govee-slider-control
        .label=${e}
        .value=${n}
        .minimum=${this.model.modelCatalogue?.limits[`${t}_min`]??0}
        .maximum=${this.model.modelCatalogue?.limits[`${t}_max`]??100}
        .disabled=${this.editorDisabled}
        @value-changed=${e=>this.editor.updatePaintedContent({[t]:e.detail.value},e.detail.interaction)}
      ></govee-slider-control>
    `}sceneLibraryItemSaved(e){this.controller.sceneItemSaved(e.detail.item,e.detail.configEntryId,e.detail.selectionIsCurrent,e.detail.panelTransitionEpoch)}sceneTemplateSelected(e){this.controller.openSceneEditor(e.detail,this.eventReturnFocus(e))}eventReturnFocus(e){return e.composedPath().find(e=>e instanceof HTMLElement&&(e.matches(`button, select, input`)||e===this))}syncUnloadProtection(){this.setUnloadListener(this.isConnected&&this.controller?.unloadProtectionRequired===!0)}setUnloadListener(e){e!==this.unloadListenerRegistered&&(this.unloadListenerRegistered=e,e?window.addEventListener(`beforeunload`,this.beforeUnload):window.removeEventListener(`beforeunload`,this.beforeUnload))}sceneLibraryItemDeleteRequested(e){let{returnFocus:t,...n}=e.detail;this.requestDelete(n,t)}cancelSceneEdit(){this.editor.cancelSceneEdit(),this.updateComplete.then(()=>this.shadowRoot?.querySelector(`govee-scene-browser`)?.refreshSelectedDefault?.())}renderEditorDeleteButton(e){return!this.isAdmin||!this.currentItem||!this.model.editorAction(`delete`)?.visible?D:T`
      <button
        class=${this.editorActionClass(e)}
        type="button"
        ?disabled=${!e.enabled}
        @click=${e=>this.requestDelete({id:this.currentItem.id,version:this.currentItem.version,updated_at:this.currentItem.updated_at,name:this.currentItem.name},e.currentTarget)}
      >
        ${this.model.deletingCurrentItem?`Deleting...`:`Delete`}
      </button>
    `}requestDelete(e,t){this.modal.requestDelete(e,t)}cancelDelete(){this.modal.cancelDelete()}deleteDialogKeyDown(e){this.modal.dialogKeyDown(e,()=>this.cancelDelete())}cancelSaveName(){this.modal.cancelSaveName()}saveNameDialogKeyDown(e){this.modal.dialogKeyDown(e,()=>this.cancelSaveName())}currentScenePreviewRequest(){return this.shadowRoot?.querySelector(`govee-scene-browser`)?.currentPreviewRequest?.()}static{this.styles=w}};C([e({attribute:!1})],M.prototype,`hass`,void 0),C([e({attribute:!1})],M.prototype,`panel`,void 0),C([e({type:Boolean})],M.prototype,`narrow`,void 0),C([c()],M.prototype,`modelRevision`,void 0),C([c()],M.prototype,`staticPalette`,void 0),C([c()],M.prototype,`staticScale`,void 0),C([c()],M.prototype,`staticApplying`,void 0),customElements.get(`govee-strip-studio-editor`)||customElements.define(`govee-strip-studio-editor`,M);