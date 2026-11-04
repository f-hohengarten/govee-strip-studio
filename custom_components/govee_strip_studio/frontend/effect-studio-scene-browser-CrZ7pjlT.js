import{$t as e,A as t,B as n,C as r,D as i,E as a,F as o,Ht as s,I as c,L as l,M as u,N as d,O as f,P as p,Q as m,Qt as h,R as g,S as _,T as v,U as y,Vt as b,Y as x,Yt as S,an as C,b as w,c as T,d as E,en as D,f as O,j as k,k as A,l as j,m as M,n as N,p as P,rn as F,s as I,tn as L,u as R,w as z,x as B,yt as V,z as H}from"./effect-studio-core-DjubBMwf.js";import"./effect-studio-segmented-control-CUN174gm.js";var U=class{constructor(e){this.execute=e,this.generation=0,this.active=!1}get currentGeneration(){return this.generation}get busy(){return this.active||this.pending!==void 0}enqueue(e){return this.generation+=1,this.pending?.resolve(),new Promise(t=>{this.pending={generation:this.generation,payload:e,resolve:t},this.drain()})}invalidate(){this.generation+=1,this.pending?.resolve(),this.pending=void 0}isLatest(e){return e===this.generation}async drain(){if(!this.active){this.active=!0;try{for(;this.pending;){let e=this.pending;this.pending=void 0;try{await this.execute(e)}finally{e.resolve()}}}finally{this.active=!1}}}},W=class{constructor(e){this.effects=e,this.stateValue=a(),this.library={items:[]},this.defaultSelectionRevision=0,this.speedRevision=0,this.defaultRefreshGeneration=0,this.defaultRefreshPending=!1,this.defaultPreviewPending=!1,this.errorSequence=0,this.stateUpdatesAvailable=!0,this.defaultWriter=new U(e=>this.performDefaultWrite(e)),this.requests=new y((e,t)=>e.api===t.api&&e.deviceId===t.deviceId&&e.category===t.category&&e.selectionIdentity===t.selectionIdentity)}get state(){return this.stateValue}get compatibleCustomScenes(){return _(this.library.items,this.stateValue.catalogue)}get sceneDirty(){return o(this.stateValue)}get sceneDefaultDirty(){let{content:e,editingCopy:t,selectedItem:n,speedIndex:r}=this.stateValue;return!!(e&&n===void 0&&!t&&this.defaultBaseline&&JSON.stringify(d(e,r))!==JSON.stringify(this.defaultBaseline.content))}get sceneCatalogueDirty(){let{catalogueContent:e,content:t,editingCopy:n,selectedItem:r,speedIndex:i}=this.stateValue;return!!(e&&t&&r===void 0&&!n&&JSON.stringify(d(t,i))!==JSON.stringify(e))}get protectedWorkDirty(){return(this.stateValue.editingCopy||this.stateValue.selectedItem!==void 0)&&this.sceneDirty||this.sceneDefaultDirty}get defaultWritePending(){return this.defaultWriter.busy||this.defaultPreviewPending}hasCurrentSceneContent(){return v(this.stateValue,this.activeSelectionIdentity)}previewRequest(e,t=!1){if(!this.stateUpdatesAvailable)return;let n=w(this.stateValue,this.activeSelectionIdentity,!!this.device,e);return n?{...n,persistDefault:t&&this.sceneDefaultDirty}:void 0}configure(e,t){this.api=e,this.device=t,this.invalidateRequests(),this.openedInitialSelection=void 0,this.patch({catalogue:void 0,category:`all`,selectedScene:void 0,selectedItem:void 0,content:void 0,catalogueContent:void 0,hasDefault:!1,defaultSaveFailed:!1,editingCopy:!1,notice:void 0,error:void 0,loading:!!(e&&t)})}setInitialSelection(e){this.initialSelection=e,this.openedInitialSelection=void 0}setLibrary(e){this.library=e;let t=this.stateValue.selectedItem;if(!t||this.stateValue.saving)return;let n=m(t,e.items,this.sceneDirty);n.action===`removed`?(this.invalidateRequests(),this.patch({selectedScene:void 0,selectedItem:void 0,content:void 0,catalogueContent:void 0,hasDefault:!1,defaultSaveFailed:!1,editingCopy:!1,notice:void 0})):n.action===`conflict`?this.patch({notice:`This custom scene changed elsewhere. Reload it before saving.`}):n.action===`reload`&&this.reloadSelectedCustom(n.summary,t)}synchroniseSavedSelection(e){let{catalogue:t,selectedItem:n}=this.stateValue;if(n?.id!==e.id||!t||!i(e.content)||e.content.template.sku!==t.sku)return;let a=r(t,e.content);a&&(this.requests.invalidate(),this.activeSelectionIdentity=`custom:${e.id}`,this.commitCustomSelection(e,a,e.content),this.patch({notice:void 0}))}setCategory(e){this.invalidateRequests(),this.patch({category:e,selectedScene:void 0,selectedItem:void 0,content:void 0,catalogueContent:void 0,hasDefault:!1,editingCopy:!1,notice:void 0})}setName(e){!this.stateValue.saving&&this.stateUpdatesAvailable&&this.patch({name:e})}setSpeedIndex(e){!this.stateValue.saving&&this.stateUpdatesAvailable&&(this.speedRevision+=1,this.patch({speedIndex:e,...this.stateValue.content?{content:d(this.stateValue.content,e,this.stateValue.selectedScene?.speed?.layer_speeds)}:{}}))}async loadCatalogue(){if(!this.api||!this.device)return;let e=this.beginRequest();this.patch({loading:!0,error:void 0,notice:void 0,selectedScene:void 0,selectedItem:void 0,content:void 0,catalogueContent:void 0,hasDefault:!1});try{let t=await e.api.sceneCatalogue(e.deviceId);if(!this.requestIsCurrent(e))return;this.patch({catalogue:t,category:`all`,loading:!1}),await this.openInitialSelection()}catch(t){this.requestIsCurrent(e)&&this.patch({error:s(t)})}finally{this.requestIsCurrent(e)&&this.patch({loading:!1})}}async selectBuiltin(e){if(!this.api||!this.device)return!1;let t=H(this.stateValue.category,e);t!==this.stateValue.category&&(this.invalidateRequests(),this.patch({category:t}));let n=c(e),r=this.beginRequest(n);this.patch({notice:void 0,selectedScene:e,selectedItem:void 0,editingCopy:!1,content:void 0,catalogueContent:void 0,name:e.display_name,speedIndex:e.speed?.default_index??null});try{let t=await r.api.sceneDetail(r.deviceId,e.scene_id,e.effect_id);return!this.requestIsCurrent(r)||c(t.scene)!==n?!1:(this.defaultBaseline=this.snapshotFromDetail(t),this.patch({selectedScene:t.scene,content:t.content,catalogueContent:t.catalogue_content,hasDefault:t.has_default,defaultSaveFailed:!1,name:t.scene.display_name,speedIndex:t.content.speed_index}),!0)}catch(e){return this.requestIsCurrent(r)&&this.patch({notice:s(e)}),!1}}async selectCustom(e){if(!this.api||!this.device||!this.stateValue.catalogue)return!1;let t=this.stateValue.catalogue,a=n(this.stateValue.category);a!==this.stateValue.category&&(this.invalidateRequests(),this.patch({category:a}));let o=this.beginRequest(`custom:${e.id}`);this.patch({notice:void 0,selectedScene:void 0,selectedItem:void 0,editingCopy:!1,content:void 0,catalogueContent:void 0,hasDefault:!1,name:e.name});try{let n=await o.api.item(e.id);if(!this.requestIsCurrent(o))return!1;if(!i(n.content))throw Error(`This custom scene uses an unsupported definition.`);let a=n.content;if(a.template.sku!==t.sku)throw Error(`This custom scene targets ${a.template.sku}, not ${t.sku}.`);let s=r(t,a);if(!s)throw Error(`The source scene is not in this device catalogue.`);let l=await o.api.sceneDetail(o.deviceId,a.template.scene_id,a.template.effect_id);return!this.requestIsCurrent(o)||c(l.scene)!==c(s)?!1:(this.commitCustomSelection(n,s,a),!0)}catch(e){return this.requestIsCurrent(o)&&this.patch({notice:s(e)}),!1}}async openInitialSelection(){let e=this.initialSelection,t=this.stateValue.catalogue;if(!e||!t)return;let n=e.kind===`none`?`none`:e.kind===`saved`?`saved:${e.itemId}`:`native:${A(e.effect)}`;if(this.openedInitialSelection===n)return;this.openedInitialSelection=n;let r=e.kind===`none`?this.clearSelection():e.kind===`saved`?await this.openInitialSavedScene(e.itemId):await this.openInitialNativeScene(e.effect);this.initialSelection===e&&this.effects.initialSelectionFinished(r)}async save(e,t=0){let{catalogue:n,content:r,selectedItem:i,selectedScene:a}=this.stateValue;if(!this.stateUpdatesAvailable||!this.api||!this.device||!n||!a||!r||!this.hasCurrentSceneContent()||r.kind!==`scene_builtin`&&r.kind!==`scene_palette`||!e||this.stateValue.saving)return!1;let o=this.stateValue.name.trim();if(!o)return this.patch({notice:`Give this custom scene a name before saving.`}),!1;let c=d(r,this.stateValue.speedIndex),l=this.captureRequest(),u=this.currentDocument(),f=()=>this.stateUpdatesAvailable&&this.requestIsCurrent(l)&&this.currentDocument()===u;this.patch({saving:!0,notice:void 0});try{let e=i?await l.api.updateItem(i,o,c,f):await l.api.createItem(o,c,f);if(e.content.kind!==`scene_builtin`&&e.content.kind!==`scene_palette`)throw Error(`The saved scene returned an unsupported definition.`);let n=this.requestIsCurrent(l)&&this.currentDocument()===u;return this.effects.libraryItemSaved(e,l.deviceId,n,t),n&&(this.activeSelectionIdentity=`custom:${e.id}`,this.requests.invalidate(),this.patch({selectedItem:e,editingCopy:!1,content:e.content,name:e.name,category:`custom`,notice:void 0})),!0}catch(e){if(this.requestIsCurrent(l)&&b(e)!==`save_cancelled`){let t=b(e);this.patch({notice:t===`conflict`?`The library changed elsewhere. Reload the scene before saving.`:t===`reserved_name`?s(e):`Save failed: ${s(e)}`})}return!1}finally{this.patch({saving:!1})}}async savePendingWork(e,t){return(this.stateValue.editingCopy||this.stateValue.selectedItem!==void 0)&&this.sceneDirty?this.save(e,t):!this.sceneDefaultDirty||(await this.setCurrentDefault(e),!this.sceneDefaultDirty)}async applyCurrent(e){let{content:t,selectedItem:n,selectedScene:r,speedIndex:i}=this.stateValue;if(!this.stateUpdatesAvailable||!this.api||!this.device||!t||!r||!e||this.stateValue.applying||this.stateValue.saving||!this.hasCurrentSceneContent())return!1;let a=this.captureRequest(),o=this.currentDocument(),c=d(t,i);this.patch({applying:!0,notice:void 0});try{return n&&!this.sceneDirty?await a.api.applySavedEffect(a.deviceId,n):await a.api.applySnapshot(a.deviceId,this.stateValue.name.trim()||r.display_name,c),this.requestIsCurrent(a)&&this.currentDocument()===o}catch(e){return this.requestIsCurrent(a)&&this.effects.error(`Apply failed: ${s(e)}`,{title:`Apply failed`,key:`scene-apply:${a.generation}:${b(e)}`}),!1}finally{this.patch({applying:!1})}}async resetToCatalogue(e){let{catalogueContent:t,selectedItem:n,selectedScene:r}=this.stateValue;if(!this.stateUpdatesAvailable||!r||!t||n!==void 0||this.stateValue.editingCopy||!this.sceneCatalogueDirty||!e||!this.hasCurrentSceneContent())return;let i=B(t),a=i.speed_index;this.speedRevision+=1,this.defaultRefreshGeneration+=1,this.patch({content:i,speedIndex:a,notice:void 0})}async setCurrentDefault(e){let{content:t,selectedItem:n,selectedScene:r,speedIndex:i}=this.stateValue;if(!this.stateUpdatesAvailable||!this.api||!this.device||!r||!t||n!==void 0||this.stateValue.editingCopy||!this.sceneDefaultDirty||!e||!this.hasCurrentSceneContent())return;this.defaultRefreshGeneration+=1;let a=d(t,i);this.patch({content:a,notice:void 0}),await this.defaultWriter.enqueue(this.defaultWrite(a)),this.patch({}),await this.flushPendingDefaultRefresh()}async refreshSelectedDefault(){let e=this.stateValue.selectedScene;if(!this.api||!this.device||!e||this.defaultWriter.busy){this.defaultWriter.busy&&(this.defaultRefreshPending=!0);return}let t=this.captureRequest(),n=this.defaultSelectionRevision,r=this.defaultWriter.currentGeneration,i=++this.defaultRefreshGeneration;try{let a=await t.api.sceneDetail(t.deviceId,e.scene_id,e.effect_id);this.requestIsCurrent(t)&&n===this.defaultSelectionRevision&&r===this.defaultWriter.currentGeneration&&i===this.defaultRefreshGeneration&&!this.defaultWriter.busy&&this.stateValue.selectedScene&&c(this.stateValue.selectedScene)===c(e)&&c(a.scene)===c(e)&&(this.defaultBaseline=this.snapshotFromDetail(a),this.patch({catalogueContent:B(a.catalogue_content),hasDefault:a.has_default}))}catch(e){this.requestIsCurrent(t)&&n===this.defaultSelectionRevision&&r===this.defaultWriter.currentGeneration&&i===this.defaultRefreshGeneration&&!this.defaultWriter.busy&&this.patch({notice:`Could not refresh the scene default: ${s(e)}`})}}previewStatusChanged(e){let t=this.stateValue.selectedScene;e?t&&e.config_entry_id===this.device?.config_entry_id&&e.scene_id===t.scene_id&&e.effect_id===t.effect_id&&(e.phase===`queued`&&e.persist_default&&e.default_action!==null?(this.defaultPreviewPending=!0,this.patch({defaultSaveFailed:!1,notice:void 0})):this.defaultPreviewPending&&(e.phase===`written`||e.phase===`failed`||e.phase===`cancelled`)&&(this.defaultPreviewPending=!1,e.phase===`failed`||e.phase===`cancelled`?this.patch({defaultSaveFailed:e.phase===`failed`}):(this.patch({defaultSaveFailed:!1}),this.refreshSelectedDefault()))):this.defaultPreviewPending&&(this.defaultPreviewPending=!1,this.patch({}))}async flushPendingDefaultRefresh(){this.defaultRefreshPending&&(this.defaultRefreshPending=!1,await this.refreshSelectedDefault())}edit(e){let{content:t,selectedItem:n,selectedScene:r}=this.stateValue;if(e&&r&&this.hasCurrentSceneContent()&&(n||!r.selector_only)){if(n||this.invalidateDefaultWrites(!0),t?.kind===`native_effect`){let e=this.stateValue.catalogueContent?.kind===`native_effect`?this.stateValue.catalogueContent:t;return{content:structuredClone(t),catalogue_content:structuredClone(e),has_default:!n&&this.stateValue.hasDefault,config_entry_id:this.device.config_entry_id,...n?{item:n}:{},name:n?.name??r.display_name}}if(r.parameter_kind===`layers`&&t?.kind===`scene_layered`){let e=n?.content.kind===`scene_layered`?n.content:this.stateValue.catalogueContent?.kind===`scene_layered`?this.stateValue.catalogueContent:t;return{content:V({...t,speed_index:this.stateValue.speedIndex}),catalogue_content:V(e),has_default:!n&&this.stateValue.hasDefault,config_entry_id:this.device.config_entry_id,...n?{item:n}:{},name:n?.name??r.display_name}}this.patch({editingCopy:!0,name:`${r.display_name} copy`,notice:void 0})}}async cancelCopy(){let e=this.stateValue.selectedScene;return this.stateValue.editingCopy&&e?this.selectBuiltin(e):!1}defaultWrite(e){let t=this.stateValue.selectedScene;return{content:B(e),api:this.api,deviceId:this.device.config_entry_id,scene:t,selectionIdentity:c(t),selectionRevision:this.defaultSelectionRevision,speedRevision:this.speedRevision}}async performDefaultWrite(e){let t=e.payload;try{let n=await t.api.setSceneDefault(t.deviceId,t.content);if(c(n.scene)!==t.selectionIdentity)throw Error(`The scene default response did not match the selected scene.`);if(!this.defaultWriteBelongsToCurrentSelection(t)||(this.defaultBaseline=this.snapshotFromDetail(n),!this.defaultWriter.isLatest(e.generation)))return;let r=this.speedRevision===t.speedRevision?n.content.speed_index:this.stateValue.speedIndex;this.patch({selectedScene:n.scene,catalogueContent:B(n.catalogue_content),...this.speedRevision===t.speedRevision?{content:B(n.content)}:{},speedIndex:r,hasDefault:n.has_default,defaultSaveFailed:!1,notice:void 0})}catch(n){if(!this.defaultWriter.isLatest(e.generation)||!this.defaultWriteBelongsToCurrentSelection(t))return;this.patch({defaultSaveFailed:!0,notice:`Save failed: ${s(n)}`})}}snapshotFromDetail(e){return{scene:{...e.scene},content:B(e.content),speedIndex:e.content.speed_index,hasDefault:e.has_default}}defaultWriteBelongsToCurrentSelection(e){return!(e.selectionRevision!==this.defaultSelectionRevision||this.activeSelectionIdentity!==e.selectionIdentity||this.stateValue.selectedItem!==void 0||this.stateValue.editingCopy||!this.stateValue.selectedScene||c(this.stateValue.selectedScene)!==e.selectionIdentity)}invalidateDefaultWrites(e=!1){this.defaultSelectionRevision+=1,this.speedRevision=0,this.defaultRefreshGeneration+=1,e||(this.defaultBaseline=void 0),this.defaultRefreshPending=!1,this.defaultPreviewPending=!1,this.defaultWriter.invalidate()}async openInitialSavedScene(e){let t=this.compatibleCustomScenes.find(t=>t.id===e);return t?this.selectCustom(t):!1}async openInitialNativeScene(e){let t=this.stateValue.catalogue,n=t?z(t,e):void 0;return n?this.selectBuiltin(n):!1}clearSelection(){return this.invalidateRequests(),this.patch({selectedScene:void 0,selectedItem:void 0,content:void 0,catalogueContent:void 0,name:``,speedIndex:null,hasDefault:!1,editingCopy:!1,notice:void 0}),!0}async reloadSelectedCustom(e,t){if(!this.api||!this.device||!this.stateValue.catalogue)return;let n=this.captureRequest(),a=this.stateValue.catalogue;try{let o=await n.api.item(e.id);if(!i(o.content))throw Error(`This custom scene uses an unsupported definition.`);let s=o.content;if(s.template.sku!==a.sku)throw Error(`This custom scene targets ${s.template.sku}, not ${a.sku}.`);let l=r(a,s);if(!l)throw Error(`The source scene is not in this device catalogue.`);let u=await n.api.sceneDetail(n.deviceId,s.template.scene_id,s.template.effect_id),d=this.stateValue.selectedItem;if(!this.requestIsCurrent(n)||this.stateValue.saving||this.sceneDirty||d?.id!==t.id||d.version!==t.version||c(u.scene)!==c(l)){d?.id===t.id&&this.sceneDirty&&this.patch({notice:`This custom scene changed elsewhere. Reload it before saving.`});return}this.commitCustomSelection(o,l,s),this.patch({notice:void 0})}catch(e){this.requestIsCurrent(n)&&this.patch({notice:s(e)})}}commitCustomSelection(e,t,r){let i=B(r);this.patch({category:n(this.stateValue.category),selectedScene:t,selectedItem:e,editingCopy:!1,content:i,hasDefault:!1,name:e.name,speedIndex:i.kind===`native_effect`?i.speed_index:i.speed_index??t.speed?.default_index??null})}beginRequest(e){return this.invalidateDefaultWrites(),this.activeSelectionIdentity=e,this.requests.begin(this.requestState())}captureRequest(){return this.requests.capture(this.requestState())}invalidateRequests(){this.invalidateDefaultWrites(),this.requests.invalidate(),this.activeSelectionIdentity=void 0}requestIsCurrent(e){return!!(this.api&&this.device&&this.requests.isCurrent(e,this.requestState()))}requestState(){return{api:this.api,deviceId:this.device.config_entry_id,category:this.stateValue.category,selectionIdentity:this.activeSelectionIdentity}}currentDocument(){return JSON.stringify({name:this.stateValue.name,content:this.stateValue.content,speedIndex:this.stateValue.speedIndex,selectedItemId:this.stateValue.selectedItem?.id,selectedItemVersion:this.stateValue.selectedItem?.version})}setStateUpdatesAvailable(e){this.stateUpdatesAvailable!==e&&(this.stateUpdatesAvailable=e,e||(this.defaultWriter.invalidate(),this.invalidateRequests(),this.patch({saving:!1})))}patch(e){let t=e.notice,n=e.error;t&&this.effects.error(t,{title:`Scene operation failed`,key:`scene:${++this.errorSequence}`}),n&&this.effects.error(n,{title:`Scenes unavailable`,key:`scene-load:${n}`}),this.stateValue={...this.stateValue,...e,...t?{notice:void 0}:{}},this.effects.changed(this.stateValue),this.effects.workStateChanged(this.protectedWorkDirty)}};function G(e){return e===`all`||e===`custom`?e:Number(e)}var K=class extends D{constructor(){super(),this.library={items:[]},this.isAdmin=!1,this.autoSaveEnabled=!1,this.autoSaveFailed=!1,this.liveApplyEnabled=!0,this.externalEditActive=!1,this.editorTransitionEpoch=0,this.stateUpdatesAvailable=!0,this.workflow=new W({changed:e=>{this.viewState=e},initialSelectionFinished:e=>{this.emit(e?`scene-initial-selection-opened`:`scene-initial-selection-failed`)},libraryItemSaved:(e,t,n,r)=>{this.emit(`library-item-saved`,{item:e,configEntryId:t,selectionIsCurrent:n,panelTransitionEpoch:r})},error:(e,t)=>{this.emit(`studio-error`,{message:e,...t})},workStateChanged:e=>{this.emit(`scene-work-state-changed`,{dirty:e})}}),this.viewState=this.workflow.state}savePendingWork(){return this.workflow.savePendingWork(this.isAdmin,this.editorTransitionEpoch)}currentPreviewRequest(){return this.workflow.previewRequest(this.isAdmin,this.autoSaveEnabled)}refreshSelectedDefault(){this.workflow.refreshSelectedDefault()}invokeSaveShortcut(){return this.isAdmin?this.workflow.sceneDefaultDirty?(this.workflow.setCurrentDefault(!0),!0):this.viewState.saving?!1:this.viewState.selectedItem&&this.workflow.sceneDirty&&this.viewState.content?.kind!==`scene_layered`&&this.viewState.content?.kind!==`native_effect`?(this.workflow.save(!0,this.editorTransitionEpoch),!0):!1:!1}willUpdate(e){let n=e.get(`device`);(e.has(`device`)&&!t(n,this.device)||e.has(`api`))&&this.workflow.configure(this.api,this.device),e.has(`initialSelection`)&&this.workflow.setInitialSelection(this.initialSelection),e.has(`savedSceneSelection`)&&this.savedSceneSelection&&this.workflow.synchroniseSavedSelection(this.savedSceneSelection),e.has(`library`)&&this.workflow.setLibrary(this.library),e.has(`stateUpdatesAvailable`)&&this.workflow.setStateUpdatesAvailable(this.stateUpdatesAvailable)}updated(e){let n=e.get(`device`);(e.has(`device`)&&!t(n,this.device)||e.has(`api`))&&this.api&&this.device&&this.workflow.loadCatalogue(),e.has(`initialSelection`)&&this.viewState.catalogue&&this.initialSelection&&this.workflow.openInitialSelection(),e.has(`previewStatus`)&&this.workflow.previewStatusChanged(this.previewStatus);let r=l(this.viewState);if(!r){this.lastScrolledSelectionKey=void 0;return}let i=e.get(`viewState`);(r!==this.lastScrolledSelectionKey||e.has(`initialSelection`)&&this.initialSelection||e.has(`library`)||i?.category!==this.viewState.category||i?.catalogue!==this.viewState.catalogue)&&S(this.shadowRoot?.querySelector(`.scene-list`)??null)&&(this.lastScrolledSelectionKey=r)}render(){let e=this.viewState;return this.device?e.loading?F`<div class="status" role="status">Loading scenes...</div>`:e.error||!e.catalogue?F`
        <section class="empty">
          <h2>Scenes are unavailable</h2>
          <p>The scene catalogue could not be loaded.</p>
        </section>
      `:F`
      <aside class="sidebar item-sidebar scenes" aria-label="Scenes">
        <div class="scene-category-panel">
          <div class="field scene-category">
            <select
              aria-label="Scene category"
              @change=${e=>{let t=e.target;this.requestSceneTransition(()=>{this.dismissExternalEdit(),this.workflow.setCategory(G(t.value))},t)}}
            >
              ${this.sortedCategories.map(e=>F`
                  <option
                    value=${String(e.id)}
                    .selected=${this.viewState.category===e.id}
                  >
                    ${e.label}
                  </option>
                `)}
            </select>
          </div>
        </div>
        <div class="scene-list">
          ${this.filteredSceneEntries.map(e=>e.kind===`custom`?this.sceneButton(`custom:${e.item.id}`,e.label,()=>this.selectCustom(e.item,!0)):this.sceneButton(c(e.scene),e.label,()=>this.selectBuiltin(e.scene,!0)))}
        </div>
      </aside>

      ${this.externalEditActive||!e.selectedScene||!e.content?L:F`
            <section class="editor-surface detail">
              ${e.selectedScene&&e.content?this.renderDetail():L}
            </section>
          `}
    `:F`
        <section class="empty">
          <h2>No loaded device</h2>
          <p>Load a Govee light before browsing its native scenes.</p>
        </section>
      `}get sortedCategories(){return k(this.viewState.catalogue,this.workflow.compatibleCustomScenes)}get filteredSceneEntries(){return u(this.viewState,this.workflow.compatibleCustomScenes)}sceneButton(e,t,n){let r=l(this.viewState)===e;return F`
      <button
        class="selector scene ${r?`selected`:``}"
        type="button"
        aria-pressed=${r}
        @click=${e=>{let t=async()=>{this.dismissExternalEdit(),await n()},r=e.currentTarget;this.requestSceneTransition(t,r)}}
      >
        <span>${t}</span>
      </button>
    `}requestSceneTransition(e,t){this.requestTransition?this.requestTransition(e,t,this.externalEditActive?void 0:()=>this.workflow.savePendingWork(this.isAdmin,this.editorTransitionEpoch)).finally(()=>{t instanceof HTMLSelectElement&&(t.value=String(this.viewState.category))}):e()}renderDetail(){let e=this.viewState,t=e.selectedScene,n=t.speed,r=e.content?.kind===`native_effect`&&e.speedIndex===null?void 0:e.speedIndex??n?.default_index??0,i=e.selectedItem!==void 0||e.editingCopy,a=e.content?.kind===`scene_layered`||e.content?.kind===`native_effect`,o=e.selectedItem===void 0&&!e.editingCopy,s=e.selectedItem===void 0&&e.editingCopy,c=!e.name.trim()||e.selectedItem!==void 0&&!this.workflow.sceneDirty;return F`
      <header class="editor-heading">
        <div class="editor-title ${i?`mobile-editable-heading`:``}">
          ${i?F`
                <span class="mobile-name-label">Name</span>
                <div class="editable-title">
                  <input
                    class="editor-name"
                    aria-label="Scene name"
                    maxlength="128"
                    .value=${e.name}
                    ?disabled=${!this.isAdmin||e.saving}
                    @input=${e=>{this.workflow.setName(e.target.value)}}
                  />
                  ${this.workflow.sceneDirty?F`<span class="dirty-marker" aria-label="Unsaved changes">*</span>`:L}
                </div>
              `:F`<div class="mobile-redundant-heading">
                <h2>${t.display_name}</h2>
              </div>`}
          ${e.selectedItem?F`<small class="origin-name">
                ${x(e.selectedItem.origin,t.display_name)}
              </small>`:L}
        </div>
        <div class="actions">
          ${this.liveApplyEnabled?L:F`
                <button
                  class="secondary apply-action"
                  type="button"
                  ?disabled=${!this.isAdmin||e.saving||e.applying||!this.workflow.hasCurrentSceneContent()}
                  @click=${()=>void this.workflow.applyCurrent(this.isAdmin)}
                >
                  ${e.applying?`Applying...`:`Apply`}
                </button>
              `}
          ${s?F`
                <button
                  class="secondary"
                  type="button"
                  ?disabled=${e.saving}
                  @click=${this.cancelCopy}
                >
                  Cancel
                </button>
              `:L}
          ${o?f(this.workflow.sceneCatalogueDirty,this.workflow.sceneDefaultDirty,this.autoSaveEnabled,this.autoSaveFailed||e.defaultSaveFailed,this.liveApplyEnabled,this.workflow.defaultWritePending,e.selectedScene?.selector_only??!1).filter(e=>e.id!==`edit`||a).map(e=>this.renderNativeAction(e)):F`
                ${e.selectedItem?F`
                      <button
                        class="danger delete-action"
                        type="button"
                        ?disabled=${!this.isAdmin||e.saving}
                        @click=${this.requestDelete}
                      >
                        Delete
                      </button>
                    `:L}
                <button
                  class=${a?`secondary`:`primary`}
                  type="button"
                  ?disabled=${!this.isAdmin||e.saving||!this.workflow.hasCurrentSceneContent()||!a&&c}
                  @click=${a?this.edit:this.save}
                >
                  ${e.saving?`Saving...`:a?`Edit`:s?`Save As`:`Save`}
                </button>
              `}
        </div>
      </header>

      ${p(t)?this.renderParameters(n,r):L}
    `}renderNativeAction(e){let t=e.id===`save-default`?()=>void this.workflow.setCurrentDefault(this.isAdmin):e.id===`reset-default`?this.resetToCatalogue:(e.id,this.edit);return F`
      <button
        class=${e.style}
        type="button"
        ?disabled=${!this.isAdmin||this.viewState.saving||!this.workflow.hasCurrentSceneContent()||e.disabled===!0}
        @click=${t}
      >
        ${e.label}
      </button>
    `}renderParameters(e,t){return F`
      <div class="card scene-parameters">
        ${t===void 0?F`<p>Layer speeds are customised.</p>`:L}
        <div class="parameter-list">
          <govee-segmented-control
            .label=${`Speed`}
            .value=${t}
            .options=${g(e.option_count,e.default_index)}
            .disabled=${!this.isAdmin||this.viewState.saving}
            @value-changed=${e=>{this.workflow.setSpeedIndex(e.detail.value),this.autoSaveEnabled?this.liveApplyEnabled?this.dispatchPreview():this.workflow.setCurrentDefault(this.isAdmin):this.dispatchPreview()}}
          ></govee-segmented-control>
        </div>
      </div>
    `}async selectBuiltin(e,t=!1){await this.workflow.selectBuiltin(e)&&t&&this.dispatchPreview()}async selectCustom(e,t=!1){await this.workflow.selectCustom(e)&&t&&this.dispatchPreview()}edit(){let e=this.workflow.edit(this.isAdmin);e&&this.emit(`scene-edit-selected`,e)}cancelCopy(){this.workflow.cancelCopy()}save(){this.workflow.save(this.isAdmin,this.editorTransitionEpoch)}resetToCatalogue(){this.workflow.resetToCatalogue(this.isAdmin).then(()=>{this.autoSaveEnabled&&!this.liveApplyEnabled?this.workflow.setCurrentDefault(this.isAdmin):this.dispatchPreview()})}dispatchPreview(){let e=this.currentPreviewRequest();e&&this.emit(`scene-preview-requested`,e)}dismissExternalEdit(){this.externalEditActive&&this.emit(`scene-external-edit-cancelled`)}requestDelete(e){let t=this.viewState.selectedItem;if(!t||!this.isAdmin)return;let n=e.currentTarget;this.emit(`library-item-delete-requested`,{id:t.id,version:t.version,updated_at:t.updated_at,name:t.name,discardsOpenEdits:this.workflow.sceneDirty,returnFocus:n}),n.blur()}emit(e,t){this.dispatchEvent(new CustomEvent(e,{...t===void 0?{}:{detail:t},bubbles:!0,composed:!0}))}static{this.styles=[T,j,I,O,R,E,P,M,C`
      :host {
        display: contents;
      }
      :host([hidden]) { display: none !important; }
      h2, p { margin-top: 0; }
      h2 { margin-bottom: 0; font-size: var(--studio-heading-size); }
      .empty {
        max-width: var(--studio-empty-state-max-width);
        padding: var(--studio-editor-padding);
        border: var(--studio-border-width) solid var(--studio-border);
        border-radius: var(--studio-card-radius);
        background: var(--studio-card);
        line-height: var(--studio-reading-line-height);
      }
      .scene-parameters { margin-top: var(--studio-section-gap); }
      .scenes {
        display: grid;
        min-height: 0;
        overflow: hidden;
        padding: 0;
        grid-template-rows: auto minmax(0, 1fr);
      }
      .scene-category-panel {
        padding: var(--studio-sidebar-padding);
        border-bottom: var(--studio-border-width) solid var(--studio-border);
        background: var(--primary-background-color);
      }
      .scene-category {
        gap: 0;
        margin: 0;
      }
      .scene-list {
        min-height: 0;
        overflow-y: auto;
        padding: var(--studio-sidebar-padding);
        background: var(--primary-background-color);
      }
      .parameter-list { display: grid; gap: var(--studio-spacing-lg); }
      .empty p {
        margin-bottom: 0;
        color: var(--studio-muted);
        line-height: var(--studio-body-line-height);
      }
      .status {
        grid-column: 2 / -1;
        padding: var(--studio-message-block-padding)
          var(--studio-editor-padding);
      }
      .mobile-name-label {
        display: none;
      }
      /* Places scenes above detail beside HA's docked sidebar. */
      @media (min-width: 901px) and (max-width: 1320px) {
        .item-sidebar {
          grid-row: 1;
          grid-column: 2;
          max-height: var(--studio-stacked-list-max-height);
          border-inline-end: 0;
          border-bottom: var(--studio-border-width) solid var(--studio-border);
        }
        .editor-surface {
          grid-row: 2;
          grid-column: 2;
        }
      }
      /* The panel owns document-flow placement below this width. */
      @media (max-width: 900px) { :host { display: block; } }
      @media (max-width: 600px) {
        .detail {
          display: flex;
          flex-direction: column;
        }
        .editor-heading {
          display: contents;
        }
        .editor-heading .actions {
          order: 100;
          margin-top: var(--studio-section-gap);
        }
        .editor-heading .mobile-editable-heading {
          order: 99;
          margin-top: var(--studio-section-gap);
        }
        .mobile-name-label {
          display: block;
          color: var(--studio-muted);
          font-size: var(--studio-parameter-label-size);
          font-weight: var(--studio-parameter-label-weight);
        }
        .mobile-redundant-heading {
          display: none;
        }
      }
    `]}};N([e({attribute:!1})],K.prototype,`api`,void 0),N([e({attribute:!1})],K.prototype,`device`,void 0),N([e({attribute:!1})],K.prototype,`library`,void 0),N([e({type:Boolean})],K.prototype,`isAdmin`,void 0),N([e({type:Boolean})],K.prototype,`autoSaveEnabled`,void 0),N([e({type:Boolean})],K.prototype,`autoSaveFailed`,void 0),N([e({type:Boolean})],K.prototype,`liveApplyEnabled`,void 0),N([e({attribute:!1})],K.prototype,`savedSceneSelection`,void 0),N([e({attribute:!1})],K.prototype,`initialSelection`,void 0),N([e({type:Boolean})],K.prototype,`externalEditActive`,void 0),N([e({type:Number})],K.prototype,`editorTransitionEpoch`,void 0),N([e({attribute:!1})],K.prototype,`previewStatus`,void 0),N([e({type:Boolean})],K.prototype,`stateUpdatesAvailable`,void 0),N([e({attribute:!1})],K.prototype,`requestTransition`,void 0),N([h()],K.prototype,`viewState`,void 0),customElements.get(`govee-scene-browser`)||customElements.define(`govee-scene-browser`,K);export{K as GoveeSceneBrowser};