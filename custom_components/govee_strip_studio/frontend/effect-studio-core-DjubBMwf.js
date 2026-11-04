var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:ee,getOwnPropertyNames:te,getOwnPropertySymbols:ne,getPrototypeOf:re}=Object,ie=globalThis,ae=ie.trustedTypes,oe=ae?ae.emptyScript:``,se=ie.reactiveElementPolyfillSupport,ce=(e,t)=>e,le={toAttribute(e,t){switch(t){case Boolean:e=e?oe:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ue=(e,t)=>!l(e,t),de={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol(`metadata`),ie.litPropertyMetadata??=new WeakMap;var fe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=de){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ee(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??de}static _$Ei(){if(this.hasOwnProperty(ce(`elementProperties`)))return;let e=re(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ce(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ce(`properties`))){let e=this.properties,t=[...te(e),...ne(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?le:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?le:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??ue)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};fe.elementStyles=[],fe.shadowRootOptions={mode:`open`},fe[ce(`elementProperties`)]=new Map,fe[ce(`finalized`)]=new Map,se?.({ReactiveElement:fe}),(ie.reactiveElementVersions??=[]).push(`2.1.2`);var pe=globalThis,me=e=>e,he=pe.trustedTypes,ge=he?he.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,_e=`$lit$`,d=`lit$${Math.random().toFixed(9).slice(2)}$`,ve=`?`+d,ye=`<${ve}>`,f=document,be=()=>f.createComment(``),xe=e=>e===null||typeof e!=`object`&&typeof e!=`function`,Se=Array.isArray,Ce=e=>Se(e)||typeof e?.[Symbol.iterator]==`function`,we=`[ 	
\f\r]`,Te=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ee=/-->/g,De=/>/g,p=RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Oe=/'/g,ke=/"/g,Ae=/^(?:script|style|textarea|title)$/i,je=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),m=Symbol.for(`lit-noChange`),h=Symbol.for(`lit-nothing`),Me=new WeakMap,g=f.createTreeWalker(f,129);function Ne(e,t){if(!Se(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ge===void 0?t:ge.createHTML(t)}var Pe=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=Te;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===Te?c[1]===`!--`?o=Ee:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=p):(Ae.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=p):o=De:o===p?c[0]===`>`?(o=i??Te,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?p:c[3]===`"`?ke:Oe):o===ke||o===Oe?o=p:o===Ee||o===De?o=Te:(o=p,i=void 0);let ee=o===p&&e[t+1].startsWith(`/>`)?` `:``;a+=o===Te?n+ye:l>=0?(r.push(s),n.slice(0,l)+_e+n.slice(l)+d+ee):n+d+(l===-2?t:ee)}return[Ne(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Fe=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Pe(t,n);if(this.el=e.createElement(l,r),g.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=g.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(_e)){let t=u[o++],n=i.getAttribute(e).split(d),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ze:r[1]===`?`?Be:r[1]===`@`?Ve:Re}),i.removeAttribute(e)}else e.startsWith(d)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ae.test(i.tagName)){let e=i.textContent.split(d),t=e.length-1;if(t>0){i.textContent=he?he.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],be()),g.nextNode(),c.push({type:2,index:++a});i.append(e[t],be())}}}else if(i.nodeType===8){if(i.data===ve)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(d,e+1))!==-1;)c.push({type:7,index:a}),e+=d.length-1}}a++}}static createElement(e,t){let n=f.createElement(`template`);return n.innerHTML=e,n}};function _(e,t,n=e,r){if(t===m)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=xe(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=_(e,i._$AS(e,t.values),i,r)),t}var Ie=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??f).importNode(t,!0);g.currentNode=r;let i=g.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Le(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new He(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=g.nextNode(),a++)}return g.currentNode=f,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Le=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=_(this,e,t),xe(e)?e===h||e==null||e===``?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==m&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Ce(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&xe(this._$AH)?this._$AA.nextSibling.data=e:this.T(f.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Fe.createElement(Ne(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ie(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Me.get(e.strings);return t===void 0&&Me.set(e.strings,t=new Fe(e)),t}k(t){Se(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(be()),this.O(be()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=me(e).nextSibling;me(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Re=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=h}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=_(this,e,t,0),a=!xe(e)||e!==this._$AH&&e!==m,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=_(this,r[n+o],t,o),s===m&&(s=this._$AH[o]),a||=!xe(s)||s!==this._$AH[o],s===h?e=h:e!==h&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},ze=class extends Re{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},Be=class extends Re{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},Ve=class extends Re{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=_(this,e,t,0)??h)===m)return;let n=this._$AH,r=e===h&&n!==h||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==h&&(n===h||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},He=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){_(this,e)}},Ue={M:_e,P:d,A:ve,C:1,L:Pe,R:Ie,D:Ce,V:_,I:Le,H:Re,N:Be,U:Ve,B:ze,F:He},We=pe.litHtmlPolyfillSupport;We?.(Fe,Le),(pe.litHtmlVersions??=[]).push(`3.3.3`);var Ge=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Le(t.insertBefore(be(),e),e,void 0,n??{})}return i._$AI(e),i},Ke=globalThis,qe=class extends fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return m}};qe._$litElement$=!0,qe.finalized=!0,Ke.litElementHydrateSupport?.({LitElement:qe});var Je=Ke.litElementPolyfillSupport;Je?.({LitElement:qe}),(Ke.litElementVersions??=[]).push(`4.2.2`);var Ye={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:ue},Xe=(e=Ye,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function Ze(e){return(t,n)=>typeof n==`object`?Xe(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function Qe(e){return Ze({...e,state:!0,attribute:!1})}function $e(e,t,n){if(!e.startsWith(`light.`)||!Number.isInteger(n)||n<0||n>100)throw Error(`Choose a light and an RGB scale from 0 to 100.`);let r=[];if(t.forEach((e,t)=>{if(e===null)return;if(e.length!==3||e.some(e=>!Number.isInteger(e)||e<0||e>255))throw Error(`Static colours must contain three RGB bytes.`);let n=r.find(t=>tt(t.rgb_color,e));n?n.segments.push(t+1):r.push({segments:[t+1],rgb_color:[...e]})}),!r.length)throw Error(`Paint at least one logical segment before applying.`);return{type:`call_service`,domain:`govee_strip_studio`,service:`paint_segments`,target:{entity_id:e},service_data:{groups:r,rgb_scale:n}}}function et(e,t,n){return Math.min(n,Math.max(t,e))}function v(e,t,n){return et(Math.round(e),t,n)}function y(e){return[...e]}function b(e){return e.map(y)}function tt(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function nt(e){return`#${e.map(e=>e.toString(16).padStart(2,`0`)).join(``)}`}function rt(e){return[Number.parseInt(e.slice(1,3),16),Number.parseInt(e.slice(3,5),16),Number.parseInt(e.slice(5,7),16)]}function it(e,t){return e.localeCompare(t,`en-AU`,{sensitivity:`base`})}function at(e,t,n){return n!==!0&&(e||t===`always_hidden`)}function ot(e,t,n){if(!e||!t)return e!==t;if(e.user?.is_admin!==t.user?.is_admin||e.dockedSidebar!==t.dockedSidebar||e.kioskMode!==t.kioskMode)return!0;if(!n)return!1;let r=e.states?.[n],i=t.states?.[n];return r?.state!==i?.state||r?.attributes?.brightness!==i?.attributes?.brightness}function st(e){return e?.light_entity_id??void 0}function ct(e,t){let n=e?.[t]?.state;return n===`on`||n===`off`?n:`unavailable`}function lt(e){return et(e,0,255)/255*100}function ut(e,t){return`${e.split(`#`,1)[0]}#${new URLSearchParams({config_entry:t}).toString()}`}function dt(e,t,n){return e===void 0||t===n?e:e===t?n:t<n&&e>t&&e<=n?e-1:n<t&&e>=n&&e<t?e+1:e}function ft(e){let t=e?.querySelector(`.selector.selected`);if(!e||!t)return!1;let n=e.getBoundingClientRect(),r=t.getBoundingClientRect();return r.top<n.top?e.scrollTop-=n.top-r.top:r.bottom>n.bottom&&(e.scrollTop+=r.bottom-n.bottom),!0}function x(e){return e instanceof Error||typeof e==`object`&&e&&`message`in e&&typeof e.message==`string`?e.message:`An unexpected error occurred.`}function S(e){if(typeof e==`object`&&e&&`code`in e&&typeof e.code==`string`)return e.code}var pt=[1,2,0,3],mt=[0,1,2,3],ht=Symbol(`applied-area-segments`),gt=Symbol(`layer-label`);function _t(){return{kind:`advanced`,layers:[yt()]}}function C(e){return{...e,layers:e.layers.map(St)}}function vt(e){return{...e,template:{...e.template},effect:{layers:C({kind:`advanced`,layers:e.effect.layers}).layers}}}function yt(){return{area:{start_tenths:0,width_tenths:10},selection:{type:0,param_1:0,param_2:1},brightness_gradient:!1,brightness_patterns:[bt()],distribution:{method:1,backwards:!1},colour_speed:128,colour_retention:20,palette:[[255,0,0],[0,0,255]],selected_movement:xt(),overall_movement:xt(),priority:0,unknown_flags:0,excess:``}}function bt(){return{scope_high:255,scope_low:0,order:0,change_speed:128,brightest_retention:20,darkest_retention:20}}function xt(){return{enabled:!1,enter_exit:!1,direction:0,distance:1,speed:128,unknown_flags:0}}function St(e){let t={...e,area:{...e.area},selection:{...e.selection},brightness_patterns:e.brightness_patterns.map(e=>({...e})),distribution:{...e.distribution},palette:b(e.palette),selected_movement:{...e.selected_movement},overall_movement:{...e.overall_movement}},n=e[ht];n&&Object.defineProperty(t,ht,{value:{...n},configurable:!0});let r=e[gt];return r!==void 0&&Dt(t,r),t}function Ct(e){let t=e.layers.map((e,t)=>e[gt]??t+1);return Ot(t,e.layers.length)?t:e.layers.map((e,t)=>t+1)}function wt(e,t){let n=Array.isArray(t)&&Ot(t,e.layers.length)?t:e.layers.map((e,t)=>t+1);e.layers.forEach((e,t)=>Dt(e,n[t]))}function Tt(e,t){Dt(e,t)}function Et(e){let t=new Set(Ct(e)),n=1;for(;t.has(n);)n+=1;return n}function Dt(e,t){Object.defineProperty(e,gt,{value:t,configurable:!0,writable:!0})}function Ot(e,t){return e.length===t&&e.every(e=>Number.isInteger(e)&&typeof e==`number`&&e>0&&e<=255)&&new Set(e).size===e.length}function kt(e){return pt.includes(e)}function At(e){return e.param_1*256+e.param_2}function jt(e){let t=v(e,0,65535);return{param_1:t>>>8,param_2:t&255}}function Mt(e){return{algorithm:e.unknown_flags>>>4,type:e.unknown_flags&15|(e.brightness_gradient?2:0)}}function Nt(e,t){let n={...Mt(e),...t};return{brightness_gradient:!!(n.type&2),unknown_flags:n.algorithm<<4|n.type&13}}function Pt(e,t=!1){let n=e.native_diy,r=(n===501?[1,2]:n===502?[0,1]:n===504?[0,1,2]:n===506?t?e.layers[2].area.width_tenths===5?[2,3]:[2]:[0,1]:n===507?t?[0]:[1]:[0]).map(t=>e.layers[t].palette);return Array.from({length:Math.max(...r.map(e=>e.length))},(e,t)=>r.flatMap(e=>e[t]?[e[t]]:[])).flat()}function Ft(e,t,n){let r=C(e),i=r.layers,a=e.native_diy;if(a!==void 0&&a>=17&&a<=19)return t.palette&&i.forEach(e=>{e.palette=b(t.palette)}),t.speed!==void 0&&(a===19?i.forEach(e=>{e.colour_speed=t.speed,e.brightness_patterns=e.brightness_patterns.map(e=>({...e,change_speed:t.speed}))}):i.forEach(e=>{e.selected_movement.speed=t.speed})),r;let o=(e,t)=>{let n=e.map(e=>i[e].palette.length);if(t.length===n.reduce((e,t)=>e+t,0)){let r=0;for(let a=0;a<Math.max(...n);a++)e.forEach((e,o)=>{a<n[o]&&(i[e].palette[a]=[...t[r++]])})}else e.forEach((n,r)=>{let a=t.filter((t,n)=>n%e.length===r);a.length&&(i[n].palette=b(a))})},s=(e,t)=>{e.forEach(e=>{i[e].brightness_patterns=i[e].brightness_patterns.map(e=>({...e,...t}))})},c=i.map((e,t)=>t);if(t.palette&&o(a===501?[1,2]:a===502?[0,1]:a===504?[0,1,2]:a===506?[0,1]:a===507?[1]:[0],t.palette),t.secondary&&o(a===506?i[2].area.width_tenths===5?[2,3]:[2]:[0],t.secondary),t.background&&(i[a===501?0:1].palette=b([t.background])),t.speed!==void 0){let e=t.speed;if(a===503||a===504)i.forEach(t=>{t.overall_movement.speed=e});else{let t=a===501?[1,2]:a===505?[0]:c;t.forEach(t=>{i[t].colour_speed=e}),a!==501&&s(t,{change_speed:e}),a===505&&(i[0].selected_movement.speed=e)}}if(t.low!==void 0||t.high!==void 0){let e=a===501?[1,2]:[0],n=i[e[0]].brightness_patterns[0],r=t.low??n.scope_low;s(e,{scope_low:r,scope_high:t.high??n.scope_high}),s([a===501?0:1],{scope_low:Math.max(20,r),scope_high:Math.max(20,r)})}if(t.brightness!==void 0&&s(c,{scope_high:t.brightness,...a===507?{scope_low:t.brightness}:{}}),t.gradient!==void 0&&a===501&&i.forEach((e,n)=>{e.colour_retention=t.gradient?50:n===0?250:10}),t.starMin!==void 0||t.starMax!==void 0){if(n==null)throw Error(`Sky star size requires physical IC count`);let e=t.starMin??i[0].selection.param_2,r=t.starMax??i[0].selection.param_1;if(e<1||r<e||r>Math.min(25,Math.floor(n*4/5)))throw Error(`Sky star size is outside physical-IC bounds`);i.forEach(t=>{t.selection={type:2,param_1:r,param_2:e}})}if(t.direction!==void 0){let r=t.direction===0;if(a===503||a===504)i.forEach((e,t)=>{e.area={width_tenths:2,start_tenths:r?[0,4,7][t]:[9,5,2][t]},e.overall_movement.direction=r?0:2}),s(c,{order:r?2:0});else if(a===507)i[0].selected_movement.direction=r?2:0,i[1].selected_movement.direction=r?0:2;else if(a===506){if(n==null)throw Error(`Bloom direction requires physical IC count`);let a=t.secondary??Pt(e,!0);i.slice(2).forEach((e,i)=>{let o=t.direction===2;e.area={start_tenths:o?i*5:0,width_tenths:o?5:0},e.selection={type:1,...jt(o?Math.floor(n/2):i===0?n:1)},e.selected_movement.enter_exit=!0,e.selected_movement.direction=o?i*2:r?0:2,e.priority=+(!o&&i===0),o||(e.palette=i===0?b(a):[[0,0,0]])}),t.direction===2&&o([2,3],a)}}return r}function It(e){return mt.includes(e)}function Lt(e,t,n=10){let r=v(e,1,Math.max(1,Math.round(n)));return{start:v(t,0,r-1),end:r}}function Rt(e,t,n=10){let r=Math.max(1,Math.round(n)),i=v(e,0,r-1);return{start:i,end:v(t,i+1,r)}}function zt(e,t,n,r=10){let i=Math.max(1,Math.round(r)),a=v(e,0,i-1),o=v(t,a+1,i)-a,s=v(n,0,i-o);return{start:s,end:s+o}}function Bt(e,t,n){let r=Math.max(1,Math.round(n)),i=Vt(t),a=Math.min(r-1,Math.floor(v(e,0,9)*r/10)),o=Math.max(1,Math.round(v(i,1,10-v(e,0,9))*r/10)),s=Math.min(r,a+o);return{start:a,end:s,length:s-a}}function Vt(e){return e===0?10:e}function Ht(e,t,n){let r=Math.max(1,Math.round(n)),i=v(e,0,r-1),a=v(t,i+1,r),o=v(i*10/r,0,9);return{start:o,end:v(a*10/r,o+1,10)}}function Ut(e,t){let n=e[ht];if(n?.segmentCount===t&&n.start>=0&&n.end<=t&&n.end>n.start){let r=Ht(n.start,n.end,t);if(e.area.start_tenths===r.start&&e.area.width_tenths===r.end-r.start)return{start:n.start,end:n.end,length:n.end-n.start}}return Gt(e,t)}function Wt(e,t,n,r){let i=Math.max(1,Math.round(r)),a=v(t,0,i-1),o=v(n,a+1,i),s=Ht(a,o,i),c=St({...e,area:{start_tenths:s.start,width_tenths:s.end-s.start}});return Object.defineProperty(c,ht,{value:{segmentCount:i,start:a,end:o},configurable:!0}),c}function Gt(e,t){return Bt(e.area.start_tenths,e.area.width_tenths,t)}var Kt={label:`Style information`,text:`Dynamic uses the effect's more active response.  Calm uses a more restrained response.`};function qt(e){return e===!0?`calm`:`dynamic`}function Jt(e){return e===`calm`}function Yt(e){return e?`full`:`part`}function Xt(e){return e===`full`}function Zt(e){return{...e,relative_brightness:e.relative_brightness===null?null:{...e.relative_brightness}}}function Qt(e){return{...e,colour:e.colour===null?null:y(e.colour),parameters:structuredClone(e.parameters),...e.palette===void 0?{}:{palette:e.palette.map(y)},...e.zones===void 0?{}:{zones:structuredClone(e.zones)}}}var $t=[`cycle`,`clockwise`,`counter_clockwise`,`twinkle`,`gradient`,`breathe`,`upward`,`downward`,`native_2`,`native_15`,`native_19`,`native_20`],w=65536,en=16384,tn=262144,nn=524288,rn=65536,an=4335,on=`H617A`;function sn(e,t,n){if(!Number.isInteger(t)||t<0||t>=133)throw Error(`Native paint point is outside the 133-point geometry.`);let r=e.groups.map(e=>({colour:[...e.colour],indices:e.indices.filter(e=>e!==t)}));if(n!==null){let e=r.find(e=>tt(e.colour,n));e?e.indices.push(t):r.push({colour:[...n],indices:[t]})}return{...e,groups:r}}var cn=`govee_strip_studio.editor`;function ln(e,t){return e===`point`||e===`key_count`||e===`segment_count`?String(t):void 0}function un(e,t){let n=t?.trim();if(!e)return n?`Govee catalogue: ${n}`:void 0;switch(e.kind){case`authored`:return n?`Based on ${n}`:void 0;case`catalogue_template`:return`Govee catalogue: ${n??e.source_id??`template`}`;case`imported`:return`Imported${e.source_id?` from ${e.source_id}`:``}`;case`migrated`:return`Migrated effect${e.source_id?`: ${e.source_id}`:``}`;default:return n??e.kind}}function dn(){return{kind:`h617a_painted`,effect:`clockwise`,speed:50,brightness:100,segments:pn()}}function fn(e,t,n,r){if(e.kind===`native_effect`)return t?.sku===n&&e.model===n&&(t.native_zones?.length===e.layers.length?t.apply.multi===`supported`:e.family===798?t.apply.painted===`supported`:t.apply.single===`supported`);if(e.kind===`advanced`&&e.native_diy!==void 0)return t?.sku===n&&t?.templates?.some(t=>t.content.kind===`advanced`&&t.content.native_diy===e.native_diy)===!0;if(e.kind===`advanced`)return t===void 0||t.sku===n&&t.advanced_create!==!1&&t.supports.advanced!==`unsupported`;if(e.kind===`music_profile`){if(!t||t.sku!==n||e.model!==n||!t.music_modes.some(t=>t.id===e.mode))return!1;if(e.zones!==void 0){let i=t.templates?.find(t=>t.content.kind===`music_profile`&&t.content.mode===e.mode);if(i?.content.kind!==`music_profile`||i.content.zones===void 0||e.zones.length!==t.native_zones?.length||e.zones.length!==i.content.zones.length||!e.zones.every((i,a)=>i.id===t.native_zones[a].id&&i.mode!==e.mode&&fn({kind:`music_profile`,model:e.model,mode:i.mode,sensitivity:e.sensitivity,colour:null,calm:null,parameters:i.parameters,...i.palette===void 0?{}:{palette:i.palette}},t,n,r)))return!1}let i=t.music_settings[e.mode];return!i?.available||!Number.isInteger(e.sensitivity)||e.sensitivity<t.limits.music_sensitivity_min||e.sensitivity>t.limits.music_sensitivity_max||e.calm!==null&&(!i.style||typeof e.calm!=`boolean`)||e.colour!==null&&(!i.colour||e.colour.length!==3||!e.colour.every(e=>Number.isInteger(e)&&e>=0&&e<=255))||Object.keys(e.parameters).some(e=>!Object.hasOwn(i.parameters,e))||e.palette!==void 0&&(!i.palette||e.palette.length<i.palette.min||e.palette.length>i.palette.max||!e.palette.every(e=>e.length===3&&e.every(e=>Number.isInteger(e)&&e>=0&&e<=255)))?!1:Object.entries(i.parameters).every(([t,n])=>{let r=Object.hasOwn(e.parameters,t)?e.parameters[t]:n.default;return n.kind===`number`?typeof r==`number`&&Number.isInteger(r)&&r>=n.min&&r<=n.max:n.kind===`switch`?typeof r==`boolean`:typeof r==`string`&&n.options.includes(r)})}if(e.kind!==`h617a_painted`&&e.kind!==`h617a_single`&&e.kind!==`h617a_multi`&&e.kind!==`palette_diy`)return!0;if(!t||t.sku!==n)return!1;let i=t.limits;return e.kind===`h617a_painted`?(e.model===void 0||e.model===n)&&t.apply.painted===`supported`&&t.painted_effects.some(t=>t.id===e.effect)&&(e.addressing??`segments`)===(t.painted_addressing??`segments`)&&e.segments.length===(t.painted_addressing===`physical_ic`?t.physical_ic_count:r)&&e.speed>=i.speed_min&&e.speed<=i.speed_max&&e.brightness>=i.brightness_min&&e.brightness<=i.brightness_max:e.kind===`palette_diy`&&(e.model!==n||t.apply.palette_diy!==`supported`)||e.kind===`h617a_single`&&t.apply.single!==`supported`||e.palette.length<i.palette_min||e.palette.length>i.palette_max||e.kind===`h617a_multi`&&(t.apply.multi!==`supported`||e.effects.length<1||e.effects.length>i.multi_max||e.speed<i.speed_min||e.speed>i.speed_max)?!1:(e.kind===`h617a_multi`?e.effects:[e]).every(n=>{let r=t.effects.find(e=>e.family===n.family);return r!==void 0&&r.variations.some(e=>e.variant===n.variant)&&(e.kind!==`h617a_multi`||r.supports_multi)&&e.palette.length<=(r.palette_max??i.palette_max)&&e.speed>=(e.kind===`h617a_multi`?r.multi_rate_min??r.rate_min:r.rate_min)&&e.speed<=r.rate_max})}function pn(){return Array.from({length:15},()=>null)}function T(e,t,n,r){if(e===`h617a_painted`){let e=t.painted_effects.find(e=>e.id===`clockwise`)??t.painted_effects[0];if(!e)throw Error(`The target catalogue has no painted effects.`);return{...dn(),effect:e.id,...t.painted_addressing===`physical_ic`?{addressing:`physical_ic`,background:y(t.painted_background??[255,255,255]),segments:Array.from({length:t.physical_ic_count??0},()=>null)}:{},speed:Math.max(t.limits.speed_min,Math.min(50,t.limits.speed_max)),brightness:t.limits.brightness_max,...t.native_zones?{model:t.sku}:{}}}let i=e===`h617a_multi`||e===`h6179_mixed_diy`,a=(e===`h617a_multi`?t.effects.find(e=>e.supports_multi&&e.id===`flow`&&e.variations.length>0):void 0)??(i?t.effects.find(e=>e.supports_multi&&e.variations.length>0):n===void 0?t.effects[0]:t.effects.find(e=>e.family===n));if(!a)throw Error(`The custom-effect catalogue has no compatible effects.`);let o=r===void 0?(i?a.variations.find(e=>e.id===`clockwise`):void 0)??a.variations[0]:a.variations.find(e=>e.variant===r);if(!o)throw Error(`The target catalogue has no matching variation.`);let s={family:a.family,variant:o.variant};return e===`h617a_single`?{kind:e,...s,speed:Math.max(a.rate_min,Math.min(50,a.rate_max)),palette:a.palette_max===3?[[255,0,0],[0,255,0],[0,0,255]]:Sn(t).slice(0,a.palette_max)}:e===`h6179_single_diy`?{kind:e,model:t.sku,...s,speed:50,palette:Sn()}:e===`h6179_mixed_diy`?{kind:e,model:t.sku,components:[s],speed:50,palette:Sn()}:{kind:e,effects:[s],speed:Math.max(t.limits.speed_min,a.rate_min,Math.min(50,a.rate_max,t.limits.speed_max)),palette:Sn(t)}}function mn(e,t,n,r){if(e.sku!==t)throw Error(`Custom-effect catalogue ${e.sku} does not target ${t}.`);let i=e.effects.find(e=>e.family===n)??e.effects[0];if(!i)throw Error(`The custom-effect catalogue has no compatible effects.`);return{kind:`palette_diy`,model:t,family:n??i.family,variant:r??i.variations[0].variant,speed:Math.max(i.rate_min,Math.min(50,i.rate_max)),palette:Sn(e)}}function hn(e){return{...e,...e.background?{background:y(e.background)}:{},segments:e.segments.map(e=>e===null?null:y(e))}}function gn(e){return e.kind===`h617a_painted`?hn(e):e.kind===`h617a_single`||e.kind===`h6179_single_diy`?{...e,palette:b(e.palette)}:e.kind===`h6179_mixed_diy`?{...e,components:e.components.map(e=>({...e})),palette:b(e.palette)}:{...e,effects:e.effects.map(e=>({...e})),palette:b(e.palette)}}function _n(e){return{...e,palette:b(e.palette)}}function vn(e){return{...e,effect:{layers:C({kind:`advanced`,layers:e.effect.layers}).layers}}}function E(e){return e.kind===`native_effect`?structuredClone(e):e.kind===`advanced`?C(e):e.kind===`scene_layered`?vt(e):e.kind===`workshop`?vn(e):e.kind===`palette_diy`?_n(e):e.kind===`music_profile`?Qt(e):e.kind===`video_profile`?Zt(e):gn(e)}function yn(e){return{...e,body:structuredClone(e.body)}}function bn(e){return e.kind===`advanced`?e:{kind:`advanced`,layers:e.effect.layers}}function xn(e,t){return e.kind===`advanced`?C(t):e.kind===`workshop`?{...vn(e),effect:{layers:C(t).layers}}:{...vt(e),effect:{layers:C(t).layers}}}function Sn(e){let t=[[255,0,0],[255,127,0],[255,255,0],[0,255,0],[0,0,255],[0,255,255],[139,0,255]];if(!e)return t;let n=Math.max(e.limits.palette_min,Math.min(t.length,e.limits.palette_max));return Array.from({length:n},(e,n)=>y(t[n%t.length]))}function Cn(e){let t=[];for(let n of e.segments)if(n!==null&&!t.some(e=>tt(e,n))&&t.push(y(n)),t.length===8)break;return t}function D(e,t){return JSON.stringify({name:e.trim(),content:t,layer_labels:O(t)})}function O(e){if(On(e))return Ct(bn(e))}function wn(e){if(!On(e.content))return e;let t=e.extensions[cn],n=typeof t==`object`&&t&&!Array.isArray(t)?t.layer_labels:void 0;return wt(bn(e.content),n),e}function Tn(e){return e===`h617a_painted`||e===`h617a_single`||e===`h617a_multi`||e===`h6179_single_diy`||e===`h6179_mixed_diy`}function En(e){return typeof e==`object`&&!!e&&`kind`in e&&Tn(e.kind)}function k(e){return En(e)||typeof e==`object`&&!!e&&`kind`in e&&(Dn(e.kind)||e.kind===`palette_diy`||e.kind===`native_effect`||e.kind===`music_profile`||e.kind===`video_profile`)}function Dn(e){return e===`advanced`||e===`scene_layered`||e===`workshop`}function On(e){return Dn(e.kind)}function kn(e){return Tn(e)||Dn(e)||e===`palette_diy`||e===`native_effect`||e===`music_profile`||e===`video_profile`||e===`scene_builtin`||e===`scene_palette`}function An(e){switch(e){case`h617a_painted`:return`Paint`;case`h617a_single`:return`Single`;case`h617a_multi`:return`Multi`;case`h6179_single_diy`:return`Single DIY`;case`h6179_mixed_diy`:return`Mixed DIY`;case`advanced`:return`Advanced`;case`palette_diy`:return`Single`;case`native_effect`:return`Native layers`;case`workshop`:return`Workshop`;default:return`Custom`}}function jn(e){return Tn(e)||Dn(e)||e===`palette_diy`||e===`native_effect`||e===`music_profile`||!kn(e)}function Mn(e){return e===`h617a_multi`||e===`h6179_mixed_diy`?`multi-layer`:e===`music_profile`?`music`:e===`h617a_painted`||e===`h617a_single`||e===`h6179_single_diy`||e===`palette_diy`?`single-layer`:`advanced`}function Nn(e,t){return e?.id===t?.id&&e?.version===t?.version}function Pn(e,t,n,r){if(!e)return{action:`none`};let i=t.find(t=>t.id===e.id);return i?i.version===e.version?{action:`none`}:n?{action:`conflict`,summary:i}:{action:`reload`,summary:i}:r===e.id?{action:`none`}:{action:`removed`}}function Fn(e,t){let n=In(t);return[...e.filter(e=>e.id!==t.id),{id:t.id,version:t.version,updated_at:t.updated_at,name:t.name,kind:t.content.kind===`opaque`?t.content.source_kind:t.content.kind,content_hash:t.content_hash,origin:t.origin,...n?{model:n}:{},...t.content.kind===`scene_builtin`||t.content.kind===`scene_palette`||t.content.kind===`scene_layered`||t.content.kind===`native_effect`&&t.content.template!==null?{template:t.content.template}:{}}].sort((e,t)=>e.name.localeCompare(t.name))}function In(e){let t=e.content;return t.kind===`h617a_painted`&&t.model!==void 0||t.kind===`h6179_single_diy`||t.kind===`h6179_mixed_diy`||t.kind===`palette_diy`||t.kind===`native_effect`||t.kind===`workshop`||t.kind===`music_profile`||t.kind===`video_profile`?t.model:t.kind===`h617a_painted`||t.kind===`h617a_single`||t.kind===`h617a_multi`?e.target_hint?.model??`H617A`:t.kind===`scene_builtin`||t.kind===`scene_palette`||t.kind===`scene_layered`?t.template.sku:e.target_hint?.model??void 0}function Ln(e,t){let n=e.catalogue;return[...n?.templates?.filter(e=>(e.category===`single-layer`||e.category===`multi-layer`||e.category===`advanced`)&&(e.content.kind===`native_effect`||e.content.kind===`advanced`&&e.content.native_diy!==void 0)).map(e=>({kind:`native-diy`,key:e.id,label:e.label,category:e.category===`multi-layer`?`multi-layer`:e.category===`single-layer`?`single-layer`:`advanced`}))??[],...n?.painted_effects.length?[{kind:`paint`,key:`template:paint`,label:`Paint`,category:`single-layer`}]:[],...n?.effects.filter(e=>e.category===`single_layer`&&!n?.templates?.some(t=>t.content.kind===`native_effect`&&t.content.family===e.family)).map(e=>({kind:`single`,key:`template:single:${e.family}:${e.variations[0].variant}`,label:e.label,category:`single-layer`,family:e.family,variant:e.variations[0].variant}))??[],...n?.music_modes.map(e=>({kind:`music`,key:`template:music:${e.id}`,label:e.label,category:`music`,mode:e.id}))??[],...e.libraryItems.filter(e=>jn(e.kind)&&e.kind!==`video_profile`).map(e=>({kind:`saved`,key:`saved:${e.id}`,label:e.name,category:e.native_workflow===`multi`?`multi-layer`:Mn(e.kind),item:e}))].filter(t=>Vn(e,t)).filter(e=>t===`all`||t===`my-effects`&&e.kind===`saved`||e.category===t).sort((e,t)=>it(e.label,t.label))}function Rn(e,t){let n=[`h617a_painted`,`h617a_single`,`h617a_multi`].includes(t.kind);return t.model!==void 0&&t.model!==e.model&&!n?!1:t.kind===`video_profile`?!!e.catalogue?.video_modes.length:A(e,t.kind)}function zn(e,t){switch(t){case`all`:return Hn(e);case`music`:return!!e.catalogue?.music_modes.length;case`single-layer`:return A(e,`native_effect`)||A(e,`h617a_painted`)||A(e,`h617a_single`)||A(e,`h6179_single_diy`)||A(e,`palette_diy`);case`multi-layer`:return!!e.catalogue?.templates?.some(e=>e.category===`multi-layer`&&e.content.kind===`native_effect`)&&e.catalogue?.apply.multi===`supported`||A(e,`h617a_multi`)||A(e,`h6179_mixed_diy`);case`advanced`:return A(e,`advanced`)||A(e,`workshop`);case`my-effects`:return!1}}function A(e,t){let n=e.catalogue;return n?t===`native_effect`?n.workflows.some(e=>e.content_kind===t)&&(n.apply.single!==`unsupported`||n.apply.painted!==`unsupported`):t===`h617a_painted`?!!n.painted_effects.length&&n.apply.painted!==`unsupported`:t===`h617a_single`?!n.workflows.some(e=>e.content_kind===`h6179_single_diy`)&&!!n.effects.length&&n.apply.single!==`unsupported`:t===`h6179_single_diy`?n.workflows.some(e=>e.content_kind===t)&&!!n.effects.length&&n.apply.single!==`unsupported`:t===`palette_diy`?!!n.effects.length&&n.apply.palette_diy!==`unsupported`:t===`h617a_multi`?!n.workflows.some(e=>e.content_kind===`h6179_mixed_diy`||e.content_kind===`native_effect`)&&n.supports.multi!==`unsupported`&&n.apply.multi!==`unsupported`:t===`h6179_mixed_diy`?n.workflows.some(e=>e.content_kind===t)&&n.supports.multi!==`unsupported`&&n.apply.multi!==`unsupported`:t===`music_profile`?!!n.music_modes.length:t===`workshop`?n.supports.workshop!==`unsupported`&&n.apply.workshop!==`unsupported`:n.supports.advanced!==`unsupported`:!1}function Bn(e,t){if(!e.catalogue?.workflows.some(e=>e.content_kind===`native_effect`)){if(t===`single-layer`)return A(e,`h617a_single`)?`h617a_single`:A(e,`h6179_single_diy`)?`h6179_single_diy`:A(e,`palette_diy`)?`palette_diy`:A(e,`h617a_painted`)?`h617a_painted`:void 0;if(t===`multi-layer`)return A(e,`h617a_multi`)?`h617a_multi`:A(e,`h6179_mixed_diy`)?`h6179_mixed_diy`:void 0;if(t===`advanced`)return e.catalogue?.advanced_create!==!1&&A(e,`advanced`)?`advanced`:void 0}}function Vn(e,t){switch(t.kind){case`native-diy`:return zn(e,t.category);case`paint`:return A(e,`h617a_painted`);case`single`:return A(e,A(e,`h617a_single`)?`h617a_single`:A(e,`h6179_single_diy`)?`h6179_single_diy`:`palette_diy`);case`music`:return A(e,`music_profile`);case`saved`:return Rn(e,t.item)}}function Hn(e){let t=e.catalogue;return!!(t&&(t.painted_effects.length||t.effects.length||t.music_modes.length||t.templates?.some(e=>e.content.kind===`native_effect`||e.content.kind===`advanced`&&e.content.native_diy!==void 0)||t.supports.advanced!==`unsupported`))}var Un={all:`All`,"my-effects":`My Effects`,"multi-layer":`Multi-Layered`,music:`Reactive`,"single-layer":`Effects`,advanced:`Advanced`},Wn=[`single-layer`,`multi-layer`,`music`,`advanced`];function Gn(e){return Un[e]}function Kn(e){return Wn.filter(t=>zn(e,t)).map(e=>({category:e,label:Gn(e)}))}var qn=16,Jn=4096,j=1024,Yn=16384,M=2**53-1;function N(e,t,n){let r=F(e,t);return(r.length===0||r.length>n)&&q(`${t} must contain 1 to ${n} characters`),r}function Xn(e,t,n){let r=F(e,t);return r.length>n&&q(`${t} must not exceed ${n} characters`),r}function P(e,t){let n=F(e,t);return n.length%2==0&&/^[0-9a-f]*$/i.test(n)||q(`${t} must be hexadecimal`),n}function F(e,t){return typeof e!=`string`&&q(`${t} must be a string`),e}function I(e,t){return typeof e!=`boolean`&&q(`${t} must be a boolean`),e}function L(e,t){return e!==`supported`&&e!==`unsupported`&&e!==`evidence_gap`&&q(`${t} is invalid`),e}function R(e,t,n,r=M){return(typeof e!=`number`||!Number.isSafeInteger(e)||e<n||e>r)&&q(`${t} must be an integer from ${n} to ${r}`),e}function z(e,t,n){let r=R(e,n,1);return r!==t&&q(`${n} is incompatible with this editor`),r}function B(e,t,n,r){return e===null?null:R(e,t,n,r)}function V(e,t){return R(e,t,0,255)}function H(e,t,n){let r=F(e,n);return t.includes(r)||q(`${n} is invalid`),r}function U(e,t){return(typeof e!=`object`||!e||Array.isArray(e))&&q(`${t} must be an object`),e}function W(e,t,n){return Array.isArray(e)||q(`${t} must be an array`),e.length>n&&q(`${t} must not exceed ${n} items`),e}function G(e,t,n){let r=e.map(t);new Set(r).size!==r.length&&q(`${n} must be unique`)}function K(e,t,n,r=Jn){let i=0,a=(e,n,o)=>{if(i+=1,i>r&&q(`${t} must not exceed ${r} JSON values`),o>qn&&q(`${t} must not exceed ${qn} nested levels`),e!==null&&typeof e!=`boolean`){if(typeof e==`number`)(!Number.isFinite(e)||Number.isInteger(e)&&!Number.isSafeInteger(e))&&q(`${n} must be a finite JSON number`);else if(typeof e==`string`)e.length>Yn&&q(`${n} must not exceed ${Yn} characters`);else if(Array.isArray(e))e.length>1024&&q(`${n} must not exceed ${j} items`),e.forEach((e,t)=>a(e,`${n}[${t}]`,o+1));else if(typeof e==`object`&&e){let t=Object.entries(e);t.length>1024&&q(`${n} must not exceed ${j} fields`),t.forEach(([e,t])=>{e.length>Yn&&q(`${n} contains an oversized key`),a(t,`${n}.${e}`,o+1)})}else q(`${n} contains a non-JSON value`)}};a(e,t,0);let o=JSON.stringify(e);o===void 0&&q(`${t} must contain JSON values`),new TextEncoder().encode(o).byteLength>n&&q(`${t} must not exceed ${n} bytes`)}function q(e){throw Error(`Malformed Effect Studio server payload: ${e}.`)}var Zn=[`native_scenes`,`edited_palette_scenes`,`layered_scenes`,`painted`,`single`,`multi`,`native_music`,`video`,`palette_diy`,`advanced`,`workshop`],Qn=[`studio`,`home_assistant`,`planned`];function $n(e){let t=U(e,`video controls`),n=U(t.white_balance,`white balance control`);return{saturation_min:R(t.saturation_min,`video saturation minimum`,0,100),white_balance:{representation:H(n.representation,[`position`,`scalar`],`white balance representation`),minimum:R(n.minimum,`white balance minimum`,0,255),maximum:R(n.maximum,`white balance maximum`,0,255),default:R(n.default,`white balance default`,0,255)},brightness_zones:W(t.brightness_zones,`brightness zones`,6).map(e=>H(e,[`left`,`top`,`right`,`bottom`,`strip_left`,`strip_right`],`brightness zone`))}}var er=[`capture_region`,`saturation`,`sound_effects`,`white_balance`,`relative_brightness`,`blank_screen`,`black_border`];function tr(e,t){K(e,`custom-effect catalogue`,nn,rn);let n=U(e,`custom-effect catalogue`),{models:r,...i}=n,a=nr(r,t),o=rr(i,`custom-effect catalogue`,on,t);if(JSON.stringify(o)!==JSON.stringify(a.H617A))throw Error(`Malformed Effect Studio server payload: legacy custom-effect catalogue view does not match models.${on}.`);return z(n.schema_version,12,`catalogue schema`),{...o,schema_version:12,sku:on,models:a}}function nr(e,t){let n=U(e,`custom-effect catalogue models`);if(!Object.hasOwn(n,`H617A`))throw Error(`Malformed Effect Studio server payload: missing catalogue model ${on}.`);return Object.fromEntries(Object.entries(n).map(([e,n])=>{let r=N(e,`catalogue model key`,255);return[r,rr(n,`catalogue model ${r}`,r,t)]}))}function rr(e,t,n,r){K(e,t,tn,rn);let i=U(e,t),a=U(i.limits,`${t} limits`),o=U(i.supports,`${t} support capabilities`),s=U(i.apply,`${t} Apply capabilities`),c=N(i.sku,`${t} SKU`,255);if(c!==n)throw Error(`Malformed Effect Studio server payload: ${t} is keyed as ${n} but declares ${c}.`);let l=R(a.music_sensitivity_min,`${t} minimum music sensitivity`,0,100),u=R(a.music_sensitivity_max,`${t} maximum music sensitivity`,0,100);l>u&&q(`${t} music sensitivity limits are inverted`);for(let e of[`palette`,`speed`,`brightness`])Number(a[`${e}_min`])>Number(a[`${e}_max`])&&q(`${t} ${e} limits are inverted`);return i.painted_addressing!==void 0&&W(i.painted_background,`painted background`,3).length!==3&&q(`painted background must contain three channels`),{sku:c,...i.native_zones===void 0?{}:{native_zones:W(i.native_zones,`${t} native zones`,255).map(e=>{let t=U(e,`native zone`);return{id:N(t.id,`native zone ID`,255),label:N(t.label,`native zone label`,128),segment_count:R(t.segment_count,`native logical segments`,1,255),physical_ic_budget:R(t.physical_ic_budget,`native physical budget`,1,65535)}})},diy_slot_policy:H(i.diy_slot_policy??`fixed`,[`fixed`,`approved_observed`],`${t} DIY slot policy`),advanced_create:i.advanced_create===void 0||I(i.advanced_create,`${t} unrestricted advanced creation`),native_diy_templates:W(i.native_diy_templates??[],`${t} native DIY templates`,j).map((e,n)=>{let r=U(e,`${t} native DIY templates[${n}]`),i=R(r.rate_min,`native DIY minimum rate`,0,255),a=R(r.rate_max,`native DIY maximum rate`,i,255);return{template_id:R(r.template_id,`native DIY template ID`,0,65535),body_effect:R(r.body_effect,`native DIY body effect`,0,65535),upload_subtype:R(r.upload_subtype,`native DIY upload subtype`,0,255),layer_count:R(r.layer_count,`native DIY layer count`,1,255),palette_min:R(r.palette_min,`native DIY minimum palette`,1,8),palette_max:R(r.palette_max,`native DIY maximum palette`,1,8),rate_field:H(r.rate_field,[`selected_movement_speed`,`colour_brightness_speed`],`native DIY rate field`),rate_min:i,rate_max:a,rate_default:R(r.rate_default,`native DIY default rate`,i,a)}}),...i.painted_addressing===void 0?{}:{painted_addressing:H(i.painted_addressing,[`segments`,`physical_ic`],`painted addressing`),painted_background:W(i.painted_background,`painted background`,3).map(e=>R(e,`painted background channel`,0,255))},...i.native_actions===void 0?{}:{native_actions:W(i.native_actions,`native actions`,255).map(e=>{let t=U(e,`native action`);return{id:F(t.id,`native action ID`),label:F(t.label,`native action label`)}})},painted_effects:cr(i.painted_effects,`${t} painted-effect templates`),effects:lr(i.effects,`${t} custom-effect templates`),music_modes:ur(i.music_modes,`${t} music modes`),music_settings:ir(i.music_settings),video_modes:ur(i.video_modes,`${t} video modes`),video_settings:ar(i.video_settings,`${t} video settings`),...i.video_controls===void 0?{}:{video_controls:$n(i.video_controls)},templates:or(i.templates,`${t} catalogue templates`,n,r),workshop_templates:dr(i.workshop_templates,`${t} Workshop templates`,n,r),workflows:sr(i.workflows,`${t} release workflows`),supports:{multi:L(o.multi,`${t} Multi support`),advanced:L(o.advanced,`${t} advanced support`),workshop:L(o.workshop,`${t} Workshop support`)},limits:{speed_min:R(a.speed_min,`${t} minimum speed`,0,100),speed_max:R(a.speed_max,`${t} maximum speed`,0,100),brightness_min:R(a.brightness_min,`${t} minimum brightness`,0,100),brightness_max:R(a.brightness_max,`${t} maximum brightness`,0,100),palette_min:R(a.palette_min,`${t} minimum palette`,1,85),palette_max:R(a.palette_max,`${t} maximum palette`,1,85),multi_max:R(a.multi_max,`${t} maximum Multi effects`,1,4),music_sensitivity_min:l,music_sensitivity_max:u},apply:{painted:L(s.painted,`${t} Painted Apply capability`),single:L(s.single,`${t} Single Apply capability`),multi:L(s.multi,`${t} Multi Apply capability`),palette_diy:L(s.palette_diy,`${t} palette DIY Apply capability`),workshop:L(s.workshop,`${t} Workshop Apply capability`)}}}function ir(e){return Object.fromEntries(Object.entries(U(e,`music settings`)).map(([e,t])=>{let n=U(t,`music mode settings`),r=U(n.parameters,`music parameters`),i=n.palette===void 0?void 0:U(n.palette,`music palette`),a=i?R(i.min,`music palette minimum`,1,8):1,o=i?R(i.max,`music palette maximum`,a,8):8,s=i?W(i.default,`music default palette`,o).map(e=>{let t=W(e,`music palette colour`,3);return t.length!==3&&q(`music palette colour`),t.map(e=>R(e,`music palette channel`,0,255))}):[];return i&&s.length<a&&q(`music default palette`),[e,{available:I(n.available,`music availability`),style:I(n.style,`music style`),calm_default:I(n.calm_default,`music default style`),colour:I(n.colour,`music colour`),evidence:n.evidence===null?null:N(n.evidence,`music evidence`,1024),palette_size:R(n.palette_size,`music palette size`,0,255),...i?{palette:{min:a,max:o,default:s}}:{},parameters:Object.fromEntries(Object.entries(r).map(([e,t])=>{let n=U(t,`music parameter`),r=H(n.kind,[`number`,`switch`,`select`],`music parameter kind`),i=R(n.min,`music minimum`,0,16777215),a=R(n.max,`music maximum`,i,16777215),o=W(n.options,`music options`,255).map(e=>N(e,`music option`,128));return[e,{kind:r,default:r===`number`?R(n.default,`music default`,i,a):r===`switch`?I(n.default,`music default`):H(n.default,o,`music default`),min:i,max:a,options:o}]}))}]}))}function ar(e,t){let n=W(e,t,er.length).map((e,n)=>H(e,er,`${t}[${n}]`));return G(n,e=>e,t),n}function or(e,t,n,r){let i=W(e,t,j).map((e,i)=>{let a=U(e,`${t}[${i}]`),o=r(a.content);return o.kind!==`h617a_painted`&&o.kind!==`h617a_single`&&o.kind!==`h6179_single_diy`&&o.kind!==`palette_diy`&&o.kind!==`music_profile`&&o.kind!==`video_profile`&&o.kind!==`advanced`&&o.kind!==`native_effect`&&q(`${t}[${i}] content is not a supported built-in template`),`model`in o&&o.model!==n&&q(`${t}[${i}] content does not target ${n}`),o.kind===`advanced`&&o.native_diy===void 0&&q(`${t}[${i}] native DIY template identity`),{id:N(a.id,`${t}[${i}] ID`,255),label:N(a.label,`${t}[${i}] label`,128),category:H(a.category,[`single-layer`,`multi-layer`,`music`,`video`,`advanced`],`${t}[${i}] category`),content:o}});return G(i,e=>e.id,`${t} IDs`),i}function sr(e,t){let n=W(e,t,Zn.length).map((e,n)=>{let r=U(e,`${t}[${n}]`);return{id:H(r.id,Zn,`${t}[${n}] ID`),label:N(r.label,`${t}[${n}] label`,128),content_kind:N(r.content_kind,`${t}[${n}] content kind`,255),application:H(r.application,Qn,`${t}[${n}] application`)}});return G(n,e=>e.id,`${t} IDs`),n}function cr(e,t){let n=W(e,t,j).map((e,n)=>{let r=U(e,`${t}[${n}]`);return{id:H(r.id,$t,`${t} ID`),label:N(r.label,`${t} label`,128)}});return G(n,e=>e.id,`${t} IDs`),n}function lr(e,t){let n=W(e,t,j).map((e,n)=>{let r=U(e,`${t}[${n}]`),i=W(r.variations,`${t}[${n}].variations`,j);if(i.length===0)throw Error(`Malformed Effect Studio server payload: custom-effect template has no variations.`);let a={...r.palette_min===void 0?{}:{palette_min:R(r.palette_min,`family palette minimum`,1,85)},...r.secondary_palette===void 0?{}:{secondary_palette:(()=>{let e=U(r.secondary_palette,`secondary palette bounds`),t=R(e.min,`secondary palette minimum`,1,85);return{min:t,max:R(e.max,`secondary palette maximum`,t,85)}})()},...r.palette_labels===void 0?{}:{palette_labels:(()=>{let e=W(r.palette_labels,`native palette labels`,2);return e.length!==2&&q(`native palette labels require two names`),e.map(e=>N(e,`palette label`,128))})()},...r.palette_max===void 0?{}:{palette_max:R(r.palette_max,`family palette maximum`,1,85)},rate_min:R(r.rate_min,`${t} minimum rate`,0,100),...r.multi_rate_min===void 0?{}:{multi_rate_min:R(r.multi_rate_min,`${t} Multi minimum rate`,0,100)},rate_max:R(r.rate_max,`${t} maximum rate`,0,100),id:N(r.id,`${t}[${n}] ID`,255),label:N(r.label,`${t}[${n}] label`,128),family:R(r.family,`${t}[${n}] family`,0,255),variations:i.map((e,r)=>{let i=U(e,`${t}[${n}].variations[${r}]`);return{id:N(i.id,`${t}[${n}].variations[${r}] ID`,255),label:N(i.label,`${t}[${n}].variations[${r}] label`,128),variant:R(i.variant,`${t}[${n}].variations[${r}] variant`,0,255)}}),supports_multi:I(r.supports_multi,`${t}[${n}] Multi support`),rate:H(r.rate,[`speed`,`sensitivity`,`none`],`${t}[${n}] rate parameter`),category:H(r.category,[`single_layer`],`${t}[${n}] category`)};return G(a.variations,e=>e.id,`${t}[${n}] variation IDs`),a.rate_min>a.rate_max&&q(`${t} rate limits are inverted`),G(a.variations,e=>String(e.variant),`${t} variation values`),a});return G(n,e=>e.id,`${t} IDs`),G(n,e=>String(e.family),`${t} family values`),n}function ur(e,t){let n=W(e,t,j).map((e,n)=>{let r=U(e,`${t}[${n}]`);return{id:N(r.id,`${t}[${n}] ID`,255),label:N(r.label,`${t}[${n}] label`,128)}});return G(n,e=>e.id,`${t} IDs`),n}function dr(e,t,n,r){let i=W(e,t,j).map((e,i)=>{let a=U(e,`${t}[${i}]`),o=r(a.content);return(o.kind!==`workshop`||o.model!==n)&&q(`${t}[${i}] content does not target ${n}`),{id:N(a.id,`${t}[${i}] ID`,255),label:N(a.label,`${t}[${i}] label`,128),content:o}});return G(i,e=>e.id,`${t} IDs`),i}var fr=[`queued`,`writing`,`written`,`confirmed`,`unconfirmed`,`failed`,`cancelled`],pr=[`exact_session`,`activation_match`,`settings_match`,`mode_match`,`write_completed`,`unknown`];function mr(e){return tr(e,J)}function hr(e){let t=U(e,`editor info`),n=U(t.limits,`editor limits`);return{integration_version:t.integration_version==null?null:N(t.integration_version,`integration version`,255),api_version:R(t.api_version,`API version`,1),effect_schema_version:R(t.effect_schema_version,`effect schema version`,1),compiler_version:R(t.compiler_version,`compiler version`,1),limits:{effect_name:z(n.effect_name,128,`effect-name limit`),effect_document_bytes:z(n.effect_document_bytes,w,`effect-document limit`),devices:z(n.devices,512,`device limit`),library_items:z(n.library_items,256,`library-item limit`),deployment_records:z(n.deployment_records,128,`deployment limit`),scene_catalogue_entries:z(n.scene_catalogue_entries,512,`scene catalogue limit`)}}}function gr(e){let t=W(e,`devices`,512).map((e,t)=>{let n=U(e,`devices[${t}]`),r=U(n.custom_effects,`devices[${t}].custom_effects`),i=U(n.profiles,`devices[${t}].profiles`),a=N(n.model,`devices[${t}].model`,255);return{config_entry_id:N(n.config_entry_id,`devices[${t}].config_entry_id`,255),light_entity_id:vr(n.light_entity_id,`devices[${t}].light_entity_id`),model:a,...n.static_composition===void 0?{}:{static_composition:I(n.static_composition,`static composition capability`)},...n.catalogue===void 0?{}:{catalogue:rr(n.catalogue,`devices[${t}].catalogue`,a,J)},support_quality:H(n.support_quality,[`experimental`,`supported`],`devices[${t}].support_quality`),confirmation_issue:n.confirmation_issue==null?null:R(n.confirmation_issue,`confirmation issue`,1),...n.show_experimental_feedback===void 0?{}:{show_experimental_feedback:I(n.show_experimental_feedback,`experimental feedback preference`)},hw_version:n.hw_version==null?null:N(n.hw_version,`hardware version`,255),fw_version:n.fw_version==null?null:N(n.fw_version,`firmware version`,255),subordinate_20_version:n.subordinate_20_version==null?null:N(n.subordinate_20_version,`sub-controller 20 version`,255),subordinate_21_version:n.subordinate_21_version==null?null:N(n.subordinate_21_version,`sub-controller 21 version`,255),display_name:N(n.display_name,`devices[${t}].display_name`,255),segment_count:R(n.segment_count,`devices[${t}].segment_count`,0,65535),...n.physical_ic_count==null?{}:{physical_ic_count:R(n.physical_ic_count,`physical IC count`,1,32767)},...n.music_settings===void 0?{}:{music_settings:ir(n.music_settings)},...n.retained_music_edit===void 0?{}:{retained_music_edit:_r(n.retained_music_edit)},custom_effects:{painted:L(r.painted,`painted capability`),single:L(r.single,`single capability`),multi:L(r.multi,`multi capability`),palette_diy:L(r.palette_diy,`palette DIY capability`),advanced:L(r.advanced,`advanced capability`),workshop:L(r.workshop,`Workshop capability`)},profiles:{music:L(i.music,`music profile capability`),video:L(i.video,`video profile capability`)},...n.video_control_states===void 0?{}:{video_control_states:Object.fromEntries(Object.entries(U(n.video_control_states,`video control states`)).map(([e,t])=>[e,L(t,`video control ${e}`)]))},readback:N(n.readback,`devices[${t}].readback`,255),effect_categories:Hr(n.effect_categories,`devices[${t}].effect_categories`,255),preview_health:Er(n.preview_health),active_state:n.active_state===null?null:br(n.active_state,`devices[${t}].active_state`),...n.active_workspace===void 0?{}:{active_workspace:n.active_workspace===null?null:xr(n.active_workspace,`devices[${t}].active_workspace`)}}});return G(t,e=>e.config_entry_id,`device IDs`),t}function _r(e){if(e===null)return null;let t=U(e,`retained music edit`);return{mode:N(t.mode,`retained music mode`,255),revision:R(t.revision,`music body revision`,0,2**53-1),parameters:U(t.parameters,`retained music parameters`),calm:t.calm===null?null:I(t.calm,`retained music style`),settings:ir({retained:t.settings}).retained}}function vr(e,t){if(e==null)return null;let n=N(e,t,255);return n.startsWith(`light.`)&&n.length!==6||q(`${t} must identify a light entity`),n}function yr(e){let t=U(e,`user state`);return K(t.navigation,`user-state navigation`,en),{owner_id:N(t.owner_id,`user-state owner`,255),recent_colours:W(t.recent_colours,`user-state recent colours`,12).map((e,t)=>Z(e,`user-state recent colours[${t}]`)),selected_config_entry_id:Kr(t.selected_config_entry_id,`user-state selected config entry ID`),navigation:U(t.navigation,`user-state navigation`)}}function br(e,t){let n=U(e,t),r=n.active_effect===null?null:Sr(n.active_effect,`${t}.active_effect`),i=H(n.confidence,pr,`${t}.confidence`);return r!==null&&r.confidence!==i&&q(`${t} active-effect confidence does not match the observation`),{config_entry_id:N(n.config_entry_id,`${t}.config_entry_id`,255),mode:N(n.mode,`${t}.mode`,255),observed_at:qr(n.observed_at,`${t}.observed_at`),confidence:i,diy_code:B(n.diy_code,`${t}.diy_code`,0,65535),effect:n.effect===null?null:N(n.effect,`${t}.effect`,255),native_mode:n.native_mode===null?null:N(n.native_mode,`${t}.native_mode`,255),matched_operation_id:n.matched_operation_id===null?null:N(n.matched_operation_id,`${t}.matched_operation_id`,255),active_effect:r}}function xr(e,t){let n=U(e,t);return{config_entry_id:N(n.config_entry_id,`${t}.config_entry_id`,255),model:N(n.model,`${t}.model`,255),selector_label:N(n.selector_label,`${t}.selector_label`,128),content:J(n.content),content_hash:Wr(n.content_hash,`${t}.content_hash`),origin:Ur(n.origin),observable_signature:N(n.observable_signature,`${t}.observable_signature`,255),updated_at:qr(n.updated_at,`${t}.updated_at`),generation:R(n.generation,`${t}.generation`,1,M),confidence:H(n.confidence,pr,`${t}.confidence`)}}function Sr(e,t){let n=U(e,t),r=U(n.origin,`${t}.origin`),i=H(n.source_kind,[`saved_effect`,`snapshot`,`deleted_effect`],`${t}.source_kind`),a=n.item_id===null?null:N(n.item_id,`${t}.item_id`,255),o=B(n.item_version,`${t}.item_version`,1,M);return(i===`saved_effect`?a===null||o===null:a!==null||o!==null)&&q(`${t} has inconsistent library identity`),{source_kind:i,selector_label:N(n.selector_label,`${t}.selector_label`,255),content_hash:Wr(n.content_hash,`${t}.content_hash`),origin:{kind:N(r.kind,`${t}.origin.kind`,255),source_id:r.source_id===null?null:N(r.source_id,`${t}.origin.source_id`,255)},observable_signature:N(n.observable_signature,`${t}.observable_signature`,255),confidence:H(n.confidence,pr,`${t}.confidence`),item_id:a,item_version:o}}function Cr(e){let t=U(e,`library snapshot`),n={generation:t.generation===void 0?0:R(t.generation,`library generation`,0,M),items:W(t.items,`library items`,256).map((e,t)=>{let n=U(e,`library items[${t}]`),r=n.template===void 0?void 0:Lr(n.template,`library items[${t}].template`),i=n.model===void 0?void 0:N(n.model,`library items[${t}].model`,255);return{id:N(n.id,`library item ID`,255),version:Jr(n.version,`library item version`,1),updated_at:qr(n.updated_at,`library item timestamp`),name:N(n.name,`library item name`,128),kind:N(n.kind,`library item kind`,255),content_hash:Wr(n.content_hash,`library item content hash`),origin:Ur(n.origin),...i?{model:i}:{},...r?{template:r}:{},...n.native_workflow===void 0?{}:{native_workflow:H(n.native_workflow,[`single`,`multi`],`native workflow`)}}})};return G(n.items,e=>e.id,`library item IDs`),n}function wr(e){K(e,`library item`,w);let t=U(e,`library item`),n=t.target_hint===void 0?void 0:U(t.target_hint,`target hint`);return wn({schema_version:z(t.schema_version,2,`effect schema version`),id:N(t.id,`effect ID`,255),version:Jr(t.version,`effect version`,1),updated_at:qr(t.updated_at,`effect timestamp`),name:N(t.name,`effect name`,128),content:J(t.content),content_hash:Wr(t.content_hash,`effect content hash`),origin:Ur(t.origin),extensions:Vr(t.extensions,`effect extensions`),...n?{target_hint:{model:n.model===null?null:N(n.model,`target model`,255),segment_count:n.segment_count===null?null:R(n.segment_count,`target segment count`,1,65535)}}:{}})}function Tr(e){let t=U(e,`preview status`);return{session_id:N(t.session_id,`preview session ID`,255),sequence:R(t.sequence,`preview sequence`,0,M),config_entry_id:N(t.config_entry_id,`preview config entry ID`,255),phase:H(t.phase,fr,`preview phase`),content_kind:N(t.content_kind,`preview content kind`,255),confidence:H(t.confidence,pr,`preview confidence`),error_code:t.error_code===null?null:N(t.error_code,`preview error code`,255),error_message:t.error_message===null?null:N(t.error_message,`preview error message`,128),write_disposition:H(t.write_disposition,[`not_started`,`may_have_started`,`completed`,`unknown`],`preview write disposition`),persist_default:I(t.persist_default,`preview persist default`),scene_id:t.scene_id===null?null:R(t.scene_id,`preview scene ID`,0,65535),effect_id:t.effect_id===null?null:R(t.effect_id,`preview effect ID`,0,65535),default_action:t.default_action===null?null:H(t.default_action,[`set`,`reset`],`preview default action`)}}function Er(e){let t=U(e,`preview health`);return{config_entry_id:N(t.config_entry_id,`preview health config entry ID`,255),revision:R(t.revision,`preview health revision`,0,M),phase:H(t.phase,[`healthy`,`checking`,`degraded`],`preview health phase`),incident_id:t.incident_id===null?null:N(t.incident_id,`preview health incident ID`,255),error_code:t.error_code===null?null:N(t.error_code,`preview health error code`,255),error_message:t.error_message===null?null:N(t.error_message,`preview health error message`,128),write_disposition:H(t.write_disposition,[`not_started`,`may_have_started`,`completed`,`unknown`],`preview health write disposition`),checked_at:qr(t.checked_at,`preview health checked time`)}}function Dr(e){K(e,`scene catalogue`,tn,rn);let t=U(e,`scene catalogue`);return{schema_version:R(t.schema_version,`scene catalogue schema`,1),sku:N(t.sku,`scene catalogue SKU`,255),enabled:I(t.enabled,`scene catalogue enabled`),categories:W(t.categories,`scene categories`,j).map((e,t)=>{let n=U(e,`scene categories[${t}]`);return{id:R(n.id,`scene category ID`,0,65535),name:N(n.name,`scene category name`,128)}}),scenes:W(t.scenes,`scenes`,512).map(Nr)}}function Or(e){let t=U(e,`scene detail`);K({scene:t.scene,content:t.content,catalogue_content:t.catalogue_content},`scene detail`,w*2);let n=J(t.content),r=J(t.catalogue_content);return n.kind!==`scene_builtin`&&n.kind!==`scene_palette`&&n.kind!==`scene_layered`&&(n.kind!==`native_effect`||n.template===null)&&q(`scene detail content is unsupported`),r.kind!==`scene_builtin`&&r.kind!==`scene_palette`&&r.kind!==`scene_layered`&&(r.kind!==`native_effect`||r.template===null)&&q(`scene detail catalogue content is unsupported`),{scene:Nr(t.scene),content:n,catalogue_content:r,has_default:I(t.has_default,`scene stored default`)}}function kr(e){let t=U(e,`catalogue-template default detail`);K({content:t.content,catalogue_content:t.catalogue_content},`catalogue-template default detail`,w*2);let n=J(t.content),r=J(t.catalogue_content),i=new Set([`native_effect`,`h617a_painted`,`h617a_single`,`h6179_single_diy`,`palette_diy`,`music_profile`,`video_profile`,`advanced`]);return i.has(n.kind)&&i.has(r.kind)||q(`catalogue-template default content is unsupported`),(n.kind===`advanced`&&n.native_diy===void 0||r.kind===`advanced`&&r.native_diy===void 0)&&q(`catalogue-template native DIY identity is missing`),{template_id:N(t.template_id,`catalogue-template ID`,255),content:n,catalogue_content:r,has_default:I(t.has_default,`catalogue-template stored default`)}}function J(e){K(e,`effect content`,w);let t=U(e,`effect content`),n=N(t.kind,`effect content kind`,255);switch(n){case`native_effect`:return Ar(t);case`h617a_painted`:let e=t.addressing===void 0?`segments`:H(t.addressing,[`segments`,`physical_ic`],`painted addressing`),r=W(t.segments,`painted segments`,e===`physical_ic`?255:15);return e===`segments`&&r.length!==15&&q(`painted effect must contain exactly 15 segments`),r.length===0&&q(`painted effect must not be empty`),{kind:n,...t.addressing===void 0?{}:{addressing:e},...t.model===void 0?{}:{model:N(t.model,`painted model`,255)},...t.background===void 0?{}:{background:Z(t.background,`painted background`)},effect:H(t.effect,$t,`painted effect`),speed:R(t.speed,`painted speed`,0,100),brightness:R(t.brightness,`painted brightness`,0,100),segments:r.map((e,t)=>e===null?null:Z(e,`painted segments[${t}]`))};case`h617a_single`:return{kind:n,family:R(t.family,`Single family`,0,254),variant:R(t.variant,`Single variant`,0,255),speed:R(t.speed,`Single speed`,0,100),palette:X(t.palette,`Single palette`,85)};case`h617a_multi`:return{kind:n,effects:W(t.effects,`Multi effects`,4).map((e,t)=>{let n=U(e,`Multi effects[${t}]`);return{family:R(n.family,`Multi family`,0,254),variant:R(n.variant,`Multi variant`,0,255)}}),speed:R(t.speed,`Multi speed`,0,100),palette:X(t.palette,`Multi palette`,85)};case`h6179_single_diy`:return{kind:n,model:H(t.model,[`H6179`],`H6179 Single DIY model`),family:R(t.family,`H6179 Single DIY family`,0,2),variant:R(t.variant,`H6179 Single DIY variant`,0,0),speed:R(t.speed,`H6179 Single DIY speed`,0,100),palette:X(t.palette,`H6179 Single DIY palette`,8)};case`h6179_mixed_diy`:{let e=W(t.components,`H6179 Mixed DIY components`,4);return e.length===0&&q(`H6179 Mixed DIY components must not be empty`),{kind:n,model:H(t.model,[`H6179`],`H6179 Mixed DIY model`),components:e.map((e,t)=>{let n=U(e,`H6179 Mixed DIY components[${t}]`);return{family:R(n.family,`H6179 Mixed DIY components[${t}] family`,0,2),variant:R(n.variant,`H6179 Mixed DIY components[${t}] variant`,0,0)}}),speed:R(t.speed,`H6179 Mixed DIY speed`,0,100),palette:X(t.palette,`H6179 Mixed DIY palette`,8)}}case`palette_diy`:return{kind:n,model:N(t.model,`palette DIY model`,255),family:R(t.family,`palette DIY family`,0,255),variant:R(t.variant,`palette DIY variant`,0,255),speed:R(t.speed,`palette DIY speed`,0,100),palette:X(t.palette,`palette DIY palette`,85)};case`music_profile`:return{kind:n,model:N(t.model,`music profile model`,255),mode:N(t.mode,`music profile mode`,255),sensitivity:R(t.sensitivity,`music profile sensitivity`,0,100),colour:Rr(t.colour,`music profile colour`),...t.palette===void 0?{}:{palette:X(t.palette,`music profile palette`,8)},calm:zr(t.calm,`music profile calm`),parameters:Vr(t.parameters,`music profile parameters`),...t.zones===void 0?{}:{zones:W(t.zones,`music zones`,2).map(e=>{let t=Vr(e,`music zone`),n=t.body===void 0?void 0:P(t.body,`music zone body`);if(n!==void 0&&(n.length<2||n.length>512))throw Error(`Music zone body exceeds its byte budget`);return{id:N(t.id,`music zone identity`,255),mode:N(t.mode,`music zone mode`,255),parameters:Vr(t.parameters,`music zone parameters`),...t.palette===void 0?{}:{palette:X(t.palette,`music zone palette`,8)},...n===void 0?{}:{body:n}}})}};case`video_profile`:if([t.blank_screen_detection,t.blank_screen_low_brightness_duration_seconds,t.blank_screen_same_tone_duration_seconds].some(e=>e!==void 0)&&(t.blank_screen==null||[t.blank_screen_detection,t.blank_screen_low_brightness_duration_seconds,t.blank_screen_same_tone_duration_seconds].some(e=>e===void 0)))throw Error(`Blank-screen policy requires the toggle, detection and both durations`);return{kind:n,model:N(t.model,`video profile model`,255),mode:N(t.mode,`video profile mode`,255),full_screen:zr(t.full_screen,`video profile full-screen flag`),saturation:B(t.saturation,`video profile saturation`,0,100),sound_effects:zr(t.sound_effects,`video profile sound-effects flag`),sound_effects_softness:B(t.sound_effects_softness,`video profile sound-effects softness`,1,100),white_balance_position:B(t.white_balance_position,`video profile white-balance position`,1,255),...t.white_balance_value===void 0?{}:{white_balance_value:R(t.white_balance_value,`video white balance`,0,255)},relative_brightness:Gr(t.relative_brightness,`video profile relative brightness`),blank_screen:zr(t.blank_screen,`video profile blank-screen flag`),...t.black_border===void 0?{}:{black_border:I(t.black_border,`video black border`)},...t.blank_screen_detection===void 0?{}:{blank_screen_detection:R(t.blank_screen_detection,`blank-screen detection`,1,2),blank_screen_low_brightness_duration_seconds:R(t.blank_screen_low_brightness_duration_seconds,`low-brightness seconds`,0,65535),blank_screen_same_tone_duration_seconds:R(t.blank_screen_same_tone_duration_seconds,`same-tone seconds`,0,65535)}};case`advanced`:let i=t.native_diy===void 0?void 0:R(t.native_diy,`native DIY template`,17,507);return i!==void 0&&!(i>=17&&i<=19||i>=501&&i<=507)&&q(`native DIY template`),{kind:n,layers:Pr(t.layers,`Advanced layers`),...i===void 0?{}:{native_diy:i}};case`workshop`:{let e=U(t.effect,`Workshop effect`);return{kind:n,model:N(t.model,`Workshop model`,255),template:N(t.template,`Workshop template`,255),effect:{layers:Pr(e.layers,`Workshop layers`)},raw_param:P(t.raw_param,`Workshop source parameter`),trailing_padding:R(t.trailing_padding,`Workshop trailing padding`,0,an)}}case`scene_builtin`:return{kind:n,template:Lr(t.template,`scene template`),speed_index:B(t.speed_index,`scene speed index`,0,255)};case`scene_palette`:return Mr(t);case`scene_layered`:{let e=U(t.effect,`layered scene effect`),r=jr(t.trailing_padding,`layered scene trailing padding`);return{kind:n,template:Lr(t.template,`layered scene template`),effect:{layers:Pr(e.layers,`layered scene layers`)},speed_index:B(t.speed_index,`layered scene speed index`,0,255),raw_param:P(t.raw_param,`layered scene raw parameter`),...r===void 0?{}:{trailing_padding:r}}}default:{let{kind:e,...r}=t;return{kind:`opaque`,source_kind:n,body:r}}}}function Ar(e){let t=H(e.model,[`H60A6`,`H607C`],`native model`),n=t===`H607C`,r=R(e.family,`native family`,0,65535);(!n&&r!==797&&r!==798||n&&r>255)&&q(`unsupported native family`);let i=W(e.layers,`native layers`,255);return i.length||q(`native effects require at least one layer`),n&&i.length>2&&q(`native zoned effects cannot add layers`),{kind:`native_effect`,model:t,family:r,layers:i.map(e=>{let t=U(e,`native layer`),i=H(t.type,[`diy`,`paint`,`opaque`],`native layer type`);if(i===`opaque`)return{type:i,kind:V(t.kind,`native kind`),data:P(t.data,`native data`)};if(i===`diy`)return!n&&r!==797&&q(`DIY layer does not match native family`),{type:i,kind:V(t.kind,`native kind`),speed:R(t.speed,`native speed`,0,100),palette:W(t.palette,`native palette`,255).map(e=>Z(e,`native colour`)),parameters:P(t.parameters,`native parameters`),parameter:V(t.parameter,`native parameter`),flag:V(t.flag,`native flag`),points:W(t.points,`native points`,255).map(e=>V(e,`native point`)),direction:V(t.direction,`native direction`),angle:R(t.angle,`native angle`,0,65535),opaque:P(t.opaque,`native opaque`),...n?{enabled:I(t.enabled??!0,`native effect section`),secondary_palette:W(t.secondary_palette??[],`native secondary palette`,255).map(e=>Z(e,`native colour`))}:{}};r!==798&&q(`paint layer does not match native family`);let a=P(t.opaque,`native paint opaque`);return a.length!==8&&q(`native paint opaque must contain four bytes`),{type:i,groups:W(t.groups,`native groups`,65535).map(e=>{let t=U(e,`native group`);return{colour:Z(t.colour,`native group colour`),indices:W(t.indices,`native indices`,65535).map(e=>R(e,`native physical point`,0,132))}}),action:V(t.action,`native action`),speed:V(t.speed,`native speed`),brightness:V(t.brightness,`native brightness`),priority:V(t.priority,`native priority`),duration:R(t.duration,`native duration`,0,65535),opaque:a,data_opaque:P(t.data_opaque,`native data opaque`),trailing:P(t.trailing,`native trailing`)}}),backgrounds:W(e.backgrounds,`native backgrounds`,255).map(e=>Z(e,`native background`)),background_flag:V(e.background_flag,`native background flag`),background:Z(e.background,`native background`),background_brightness:V(e.background_brightness,`native background brightness`),show_type:V(e.show_type,`native show type`),opaque:P(e.opaque,`native opaque`),preset_id:B(e.preset_id,`native preset`,0,255),template:e.template===null?null:Lr(e.template,`native scene template`),speed_index:B(e.speed_index,`native scene speed index`,0,255)}}function jr(e,t){if(e!==void 0)return R(e,t,0,an)}function Mr(e){let t=R(e.layout,`palette scene layout`,0,1)===0?0:1,n=W(e.steps,`palette scene steps`,255).map((e,n)=>{let r=U(e,`palette scene steps[${n}]`),i=t===0?(r.inline_colour!==null&&q(`palette scene steps[${n}].inline_colour must be null for layout 0`),null):Z(r.inline_colour,`palette scene steps[${n}].inline_colour`),a=r.inline_extra===void 0||r.inline_extra===null?void 0:t===0?q(`palette scene steps[${n}].inline_extra is not valid for layout 0`):R(r.inline_extra,`palette scene steps[${n}].inline_extra`,0,65535);return{value:R(r.value,`palette scene steps[${n}].value`,0,65535),colour:Z(r.colour,`palette scene steps[${n}].colour`),inline_colour:i,...a===void 0?{}:{inline_extra:a}}});t===1&&n.some(e=>e.inline_extra!==void 0)&&n.some(e=>e.inline_extra===void 0)&&q(`palette scene layout 1 steps must agree on inline_extra presence`);let r=X(e.palette,`palette scene shared palette`,255,!0);t===1&&r.length!==0&&q(`palette scene layout 1 must not have a shared palette`);let i;e.config_flags!==void 0&&(i=R(e.config_flags,`palette scene config flags`,0,255),i&-9&&q(`palette scene config flags must only set reserved config bits`));let a=jr(e.trailing_padding,`palette scene trailing padding`);return{kind:`scene_palette`,template:Lr(e.template,`palette scene template`),layout:t,brightness_flag:I(e.brightness_flag,`palette scene brightness flag`),steps:n,palette:r,speed_index:B(e.speed_index,`palette scene speed index`,0,255),...i===void 0?{}:{config_flags:i},...a===void 0?{}:{trailing_padding:a}}}function Y(e){return e.kind===`opaque`?(K(e.body,`opaque content`,w),{...e.body,kind:N(e.source_kind,`opaque source kind`,255)}):e}function Nr(e){let t=U(e,`scene`),n=F(t.parameter_kind,`scene parameter kind`);n!==`none`&&n!==`palette`&&n!==`layers`&&n!==`opaque`&&q(`scene parameter kind is invalid`);let r=t.speed===null?null:(()=>{let e=U(t.speed,`scene speed`),n=R(e.option_count,`scene speed option count`,1,256),r=e.layer_speeds===void 0?void 0:W(e.layer_speeds,`native scene speed rows`,256).map(e=>W(e,`native scene layer speeds`,255).map(e=>R(e,`native scene layer speed`,0,100)));return r!==void 0&&(r.length!==n||r.some(e=>!e.length))&&q(`native scene speed rows must match the option count and contain layer speeds`),{option_count:n,...r===void 0?{}:{layer_speeds:r},default_index:R(e.default_index,`scene default speed`,0,255)}})();return{scene_id:R(t.scene_id,`scene ID`,0,65535),effect_id:R(t.effect_id,`scene effect ID`,0,65535),category_id:R(t.category_id,`scene category ID`,0,65535),category:N(t.category,`scene category`,128),name:N(t.name,`scene name`,128),variant:Xn(t.variant,`scene variant`,255),display_name:N(t.display_name,`scene display name`,128),scene_type:R(t.scene_type,`scene type`,0,255),selector_only:I(t.selector_only,`scene selector-only flag`),parameter_kind:n,speed:r}}function Pr(e,t){return W(e,t,255).map((e,n)=>Fr(e,`${t}[${n}]`))}function Fr(e,t){let n=U(e,t),r=U(n.area,`${t}.area`),i=U(n.selection,`${t}.selection`),a=U(n.distribution,`${t}.distribution`);return{area:{start_tenths:R(r.start_tenths,`${t}.area.start_tenths`,0,15),width_tenths:R(r.width_tenths,`${t}.area.width_tenths`,0,15)},selection:{type:V(i.type,`${t}.selection.type`),param_1:V(i.param_1,`${t}.selection.param_1`),param_2:V(i.param_2,`${t}.selection.param_2`)},brightness_gradient:I(n.brightness_gradient,`${t}.brightness_gradient`),brightness_patterns:W(n.brightness_patterns,`${t}.brightness_patterns`,255).map((e,n)=>{let r=U(e,`${t}.brightness_patterns[${n}]`);return{scope_high:V(r.scope_high,`brightness scope high`),scope_low:V(r.scope_low,`brightness scope low`),order:V(r.order,`brightness order`),change_speed:V(r.change_speed,`brightness change speed`),brightest_retention:V(r.brightest_retention,`brightest retention`),darkest_retention:V(r.darkest_retention,`darkest retention`)}}),distribution:{method:R(a.method,`${t}.distribution.method`,0,127),backwards:I(a.backwards,`${t}.distribution.backwards`),...a.extensions===void 0?{}:{extensions:Yr(a.extensions,112,`distribution extensions`)}},colour_speed:V(n.colour_speed,`${t}.colour_speed`),colour_retention:V(n.colour_retention,`${t}.colour_retention`),palette:X(n.palette,`${t}.palette`,255,!0),selected_movement:Ir(n.selected_movement,`${t}.selected_movement`),overall_movement:Ir(n.overall_movement,`${t}.overall_movement`),priority:V(n.priority,`${t}.priority`),unknown_flags:Yr(n.unknown_flags,253,`${t}.unknown_flags`),excess:P(n.excess,`${t}.excess`)}}function Ir(e,t){let n=U(e,t);return{enabled:I(n.enabled,`${t}.enabled`),enter_exit:I(n.enter_exit,`${t}.enter_exit`),direction:R(n.direction,`${t}.direction`,0,3),distance:V(n.distance,`${t}.distance`),speed:V(n.speed,`${t}.speed`),unknown_flags:Yr(n.unknown_flags,232,`${t}.unknown_flags`)}}function Lr(e,t){let n=U(e,t);return{sku:N(n.sku,`${t}.sku`,255),scene_id:R(n.scene_id,`${t}.scene_id`,0,65535),effect_id:R(n.effect_id,`${t}.effect_id`,0,65535),catalogue_schema_version:R(n.catalogue_schema_version,`${t}.catalogue_schema_version`,1,M)}}function X(e,t,n,r=!1){let i=W(e,t,n);return!r&&i.length===0&&q(`${t} must not be empty`),i.map((e,n)=>Z(e,`${t}[${n}]`))}function Z(e,t){let n=W(e,t,3);return n.length!==3&&q(`${t} must contain three channels`),n.map(e=>R(e,`${t} channel`,0,255))}function Rr(e,t){return e===null?null:Z(e,t)}function zr(e,t){return e===null?null:I(e,t)}function Br(e,t){let n=U(e,t);return{left:R(n.left,`${t}.left`,1,100),top:R(n.top,`${t}.top`,1,100),right:R(n.right,`${t}.right`,1,100),bottom:R(n.bottom,`${t}.bottom`,1,100),...n.strip_left===void 0&&n.strip_right===void 0?{}:{strip_left:R(n.strip_left,`${t}.strip_left`,1,100),strip_right:R(n.strip_right,`${t}.strip_right`,1,100)}}}function Vr(e,t){return K(e,t,w),U(e,t)}function Hr(e,t,n){return Array.isArray(e)||q(`${t} must be an array`),e.map((e,r)=>N(e,`${t}[${r}]`,n))}function Ur(e){let t=U(e,`effect origin`);return{kind:N(t.kind,`effect origin kind`,255),source_id:Kr(t.source_id,`effect origin source ID`)}}function Wr(e,t){let n=P(e,t);return n.length!==64&&q(`${t} must contain 64 hexadecimal characters`),n}function Gr(e,t){return e===null?null:Br(e,t)}function Kr(e,t){return e===null?null:N(e,t,255)}function qr(e,t){let n=N(e,t,64);return(!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(n)||Number.isNaN(Date.parse(n)))&&q(`${t} must be an ISO 8601 timestamp with a UTC offset`),n}function Jr(e,t,n){return R(e,t,n,M)}function Yr(e,t,n){let r=V(e,n);return r&~t&&q(`${n} must only set reserved bits, not bits explicit fields carry`),r}function Xr(e){return e.api_version===18&&e.effect_schema_version===2&&e.compiler_version===6}var Zr=`govee_strip_studio/editor`,Qr=class{constructor(e){this.hass=e}setLibrarySnapshotHandler(e){this.librarySnapshotHandler=e}setOverwriteConfirmation(e){this.overwriteConfirmation=e}async info(){return hr(await this.call(`info`))}async devices(){return gr(Q(await this.call(`devices`),`devices`))}async device(e){return gr([Q(await this.call(`device`,{config_entry_id:e}),`device`)])[0]}subscribeDevice(e,t,n){return this.hass.connection.subscribeMessage(e=>{try{t(gr([Q(e,`device`)])[0])}catch(e){n?.(ri(e))}},{type:`${Zr}/device/subscribe`,config_entry_id:e})}async customCatalogue(){return mr(Q(await this.call(`custom/catalogue`),`catalogue`))}async editRetainedMusic(e,t,n,r){return _r(Q(await this.call(`music/edit_retained`,{config_entry_id:e,mode:t.mode,expected_body_revision:t.revision,parameters:n,...r===void 0?{}:{calm:r}}),`retained_music_edit`))}async library(){return Cr(await this.call(`library/list`))}async userState(){return yr(Q(await this.call(`user_state/get`),`user_state`))}async updateUserState(e,t){return yr(Q(await this.call(`user_state/update`,{...e?{selected_config_entry_id:e}:{},navigation:t}),`user_state`))}async item(e){return wr(Q(await this.call(`library/get`,{item_id:e}),`item`))}async createItem(e,t,n){let r={name:e,content:Y(t),...O(t)?{layer_labels:O(t)}:{}};try{return await this.libraryMutation(`library/create`,r)}catch(r){return this.resolveNameCollision(r,e,t,void 0,n)}}async updateItem(e,t,n,r){let i={item_id:e.id,name:t,content:Y(n),...O(n)?{layer_labels:O(n)}:{},expected_version:e.version,expected_updated_at:e.updated_at};try{return await this.libraryMutation(`library/update`,i)}catch(i){return this.resolveNameCollision(i,t,n,e.id,r)}}async deleteItem(e){let t=await this.call(`library/delete`,{item_id:e.id,expected_version:e.version,expected_updated_at:e.updated_at});if(await this.acceptLibrarySnapshot(Cr(Q(t,`library`)))===!1)throw new ti}async nameStatus(e,t){let n=Q(await this.call(`library/name_status`,{name:e,...t?{excluding_item_id:t}:{}}),`status`);if(typeof n!=`object`||!n||Array.isArray(n))throw Error(`Malformed Effect Studio server payload: name status must be an object.`);let r=n;if(r.kind!==`available`&&r.kind!==`reserved`&&r.kind!==`same_item`&&r.kind!==`saved`)throw Error(`Malformed Effect Studio server payload: name status kind is invalid.`);return r.kind===`saved`?{kind:`saved`,item:Cr({generation:0,items:[r.item]}).items[0]}:{kind:r.kind}}async applySavedEffect(e,t,n){await this.call(`apply`,{config_entry_id:e,item_id:t.id,expected_version:t.version,updated_at:new Date().toISOString(),...n===void 0?{}:{diy_code:n}})}async applySnapshot(e,t,n,r,i){await this.call(`apply_snapshot`,{config_entry_id:e,name:t,content:Y(n),updated_at:new Date().toISOString(),...r??{},...i===void 0?{}:{diy_code:i}})}async applyScene(e,t,n){await this.call(`scene/apply`,{config_entry_id:e,scene_id:t.scene_id,effect_id:t.effect_id,...n===null?{}:{speed_index:n}})}async closePreviewSession(e){await this.call(`preview/session/close`,{session_id:e})}async previewSnapshot(e,t,n,r,i,a=!1,o,s){await this.call(`preview/apply_snapshot`,{session_id:e,sequence:t,config_entry_id:n,name:r,content:Y(i),updated_at:new Date().toISOString(),persist_default:a,...o??{},...s===void 0?{}:{diy_code:s}})}async previewScene(e,t,n,r,i,a=!1){await this.call(`preview/apply_scene`,{session_id:e,sequence:t,config_entry_id:n,scene_id:r.scene_id,effect_id:r.effect_id,...i===null?{}:{speed_index:i},updated_at:new Date().toISOString(),persist_default:a})}async cancelPreview(e,t){await this.call(`preview/cancel`,{session_id:e,...t?{config_entry_id:t}:{}})}async sceneCatalogue(e){return Dr(Q(await this.call(`scene/catalogue/list`,{config_entry_id:e}),`catalogue`))}sceneDetail(e,t,n){return this.call(`scene/catalogue/get`,{config_entry_id:e,scene_id:t,effect_id:n}).then(Or)}resetScene(e,t){return this.call(`scene/reset`,{config_entry_id:e,scene_id:t.scene_id,effect_id:t.effect_id}).then(Or)}setSceneDefault(e,t){return this.call(`scene/default/set`,{config_entry_id:e,scene_id:t.template.scene_id,effect_id:t.template.effect_id,content:Y(t),updated_at:new Date().toISOString()}).then(Or)}templateDefault(e,t){return this.call(`template/default/get`,{config_entry_id:e,template_id:t}).then(kr)}setTemplateDefault(e,t,n){return this.call(`template/default/set`,{config_entry_id:e,template_id:t,content:Y(n),updated_at:new Date().toISOString()}).then(kr)}resetTemplateDefault(e,t){return this.call(`template/default/reset`,{config_entry_id:e,template_id:t}).then(kr)}subscribeLibrary(e,t){return this.hass.connection.subscribeMessage(n=>{try{e(Cr(n))}catch(e){t?.(ri(e))}},{type:`${Zr}/library/subscribe`})}subscribePreview(e,t,n){return this.hass.connection.subscribeMessage(e=>{try{t(Tr(e))}catch(e){n?.(ri(e))}},{type:`${Zr}/preview/subscribe`,session_id:e})}onConnectionReady(e){let t=this.hass.connection;return!t.addEventListener||!t.removeEventListener?()=>void 0:(t.addEventListener(`ready`,e),()=>t.removeEventListener?.(`ready`,e))}call(e,t={}){return this.hass.callWS({type:`${Zr}/${e}`,...t})}async libraryMutation(e,t){let n=ni(await this.call(e,t));if(await this.acceptLibrarySnapshot(n.library)===!1)throw new ti;return n.item}async resolveNameCollision(e,t,n,r,i){let a=S(e);if(a===`reserved_name`)throw new ei(t);if(a!==`name_conflict`)throw e;if(i&&!i())throw new $r;let o=await this.nameStatus(t,r);if(i&&!i())throw new $r;if(o.kind===`reserved`)throw new ei(t);if(o.kind!==`saved`)throw e;if(!this.overwriteConfirmation||!await this.overwriteConfirmation(o.item.name)||i&&!i())throw new $r;return this.libraryMutation(`library/overwrite`,{target_item_id:o.item.id,expected_version:o.item.version,expected_updated_at:o.item.updated_at,name:t,content:Y(n),...O(n)?{layer_labels:O(n)}:{}})}acceptLibrarySnapshot(e){return this.librarySnapshotHandler?.(e)}},$r=class extends Error{constructor(){super(`The save was cancelled.`),this.code=`save_cancelled`}},ei=class extends Error{constructor(e){super(`An effect named ${JSON.stringify(e)} already exists.`),this.code=`reserved_name`}},ti=class extends Error{constructor(){super(`The effect library changed before the save response arrived.`),this.code=`conflict`}};function ni(e){return{item:wr(Q(e,`item`)),library:Cr(Q(e,`library`))}}function Q(e,t){if(typeof e!=`object`||!e||Array.isArray(e))throw Error(`Malformed Effect Studio server payload: response must be an object.`);if(!(t in e))throw Error(`Malformed Effect Studio server payload: response is missing ${t}.`);return e[t]}function ri(e){return e instanceof Error?e:Error(`Malformed Effect Studio server payload.`)}var ii=class{constructor(e){this.contextsMatch=e,this.generation=0}begin(e){return this.generation+=1,this.capture(e)}capture(e){return Object.freeze({...e,generation:this.generation})}invalidate(){this.generation+=1}isCurrent(e,t){return e.generation===this.generation&&this.contextsMatch(e,t)}};function $(e,t,n){return{catalogue:E(e),persisted:E(t),hasDefault:n}}function ai(e,t){let n=e=>JSON.stringify({content:e,layer_labels:O(e)});return n(e)===n(t)}function oi(e,t){return!(!t||ai(e,t.catalogue))}function si(e,t){return!(!t||ai(e,t.persisted))}var ci=`/govee-strip-studio/editor`;function li(e){if(!e)return[];let t=new Set(e.video_modes.map(e=>e.id));return(e.templates??[]).filter(n=>n.category===`video`&&n.content.kind===`video_profile`&&n.content.model===e.sku&&t.has(n.content.mode))}function ui(e,t){return li(e).find(e=>e.content.mode===t)}function di(e){let t=e.match(/^\/govee-strip-studio\/editor\/([^/]+)\/?$/);if(t?.[1])try{return decodeURIComponent(t[1])}catch{return}}function fi(e){return`${ci}/${encodeURIComponent(e)}`}function pi(e,t){e.value=t??``}function mi(e,t,n){return[...t?[{section:`video`,label:`Video`}]:[],...e?[{section:`scenes`,label:`Scenes`}]:[],...n.map(({category:e,label:t})=>({section:`custom`,category:e,label:t}))]}function hi(e,t,n){let r=di(e);return r===void 0?n&&t.some(e=>e.config_entry_id===n)?n:t[0]?.config_entry_id:r}function gi(e,t){let n=e.section;return n===`video`&&t.video||n===`scenes`&&t.scenes||n===`custom`&&t.custom?n:t.custom?`custom`:t.video?`video`:`scenes`}function _i(e,t,n,r){let i=e?.active_state,a=i?.active_effect,o=i?vi(i):void 0,s=e?.active_workspace,c=s&&s.config_entry_id===e.config_entry_id&&s.model===e.model?yi(s.content):void 0;if(s&&c)return{kind:`workspace`,...c,content:s.content,origin:s.origin,label:s.selector_label};if(a?.source_kind===`saved_effect`&&a.item_id&&(a.confidence!==`unknown`||o===a.observable_signature)){let e=t.find(e=>e.id===a.item_id&&e.version===a.item_version&&e.content_hash===a.content_hash&&n(e));if(e)return{kind:`saved`,item:e}}if(a)return{kind:`root`};let l=i?.native_mode;if(!l)return{kind:`root`};if(i.mode===`scene`&&i.effect===l)return{kind:`native-scene`,effect:l};if(i.mode===`video`){let e=ui(r,l);return e?{kind:`native-profile`,section:`video`,mode:e.content.mode,label:e.label}:{kind:`root`}}if(i.mode===`music`){let e=r?.music_modes.find(e=>e.id===l);return e?{kind:`native-profile`,section:`custom`,category:`music`,mode:e.id,label:e.label}:{kind:`root`}}return{kind:`root`}}function vi(e){if(e.mode===`custom`&&e.diy_code!==null)return`custom:${e.diy_code}`;if(e.mode===`scene`&&e.effect)return`scene:${e.effect}`;if((e.mode===`music`||e.mode===`video`)&&e.native_mode)return`${e.mode}:${e.native_mode}`}function yi(e){if(e.kind===`video_profile`)return{section:`video`};if(e.kind===`music_profile`)return{section:`custom`,category:`music`};if(e.kind===`h617a_painted`||e.kind===`h617a_single`||e.kind===`h6179_single_diy`||e.kind===`palette_diy`)return{section:`custom`,category:`single-layer`};if(e.kind===`h617a_multi`||e.kind===`h6179_mixed_diy`)return{section:`custom`,category:`multi-layer`};if(e.kind===`advanced`||e.kind===`workshop`)return{section:`custom`,category:`advanced`}}function bi(e,t){return e?.config_entry_id===t?.config_entry_id&&e?.model===t?.model}function xi(){return{category:`all`,name:``,speedIndex:null,hasDefault:!1,loading:!1,saving:!1,applying:!1,defaultSaveFailed:!1,editingCopy:!1}}function Si(e){return`builtin:${e.scene_id}:${e.effect_id}`}function Ci(e){return e.selectedItem?`custom:${e.selectedItem.id}`:e.selectedScene?Si(e.selectedScene):void 0}function wi(e){return e.trim().replace(/\s+/g,` `).toLocaleLowerCase()}function Ti(e,t){return e.filter(e=>Ni(e.kind)&&e.template?.sku===t?.sku)}function Ei(e,t){let n=[];e?.scenes.length&&n.push({id:`all`,label:`All`}),t.length&&n.push({id:`custom`,label:`My Effects`});let r=e?.categories.filter(t=>e.scenes.some(e=>e.category_id===t.id)).map(e=>({id:e.id,label:e.name})).sort((e,t)=>it(e.label,t.label))??[];return[...n,...r]}function Di(e,t){let n=e.category===`all`||e.category===`custom`?t:[],r=!e.catalogue||e.category===`custom`?[]:e.category===`all`?e.catalogue.scenes:e.catalogue.scenes.filter(t=>t.category_id===e.category);return[...n.map(e=>({kind:`custom`,item:e,label:e.name})),...r.map(e=>({kind:`builtin`,scene:e,label:e.display_name}))].sort((e,t)=>it(e.label,t.label))}function Oi(e,t){return e===`all`||e===t.category_id?e:t.category_id}function ki(e){return e===`all`||e===`custom`?e:`custom`}function Ai(e,t){return e.scenes.find(e=>e.scene_id===t.template.scene_id&&e.effect_id===t.template.effect_id)}function ji(e,t){let n=wi(t);return e.scenes.find(e=>wi(e.display_name)===n||wi(e.name)===n)}function Mi(e){return Ni(e.kind)&&(e.kind!==`native_effect`||e.template!==null)}function Ni(e){return e===`scene_builtin`||e===`scene_palette`||e===`scene_layered`||e===`native_effect`}function Pi(e,t){return Array.from({length:e},(n,r)=>({value:r,label:`▸`.repeat(r+1),ariaLabel:Li(r,t,e)}))}function Fi(e,t,n,r=!1,i=!0,a=!1,o=!1){if(o)return[];let s=[];return s.push({id:`save-as`,label:`Save As`,style:`secondary`}),e&&s.push({id:`reset-default`,label:`Reset`,style:`secondary`,...a?{disabled:!0}:{}}),s.push({id:`edit`,label:`Edit`,style:`secondary`}),!a&&t&&(!n||r)&&s.push({id:`save-default`,label:`Save`,style:`primary`}),s}function Ii(e){return e.speed!==null}function Li(e,t,n){let r=(n===3?[`Slow`,`Medium`,`Fast`]:n===4?[`Slowest`,`Slow`,`Fast`,`Fastest`]:[])[e]??`Speed ${e+1}`;return e===t?`${r}, catalogue default`:r}function Ri(e){return{...e,template:{...e.template},steps:e.steps.map(e=>({...e,colour:[...e.colour],inline_colour:e.inline_colour===null?null:[...e.inline_colour]})),palette:e.palette.map(e=>[...e])}}function zi(e){return e.kind===`native_effect`?structuredClone(e):e.kind===`scene_palette`?Ri(e):e.kind===`scene_layered`?vt(e):{...e,template:{...e.template}}}function Bi(e,t,n){let r=zi(e);if(r.kind===`native_effect`&&r.family===797&&t!==null&&n!==void 0){let e=n[t];if(!e||e.length!==r.layers.length||r.layers.some(e=>e.type!==`diy`))throw Error(`Native scene speed metadata does not match its typed layers.`);r.layers=r.layers.map((t,n)=>({...t,speed:e[n]}))}return{...r,speed_index:t}}function Vi(e,t){let{catalogue:n,selectedScene:r,content:i}=e;return!!(n&&r&&i&&i.template?.sku===n.sku&&i.template?.scene_id===r.scene_id&&i.template?.effect_id===r.effect_id&&t===Ci(e))}function Hi(e){return!e.selectedItem||!e.content||e.name.trim()!==e.selectedItem.name||JSON.stringify(Bi(e.content,e.speedIndex))!==JSON.stringify(e.selectedItem.content)}function Ui(e,t,n,r){if(!n||!e.selectedScene||!e.content||!Vi(e,t)||!r)return;let i=Bi(e.content,e.speedIndex);return i.kind===`scene_builtin`?{kind:`scene`,scene:e.selectedScene,speedIndex:e.speedIndex}:{kind:`snapshot`,name:e.name.trim()||e.selectedScene.display_name,content:i}}var Wi=class{constructor(e,t,n,r,i){this.model=e,this.editor=t,this.preview=n,this.modal=r,this.options=i,this.autoSaveRunning=!1,this.lastSaveCancelled=!1,this.stateUpdatesGeneration=0,this.latestSavedItems=new Map,this.loadRequests=new ii((e,t)=>e.api===t.api),this.modal.setTransitionDialogTeardown(()=>{this.pendingTransition=void 0})}async load(e,t){this.stateUpdatesGeneration+=1,this.model.patch({loading:!0,error:void 0,previewStatus:void 0,previewNotice:void 0,stateUpdatesUnavailable:!1,sceneWorkDirty:!1,isAdmin:t});let n=new Qr(e);n.setLibrarySnapshotHandler(e=>this.libraryChanged(e)),n.setOverwriteConfirmation(e=>this.confirmOverwrite(e)),this.api=n;let r=this.loadRequests.begin({api:n});try{let[e,i,a,o,s]=await Promise.all([n.info(),n.devices(),n.library(),n.customCatalogue(),n.userState()]);if(!this.loadIsCurrent(r))return;if(!Xr(e))throw Error(`This editor bundle is not compatible with the installed backend.`);this.model.patch({devices:i,integrationVersion:e.integration_version??void 0,library:a,customCatalogue:o,userState:s,autoSaveEnabled:qi(s.navigation.auto_save)}),await this.initialiseSelectedDevice(),this.model.customEffectsAvailable||this.model.patch({section:`scenes`});let c=await n.subscribeLibrary(e=>void this.libraryChanged(e),e=>this.subscriptionFailed(e,r));if(!this.loadIsCurrent(r)||this.model.error||this.model.stateUpdatesUnavailable){c();return}if(this.unsubscribeLibrary=c,await this.subscribeSelectedDevice(n),!this.loadIsCurrent(r)||this.model.error||this.model.stateUpdatesUnavailable)return;if(t&&(!await this.preview.open(n,e=>this.subscriptionFailed(e,r))||!this.loadIsCurrent(r)||this.model.error||this.model.stateUpdatesUnavailable)){this.preview.dispose();return}await this.openInitialContext()}catch(e){this.loadIsCurrent(r)&&(this.stopSubscriptions(),this.model.patch({error:x(e)}))}finally{this.loadIsCurrent(r)&&this.model.patch({loading:!1})}}disconnect(){this.cancelPendingAutoSave(),this.pendingTransition=void 0,this.modal.closeTransition(!1),this.loadRequests.invalidate(),this.stopSubscriptions(),this.api=void 0}async deviceChanged(e,t){e&&e!==this.model.selectedDeviceId&&this.model.devices.some(t=>t.config_entry_id===e)&&await this.requestTransition(()=>this.performDeviceChange(e),t)}async performDeviceChange(e){let t=this.model.selectedDeviceId,n=this.editor.beginTransition();this.editor.clearSelection(n),this.model.patch({selectedDeviceId:e,previewStatus:void 0,previewNotice:void 0,notice:void 0}),this.openRootCreateView();let r=this.model.editorTransitionEpoch;if(await this.preview.cancel(t),this.api&&await this.subscribeSelectedDevice(this.api),this.model.stateUpdatesUnavailable)return;this.options.replacePath(fi(e));let i=this.stateUpdatesGeneration;try{let t=await this.api?.updateUserState(e,this.navigationPreferences);t&&!this.model.stateUpdatesUnavailable&&i===this.stateUpdatesGeneration&&this.model.patch({userState:t})}catch(e){console.warn(`Could not remember the selected light`,e)}!this.model.stateUpdatesUnavailable&&i===this.stateUpdatesGeneration&&r===this.model.editorTransitionEpoch&&e===this.model.selectedDeviceId&&await this.restoreActiveSelection(r,!0)}async selectSection(e,t,n){if(e===`scenes`&&!this.model.scenesAvailable||e===`custom`&&(!this.model.customEffectsAvailable||t!==void 0&&!this.model.customEffectCategoryAvailable(t))||e===`video`&&!this.model.videoAvailable)return;let r=e===`custom`&&t!==void 0?t:this.model.customEffectCategory,i=this.model.section,a=e!==this.model.section||e===`custom`&&r!==this.model.customEffectCategory,o=this.model.editorOwnedByActiveView&&e===this.model.section&&(e!==`custom`||r===this.model.customEffectCategory);!a&&o?e===`scenes`&&this.model.sceneEditorOpen&&this.editor.cancelSceneEdit():await this.requestTransition(()=>this.performSectionChange(e,r,i),n)}async performSectionChange(e,t,n){let r=this.editor.beginTransition();this.model.patch({sceneEditorOpen:!1,sceneInitialSelection:void 0,section:e,customEffectCategory:t,notice:void 0});let i=e===`scenes`&&this.model.editorSource.kind!==`scene`,a=n===`scenes`&&this.model.editorOwnedByActiveView;(this.model.editorSource.kind===`scene`||!i&&!a)&&this.editor.clearSelection(r),this.remember(),await this.restoreActiveSelection(r)}async selectCustomEffectEntry(e,t){e.kind===`saved`?await this.requestTransition(()=>this.editor.selectCustomEffectEntry(e),t):await this.requestTransition(async()=>{let t={section:`custom`,category:e.category};await this.openCatalogueTemplate(e.key,e.label,t,this.editor.beginSelectionTransition(),!0)},t)}async newCustomEffect(e,t){await this.requestTransition(()=>this.editor.newCustomEffect(e),t)}async openSceneEditor(e,t){await this.requestTransition(()=>{this.model.patch({sceneWorkDirty:!1}),this.editor.openSceneEditor(e)},t)}async selectVideoTemplate(e,t,n){await this.requestTransition(async()=>{await this.openCatalogueTemplate(e,t,{section:`video`},this.editor.beginSelectionTransition(),!0)},n)}async selectCatalogueTemplate(e,t,n,r){await this.requestTransition(async()=>{await this.openCatalogueTemplate(e,t,n,this.editor.beginSelectionTransition(),!0)},r)}async selectItemFromList(e,t){await this.requestTransition(async()=>{await this.selectItem(e,this.editor.beginSelectionTransition())},t)}async selectScene(e,t,n){await this.requestTransition(async()=>{if(this.model.editorSource.kind!==`none`){let e=this.editor.beginTransition();this.editor.clearSelection(e),this.model.patch({sceneEditorOpen:!1})}await e()},t,n)}async openInitialContext(){this.openRootCreateView(),await this.restoreActiveSelection(this.model.editorTransitionEpoch,!0)}async restoreActiveSelection(e,t=!1){let n=this.model.selectedDevice;if(!n||e!==this.model.editorTransitionEpoch)return;let r=_i(n,this.model.library.items,e=>e.kind===`scene_builtin`||e.kind===`scene_palette`||e.kind===`scene_layered`||e.kind===`native_effect`&&e.template!==void 0?e.template?.sku===this.model.selectedModel:this.model.libraryItemAvailable(e),this.model.modelCatalogue);if(r.kind===`native-scene`){if(!this.model.scenesAvailable)return;t&&this.model.patch({section:`scenes`,sceneEditorOpen:!1,notice:void 0}),this.model.section===`scenes`&&this.model.patch({sceneInitialSelection:{kind:`native`,effect:r.effect}});return}if(this.model.section===`scenes`&&this.model.patch({sceneInitialSelection:{kind:`none`}}),r.kind===`native-profile`){if(r.section===`video`&&!this.model.videoAvailable||r.section===`custom`&&(!r.category||!this.model.customEffectCategoryAvailable(r.category))||(t&&this.model.patch({section:r.section,...r.section===`custom`&&r.category?{customEffectCategory:r.category}:{},sceneEditorOpen:!1,notice:void 0}),r.section!==this.model.section||r.section===`custom`&&r.category!==this.model.customEffectCategory))return;if(r.section===`video`){let t=this.model.videoTemplate(r.mode);if(!t)return;await this.openCatalogueTemplate(t.id,t.label,{section:`video`},e,!1)}else await this.openCatalogueTemplate(`template:music:${r.mode}`,r.label,{section:`custom`,category:r.category??`music`},e,!1);return}if(r.kind===`workspace`){if(r.section===`video`&&!this.model.videoAvailable||r.section===`custom`&&(!r.category||!this.model.customEffectCategoryAvailable(r.category))||(t&&this.model.patch({section:r.section,...r.section===`custom`&&r.category?{customEffectCategory:r.category}:{},sceneEditorOpen:!1,notice:void 0}),r.section!==this.model.section||r.section===`custom`&&r.category!==this.model.customEffectCategory))return;this.editor.openActiveWorkspace(r,e)?this.model.editorSource.kind===`catalogue`&&await this.refreshCurrentBuiltInBaselines(this.model.editorSource.selectionIdentity,e):this.editor.clearSelection(e);return}if(r.kind===`root`)return;let i=r.item;if(i.kind===`scene_builtin`||i.kind===`scene_palette`||i.kind===`scene_layered`||i.kind===`native_effect`&&i.template!==void 0){if(!this.model.scenesAvailable)return;t&&this.model.patch({section:`scenes`,sceneEditorOpen:!1,notice:void 0}),this.model.section===`scenes`&&this.model.patch({sceneInitialSelection:{kind:`saved`,itemId:i.id}})}else i.kind===`video_profile`&&!this.model.videoAvailable||i.kind!==`video_profile`&&!this.model.customEffectCategoryAvailable(this.categoryForKind(i.kind))||(t&&this.model.patch(i.kind===`video_profile`?{section:`video`,sceneEditorOpen:!1,notice:void 0}:{section:`custom`,customEffectCategory:this.categoryForKind(i.kind),sceneEditorOpen:!1,notice:void 0}),i.kind===`video_profile`&&this.model.section!==`video`||i.kind!==`video_profile`&&(this.model.section!==`custom`||this.categoryForKind(i.kind)!==this.model.customEffectCategory)||await this.selectItem(i.id,e,!1)||this.editor.clearSelection(e))}async openCatalogueTemplate(e,t,n,r,i){let a=this.api,o=this.model.selectedDevice;if(!a||!o)return!1;try{let s=await a.templateDefault(o.config_entry_id,e);return a!==this.api||r!==this.model.editorTransitionEpoch||o.config_entry_id!==this.model.selectedDeviceId||!k(s.content)||!k(s.catalogue_content)?!1:(this.editor.openEditableTemplate(t,s.content,e,n,i,r,s.catalogue_content,s.has_default),!0)}catch(e){return r===this.model.editorTransitionEpoch&&this.model.patch({notice:`Could not load the built-in default: ${x(e)}`}),!1}}async refreshCurrentBuiltInBaselines(e,t){let n=this.api,r=this.model.selectedDevice;if(n&&r)try{let i=await n.templateDefault(r.config_entry_id,e);n===this.api&&t===this.model.editorTransitionEpoch&&this.model.editorSource.kind===`catalogue`&&this.model.editorSource.selectionIdentity===e&&k(i.content)&&k(i.catalogue_content)&&this.model.patch({resetBaseline:E(i.catalogue_content),builtInBaselines:$(i.catalogue_content,i.content,i.has_default)})}catch(e){t===this.model.editorTransitionEpoch&&this.model.patch({notice:`Could not refresh the built-in default: ${x(e)}`})}}sceneInitialSelectionOpened(){this.model.patch({section:`scenes`,sceneInitialSelection:void 0})}sceneInitialSelectionFailed(){this.model.patch({sceneInitialSelection:void 0})}remember(){this.rememberNavigation()}toggleAutoSave(e){if(this.model.stateUpdatesUnavailable)return;let t=!this.model.autoSaveEnabled;this.model.patch({autoSaveEnabled:t,autoSaveFailed:!1}),t?this.model.builtInDefaultSource&&this.model.builtInDefaultDirty&&this.model.liveApplyEnabled?this.preview.scheduleEdited(`committed`):this.model.section===`scenes`&&!this.model.sceneEditorOpen&&e?this.model.liveApplyEnabled?this.preview.scheduleScene({...e,persistDefault:!0}):this.options.saveSceneWork?.():this.contentCommitted(`committed`):this.cancelPendingAutoSave(),this.remember()}contentCommitted(e){if(!this.model.stateUpdatesUnavailable&&e===`committed`&&this.model.isAdmin&&this.model.autoSaveEnabled&&k(this.model.content)){if(this.model.builtInDefaultSource){if(!this.model.builtInDefaultDirty||this.model.liveApplyEnabled)return;let e=this.model.selectedDeviceId;if(!e)return;this.autoSavePending={kind:`built-in`,epoch:this.model.editorTransitionEpoch,configEntryId:e,...this.model.editorSource.kind===`catalogue`?{templateId:this.model.editorSource.selectionIdentity}:{},content:E(this.model.content)},this.autoSaveRunning||(this.autoSaveDrain=this.drainAutoSave())}else!this.model.sceneEditorOpen&&this.model.currentItem&&this.model.dirty&&(this.autoSavePending={kind:`library`,epoch:this.model.editorTransitionEpoch,item:this.model.currentItem,name:this.model.name.trim(),content:E(this.model.content)},this.autoSaveRunning||(this.autoSaveDrain=this.drainAutoSave()))}}cancelPendingAutoSave(){this.autoSavePending=void 0}get unloadProtectionRequired(){return this.model.localWorkNeedsProtection}async requestTransition(e,t,n){if(this.pendingTransition||this.modal.open)return!1;if(this.model.stateUpdatesUnavailable)return this.modal.showError(`Reload the page before continuing.`,{title:`State updates stopped`,key:`subscription:reload-before-transition`,resumeWorkflow:!1}),!1;let r=this.stateUpdatesGeneration,i=this.model.editorOwnedByActiveView&&(this.model.builtInDefaultSource?this.model.builtInDefaultDirty:this.model.dirty||this.model.resetDirty),a=n??(this.model.sceneWorkDirty&&!i?this.options.saveSceneWork??(()=>Promise.resolve(!1)):void 0),o={epoch:this.model.editorTransitionEpoch,itemId:this.model.currentItem?.id,execute:e,save:a};if(this.model.editorSource.kind===`saved`&&this.model.dirty&&this.model.autoSaveEnabled&&!this.model.autoSaveFailed){if(await this.flushAutoSave(o))return this.model.stateUpdatesUnavailable||r!==this.stateUpdatesGeneration?!1:(await this.executeOwnedTransition(o),!0);if(this.model.stateUpdatesUnavailable||r!==this.stateUpdatesGeneration||o.epoch!==this.model.editorTransitionEpoch||o.itemId!==this.model.currentItem?.id)return!1}else if(this.model.builtInDefaultSource&&this.model.builtInDefaultDirty&&this.model.autoSaveEnabled&&!this.model.autoSaveFailed){if(await this.saveBuiltInDefault())return await this.executeOwnedTransition(o),!0}else if(!this.model.localWorkNeedsProtection&&!(this.model.editorSource.kind===`saved`&&this.model.autoSaveFailed))return await this.executeOwnedTransition(o),!0;return this.pendingTransition=o,this.modal.requestTransition(`Save`,this.model.name.trim(),!a&&this.model.editorSource.kind===`new`,t),!1}cancelPendingTransition(){this.pendingTransition&&!this.model.pendingTransitionDialog?.busy&&(this.pendingTransition=void 0,this.modal.closeTransition(!0))}async declinePendingTransition(){if(this.model.stateUpdatesUnavailable)return;let e=this.takePendingTransition();e&&e.epoch===this.model.editorTransitionEpoch&&e.itemId===this.model.currentItem?.id&&(this.editor.clearSelection(e.epoch),await e.execute())}async savePendingTransition(){let e=this.pendingTransition,t=this.stateUpdatesGeneration,n=this.model.pendingTransitionDialog;if(!e||!n||n.busy)return;let r=n.saveName.trim();if(n.requiresName&&!r){this.modal.showError(`Enter an effect name.`,{title:`Effect name required`,key:`transition-name-required:${e.epoch}`});return}n.primaryLabel===`Save`&&n.requiresName&&this.model.patch({name:r}),this.modal.updateTransition({busy:!0,error:void 0});let i=e.save?await e.save():n.primaryLabel===`Save`?await this.save():await this.saveAs(r);if(this.model.stateUpdatesUnavailable||t!==this.stateUpdatesGeneration)return;if(!i){if(this.lastSaveCancelled){this.modal.updateTransition({busy:!1,error:void 0});return}let t=this.model.modalState?.kind===`error`&&this.model.modalState.resume?.kind===`pending-transition`;if(this.modal.updateTransition({busy:!1,error:void 0}),t)return;this.model.modalState?.kind===`pending-transition`&&this.modal.showError(`The effect could not be saved.`,{title:`Save failed`,key:`transition-save-failed:${e.epoch}`});return}let a=this.takePendingTransition();a?.epoch===this.model.editorTransitionEpoch&&await a.execute()}takePendingTransition(){let e=this.pendingTransition;return this.pendingTransition=void 0,this.modal.closeTransition(!1),e}async executeOwnedTransition(e){this.model.stateUpdatesUnavailable||e.epoch!==this.model.editorTransitionEpoch||e.itemId!==this.model.currentItem?.id||await e.execute()}async flushAutoSave(e){return this.model.stateUpdatesUnavailable||!this.model.currentItem||!k(this.model.content)?!1:(this.autoSavePending={kind:`library`,epoch:e.epoch,item:this.model.currentItem,name:this.model.name.trim(),content:E(this.model.content)},this.autoSaveRunning||(this.autoSaveDrain=this.drainAutoSave()),await this.autoSaveDrain===!0&&!this.model.stateUpdatesUnavailable&&e.epoch===this.model.editorTransitionEpoch&&(e.itemId=this.model.currentItem?.id,!this.model.dirty))}async libraryChanged(e){if((e.generation??0)<(this.model.library.generation??0))return!1;if(this.model.patch({library:e}),this.model.saving)return!0;if(this.model.currentItem&&!this.model.editorOwnedByActiveView){let t=e.items.find(e=>e.id===this.model.currentItem?.id);return t&&t.version===this.model.currentItem.version||this.editor.clearRetainedSelection(),!0}let t=Pn(this.model.currentItem,e.items,this.model.dirty,this.model.deletingItemId);if(t.action===`none`)return!0;if(t.action===`removed`)return this.model.patch({notice:void 0}),!0;if(t.action===`conflict`)return this.model.patch({notice:`This effect changed elsewhere. Reload it before saving.`}),!0;let n=this.model.currentItem;if(!n)return!0;let r={itemId:n.id,version:n.version,document:this.currentEditorDocument()},i=this.editor.beginTransition();return await this.selectItem(t.summary.id,i,!1,r)&&i===this.model.editorTransitionEpoch?this.model.patch({notice:void 0}):i===this.model.editorTransitionEpoch&&this.model.currentItem?.id===r.itemId&&this.currentEditorDocument()!==r.document&&this.model.patch({notice:`This effect changed elsewhere. Reload it before saving.`}),!0}async sceneItemSaved(e,t,n,r){this.model.patch({library:{...this.model.library,items:Fn(this.model.library.items,e)}}),n&&this.model.liveApplyEnabled&&this.model.selectedDeviceId===t&&this.model.section===`scenes`&&this.model.editorTransitionEpoch===r&&await this.applySavedIdentity(e,this.model.editorTransitionEpoch)}async toggleLive(e){if(this.model.stateUpdatesUnavailable)return;if(!this.model.liveApplyEnabled&&this.model.h6179DiyCodeRequired&&this.model.h6179DiyCode===void 0){this.model.patch({notice:this.model.h6179DiyApprovalMessage});return}if(this.model.liveApplyEnabled){this.preview.toggle(e),this.model.autoSaveEnabled&&(this.model.builtInDefaultSource&&this.model.builtInDefaultDirty?await this.saveBuiltInDefault():this.model.section===`scenes`&&!this.model.sceneEditorOpen&&e?.persistDefault&&await this.options.saveSceneWork?.());return}let t=this.model.currentItem;t&&this.model.editorSource.kind===`saved`&&this.model.editorOwnedByActiveView&&!this.model.dirty?(this.model.patch({liveApplyEnabled:!0}),await this.applySavedIdentity(t,this.model.editorTransitionEpoch)):this.preview.toggle(e)}async useObservedH6179DiyCode(){let e=this.model.h6179ObservedDiyCode;return!this.model.h6179DiyCodeRequired||e===void 0?!1:(this.model.patch({h6179ApprovedDiyCode:e,notice:void 0}),await this.preview.diyCodeChanged(),!0)}async applyCurrentDraft(){let e=this.api,t=this.model.selectedDevice;if(!e||!t||!this.model.isAdmin||this.model.previewCapability!==`supported`||this.model.liveApplyEnabled||this.model.stateUpdatesUnavailable||this.model.applying||this.model.saving||!k(this.model.content))return!1;let n=this.model.editorTransitionEpoch,r=E(this.model.content),i=this.model.h6179DiyCode;if(this.model.h6179DiyCodeRequired&&i===void 0)return this.model.patch({notice:this.model.h6179DiyApprovalMessage}),!1;this.model.patch({applying:!0,notice:void 0});try{if(this.model.editorSource.kind===`saved`&&this.model.currentItem&&!this.model.dirty)i===void 0?await e.applySavedEffect(t.config_entry_id,this.model.currentItem):await e.applySavedEffect(t.config_entry_id,this.model.currentItem,i);else{let n=this.model.editorSource.kind===`catalogue`?{origin_kind:`catalogue_template`,origin_id:this.model.editorSource.selectionIdentity}:void 0;i===void 0?await e.applySnapshot(t.config_entry_id,this.model.name.trim()||`Effect Studio draft`,r,n):await e.applySnapshot(t.config_entry_id,this.model.name.trim()||`Effect Studio draft`,r,n,i)}return n===this.model.editorTransitionEpoch&&await this.refreshSelectedDevice(n),!0}catch(e){return n===this.model.editorTransitionEpoch&&this.model.reportError(`Apply failed: ${x(e)}`,{title:`Apply failed`,key:`apply:${n}:${S(e)}`}),!1}finally{this.model.patch({applying:!1})}}async selectItem(e,t,n=!0,r){if(t===void 0){let t=!1;return await this.requestTransition(async()=>{t=await this.selectItem(e,this.editor.beginSelectionTransition(),n,r)}),t}let i=t;if(!this.api)return!1;try{let t=await this.api.item(e);return i!==this.model.editorTransitionEpoch||r!==void 0&&(this.model.saving||this.model.currentItem?.id!==r.itemId||this.model.currentItem.version!==r.version||this.currentEditorDocument()!==r.document)||!this.editor.applyLibraryItem(t)?!1:(n&&this.model.liveApplyEnabled&&await this.applySavedIdentity(t,i),i===this.model.editorTransitionEpoch)}catch(e){return i===this.model.editorTransitionEpoch&&this.model.patch({notice:x(e)}),!1}}async confirmDelete(){let e=this.modal.deleteCandidate;if(e&&this.api&&this.model.isAdmin&&!this.model.stateUpdatesUnavailable&&this.model.deletingItemId===void 0){this.modal.takeDeleteCandidate(),this.model.patch({deletingItemId:e.id,notice:void 0});try{await this.api.deleteItem(e),this.model.patch({library:{...this.model.library,items:this.model.library.items.filter(t=>t.id!==e.id)}}),this.model.currentItem?.id===e.id&&this.model.currentItem.version===e.version&&this.editor.clearCurrentAfterDelete(),this.model.patch({notice:void 0})}catch(e){let t=S(e)===`conflict`,n=t?`This effect or library changed elsewhere. Reload before deleting.`:`Delete failed: ${x(e)}`,r=n;if(t)try{this.model.patch({library:await this.api.library()})}catch(e){r=`${n} Library refresh failed: ${x(e)}`}this.model.patch({notice:r})}finally{this.model.patch({deletingItemId:void 0}),this.modal.focusActiveSectionIfNeeded()}}}async save(){if(this.model.builtInDefaultSource)return this.saveBuiltInDefault();if(!this.api||!this.model.isAdmin||!this.model.canSaveCurrentDraft||this.model.saving||this.model.stateUpdatesUnavailable||this.model.deletingCurrentItem||!k(this.model.content))return!1;let e=this.model.name.trim();if(!e)return this.model.patch({notice:`Give this effect a name before saving.`}),!1;let t=this.model.editorTransitionEpoch;this.lastSaveCancelled=!1;let n=this.model.currentItem,r=E(this.model.content),i=this.api,a=this.model.selectedDeviceId,o=D(e,r),s=this.stateUpdatesGeneration,c=()=>i===this.api&&!this.model.stateUpdatesUnavailable&&s===this.stateUpdatesGeneration&&t===this.model.editorTransitionEpoch&&a===this.model.selectedDeviceId&&Nn(this.model.currentItem,n)&&k(this.model.content)&&this.currentEditorDocument()===o,l=this.model.sceneEditorOpen;this.model.patch({saving:!0,notice:void 0});try{let a=n?await i.updateItem(n,e,r,c):await i.createItem(e,r,c);if(!k(a.content))throw Error(`The saved effect returned an unsupported definition.`);let o=a.content,s=l&&Mi(o);return this.model.patch({library:{...this.model.library,items:Fn(this.model.library.items,a)}}),t===this.model.editorTransitionEpoch&&Nn(this.model.currentItem,n)&&k(this.model.content)&&D(this.model.name,this.model.content)===D(e,r)&&(this.model.patch({currentItem:a,editorSource:{kind:`saved`,owner:a.content.kind===`video_profile`?{section:`video`}:{section:`custom`,category:this.categoryForKind(a.content.kind)},itemId:a.id},name:a.name,content:E(o),savedBaseline:D(a.name,o),resetBaseline:E(o),resetNameBaseline:void 0,sceneEditorOpen:!s&&this.model.sceneEditorOpen,section:s?`custom`:this.model.section,customEffectCategory:s?this.categoryForKind(a.content.kind):this.model.customEffectCategory,savedSceneSelection:n&&Mi(o)?a:this.model.savedSceneSelection,autoSaveFailed:!1}),s&&this.remember(),this.model.liveApplyEnabled&&!await this.applySavedIdentity(a,t))?!0:t===this.model.editorTransitionEpoch&&Nn(this.model.currentItem,a)&&k(this.model.content)&&D(this.model.name,this.model.content)===D(a.name,o)?(this.model.patch({notice:void 0}),!0):!1}catch(e){let n=S(e);if(n===`save_cancelled`)this.lastSaveCancelled=!0;else if(n===`conflict`){let e=`This effect or library changed elsewhere. Reload before saving.`;t===this.model.editorTransitionEpoch&&this.model.patch({notice:e});try{this.model.patch({library:await this.api.library()})}catch(n){t===this.model.editorTransitionEpoch&&this.model.patch({notice:`${e} Library refresh failed: ${x(n)}`})}}else t===this.model.editorTransitionEpoch&&this.model.patch({notice:n===`reserved_name`?x(e):`Save failed: ${x(e)}`});return!1}finally{this.model.patch({saving:!1})}}async saveBuiltInDefault(){let e=this.api,t=this.model.selectedDeviceId,n=this.model.editorSource;if(!e||!t||!this.model.isAdmin||this.model.stateUpdatesUnavailable||this.model.saving||this.model.applying||!this.model.builtInDefaultDirty||!k(this.model.content))return!1;let r=this.model.editorTransitionEpoch,i=E(this.model.content);this.model.patch({saving:!0,autoSaveFailed:!1,notice:void 0});try{if(n.kind===`catalogue`){let a=await e.setTemplateDefault(t,n.selectionIdentity,i);r===this.model.editorTransitionEpoch&&this.model.editorSource.kind===`catalogue`&&this.model.editorSource.selectionIdentity===n.selectionIdentity&&k(a.content)&&k(a.catalogue_content)&&this.model.patch({builtInBaselines:$(a.catalogue_content,a.content,a.has_default),resetBaseline:E(a.catalogue_content),autoSaveFailed:!1})}else if(n.kind===`scene`&&n.itemId===void 0&&Mi(i)){let n=await e.setSceneDefault(t,i);r===this.model.editorTransitionEpoch&&this.model.editorSource.kind===`scene`&&this.model.editorSource.itemId===void 0&&k(n.content)&&k(n.catalogue_content)&&this.model.patch({builtInBaselines:$(n.catalogue_content,n.content,n.has_default),resetBaseline:E(n.catalogue_content),autoSaveFailed:!1})}else return!1;return!0}catch(e){return r===this.model.editorTransitionEpoch&&this.model.patch({autoSaveFailed:!0,notice:`Save failed: ${x(e)}`}),!1}finally{this.model.patch({saving:!1})}}async saveAs(e){if(!this.api||!this.model.isAdmin||this.model.stateUpdatesUnavailable||this.model.saving||this.model.deletingCurrentItem||!k(this.model.content))return!1;let t=E(this.model.content);this.lastSaveCancelled=!1;let n=this.model.editorTransitionEpoch,r=this.api,i=this.model.currentItem?.id,a=this.currentEditorDocument(),o=this.model.selectedDeviceId,s=this.stateUpdatesGeneration,c=()=>r===this.api&&!this.model.stateUpdatesUnavailable&&s===this.stateUpdatesGeneration&&n===this.model.editorTransitionEpoch&&this.model.currentItem?.id===i&&this.model.selectedDeviceId===o&&this.currentEditorDocument()===a;this.cancelPendingAutoSave(),this.model.patch({saving:!0,notice:void 0});try{let s=await r.createItem(e,t,c);return this.model.patch({library:{...this.model.library,items:Fn(this.model.library.items,s)}}),n===this.model.editorTransitionEpoch&&this.model.currentItem?.id===i&&this.model.selectedDeviceId===o&&this.currentEditorDocument()===a&&(this.editor.applyLibraryItem(s),this.model.patch({...s.content.kind===`video_profile`?{}:{section:`custom`,customEffectCategory:this.categoryForKind(s.content.kind)},autoSaveFailed:!1}),this.remember(),this.model.liveApplyEnabled&&await this.applySavedIdentity(s,n),!0)}catch(e){let t=S(e);return t===`save_cancelled`?this.lastSaveCancelled=!0:n===this.model.editorTransitionEpoch&&this.model.patch({notice:t===`reserved_name`?x(e):`Save As failed: ${x(e)}`}),!1}finally{this.model.patch({saving:!1})}}async initialiseSelectedDevice(){let e=this.model.userState,t=hi(this.options.pathname(),this.model.devices,e?.selected_config_entry_id);if(this.model.update(e=>{e.selectedDeviceId=t,e.notice=void 0}),e&&this.model.selectedDevice&&t!==e.selected_config_entry_id)try{let n=await this.api?.updateUserState(t,{...e.navigation,auto_save:this.model.autoSaveEnabled});n&&this.model.patch({userState:n});return}catch(e){console.warn(`Could not remember the selected light`,e);return}}openRootCreateView(){this.editor.reset();let e=this.model.userState?.navigation??{},t=e.custom_category,n=Ki(t,e=>this.model.customEffectCategoryAvailable(e),this.model.defaultCustomEffectCategory());this.model.patch({section:gi(e,{scenes:this.model.scenesAvailable,custom:this.model.customEffectsAvailable,video:this.model.videoAvailable}),customEffectCategory:n,autoSaveEnabled:qi(e.auto_save),notice:void 0})}async rememberNavigation(){if(!this.api||!this.model.userState||this.model.stateUpdatesUnavailable)return;let e=this.stateUpdatesGeneration;try{let t=await this.api.updateUserState(this.model.selectedDeviceId,{...this.navigationPreferences});!this.model.stateUpdatesUnavailable&&e===this.stateUpdatesGeneration&&this.model.patch({userState:t})}catch(e){console.warn(`Could not remember Studio navigation`,e)}}async confirmOverwrite(e){let t=this.stateUpdatesGeneration;return await this.modal.requestOverwrite(e)&&!this.model.stateUpdatesUnavailable&&t===this.stateUpdatesGeneration}async drainAutoSave(){if(this.model.stateUpdatesUnavailable)return this.autoSavePending=void 0,!1;this.autoSaveRunning=!0,this.model.patch({autoSaveInProgress:!0});let e=!0;try{for(;this.autoSavePending;){if(this.model.stateUpdatesUnavailable){this.autoSavePending=void 0,e=!1;break}let t=this.autoSavePending;if(this.autoSavePending=void 0,!await this.persistAutoSave(t)){e=!1;break}}}finally{this.autoSaveRunning=!1,this.autoSaveDrain=void 0,this.model.patch({autoSaveInProgress:!1})}return e}async persistAutoSave(e){if(e.kind===`built-in`)return this.persistBuiltInAutoSave(e);if(this.model.stateUpdatesUnavailable||!this.api||!e.name)return!1;let t=this.latestSavedItems.get(e.item.id)??e.item;this.model.patch({saving:!0,autoSaveFailed:!1,notice:void 0});try{let n=this.api,r=this.stateUpdatesGeneration,i=D(e.name,e.content),a=await n.updateItem(t,e.name,e.content,()=>n===this.api&&!this.model.stateUpdatesUnavailable&&r===this.stateUpdatesGeneration&&e.epoch===this.model.editorTransitionEpoch&&this.model.currentItem?.id===e.item.id&&k(this.model.content)&&this.currentEditorDocument()===i);if(!k(a.content))throw Error(`The saved effect returned an unsupported definition.`);let o=a.content;if(this.latestSavedItems.set(a.id,a),this.model.patch({library:{...this.model.library,items:Fn(this.model.library.items,a)}}),e.epoch===this.model.editorTransitionEpoch&&this.model.currentItem?.id===e.item.id){let t=D(a.name,o);if(k(this.model.content)&&D(this.model.name,this.model.content)===D(e.name,e.content)&&a.id!==e.item.id?this.editor.applyLibraryItem(a):this.model.patch({currentItem:a,editorSource:{kind:`saved`,owner:a.content.kind===`video_profile`?{section:`video`}:{section:`custom`,category:this.categoryForKind(a.content.kind)},itemId:a.id},savedBaseline:t}),this.model.patch({autoSaveFailed:!1,notice:void 0}),this.autoSavePending?.kind===`library`&&this.autoSavePending.item.id===e.item.id&&(this.autoSavePending={...this.autoSavePending,item:a}),this.model.liveApplyEnabled&&k(this.model.content)&&D(this.model.name,this.model.content)===t&&!await this.applySavedIdentity(a,e.epoch))return!0}return!0}catch(t){if(e.epoch===this.model.editorTransitionEpoch&&this.model.currentItem?.id===e.item.id){let e=S(t);this.model.patch({autoSaveFailed:!0,...e===`save_cancelled`?{}:{notice:e===`conflict`?`This effect changed elsewhere. Reload it before saving.`:`Save failed: ${x(t)}`}})}return this.autoSavePending=void 0,!1}finally{this.model.patch({saving:!1})}}async persistBuiltInAutoSave(e){let t=this.api;if(!t||this.model.stateUpdatesUnavailable)return!1;this.model.patch({saving:!0,autoSaveFailed:!1,notice:void 0});try{let n=e.templateId?await t.setTemplateDefault(e.configEntryId,e.templateId,e.content):Mi(e.content)?await t.setSceneDefault(e.configEntryId,e.content):void 0;return n?(e.epoch===this.model.editorTransitionEpoch&&e.configEntryId===this.model.selectedDeviceId&&k(n.content)&&k(n.catalogue_content)&&this.model.patch({builtInBaselines:$(n.catalogue_content,n.content,n.has_default),resetBaseline:E(n.catalogue_content),autoSaveFailed:!1}),!0):!1}catch(t){return e.epoch===this.model.editorTransitionEpoch&&this.model.patch({autoSaveFailed:!0,notice:`Save failed: ${x(t)}`}),this.autoSavePending=void 0,!1}finally{this.model.patch({saving:!1})}}get navigationPreferences(){return{section:this.model.section,custom_category:this.model.customEffectCategory,auto_save:this.model.autoSaveEnabled}}currentEditorDocument(){return k(this.model.content)?D(this.model.name,this.model.content):JSON.stringify({name:this.model.name,content:this.model.content})}categoryForKind(e){let t=Mn(e);return this.model.customEffectCategoryAvailable(t)?t:this.model.defaultCustomEffectCategory()}async applySavedIdentity(e,t){let n=this.model.selectedDevice;if(!this.api||!n||!fn(e.content,this.model.modelCatalogue,n.model,n.segment_count))return!1;let r=n.config_entry_id;if(!this.model.liveApplyEnabled)return!1;let i=this.model.h6179DiyCode;if(this.model.h6179DiyCodeRequired&&i===void 0)return this.model.patch({notice:this.model.h6179DiyApprovalMessage}),!1;try{return i===void 0?await this.api.applySavedEffect(r,e):await this.api.applySavedEffect(r,e,i),!this.model.liveApplyEnabled||this.model.selectedDeviceId!==r||t!==this.model.editorTransitionEpoch?!1:(await this.refreshSelectedDevice(t),t===this.model.editorTransitionEpoch)}catch(e){return t===this.model.editorTransitionEpoch&&this.model.patch({notice:`Apply failed: ${x(e)}`}),!1}}async refreshSelectedDevice(e){let t=this.api,n=this.model.selectedDeviceId;if(!t||!n)return;let r;try{r=await this.requestDeviceRefresh(t,n)}catch(t){e===this.model.editorTransitionEpoch&&this.model.patch({notice:`Refresh failed: ${x(t)}`});return}if(t===this.api&&e===this.model.editorTransitionEpoch&&n===this.model.selectedDeviceId)return this.model.patch({devices:this.model.devices.map(e=>e.config_entry_id===n?r:e)}),r}requestDeviceRefresh(e,t){let n=this.deviceRefresh;if(n?.api===e&&n.configEntryId===t)return n.promise;let r=e.device(t).finally(()=>{this.deviceRefresh?.promise===r&&(this.deviceRefresh=void 0)});return this.deviceRefresh={api:e,configEntryId:t,promise:r},r}loadIsCurrent(e){return this.options.connected()&&this.api!==void 0&&this.loadRequests.isCurrent(e,{api:this.api})}subscriptionFailed(e,t){this.loadIsCurrent(t)&&this.stateUpdatesFailed(e)}stateUpdatesFailed(e){this.stateUpdatesGeneration+=1,this.cancelPendingAutoSave(),this.pendingTransition=void 0,this.model.patch({liveApplyEnabled:!1,stateUpdatesUnavailable:!0,previewStatus:void 0,previewNotice:void 0,previewProgressVisible:!1}),this.modal.showError(`${e.message} Reload the page before making further changes.`,{title:`State updates stopped`,key:`subscription:${e.message}`,resumeWorkflow:!1}),queueMicrotask(()=>this.stopSubscriptions())}async subscribeSelectedDevice(e){let t=this.model.selectedDeviceId;if(this.unsubscribeDevice?.(),this.unsubscribeDevice=void 0,!t)return;let n=this.stateUpdatesGeneration,r;try{r=await e.subscribeDevice(t,t=>{e!==this.api||this.model.stateUpdatesUnavailable||t.config_entry_id!==this.model.selectedDeviceId||this.model.patch({devices:this.model.devices.map(e=>e.config_entry_id===t.config_entry_id?t:e)})},t=>{e===this.api&&this.stateUpdatesFailed(t)})}catch(n){e===this.api&&t===this.model.selectedDeviceId&&this.stateUpdatesFailed(n instanceof Error?n:Error(`Device state subscription failed.`));return}e!==this.api||this.model.stateUpdatesUnavailable||n!==this.stateUpdatesGeneration||t!==this.model.selectedDeviceId?r():this.unsubscribeDevice=r}stopSubscriptions(){this.unsubscribeLibrary?.(),this.unsubscribeLibrary=void 0,this.unsubscribeDevice?.(),this.unsubscribeDevice=void 0,this.preview.dispose()}};function Gi(e){return e===`all`||e===`music`||e===`single-layer`||e===`multi-layer`||e===`advanced`||e===`my-effects`}function Ki(e,t,n){return e===`all`?n:Gi(e)&&t(e)?e:n}function qi(e){return e===!0}var Ji=class{constructor(e,t,n,r){this.model=e,this.preview=t,this.modal=n,this.options=r}beginTransition(e=!0){return this.options.editorTransitionStarted(),this.modal.closeForEditorTransition(),this.model.h6179ApprovedDiyCode=void 0,this.preview.beginEditorTransition(e)}beginSelectionTransition(){return this.beginTransition(!1)}reset(e=!0){this.beginTransition(e),this.model.patch({sceneEditorOpen:!1,sceneInitialSelection:void 0,currentItem:void 0,savedSceneSelection:void 0,editorSource:{kind:`none`},name:``,content:dn(),savedBaseline:void 0,resetBaseline:void 0,resetNameBaseline:void 0,builtInBaselines:void 0})}selectCustomEffectEntry(e){if(e.kind===`saved`)this.options.selectItem(e.item.id);else if(e.kind===`native-diy`){let t=this.model.modelCatalogue?.templates?.find(t=>t.id===e.key);if(t?.content.kind!==`advanced`&&t?.content.kind!==`native_effect`)return;this.openEditableTemplate(e.label,E(t.content),e.key,{section:`custom`,category:e.category},!0)}else if(e.kind===`music`)this.openMusicTemplate(e.mode,e.label,!0);else if(e.kind===`paint`){let t=this.model.modelCatalogue;if(!t)return;this.openEditableTemplate(e.label,T(`h617a_painted`,t),e.key,{section:`custom`,category:e.category},!0)}else{let t=this.model.modelCatalogue;if(!t)return;if(this.model.customEffectKindAvailable(`h617a_single`))this.openEditableTemplate(e.label,T(`h617a_single`,t,e.family,e.variant),e.key,{section:`custom`,category:e.category},!0);else if(this.model.customEffectKindAvailable(`h6179_single_diy`)){let n=T(`h6179_single_diy`,t);this.openEditableTemplate(e.label,{...n,family:e.family,variant:e.variant},e.key,{section:`custom`,category:e.category},!0)}else this.model.customEffectKindAvailable(`palette_diy`)&&this.openEditableTemplate(e.label,mn(t,this.model.selectedModel,e.family,e.variant),e.key,{section:`custom`,category:e.category},!0)}}newCustomEffect(e){if(e===`music`){let e=this.model.modelCatalogue?.music_modes[0],t=e?this.musicTemplateContent(e.id):void 0;e&&t&&this.newEffect(`music_profile`,void 0,{name:`New ${e.label} effect`,content:t});return}let t=Bn(this.model.customEffectListContext,e);t&&this.newEffect(t)}openVideoTemplate(e,t,n=!0,r){let i=this.model.videoTemplate(e);this.model.videoAvailable&&i&&this.openEditableTemplate(t,Zt(i.content),i.id,{section:`video`},n,r)}openEditableTemplate(e,t,n,r,i=!0,a,o=t,s=!1){if(a!==void 0&&a!==this.model.editorTransitionEpoch)return;a===void 0&&this.beginSelectionTransition();let c=E(t);c.kind===`h617a_painted`&&c.addressing===`physical_ic`&&(this.model.paintColour=[255,0,0],this.model.paintBrushOff=!1),this.model.patch({currentItem:void 0,editorSource:{kind:`catalogue`,owner:r,selectionIdentity:n,label:e},name:e,content:c,savedBaseline:void 0,resetBaseline:E(o),resetNameBaseline:void 0,builtInBaselines:$(o,t,s),notice:void 0}),i&&this.preview.scheduleTemplateSelection()}openActiveWorkspace(e,t){if(t!==this.model.editorTransitionEpoch||!k(e.content))return!1;let n=this.workspaceTemplate(e),r=e.section===`video`?{section:`video`}:{section:`custom`,category:e.category??`single-layer`},i=!n&&e.origin.kind===`authored`&&e.origin.source_id===null;if(!n&&!i)return!1;let a=n?.label??e.label;return this.model.patch({currentItem:void 0,sceneEditorOpen:!1,editorSource:n?{kind:`catalogue`,owner:r,selectionIdentity:n.selectionIdentity,label:a}:{kind:`new`,owner:r},name:a,content:E(e.content),paintBrushOff:e.content.kind!==`h617a_painted`&&this.model.paintBrushOff,savedBaseline:void 0,resetBaseline:n?E(n.resetContent):void 0,resetNameBaseline:void 0,builtInBaselines:n?$(n.resetContent,e.content,!1):void 0,notice:void 0}),!0}openMusicTemplate(e,t,n=!0,r){let i=this.musicTemplateContent(e);i&&this.openEditableTemplate(t,i,`template:music:${e}`,{section:`custom`,category:`music`},n,r)}openDefaultAvailableTemplate(e,t){let n=this.model.modelCatalogue;if(e===`music`||e===`multi-layer`||e===`advanced`||e!==`single-layer`){this.clearSelection(t);return}if(n&&this.model.customEffectKindAvailable(`h617a_painted`)){this.openEditableTemplate(`Paint`,T(`h617a_painted`,n),`template:paint`,{section:`custom`,category:e},!1,t);return}let r=n?.effects.find(e=>e.category===`single_layer`)??n?.effects[0];if(this.model.customEffectKindAvailable(`h617a_single`)&&n&&r){let i=r.variations[0];this.openEditableTemplate(r.label,T(`h617a_single`,n,r.family,i.variant),`template:single:${r.family}:${i.variant}`,{section:`custom`,category:e},!1,t)}else if(this.model.customEffectKindAvailable(`h6179_single_diy`)&&n&&r){let i=r.variations[0],a=T(`h6179_single_diy`,n);this.openEditableTemplate(r.label,{...a,family:r.family,variant:i.variant},`template:single:${r.family}:${i.variant}`,{section:`custom`,category:e},!1,t)}else if(this.model.customEffectKindAvailable(`palette_diy`)&&n&&r){let i=r.variations[0];this.openEditableTemplate(r.label,mn(n,this.model.selectedModel,r.family,i.variant),`template:single:${r.family}:${i.variant}`,{section:`custom`,category:e},!1,t)}else this.clearSelection(t)}newEffect(e,t,n){if(t!==void 0&&t!==this.model.editorTransitionEpoch||(t===void 0&&this.beginTransition(),!this.options.apiReady()||!this.model.isAdmin||!this.model.customEffectKindAvailable(e)||e!==`advanced`&&!this.model.modelCatalogue))return;let r=n?.content??(e===`advanced`?_t():e===`music_profile`?this.musicTemplateContent(this.model.modelCatalogue.music_modes[0]?.id??``):e===`palette_diy`?mn(this.model.modelCatalogue,this.model.selectedModel):T(e,this.model.modelCatalogue));if(!r)return;let i=n?.name??`New ${An(e)} effect`;r.kind===`h617a_painted`&&r.addressing===`physical_ic`&&(this.model.paintColour=[255,0,0]);let a={section:`custom`,category:e===`music_profile`?`music`:e===`h617a_multi`||e===`h6179_mixed_diy`?`multi-layer`:e===`advanced`?`advanced`:`single-layer`};this.model.patch({currentItem:void 0,editorSource:{kind:`new`,owner:a},name:i,content:E(r),paintBrushOff:e!==`h617a_painted`&&this.model.paintBrushOff,savedBaseline:D(i,r),resetBaseline:E(r),resetNameBaseline:i,builtInBaselines:void 0,notice:void 0})}applyLibraryItem(e){let t={currentItem:e,sceneEditorOpen:!1,editorSource:{kind:`saved`,owner:e.content.kind===`video_profile`?{section:`video`}:{section:`custom`,category:Mn(e.content.kind)},itemId:e.id},name:e.name};if(e.content.kind===`opaque`)return this.model.patch({...t,content:yn(e.content),savedBaseline:void 0,resetBaseline:void 0,resetNameBaseline:void 0,notice:void 0,builtInBaselines:void 0}),!0;if(!k(e.content))return this.model.patch({notice:`This item cannot be edited here.`}),!1;let n=e.content;return this.model.patch({...t,content:E(n),savedBaseline:D(e.name,n),resetBaseline:E(n),resetNameBaseline:void 0,builtInBaselines:void 0,paintBrushOff:n.kind!==`h617a_painted`&&this.model.paintBrushOff,notice:void 0}),!0}clearCurrentAfterDelete(){this.beginTransition(),this.model.patch({currentItem:void 0,editorSource:{kind:`none`},sceneEditorOpen:!1,name:``,content:dn(),savedBaseline:void 0,resetBaseline:void 0,resetNameBaseline:void 0,builtInBaselines:void 0})}clearRetainedSelection(){this.model.patch({currentItem:void 0,editorSource:{kind:`none`},name:``,content:dn(),savedBaseline:void 0,resetBaseline:void 0,resetNameBaseline:void 0,builtInBaselines:void 0})}openSceneEditor(e){this.model.isAdmin&&e.config_entry_id===this.model.selectedDeviceId&&(this.beginTransition(),this.model.patch({currentItem:e.item,editorSource:{kind:`scene`,owner:{section:`scenes`},...e.item?{itemId:e.item.id}:{}},name:e.name.trim()||`Layered scene template`,content:E(e.content),savedBaseline:e.item?.content.kind===e.content.kind?D(e.item.name,e.item.content):void 0,resetBaseline:E(e.catalogue_content??e.content),resetNameBaseline:void 0,builtInBaselines:e.item?void 0:$(e.catalogue_content??e.content,e.content,e.has_default===!0),sceneEditorOpen:!0,notice:void 0}))}cancelSceneEdit(){this.beginTransition(),this.model.patch({sceneEditorOpen:!1,notice:void 0})}advancedContentChanged(e,t,n){On(this.model.content)&&this.installEditedContent(xn(this.model.content,e),t,n)}customContentChanged(e,t){let n=e.kind===`palette_diy`?_n(e):gn(e);this.installEditedContent(n,t)}musicContentChanged(e,t){this.installEditedContent(Qt(e),t)}nativeContentChanged(e,t,n){this.installEditedContent(E(e),t,n)}musicModeChanged(e){let t=this.model.editorSource,n=this.model.content,r=this.model.modelCatalogue,i=r?.music_modes.find(t=>t.id===e);if(t.kind!==`new`&&t.kind!==`saved`||t.owner.section!==`custom`||t.owner.category!==`music`||n.kind!==`music_profile`||!i||n.mode===e)return;let a=this.musicTemplateContent(e);if(!a)return;let o=r?.music_modes.find(e=>e.id===n.mode)?.label,s=t.kind===`new`&&o!==void 0&&this.model.name===`New ${o} effect`,c={...a,sensitivity:n.sensitivity,colour:n.colour===null?null:[...n.colour]};s&&this.model.patch({name:`New ${i.label} effect`}),this.installEditedContent(c,`committed`)}videoContentChanged(e,t){this.installEditedContent(Zt(e),t)}paintColourChanged(e){this.model.patch({paintColour:[...e],paintBrushOff:!1})}selectPaintOff(){this.model.patch({paintBrushOff:!0})}selectSingleEffect(e){if(!this.model.customCatalogue||this.model.currentItem?.content.kind===`opaque`)return;let t=this.model.content;if(this.model.currentItem&&(t.kind===`h617a_painted`&&e!==`paint`||t.kind===`h617a_single`&&e===`paint`))return;let n=this.model.editorSource;if(n.kind===`catalogue`){if(e===`paint`){this.options.selectCatalogueTemplate?.(`template:paint`,`Paint`,n.owner);return}let t=this.model.modelCatalogue,r=t?.effects.find(t=>t.id===e),i=r?.variations[0];if(!t||!r||!i)return;this.options.selectCatalogueTemplate?.(`template:single:${r.family}:${i.variant}`,r.label,n.owner);return}if(e===`paint`){t.kind!==`h617a_painted`&&this.switchCustomMode(`h617a_painted`),this.model.update(e=>{this.updateGeneratedEffectName(e,`Paint`)});return}let r=this.model.modelCatalogue?.effects.find(t=>t.id===e),i=r?.variations[0];if(!r||!i||(this.model.content.kind===`h617a_painted`&&this.switchCustomMode(`h617a_single`,!1),this.model.content.kind!==`h617a_single`&&this.model.content.kind!==`h6179_single_diy`&&this.model.content.kind!==`palette_diy`))return;let a={...this.model.content,family:r.family,variant:i.variant,speed:Math.max(r.rate_min,Math.min(this.model.content.speed,r.rate_max))};this.installEditedContent(a),this.model.update(e=>{this.updateGeneratedEffectName(e,r.label)})}setSegmentColour(e,t){if(this.model.content.kind!==`h617a_painted`)return!1;let n=this.model.content.segments.map(e=>e===null?null:[...e]),r=this.model.activePaintBrush,i=n[e];return(i===null?r===null:r!==null&&i.every((e,t)=>e===r[t]))?(t===`committed`&&this.installEditedContent({...this.model.content,segments:n},t),!1):(n[e]=r===null?null:[...r],this.installEditedContent({...this.model.content,segments:n},t),!0)}resetContent(){let e=this.model.resetBaseline;if(!e||!this.model.resetDirty)return;let t=this.model.editorSource.kind===`new`?this.model.resetNameBaseline:void 0,n=this.model.resetContentDirty;e.kind===`h617a_painted`&&this.model.patch({paintBrushOff:!1}),t!==void 0&&this.model.patch({name:t}),n&&this.installEditedContent(E(e),`committed`)}updatePaintedContent(e,t=`changing`){this.model.content.kind===`h617a_painted`&&this.installEditedContent({...this.model.content,...e},t)}switchCustomMode(e,t=!0){let n=this.model.modelCatalogue;if(!this.model.isAdmin||!n||!En(this.model.content)||this.model.content.kind===e)return;let r=this.model.content;if(r.kind===`h6179_single_diy`||r.kind===`h6179_mixed_diy`||e===`h617a_single`&&r.kind===`h617a_multi`&&r.effects.length>1)return;let i;if(e===`h617a_painted`)r.kind!==`h617a_painted`&&(this.model.paintColour=r.palette[0]?[...r.palette[0]]:[47,111,237]),this.model.paintBrushOff=!1,i={...T(`h617a_painted`,n),speed:Math.max(n.limits.speed_min,Math.min(r.speed,n.limits.speed_max))},i.addressing===`physical_ic`&&(this.model.paintColour=[255,0,0]);else if(r.kind===`h617a_painted`){let t=Cn(r);if(e===`h617a_single`){let a=T(e,n),o=n.effects.find(e=>e.family===a.family);i={...a,speed:Math.max(o.rate_min,Math.min(r.speed,o.rate_max)),palette:t.length>=n.limits.palette_min?t.slice(0,n.limits.palette_max):a.palette}}else{let e=T(`h617a_multi`,n);i={...e,palette:t.length>=n.limits.palette_min?t.slice(0,n.limits.palette_max):e.palette}}}else if(e===`h617a_multi`&&r.kind===`h617a_single`)i={kind:e,effects:[{family:r.family,variant:r.variant}],speed:r.speed,palette:r.palette.map(e=>[...e])};else if(e===`h617a_single`&&r.kind===`h617a_multi`){let t=r.effects[0];i={kind:e,family:t.family,variant:t.variant,speed:r.speed,palette:r.palette.map(e=>[...e])}}else return;t?this.installEditedContent(i):this.model.content=i,this.model.update(t=>{/^New (Paint|Painted|Single|Multi) effect$/.test(t.name)&&(t.name=`New ${An(e)} effect`),t.notice=void 0})}installEditedContent(e,t=`committed`,n){this.model.patch({content:e}),this.preview.scheduleEdited(t,n),this.options.contentCommitted(t)}updateGeneratedEffectName(e,t){e.editorSource.kind===`catalogue`?(e.editorSource={...e.editorSource,label:t},e.name=t):e.editorSource.kind===`new`&&/^New .+ effect$/.test(e.name)&&(e.name=`New ${t} effect`)}clearSelection(e){(e===void 0||e===this.model.editorTransitionEpoch)&&(e===void 0&&this.beginTransition(),this.model.patch({currentItem:void 0,editorSource:{kind:`none`},name:``,content:dn(),savedBaseline:void 0,resetBaseline:void 0,resetNameBaseline:void 0,builtInBaselines:void 0,notice:void 0}))}musicTemplateContent(e){let t=this.model.selectedModel,n=this.model.modelCatalogue;if(!t||!n||!n.music_modes.some(t=>t.id===e))return;let r=n.templates?.find(t=>t.content.kind===`music_profile`&&t.content.mode===e);return r?.content.kind===`music_profile`?Qt(r.content):{kind:`music_profile`,model:t,mode:e,sensitivity:n.limits.music_sensitivity_max,colour:null,calm:n.music_settings[e]?.style?n.music_settings[e].calm_default:null,parameters:{}}}workspaceTemplate(e){let t=this.structuralWorkspaceTemplate(e.content),n=e.origin.kind===`catalogue_template`?e.origin.source_id:null;return n===null||t?.selectionIdentity===n?t:void 0}structuralWorkspaceTemplate(e){let t=this.model.modelCatalogue,n=this.model.selectedModel;if(t&&n){if(e.kind===`h617a_painted`&&this.model.customEffectKindAvailable(e.kind))return{selectionIdentity:`template:paint`,label:`Paint`,resetContent:T(`h617a_painted`,t)};if((e.kind===`h617a_single`||e.kind===`h6179_single_diy`)&&this.model.customEffectKindAvailable(e.kind)||e.kind===`palette_diy`&&e.model===n&&this.model.customEffectKindAvailable(e.kind)){let r=t.effects.flatMap(t=>t.family===e.family?t.variations.filter(t=>t.variant===e.variant).map(e=>({family:t,variation:e})):[]);if(r.length!==1)return;let[{family:i,variation:a}]=r,o=e.kind===`h617a_single`?T(`h617a_single`,t,i.family,a.variant):e.kind===`h6179_single_diy`?{...T(`h6179_single_diy`,t),family:i.family,variant:a.variant}:mn(t,n,i.family,a.variant);return{selectionIdentity:`template:single:${i.family}:${a.variant}`,label:i.label,resetContent:o}}if(e.kind===`music_profile`&&e.model===n){let n=t.music_modes.filter(t=>t.id===e.mode),r=n.length===1?this.musicTemplateContent(n[0].id):void 0;return r?{selectionIdentity:`template:music:${n[0].id}`,label:n[0].label,resetContent:r}:void 0}if(e.kind===`video_profile`&&e.model===n&&this.model.videoAvailable){let t=this.model.videoTemplate(e.mode);return t?{selectionIdentity:t.id,label:t.label,resetContent:Zt(t.content)}:void 0}}}},Yi=class{constructor(e,t){this.model=e,this.host=t,this.model.setErrorHandler((e,t)=>this.showError(e,t))}get open(){return this.model.modalState!==void 0}get deleteCandidate(){return this.model.deleteCandidate}closeForEditorTransition(){let e=this.model.modalState,t=e?.kind===`error`&&e.resume===void 0;(e?.kind===`pending-transition`||e?.kind===`error`&&e.resume?.kind===`pending-transition`)&&this.transitionDialogTeardown?.(),this.saveNameReturnFocus=void 0,this.feedbackReturnFocus=void 0,t||(this.errorReturnFocus=void 0),this.overwriteReturnFocus=void 0,this.overwriteResolution?.(!1),this.overwriteResolution=void 0,this.model.modalState=t?e:void 0,this.model.saveNameError=void 0,this.model.patch({})}setTransitionDialogTeardown(e){this.transitionDialogTeardown=e}requestFeedback(e){let t=this.model.selectedDevice;!this.open&&t?.confirmation_issue&&(this.feedbackReturnFocus=e,this.model.patch({modalState:{kind:`feedback`,device:t,report:this.model.deviceFeedbackReport(t)}}),this.host.updateComplete().then(()=>this.host.root()?.querySelector(`.feedback-dialog`)?.focus()))}closeFeedback(){if(this.model.modalState?.kind!==`feedback`)return;let e=this.feedbackReturnFocus;this.feedbackReturnFocus=void 0,this.model.patch({modalState:void 0}),this.restoreFocus(e)}requestTransition(e,t,n,r){this.open||(this.saveNameReturnFocus=r,this.model.patch({modalState:{kind:`pending-transition`,primaryLabel:e,saveName:t,requiresName:n,busy:!1}}),this.host.updateComplete().then(()=>{let t=e===`Save As`?`.transition-dialog input`:`.transition-dialog .secondary`;this.host.root()?.querySelector(t)?.focus()}))}updateTransitionName(e){let t=this.model.modalState;t?.kind===`pending-transition`&&this.model.patch({modalState:{...t,saveName:e,error:void 0}})}updateTransition(e){let t=this.model.modalState;t?.kind===`pending-transition`?this.model.patch({modalState:{...t,...e}}):t?.kind===`error`&&t.resume?.kind===`pending-transition`&&this.model.patch({modalState:{...t,resume:{...t.resume,...e}}})}closeTransition(e){let t=this.saveNameReturnFocus;if(this.saveNameReturnFocus=void 0,this.model.modalState?.kind===`pending-transition`)this.model.patch({modalState:void 0});else if(this.model.modalState?.kind===`error`&&this.model.modalState.resume?.kind===`pending-transition`){let{resume:e,...t}=this.model.modalState;this.model.patch({modalState:t})}e&&this.restoreFocus(t)}requestDelete(e,t){this.host.canMutate()&&this.model.isAdmin&&this.model.deletingItemId===void 0&&!this.model.saving&&(this.deleteReturnFocus=t,this.model.patch({modalState:{kind:`delete`,candidate:{...e}},notice:void 0}),this.host.updateComplete().then(()=>{this.host.root()?.querySelector(`.delete-dialog .secondary`)?.focus()}))}cancelDelete(){let e=this.deleteReturnFocus;this.deleteReturnFocus=void 0,this.model.modalState?.kind===`delete`&&this.model.patch({modalState:void 0}),this.restoreFocus(e)}takeDeleteCandidate(){let e=this.model.deleteCandidate;return this.deleteReturnFocus=void 0,this.model.modalState?.kind===`delete`&&this.model.patch({modalState:void 0}),e}requestSave(e){this.model.isAdmin&&this.model.canSaveCurrentDraft&&!this.model.saving&&!this.model.deletingCurrentItem&&e()}requestSaveAs(e,t){this.host.canMutate()&&this.model.isAdmin&&!this.model.saving&&!this.model.deletingCurrentItem&&this.requestNamedSave(e,t)}requestNamedSave(e,t){this.saveNameReturnFocus=e,this.model.patch({saveNameValue:t,saveNameError:void 0,modalState:{kind:`save-name`,busy:!1}}),this.host.updateComplete().then(()=>{let e=this.host.root()?.querySelector(`.save-dialog input`);e?.focus(),e?.select()})}saveNameChanged(e){this.model.patch({saveNameValue:e,saveNameError:void 0})}cancelSaveName(){if(this.model.modalState?.kind===`save-name`&&this.model.modalState.busy)return;let e=this.saveNameReturnFocus;this.saveNameReturnFocus=void 0,this.model.modalState?.kind===`save-name`&&this.model.patch({modalState:void 0,saveNameError:void 0}),this.restoreFocus(e)}async confirmNamedSave(e){let t=this.model.saveNameValue.trim();if(!t)this.showError(`Enter an effect name.`,{title:`Effect name required`,key:`save-name-required:${this.model.saveNameValue}`});else if(this.model.patch({modalState:{kind:`save-name`,busy:!0},saveNameError:void 0}),await e(t)){if(this.saveNameReturnFocus=void 0,this.model.modalState?.kind===`save-name`)this.model.patch({modalState:void 0});else if(this.model.modalState?.kind===`error`&&this.model.modalState.resume?.kind===`save-name`){let{resume:e,...t}=this.model.modalState;this.model.patch({modalState:t})}}else this.updateSaveNameBusy(!1)}showError(e,t={}){let n=t.key??`error:${e}`,r=this.model.modalState;if(r?.kind===`error`&&r.key===n)return;t.resumeWorkflow===!1&&(this.overwriteResolution?.(!1),this.overwriteResolution=void 0,this.saveNameReturnFocus=void 0,this.overwriteReturnFocus=void 0);let i=t.resumeWorkflow===!1?void 0:r?.kind===`error`?r.resume:r||void 0,a=this.host.root()?.activeElement;this.errorReturnFocus=Xi(a)??this.errorReturnFocus,this.model.patch({modalState:{kind:`error`,title:t.title??`Effect Studio error`,message:e,key:n,...i?{resume:i}:{}}}),this.host.updateComplete().then(()=>{this.host.root()?.querySelector(`.error-dialog .secondary`)?.focus()})}closeError(){let e=this.model.modalState;if(e?.kind!==`error`)return;let t=e.resume;if(this.model.patch({modalState:t}),t){this.host.updateComplete().then(()=>this.focusModal(t));return}let n=this.errorReturnFocus;this.errorReturnFocus=void 0,this.restoreFocus(n)}requestOverwrite(e){let t=this.model.modalState;if(t?.kind===`delete`||t?.kind===`feedback`||t?.kind===`error`||t?.kind===`overwrite`)return Promise.resolve(!1);let n=this.host.root()?.activeElement;this.overwriteReturnFocus=Xi(n)??this.overwriteReturnFocus,this.model.patch({modalState:{kind:`overwrite`,effectName:e,...t?{resume:t}:{}}});let r=new Promise(e=>{this.overwriteResolution=e});return this.host.updateComplete().then(()=>{this.host.root()?.querySelector(`.overwrite-dialog .secondary`)?.focus()}),r}cancelOverwrite(){if(this.model.modalState?.kind!==`overwrite`)return;let e=this.overwriteReturnFocus,t=this.model.modalState.resume;this.overwriteReturnFocus=void 0,this.overwriteResolution?.(!1),this.overwriteResolution=void 0,this.model.patch({modalState:t}),t?this.host.updateComplete().then(()=>this.focusModal(t)):this.restoreFocus(e)}confirmOverwrite(){if(this.model.modalState?.kind!==`overwrite`)return;let e=this.model.modalState.resume;this.overwriteReturnFocus=void 0,this.overwriteResolution?.(!0),this.overwriteResolution=void 0,this.model.patch({modalState:e})}dialogKeyDown(e,t){e.key===`Tab`?this.trapDialogFocus(e):e.key===`Escape`&&(e.preventDefault(),t())}focusActiveSectionIfNeeded(){this.host.updateComplete().then(()=>{this.host.root()?.activeElement||this.host.root()?.querySelector(`.primary-nav .selector[aria-current="page"]`)?.focus()})}syncScrollLock(){this.open?this.scrollLock||(this.scrollLock={bodyOverflow:document.body.style.overflow,documentOverflow:document.documentElement.style.overflow},document.body.style.overflow=`hidden`,document.documentElement.style.overflow=`hidden`):this.releaseScrollLock()}releaseScrollLock(){this.scrollLock&&=(document.body.style.overflow=this.scrollLock.bodyOverflow,document.documentElement.style.overflow=this.scrollLock.documentOverflow,void 0)}restoreFocus(e){this.host.updateComplete().then(()=>{e?.isConnected&&e.focus()})}focusModal(e){let t=e.kind===`save-name`?`.save-dialog input`:e.kind===`pending-transition`?`.transition-dialog .secondary`:e.kind===`delete`?`.delete-dialog .secondary`:e.kind===`overwrite`?`.overwrite-dialog .secondary`:e.kind===`feedback`?`.feedback-dialog`:`.error-dialog .secondary`;this.host.root()?.querySelector(t)?.focus()}updateSaveNameBusy(e){let t=this.model.modalState;t?.kind===`save-name`?this.model.patch({modalState:{...t,busy:e}}):t?.kind===`error`&&t.resume?.kind===`save-name`&&this.model.patch({modalState:{...t,resume:{...t.resume,busy:e}}})}trapDialogFocus(e){let t=e.currentTarget,n=Array.from(t.querySelectorAll(`button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])`)).filter(e=>e.getClientRects().length>0),r=n[0],i=n.at(-1);if(!r||!i)return;let a=t.getRootNode(),o=a instanceof ShadowRoot?a.activeElement:document.activeElement,s=o instanceof HTMLElement&&n.includes(o);e.shiftKey&&(o===r||!s)?(e.preventDefault(),i.focus()):e.shiftKey||o!==i&&s||(e.preventDefault(),r.focus())}};function Xi(e){return typeof HTMLElement<`u`&&e instanceof HTMLElement?e:void 0}var Zi={kind:`none`};function Qi(e,t){return e.kind===`new`&&e.owner.section===`custom`&&e.owner.category===t}function $i(e){return(e.kind===`new`||e.kind===`saved`)&&e.owner.section===`custom`&&e.owner.category===`music`}function ea(e,t,n){return e.kind===`none`||e.owner.section!==t?!1:e.owner.section!==`custom`||e.owner.category===n}function ta(e,t){let n=new Set;switch(e.kind!==`none`&&!t.liveApplyEnabled&&t.canApply&&n.add(`apply`),e.kind){case`catalogue`:n.add(`saveAs`),t.resetDirty&&n.add(`reset`),t.defaultDirty&&(!t.autoSaveEnabled||t.autoSaveFailed)&&n.add(`save`);break;case`new`:t.resetAvailable&&n.add(`reset`),n.add(`save`);break;case`saved`:n.add(`saveAs`),t.resetDirty&&n.add(`reset`),n.add(`delete`),(!t.autoSaveEnabled||t.autoSaveFailed)&&n.add(`save`);break;case`scene`:n.add(`saveAs`),t.resetDirty&&n.add(`reset`),n.add(`cancel`),e.itemId!==void 0&&n.add(`delete`),(e.itemId!==void 0||t.defaultDirty&&(!t.autoSaveEnabled||t.autoSaveFailed))&&n.add(`save`)}return[`apply`,`saveAs`,`reset`,`cancel`,`delete`,`save`].map(e=>{let r=n.has(e),i=r&&!t.busy&&(e===`reset`?t.resetDirty:e===`apply`?t.canApply===!0:e===`cancel`||t.canMutate&&(e!==`save`||t.canSave));return{id:e,label:e===`saveAs`?`Save As`:e[0].toUpperCase()+e.slice(1),style:e===`save`?`primary`:e===`delete`?`delete`:`secondary`,visible:r,enabled:i}})}function na(e){return JSON.stringify({content:e,layer_labels:O(e)})}var ra=class{constructor(e){this.changed=e,this.loading=!0,this.devices=[],this.sessionHiddenFeedback=new Set,this.section=`custom`,this.customEffectCategory=`single-layer`,this.sceneEditorOpen=!1,this.editorSource=Zi,this.library={items:[]},this.name=``,this.content=dn(),this.paintColour=[255,69,58],this.paintBrushOff=!1,this.saving=!1,this.applying=!1,this.saveNameValue=``,this.liveApplyEnabled=!0,this.autoSaveEnabled=!1,this.autoSaveInProgress=!1,this.autoSaveFailed=!1,this.previewProgressVisible=!1,this.stateUpdatesUnavailable=!1,this.sceneWorkDirty=!1,this.editorTransitionEpoch=0,this.isAdmin=!1,this.errorSequence=0}update(e){e(this),this.flushReportedErrors(),this.changed()}patch(e){Object.assign(this,e),this.flushReportedErrors(),this.changed()}setErrorHandler(e){this.errorHandler=e,this.flushReportedErrors()}reportError(e,t){this.errorHandler?this.errorHandler(e,t):(this.notice=e,this.changed())}get saveNameDialogOpen(){return this.modalState?.kind===`save-name`}set saveNameDialogOpen(e){e?this.modalState={kind:`save-name`,busy:!1}:this.modalState?.kind===`save-name`&&(this.modalState=void 0)}get pendingTransitionDialog(){return this.modalState?.kind===`pending-transition`?this.modalState:void 0}set pendingTransitionDialog(e){e?this.modalState={kind:`pending-transition`,...e}:this.modalState?.kind===`pending-transition`&&(this.modalState=void 0)}get deleteCandidate(){return this.modalState?.kind===`delete`?this.modalState.candidate:void 0}set deleteCandidate(e){e?this.modalState={kind:`delete`,candidate:e}:this.modalState?.kind===`delete`&&(this.modalState=void 0)}flushReportedErrors(){let e=this.notice??this.previewNotice;if(!e||!this.errorHandler)return;let t=this.previewNotice===e;this.notice=void 0,this.previewNotice=void 0,this.errorHandler(e,{title:t?`Live change failed`:`Effect Studio error`,key:t?`preview:${e}`:`studio:${++this.errorSequence}`})}syncAdmin(e){let t=e?.user?.is_admin===!0;this.isAdmin!==t&&(this.isAdmin=t,this.changed())}get selectedDevice(){return this.devices.find(e=>e.config_entry_id===this.selectedDeviceId)}get selectedModel(){return this.selectedDevice?.model}get experimentalSupport(){return this.selectedDevice?.support_quality===`experimental`}get showFeedbackNotice(){let e=this.selectedDevice;return this.experimentalSupport&&e!==void 0&&e.show_experimental_feedback!==!1&&!this.sessionHiddenFeedback.has(e.config_entry_id)}deviceFeedbackReport(e){let t=`not yet observed`;return[`### Device details`,`- Model: ${e.model}`,`- Hardware version: ${e.hw_version??t}`,`- Firmware version: ${e.fw_version??t}`,...e.subordinate_20_version?[`- Sub-controller 20 version: ${e.subordinate_20_version}`]:[],...e.subordinate_21_version?[`- Sub-controller 21 version: ${e.subordinate_21_version}`]:[],`- Integration version: ${this.integrationVersion??`not available (fill from Home Assistant)`}`,`- Version source: integration observations; fill missing versions from the Govee app and identify any changes.`,``,`### Observations`,`- What I tried:`,`- What visibly worked:`,`- What failed or behaved unexpectedly:`,`- Anything unexpected in Home Assistant state or after restoring a preview:`,`- What I did not test:`,``,`### Follow-up`,`- Available to test a follow-up fix: yes / no`,`- Diagnostics attached: yes / no`].join(`
`)}get h6179DiyCodeRequired(){return this.modelCatalogue?.diy_slot_policy===`approved_observed`&&((this.content.kind===`h6179_single_diy`||this.content.kind===`h6179_mixed_diy`)&&this.content.model===this.selectedModel||this.content.kind===`h617a_single`||this.content.kind===`h617a_multi`||this.content.kind===`advanced`&&this.content.native_diy!==void 0)}get h6179DiyCode(){let e=this.h6179ObservedDiyCode;return e!==void 0&&this.h6179ApprovedDiyCode===e?e:void 0}get h6179ObservedDiyCode(){if(!this.h6179DiyCodeRequired)return;let e=this.selectedDevice?.active_state?.diy_code;return typeof e==`number`&&Number.isSafeInteger(e)&&e>=0&&e<=65535?e:void 0}get h6179DiyApprovalMessage(){return this.h6179ObservedDiyCode===void 0?`Select a disposable ${this.selectedModel??`device`} DIY item in the Govee app, then refresh or return to Effect Studio before applying or enabling Live preview.`:`Use the currently observed disposable DIY item before applying or enabling Live preview.`}get showDeviceSelector(){return this.devices.length>1||this.devices.length>0&&this.selectedDeviceId!==void 0&&this.selectedDevice===void 0}get editorReadOnly(){return!this.isAdmin||this.stateUpdatesUnavailable}get editorOwnedByActiveView(){return ea(this.editorSource,this.section,this.customEffectCategory)}get templateSelection(){return this.editorSource.kind===`catalogue`?this.editorSource.selectionIdentity:void 0}get catalogueSourceLabel(){return this.editorSource.kind===`catalogue`?this.editorSource.label:void 0}get newCustomEffectSelected(){return Qi(this.editorSource,this.customEffectCategory)}get showReactiveEffectSelector(){return $i(this.editorSource)}get modelCatalogue(){let e=this.selectedDevice;if(e?.catalogue)return{...e.catalogue,physical_ic_count:e.physical_ic_count};let t=this.selectedModel,n=t?this.customCatalogue?.models[t]:void 0;return n&&(n.painted_addressing===`physical_ic`||this.selectedDevice?.music_settings!==void 0)?{...n,physical_ic_count:this.selectedDevice?.physical_ic_count,music_settings:this.selectedDevice?.music_settings??n.music_settings,music_modes:n.music_modes.filter(e=>this.selectedDevice?.music_settings===void 0||e.id in this.selectedDevice.music_settings),templates:n.templates?.filter(e=>e.content.kind!==`music_profile`||this.selectedDevice?.music_settings===void 0||e.content.mode in this.selectedDevice.music_settings)}:n}get videoAvailable(){return this.effectCategoryEnabled(`video`)&&this.selectedDevice?.profiles.video!==`unsupported`&&this.videoTemplates.length>0}get videoTemplates(){return!this.effectCategoryEnabled(`video`)||this.selectedDevice?.profiles.video===`unsupported`?[]:li(this.modelCatalogue)}videoTemplate(e){return ui(this.modelCatalogue,e)}get customEffectsAvailable(){return!!(this.modelCatalogue&&(this.customEffectCategoryAvailable(`single-layer`)||this.customEffectCategoryAvailable(`multi-layer`)||this.customEffectCategoryAvailable(`music`)||this.customEffectCategoryAvailable(`advanced`)))}get customEffectListContext(){return{model:this.selectedModel,catalogue:this.modelCatalogue,libraryItems:this.library.items}}get dirty(){return!this.builtInDefaultSource&&this.editorSource.kind!==`none`&&this.editorSource.kind!==`catalogue`&&k(this.content)&&this.savedBaseline!==D(this.name,this.content)}get localWorkNeedsProtection(){return this.builtInDefaultSource?this.builtInDefaultDirty:this.sceneWorkDirty?!0:this.editorSource.kind===`saved`||this.editorSource.kind===`scene`?this.dirty:this.liveApplyEnabled?!1:this.editorSource.kind===`catalogue`?this.resetDirty:this.editorSource.kind===`new`&&(this.dirty||this.resetDirty)}get canSaveCurrentDraft(){return this.builtInDefaultDirty||this.dirty||this.editorSource.kind===`new`||this.editorSource.kind===`scene`&&this.editorSource.itemId===void 0}get resetDirty(){return this.resetContentDirty||this.resetNameDirty}get resetContentDirty(){return this.builtInDefaultSource&&k(this.content)?oi(this.content,this.builtInBaselines):k(this.content)&&this.resetBaseline!==void 0&&na(this.content)!==na(this.resetBaseline)}get resetNameDirty(){return this.editorSource.kind===`new`&&this.resetNameBaseline!==void 0&&this.name.trim()!==this.resetNameBaseline.trim()}get editorActions(){return ta(this.editorSource,{resetAvailable:this.resetBaseline!==void 0,resetDirty:this.resetDirty,defaultDirty:this.builtInDefaultDirty,autoSaveEnabled:this.autoSaveEnabled,autoSaveFailed:this.autoSaveFailed,liveApplyEnabled:this.liveApplyEnabled,canApply:k(this.content)&&this.previewCapability===`supported`&&this.isAdmin&&!this.stateUpdatesUnavailable&&(!this.h6179DiyCodeRequired||this.h6179DiyCode!==void 0),canSave:this.canSaveCurrentDraft,canMutate:this.isAdmin&&!this.stateUpdatesUnavailable,busy:this.saving||this.applying||this.deletingCurrentItem})}editorAction(e){return this.editorActions.find(t=>t.id===e)}get builtInDefaultSource(){return this.editorSource.kind===`catalogue`||this.editorSource.kind===`scene`&&this.editorSource.itemId===void 0}get builtInDefaultDirty(){return this.builtInDefaultSource&&k(this.content)&&si(this.content,this.builtInBaselines)}get showSingleEffectSelector(){return this.editorSource.kind===`new`||this.editorSource.kind===`saved`}get previewCapability(){if(!k(this.content))return;let e=this.selectedDevice;if(e){if(!fn(this.content,this.modelCatalogue,e.model,e.segment_count))return`unsupported`;switch(this.content.kind){case`h617a_painted`:return e.custom_effects.painted;case`h617a_single`:return e.custom_effects.single;case`h617a_multi`:return e.custom_effects.multi;case`h6179_single_diy`:return e.custom_effects.single;case`h6179_mixed_diy`:return e.custom_effects.multi;case`palette_diy`:return e.custom_effects.palette_diy;case`native_effect`:return this.content.family===798?e.custom_effects.painted:e.custom_effects.single;case`advanced`:case`scene_layered`:return e.custom_effects.advanced;case`music_profile`:return e.profiles.music;case`video_profile`:if(this.content.saturation!==null&&this.content.saturation<(this.modelCatalogue?.video_controls?.saturation_min??0))return`unsupported`;for(let[t,n]of Object.entries({capture_region:this.content.full_screen!==null,saturation:this.content.saturation!==null,sound_effects:this.content.sound_effects!==null||this.content.sound_effects_softness!==null,white_balance:this.content.white_balance_position!==null||this.content.white_balance_value!==void 0,relative_brightness:this.content.relative_brightness!==null,blank_screen:this.content.blank_screen!==null,black_border:this.content.black_border!==void 0})){let r=e.video_control_states?.[t];if(n&&r&&r!==`supported`)return r}return e.profiles.video;case`workshop`:return e.custom_effects.workshop}}}get deletingCurrentItem(){return this.deletingItemId!==void 0&&this.currentItem?.id===this.deletingItemId}get selectedSingleEffectFamily(){if(this.content.kind!==`h617a_single`&&this.content.kind!==`h6179_single_diy`&&this.content.kind!==`palette_diy`)return;let e=this.content.family;return this.modelCatalogue?.effects.find(t=>t.family===e)}libraryItemAvailable(e){return Rn(this.customEffectListContext,e)}customEffectCategoryAvailable(e){return this.effectCategoryEnabled(e)&&zn(this.customEffectListContext,e)}get scenesAvailable(){return this.effectCategoryEnabled(`scenes`)}effectCategoryEnabled(e){let t={scenes:`scenes`,video:`video`,"single-layer":`effects`,"multi-layer":`multi_layered`,music:`reactive`,advanced:`advanced`,all:``,"my-effects":``}[e];return t!==``&&this.selectedDevice?.effect_categories.includes(t)===!0}defaultCustomEffectCategory(){return[`single-layer`,`multi-layer`,`music`,`advanced`].find(e=>this.customEffectCategoryAvailable(e))??`single-layer`}customEffectKindAvailable(e){return A(this.customEffectListContext,e)}get activePaintBrush(){return this.paintBrushOff?null:[...this.paintColour]}},ia=500,aa=class{constructor(e){this.starts=new Map,this.visible=!1,this.changed=e.changed,this.now=e.now??(()=>performance.now()),this.setTimer=e.setTimer??((e,t)=>window.setTimeout(e,t)),this.clearTimer=e.clearTimer??(e=>window.clearTimeout(e))}accept(e){if(this.configEntryId!==void 0&&e.config_entry_id!==this.configEntryId&&this.reset(),this.configEntryId=e.config_entry_id,e.phase===`queued`){for(let t of this.starts.keys())t<e.sequence&&this.starts.delete(t);this.starts.set(e.sequence,this.now()),this.startPending(e.sequence)}else e.phase===`writing`?this.startPending(e.sequence):(e.phase===`written`&&this.starts.delete(e.sequence),this.clearPending(e.sequence))}clear(){this.pendingSequence!==void 0&&this.starts.delete(this.pendingSequence),this.pendingSequence=void 0,this.clearDisplayTimer(),this.setVisible(!1)}reset(){this.clear(),this.configEntryId=void 0,this.starts=new Map}startPending(e){this.pendingSequence!==e&&(this.pendingSequence=e,this.clearDisplayTimer(),this.setVisible(!1),this.displayTimer=this.setTimer(()=>{this.displayTimer=void 0,this.pendingSequence===e&&this.setVisible(!0)},ia))}clearPending(e){this.pendingSequence===e&&this.clear()}clearDisplayTimer(){this.displayTimer!==void 0&&(this.clearTimer(this.displayTimer),this.displayTimer=void 0)}setVisible(e){this.visible!==e&&(this.visible=e,this.changed(e))}};function oa(e,t,n,r=!1,i,a){return{kind:`snapshot`,configEntryId:e,name:t,content:n,...i?{provenance:i}:{},...a===void 0?{}:{diyCode:a},fingerprint:JSON.stringify({configEntryId:e,name:t,content:n,provenance:i,persistDefault:r,diyCode:a}),persistDefault:r}}function sa(e){return e.kind===`catalogue`?{origin_kind:`catalogue_template`,origin_id:e.selectionIdentity}:void 0}function ca(e,t){return e.kind===`scene`?{kind:`scene`,configEntryId:t,scene:e,fingerprint:JSON.stringify({configEntryId:t,sceneId:e.scene.scene_id,effectId:e.scene.effect_id,speedIndex:e.speedIndex,persistDefault:e.persistDefault===!0}),persistDefault:e.persistDefault}:oa(t,e.name,e.content,e.persistDefault===!0)}function la(e){return e===3?!0:typeof e!=`object`||!e?!1:`code`in e&&e.code===3||`error`in e&&typeof e.error==`object`&&e.error!==null&&`code`in e.error&&e.error.code===3}function ua(e=typeof crypto.randomUUID==`function`?crypto.randomUUID.bind(crypto):void 0,t=e=>crypto.getRandomValues(e)){if(e)return e();let n=t(new Uint8Array(new ArrayBuffer(16)));n[6]=n[6]&15|64,n[8]=n[8]&63|128;let r=[...n].map(e=>e.toString(16).padStart(2,`0`));return[r.slice(0,4).join(``),r.slice(4,6).join(``),r.slice(6,8).join(``),r.slice(8,10).join(``),r.slice(10).join(``)].join(`-`)}var da=class{constructor(e,t,n,r=()=>void 0){this.api=e,this.statusChanged=t,this.subscriptionFailed=n,this.requestFailed=r,this.sessionId=ua(),this.readyState=!1,this.sequence=0,this.generation=0,this.latestStatusSequence=0,this.waitingForConnection=!1,this.connectionRevision=0}get ready(){return this.readyState}async open(){let e=this.generation,t=await this.api.subscribePreview(this.sessionId,e=>this.acceptStatus(e),e=>{this.readyState&&this.subscriptionFailed(e)});return e===this.generation?(this.unsubscribe=t,this.unsubscribeConnectionReady=this.api.onConnectionReady(()=>{this.connectionRevision+=1,this.waitingForConnection=!1,this.drain()}),this.readyState=!0,!0):(t(),await this.closeRemoteSession(this.sessionId),!1)}submit(e){this.readyState&&(this.desired={request:e,sequence:++this.sequence},this.drain())}async cancel(e){this.generation+=1,this.desired=void 0,this.waitingForConnection=!1,this.latestStatusSequence=this.sequence+1,this.statusChanged(void 0);let t=this.sessionId;t&&await this.api.cancelPreview(t,e)}transition(){this.generation+=1,this.desired=void 0,this.waitingForConnection=!1,this.latestStatusSequence=Math.max(this.latestStatusSequence,this.sequence+1),this.statusChanged(void 0)}close(){this.generation+=1,this.readyState=!1,this.desired=void 0,this.waitingForConnection=!1,this.statusChanged(void 0),this.unsubscribeConnectionReady?.(),this.unsubscribeConnectionReady=void 0,this.unsubscribe?.(),this.unsubscribe=void 0,this.closeRemoteSession(this.sessionId)}drain(){if(!this.readyState||this.waitingForConnection||this.drainTask||!this.desired)return;let e=this.generation,t=this.drainDesired(e).finally(()=>{this.drainTask===t&&(this.drainTask=void 0,this.readyState&&!this.waitingForConnection&&this.desired&&queueMicrotask(()=>this.drain()))});this.drainTask=t}async drainDesired(e){for(;this.readyState&&!this.waitingForConnection&&e===this.generation&&this.desired;){let t=this.desired,n=this.connectionRevision;this.inFlight=t;try{await this.send(t),this.desired===t&&(this.desired=void 0)}catch(r){if(e!==this.generation)return;if(la(r)){if(n===this.connectionRevision){this.waitingForConnection=!0;return}continue}this.desired===t&&(this.desired=void 0),this.requestFailed(r)}finally{this.inFlight===t&&(this.inFlight=void 0)}}}async send(e){let{request:t,sequence:n}=e;t.kind===`scene`?await this.api.previewScene(this.sessionId,n,t.configEntryId,t.scene.scene,t.scene.speedIndex,t.persistDefault):t.diyCode===void 0?await this.api.previewSnapshot(this.sessionId,n,t.configEntryId,t.name,t.content,t.persistDefault,t.provenance):await this.api.previewSnapshot(this.sessionId,n,t.configEntryId,t.name,t.content,t.persistDefault,t.provenance,t.diyCode)}acceptStatus(e){e.session_id!==this.sessionId||e.sequence<this.latestStatusSequence||(this.latestStatusSequence=e.sequence,this.statusChanged(e))}async closeRemoteSession(e){try{await this.api.closePreviewSession(e)}catch(e){S(e)!==`preview_session_not_found`&&console.warn(`Could not close Effect Studio preview session`,e)}}};function fa(e){if(!(e===void 0||e.phase!==`failed`&&e.phase!==`unconfirmed`)){if(e.error_message)return e.error_message;switch(e.error_code){case`transport_failed`:return`Live apply could not reach the light. Turn Live off and on to try again.`;case`compilation_failed`:return`Live apply could not prepare this effect.`;case`storage_failed`:return`The light changed, but its scene default could not be saved.`;case`device_state_mismatch`:return`The light accepted the write, but its reported state did not match the requested change.`;case`device_readback_unknown`:return`The light accepted the write, but did not provide state readback to confirm it.`;default:return`Effect Studio could not confirm whether the Live change completed.`}}}var pa=class{constructor(e){this.model=e,this.rejectedRequestSequence=0,this.refreshedDefaultSequences=new Set,this.reportedPreviewErrors=new Set,this.progress=new aa({changed:e=>{this.model.patch({previewProgressVisible:e})}})}async open(e,t){this.api=e,this.reportedPreviewErrors.clear(),this.refreshedDefaultSequences.clear();let n=new da(e,e=>{if(e!==void 0&&e.config_entry_id!==this.model.selectedDeviceId)return;e?this.progress.accept(e):this.progress.clear(),this.model.update(t=>{t.previewStatus=e,t.previewNotice=void 0}),this.updateBuiltInDefaultStatus(e);let t=fa(e);if(t&&e){let n=`preview:${e.session_id}:${e.sequence}:${e.phase}:${e.error_code??``}`;this.reportedPreviewErrors.has(n)||(this.reportedPreviewErrors.add(n),this.model.reportError(t,{title:`Live change failed`,key:n}))}},t,e=>{this.progress.clear(),this.model.patch({previewStatus:void 0,previewNotice:void 0,previewProgressVisible:!1}),this.rejectedRequestSequence+=1,this.model.reportError(`Live request was not accepted: ${x(e)}`,{title:`Live request failed`,key:`preview-rejected:${this.rejectedRequestSequence}`})});return this.session=n,this.progress.reset(),!await n.open()||this.session!==n?(n.close(),this.session===n&&(this.api=void 0),!1):!0}beginEditorTransition(e=!0){let t=this.model.editorTransitionEpoch+1;return e?this.cancel():this.session?.transition(),this.progress.clear(),this.refreshedDefaultSequences.clear(),this.model.patch({editorTransitionEpoch:t,previewStatus:void 0,previewNotice:void 0,previewProgressVisible:!1}),t}scheduleEdited(e=`committed`,t){let n=this.currentRequest(t);n&&this.submit(n)}scheduleTemplateSelection(){let e=this.currentRequest();e&&this.submit(e)}scheduleScene(e){let t=this.model.selectedDeviceId;this.model.liveApplyEnabled&&t&&this.submit(ca(e,t))}async diyCodeChanged(){await this.cancel();let e=this.currentRequest();e&&this.submit(e)}toggle(e){if(this.model.liveApplyEnabled){this.model.update(e=>{e.liveApplyEnabled=!1,e.previewStatus=void 0,e.previewNotice=void 0,e.previewProgressVisible=!1}),this.progress.clear(),this.cancel();return}this.model.update(e=>{e.liveApplyEnabled=!0});let t=this.currentRequest(e);t&&this.submit(t)}async cancel(e=this.model.selectedDeviceId,t=!1){let n=this.session;if(n)try{await n.cancel(e)}catch(e){if(S(e)!==`preview_session_not_found`){if(t)throw e;this.model.update(t=>{t.notice=`Could not cancel Live: ${x(e)}`})}}}dispose(){this.progress.reset(),this.session?.close(),this.session=void 0,this.api=void 0,this.reportedPreviewErrors.clear(),this.refreshedDefaultSequences.clear(),this.model.update(e=>{e.previewStatus=void 0,e.previewNotice=void 0,e.previewProgressVisible=!1})}submit(e){this.model.liveApplyEnabled&&e.configEntryId===this.model.selectedDeviceId&&this.session?.submit(e)}currentRequest(e){if(this.model.liveApplyEnabled&&this.model.selectedDeviceId){if(this.model.section===`scenes`&&!this.model.sceneEditorOpen)return e?ca(e,this.model.selectedDeviceId):void 0;if(this.canPreview&&this.model.editorOwnedByActiveView&&k(this.model.content))return oa(this.model.selectedDeviceId,this.model.name.trim()||`Live preview`,this.model.content,this.model.autoSaveEnabled&&this.model.builtInDefaultDirty,sa(this.model.editorSource),this.model.h6179DiyCode)}}updateBuiltInDefaultStatus(e){if(!e?.persist_default||!this.model.builtInDefaultSource||!k(this.model.content))return;if(e.phase===`failed`){this.model.patch({autoSaveFailed:!0});return}if(e.phase!==`written`)return;let t=`${e.session_id}:${e.sequence}`;this.refreshedDefaultSequences.has(t)||(this.refreshedDefaultSequences.add(t),this.refreshBuiltInDefault(t))}async refreshBuiltInDefault(e){let t=this.api,n=this.model.selectedDeviceId,r=this.model.editorTransitionEpoch,i=this.model.editorSource,a=k(this.model.content)?E(this.model.content):void 0;if(t&&n&&a)try{let e=i.kind===`catalogue`?await t.templateDefault(n,i.selectionIdentity):i.kind===`scene`&&i.itemId===void 0&&Mi(a)?await t.sceneDetail(n,a.template.scene_id,a.template.effect_id):void 0;if(!e||t!==this.api||n!==this.model.selectedDeviceId||r!==this.model.editorTransitionEpoch||!this.sameBuiltInSource(i)||!k(e.content)||!k(e.catalogue_content))return;this.installBuiltInDefaultDetail(e)}catch(e){t===this.api&&n===this.model.selectedDeviceId&&r===this.model.editorTransitionEpoch&&this.sameBuiltInSource(i)&&this.model.patch({autoSaveFailed:!0,notice:`The default was saved, but its state could not be refreshed: ${x(e)}`})}finally{this.refreshedDefaultSequences.delete(e)}}sameBuiltInSource(e){let t=this.model.editorSource;return e.kind===`catalogue`&&t.kind===`catalogue`&&t.selectionIdentity===e.selectionIdentity||e.kind===`scene`&&e.itemId===void 0&&t.kind===`scene`&&t.itemId===void 0}installBuiltInDefaultDetail(e){k(e.content)&&k(e.catalogue_content)&&this.model.patch({builtInBaselines:$(e.catalogue_content,e.content,e.has_default),resetBaseline:E(e.catalogue_content),autoSaveFailed:!1})}get canPreview(){return k(this.model.content)&&this.model.isAdmin&&!this.model.deletingCurrentItem&&this.model.previewCapability===`supported`&&(!this.model.h6179DiyCodeRequired||this.model.h6179DiyCode!==void 0)&&this.model.selectedDevice!==void 0&&this.session?.ready===!0}},ma=o`
  :host {
    --studio-blue: var(--primary-color, #03a9f4);
    --studio-blue-soft: color-mix(
      in srgb,
      var(--studio-blue) 13%,
      transparent
    );
    --studio-border: var(--divider-color, #d8dce2);
    --studio-border-width: 1px;
    --studio-strong-border-width: 2px;
    --studio-card: var(--card-background-color, #fff);
    --studio-muted: var(--secondary-text-color, #68707c);
    --studio-danger: var(--error-color, #db4437);
    --studio-spacing-xxs: 4px;
    --studio-spacing-xs: 6px;
    --studio-spacing-sm: 8px;
    --studio-spacing-md: 10px;
    --studio-spacing-lg: 12px;
    --studio-spacing-xl: 14px;
    --studio-spacing-2xl: 16px;
    --studio-spacing-3xl: 18px;
    --studio-spacing-4xl: 20px;
    --studio-spacing-5xl: 22px;
    --studio-spacing-6xl: 24px;
    --studio-spacing-7xl: 28px;
    --studio-touch-target-size: 44px;
    --studio-control-height: var(--studio-touch-target-size);
    --studio-compact-control-height: 36px;
    --studio-compact-action-size: var(--studio-control-height);
    --studio-app-header-height: 56px;
    --studio-icon-size: 20px;
    --studio-action-glyph-size: var(--studio-icon-size);
    --studio-info-control-size: var(--studio-spacing-6xl);
    --studio-info-control-font-size: var(--studio-caption-size);
    --studio-info-popover-width: 320px;
    --studio-checkbox-size: 20px;
    --studio-small-swatch-size: 16px;
    --studio-swatch-size: 32px;
    --studio-paint-segment-height: 48px;
    --studio-control-radius: 8px;
    --studio-button-radius: 9px;
    --studio-card-radius: 10px;
    --studio-dialog-radius: 12px;
    --studio-swatch-radius: 6px;
    --studio-pill-radius: 999px;
    --studio-round-radius: 50%;
    --studio-card-padding: var(--studio-spacing-4xl);
    --studio-section-gap: var(--studio-spacing-3xl);
    --studio-parameter-gap: var(--studio-spacing-3xl);
    --studio-section-title-gap: var(--studio-spacing-xl);
    --studio-field-margin: var(--studio-spacing-xl);
    --studio-heading-gap: var(--studio-spacing-4xl);
    --studio-editor-heading-gap: var(--studio-spacing-5xl);
    --studio-control-gap: var(--studio-spacing-md);
    --studio-action-gap: var(--studio-spacing-md);
    --studio-compact-gap: var(--studio-spacing-sm);
    --studio-tight-gap: var(--studio-spacing-xs);
    --studio-micro-gap: var(--studio-spacing-xxs);
    --studio-caption-size: 12px;
    --studio-parameter-label-size: 13px;
    --studio-font-weight-medium: 500;
    --studio-font-weight-semibold: 600;
    --studio-font-weight-emphasis: 650;
    --studio-font-weight-bold: 700;
    --studio-font-weight-alert: 800;
    --studio-parameter-label-weight: var(--studio-font-weight-semibold);
    --studio-label-line-height: 1.35;
    --studio-muted-line-height: 1.45;
    --studio-body-line-height: 1.5;
    --studio-reading-line-height: 1.55;
    --studio-icon-line-height: 1;
    --studio-subheading-size: 14px;
    --studio-section-title-size: 16px;
    --studio-section-title-weight: var(--studio-font-weight-semibold);
    --studio-heading-size: 20px;
    --studio-editor-heading-size: 24px;
    --studio-page-heading-size: 25px;
    --studio-action-padding: var(--studio-spacing-sm)
      var(--studio-spacing-2xl);
    --studio-field-padding: var(--studio-spacing-sm)
      var(--studio-spacing-md);
    --studio-option-padding: var(--studio-spacing-sm)
      var(--studio-spacing-lg);
    --studio-sidebar-padding: var(--studio-spacing-5xl)
      var(--studio-spacing-2xl);
    --studio-editor-padding: var(--studio-spacing-7xl);
    --studio-mobile-editor-bottom-padding: 32px;
    --studio-mobile-editor-padding: var(--studio-spacing-4xl)
      var(--studio-spacing-2xl)
      var(--studio-mobile-editor-bottom-padding);
    --studio-dialog-padding: var(--studio-spacing-6xl);
    --studio-dialog-viewport-gutter: 48px;
    --studio-message-block-padding: 48px;
    --studio-message-inline-padding: 24px;
    --studio-empty-state-block-padding: 56px;
    --studio-chrome-gutter: var(--studio-spacing-2xl);
    --studio-empty-state-max-width: 680px;
    --studio-editor-name-max-width: 460px;
    --studio-editor-action-width: 96px;
    --studio-navigation-width: clamp(168px, 14vw, 190px);
    --studio-list-width: clamp(210px, 18vw, 230px);
    --studio-stacked-navigation-width: clamp(152px, 16vw, 170px);
    --studio-stacked-list-max-height: 220px;
    --studio-mobile-list-max-height: 340px;
    --studio-transition-duration: 120ms;
    --studio-switch-track-height: 24px;
    --studio-switch-thumb-size: 18px;
    --studio-switch-thumb-inset: 3px;
    --studio-compact-switch-track-width: 48px;
    --studio-switch-track-off: color-mix(
      in srgb,
      var(--studio-muted) 42%,
      var(--studio-card)
    );
    --studio-switch-track-on: color-mix(
      in srgb,
      var(--studio-blue) 72%,
      var(--studio-card)
    );
    --studio-switch-thumb-off: color-mix(
      in srgb,
      var(--studio-muted) 72%,
      var(--studio-card)
    );
    --studio-switch-thumb-on: var(--text-primary-color, #fff);
    --studio-switch-transition-duration: 150ms;
    --studio-switch-transition-easing: cubic-bezier(0.31, 0.94, 0.34, 1);
    --studio-z-raised: 1;
    --studio-z-toolbar: 4;
    --studio-z-popover: 20;
    --studio-z-modal: 1000;
    --studio-disabled-opacity: 0.52;
    --studio-focus-width: 3px;
    --studio-focus-offset: 2px;
    --studio-popover-padding: 10px;
    --studio-popover-radius: 9px;
    --studio-popover-shadow: 0 8px 24px rgb(0 0 0 / 18%);
    --studio-mobile-gutter: 24px;
  }
`,ha=o`
  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    min-height: var(--studio-control-height);
  }

  button:disabled,
  input:disabled,
  select:disabled {
    cursor: not-allowed;
    opacity: var(--studio-disabled-opacity);
  }
`,ga=o`
  .card {
    min-width: 0;
    padding: var(--studio-card-padding);
    border: var(--studio-border-width) solid var(--studio-border);
    border-radius: var(--studio-card-radius);
    background: var(--studio-card);
  }

  .section-title {
    margin: 0 0 var(--studio-section-title-gap);
    font-size: var(--studio-section-title-size);
    font-weight: var(--studio-section-title-weight);
    line-height: var(--studio-label-line-height);
  }
`,_a=o`
  .primary,
  .secondary,
  .danger {
    min-height: var(--studio-control-height);
    padding: var(--studio-action-padding);
    border-radius: var(--studio-button-radius);
    font-weight: var(--studio-font-weight-semibold);
    cursor: pointer;
  }

  .primary {
    border: var(--studio-border-width) solid var(--studio-blue);
    color: var(--text-primary-color, #fff);
    background: var(--studio-blue);
  }

  .secondary {
    border: var(--studio-border-width) solid var(--studio-border);
    color: var(--primary-text-color);
    background: var(--studio-card);
  }

  .danger {
    border: var(--studio-border-width) solid var(--studio-danger);
    color: var(--studio-danger);
    background: var(--studio-card);
  }

  .danger:hover,
  .danger:focus-visible {
    color: var(--text-primary-color, #fff);
    background: var(--studio-danger);
  }

  .danger.delete-action {
    color: var(--text-primary-color, #fff);
    background: var(--studio-danger);
  }

  .danger.delete-action:hover,
  .danger.delete-action:focus-visible {
    background: color-mix(in srgb, var(--studio-danger) 84%, #000);
  }

  .secondary.active {
    color: var(--studio-blue);
    border-color: var(--studio-blue);
    background: var(--studio-blue-soft);
  }
`,va=o`
  .selector {
    width: 100%;
    min-height: var(--studio-control-height);
    padding: var(--studio-field-padding);
    border: 0;
    border-radius: var(--studio-control-radius);
    color: var(--primary-text-color);
    background: transparent;
    text-align: start;
    cursor: pointer;
  }

  .selector:hover {
    background: color-mix(
      in srgb,
      var(--primary-text-color) 6%,
      transparent
    );
  }

  .selector.selected {
    /* Selection uses colour and fill so labels keep the same width and row height. */
    color: var(--studio-blue);
    background: var(--studio-blue-soft);
  }
`,ya=o`
  .parameter-stack {
    display: grid;
    gap: var(--studio-parameter-gap);
  }

  .parameter-stack > .field,
  .parameter-stack > .range-field,
  .parameter-stack > .parameter-group,
  .parameter-stack > .check-field {
    margin-top: 0;
  }

  .parameter-group {
    display: grid;
    gap: var(--studio-control-gap);
  }

  .check-field {
    display: flex;
    align-items: center;
    gap: var(--studio-control-gap);
    min-height: var(--studio-control-height);
  }

  .check-field input[type="checkbox"] {
    width: var(--studio-checkbox-size);
    height: var(--studio-checkbox-size);
    margin: 0;
    accent-color: var(--studio-blue);
  }

  .parameter-label,
  .field > span:first-child,
  .range-field > span:first-child,
  .check-field > span:last-child {
    color: var(--studio-muted);
    font-size: var(--studio-parameter-label-size);
    font-weight: var(--studio-parameter-label-weight);
    line-height: var(--studio-label-line-height);
  }

  .parameter-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--studio-tight-gap);
  }

  .parameter-options button {
    min-width: 0;
    flex: 1;
    padding: var(--studio-option-padding);
    border: var(--studio-border-width) solid var(--studio-border);
    border-radius: var(--studio-control-radius);
    color: var(--primary-text-color);
    background: var(--studio-card);
    font-size: var(--studio-parameter-label-size);
    font-weight: var(--studio-parameter-label-weight);
    cursor: pointer;
  }

  .parameter-options button.selected,
  .parameter-options button[aria-pressed="true"] {
    color: var(--studio-blue);
    border-color: var(--studio-blue);
    background: var(--studio-blue-soft);
  }

  .field,
  .range-field {
    display: grid;
    align-items: center;
    gap: var(--studio-control-gap);
    margin-top: var(--studio-field-margin);
  }

  .field input,
  .field select {
    width: 100%;
    min-width: 0;
    min-height: var(--studio-control-height);
    padding: var(--studio-field-padding);
    border: var(--studio-border-width) solid var(--studio-border);
    border-radius: var(--studio-control-radius);
    color: var(--primary-text-color);
    background: var(--studio-card);
  }

  .range-field input[type="range"] {
    width: 100%;
    min-width: 0;
    min-height: var(--studio-control-height);
    margin: 0;
  }

`,ba=o`
  .editor-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--studio-heading-gap);
    margin-bottom: var(--studio-editor-heading-gap);
  }

  .editor-title {
    display: grid;
    min-width: 0;
    gap: var(--studio-tight-gap);
  }

  .editable-title {
    display: flex;
    align-items: center;
    gap: var(--studio-tight-gap);
    min-width: 0;
  }

  .dirty-marker {
    color: var(--studio-blue);
    font-size: var(--studio-heading-size);
    font-weight: var(--studio-font-weight-bold);
    line-height: var(--studio-icon-line-height);
  }

  .origin-name {
    color: var(--studio-muted);
    font-size: var(--studio-caption-size);
    line-height: var(--studio-label-line-height);
  }

  .editor-name {
    width: min(var(--studio-editor-name-max-width), 100%);
    min-height: var(--studio-control-height);
    padding: var(--studio-compact-gap) 0;
    border: 0;
    border-bottom: var(--studio-border-width) solid var(--studio-border);
    border-radius: 0;
    color: var(--primary-text-color);
    background: transparent;
    font-size: var(--studio-editor-heading-size);
    font-weight: var(--studio-font-weight-semibold);
  }

  .actions {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--studio-action-gap);
  }

  .actions > .apply-action {
    margin-right: auto;
  }

  .actions > button {
    width: var(--studio-editor-action-width);
    min-width: var(--studio-editor-action-width);
    max-width: var(--studio-editor-action-width);
  }

  /* Gives editor actions full-row room on phone widths. */
  @media (max-width: 600px) {
    .editor-heading {
      align-items: stretch;
      flex-direction: column;
    }

    .actions {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(--studio-editor-action-width), 1fr)
      );
    }

    .actions > button {
      width: auto;
      min-width: 0;
      max-width: none;
    }
  }
`,xa=o`
  /* Standard one-pixel accessibility box keeps content available to assistive technology. */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
`,Sa=o`
  .sidebar {
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding: var(--studio-sidebar-padding);
    border-inline-end: var(--studio-border-width) solid var(--studio-border);
    contain: style;
  }

  .item-sidebar {
    background: var(--primary-background-color);
  }

  .editor-surface {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding: var(--studio-editor-padding);
    background: var(--secondary-background-color, #f5f6f8);
    contain: style;
  }

  /* Matches the panel's narrow document-flow breakpoint. */
  @media (max-width: 900px) {
    .item-sidebar {
      max-height: var(--studio-mobile-list-max-height);
      border-inline-end: 0;
      border-bottom: var(--studio-border-width) solid var(--studio-border);
    }
  }

  /* Reduces editor gutters once primary navigation becomes horizontal. */
  @media (max-width: 760px) {
    .editor-surface {
      padding: var(--studio-mobile-editor-padding);
    }
  }
`,Ca=[ma,ha,ga,_a,va,ya,ba,xa,Sa,o`
    :host {
      --studio-device-selector-max-width: 340px;
      --studio-device-selector-min-width: 180px;
      --studio-dialog-max-width: 440px;
      --studio-video-list-max-height: 150px;
      --studio-live-status-size: 18px;
      --studio-live-status-line-height: 16px;
      --studio-live-spin-duration: 700ms;
      --studio-live-reduced-motion-duration: 1400ms;
      --studio-light-on-ring-strength: 44%;
      --studio-light-on-hover-strength: 18%;
      --studio-light-off-foreground-strength: 72%;
      --studio-light-off-background-strength: 4%;
      --studio-dialog-shadow-offset: 18px;
      --studio-dialog-shadow-blur: 52px;
      display: flex;
      height: calc(100dvh - env(safe-area-inset-bottom, 0px));
      min-height: 0;
      overflow: hidden;
      flex-direction: column;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .panel-content {
      display: contents;
    }

    .centred,
    .fatal {
      max-width: var(--studio-empty-state-max-width);
      margin: 0 auto;
      padding: var(--studio-message-block-padding)
        var(--studio-message-inline-padding);
    }

    .fatal h1 {
      margin-top: 0;
    }

    .fatal a {
      color: var(--studio-blue);
      font-weight: var(--studio-font-weight-semibold);
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      margin-bottom: 0;
      font-size: var(--studio-page-heading-size);
      font-weight: var(--studio-font-weight-semibold);
    }

    h2 {
      margin-bottom: 0;
      font-size: var(--studio-heading-size);
      font-weight: var(--studio-font-weight-semibold);
    }

    h3 {
      margin-bottom: var(--studio-section-gap);
      font-size: var(--studio-section-title-size);
    }

    select {
      min-height: var(--studio-control-height);
      padding: var(--studio-option-padding);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-button-radius);
      color: var(--primary-text-color);
      background: var(--studio-card);
    }

    .home-assistant-header {
      display: flex;
      align-items: center;
      min-height: var(--studio-app-header-height);
      padding: 0 var(--studio-chrome-gutter);
      flex: 0 0 var(--studio-app-header-height);
      box-sizing: border-box;
      border-bottom: var(--app-header-border-bottom, none);
      color: var(--app-header-text-color, #fff);
      background: var(--app-header-background-color, var(--primary-color));
      font-size: var(--ha-font-size-l, 18px);
      font-weight: var(--ha-font-weight-normal, 400);
    }

    .home-assistant-menu {
      display: inline-grid;
      width: var(--studio-app-header-height);
      height: var(--studio-app-header-height);
      margin: 0 var(--studio-chrome-gutter) 0
        calc(0px - var(--studio-control-gap));
      padding: var(--studio-control-gap);
      border: 0;
      place-items: center;
      color: inherit;
      background: transparent;
      cursor: pointer;
    }

    .home-assistant-menu svg {
      width: var(--studio-icon-size);
      height: var(--studio-icon-size);
      fill: currentColor;
    }

    .home-assistant-menu:focus-visible {
      border-radius: var(--studio-round-radius);
      outline: var(--studio-strong-border-width) solid currentColor;
      outline-offset: calc(0px - var(--studio-micro-gap));
    }

    .studio-toolbar {
      position: sticky;
      z-index: var(--studio-z-toolbar);
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--studio-action-gap);
      height: var(--studio-app-header-height);
      min-height: var(--studio-app-header-height);
      padding: var(--studio-tight-gap) var(--studio-section-gap);
      box-sizing: border-box;
      border-bottom: var(--studio-border-width) solid var(--studio-border);
      background: var(--primary-background-color, #fff);
      contain: style;
    }

    .device-selector {
      display: flex;
      align-items: center;
      gap: var(--studio-control-gap);
      min-width: 0;
      flex: 1 1 auto;
      color: var(--studio-muted);
      font-size: var(--studio-parameter-label-size);
      font-weight: var(--studio-font-weight-semibold);
    }

    .studio-toolbar-device {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: var(--studio-micro-gap);
      flex: 1 1 auto;
    }

    .device-selector select {
      width: min(var(--studio-device-selector-max-width), 50vw);
      max-width: 100%;
      min-width: min(var(--studio-device-selector-min-width), 100%);
    }

    .live-apply-control {
      display: flex;
      align-items: center;
      gap: var(--studio-action-gap);
    }

    .toolbar-control {
      min-width: var(--studio-touch-target-size);
      height: var(--studio-touch-target-size);
      min-height: var(--studio-touch-target-size);
      box-sizing: border-box;
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-button-radius);
      color: var(--secondary-text-color);
      background: transparent;
    }

    .toolbar-mode-button {
      display: inline-grid;
      padding: var(--studio-micro-gap) var(--studio-control-gap);
      place-content: center;
      font: inherit;
      font-size: var(--studio-caption-size);
      font-weight: var(--studio-font-weight-semibold);
      line-height: var(--studio-label-line-height);
      cursor: pointer;
    }

    .toolbar-mode-button > span,
    .toolbar-mode-icon {
      display: block;
    }

    .toolbar-mode-icon {
      --mdc-icon-size: var(--studio-icon-size);
      display: inline-flex;
      width: var(--studio-icon-size);
      height: var(--studio-icon-size);
      align-items: center;
      justify-content: center;
      line-height: 0;
    }

    .toolbar-control:hover {
      color: var(--primary-text-color);
      background: color-mix(
        in srgb,
        var(--primary-text-color) 8%,
        transparent
      );
    }

    .toolbar-mode-button[aria-pressed="true"] {
      border-color: var(--studio-blue);
      color: var(--studio-blue);
      background: color-mix(in srgb, var(--studio-blue) 12%, transparent);
    }

    .toolbar-mode-button.pending {
      box-shadow: inset 0 0 0 var(--studio-border-width)
        var(--studio-blue);
    }

    .toolbar-control:focus-visible {
      outline: var(--studio-focus-width) solid var(--studio-blue);
      outline-offset: var(--studio-focus-offset);
    }

    .studio-toolbar-controls {
      display: flex;
      align-items: center;
      gap: var(--studio-micro-gap);
      flex: 0 0 auto;
      margin-inline-start: auto;
    }

    .support-notice {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--studio-tight-gap);
      margin: 0;
      padding: var(--studio-tight-gap) var(--studio-section-gap);
      border-bottom: var(--studio-border-width) solid var(--studio-border);
      color: var(--primary-text-color);
      background: color-mix(
        in srgb,
        var(--warning-color, #ff9800) 14%,
        var(--primary-background-color)
      );
      font-size: var(--studio-parameter-label-size);
      line-height: var(--studio-muted-line-height);
      white-space: nowrap;
    }

    .support-notice > span {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .support-notice button {
      flex: 0 0 auto;
      min-width: var(--studio-touch-target-size);
      padding-inline: var(--studio-tight-gap);
    }

    .feedback-dialog textarea {
      width: 100%;
      resize: vertical;
      font: inherit;
    }

    .feedback-dialog .feedback-copy {
      margin-top: var(--studio-tight-gap);
    }

    .feedback-dialog .dialog-actions {
      flex-wrap: wrap;
      align-items: center;
    }

    .light-control-button {
      display: inline-grid;
      width: var(--studio-touch-target-size);
      padding: var(--studio-compact-gap);
      place-items: center;
      cursor: pointer;
      text-decoration: none;
    }

    .light-control-button:focus-visible {
      color: var(--primary-text-color);
    }

    .light-control-button svg {
      width: var(--studio-icon-size);
      height: var(--studio-icon-size);
      fill: currentColor;
    }

    .native-light-brightness-ring {
      fill: currentColor;
    }

    .native-light-control.light-state-on {
      color: var(--studio-blue);
      background:
        linear-gradient(
          to top,
          color-mix(in srgb, var(--studio-blue) 38%, transparent)
            0 var(--native-light-fill),
          transparent var(--native-light-fill) 100%
        ),
        var(--studio-blue-soft);
      box-shadow: inset 0 0 0 var(--studio-border-width)
        color-mix(
          in srgb,
          var(--studio-blue) var(--studio-light-on-ring-strength),
          transparent
        );
    }

    .native-light-control.light-state-on:hover,
    .native-light-control.light-state-on:focus-visible {
      color: var(--studio-blue);
      background:
        linear-gradient(
          to top,
          color-mix(in srgb, var(--studio-blue) 48%, transparent)
            0 var(--native-light-fill),
          transparent var(--native-light-fill) 100%
        ),
        color-mix(
          in srgb,
          var(--studio-blue) var(--studio-light-on-hover-strength),
          transparent
        );
    }

    .native-light-control.light-state-off {
      color: color-mix(
        in srgb,
        var(--studio-muted) var(--studio-light-off-foreground-strength),
        transparent
      );
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121)
          var(--studio-light-off-background-strength),
        transparent
      );
    }

    .native-light-control.light-state-unavailable {
      color: var(--studio-muted);
      opacity: var(--studio-disabled-opacity);
    }

    .live-apply-status {
      position: relative;
      display: grid;
      width: var(--studio-live-status-size);
      height: var(--studio-live-status-size);
      flex: 0 0 var(--studio-live-status-size);
      place-items: center;
      border: var(--studio-strong-border-width) solid transparent;
      border-radius: var(--studio-round-radius);
    }

    .live-apply-status.idle {
      visibility: hidden;
    }

    .live-apply-status.pending {
      border-color: color-mix(
        in srgb,
        var(--studio-blue) 25%,
        transparent
      );
      border-top-color: var(--studio-blue);
      animation: live-apply-spin var(--studio-live-spin-duration) linear
        infinite;
    }

    .live-apply-status.warning {
      border-color: var(--error-color, #db4437);
    }

    .live-apply-status.warning::after {
      position: absolute;
      inset: calc(0px - var(--studio-border-width)) 0 0;
      color: var(--error-color, #db4437);
      content: "!";
      font-size: var(--studio-caption-size);
      font-weight: var(--studio-font-weight-alert);
      line-height: var(--studio-live-status-line-height);
      text-align: center;
    }

    @keyframes live-apply-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .studio {
      display: grid;
      min-height: 0;
      overflow: hidden;
      flex: 1 1 auto;
      contain: style;
      grid-template-columns:
        var(--studio-navigation-width)
        var(--studio-list-width)
        minmax(0, 1fr);
    }

    .empty-state {
      max-width: var(--studio-empty-state-max-width);
      margin: 0 auto;
      padding: var(--studio-empty-state-block-padding)
        var(--studio-message-inline-padding);
    }

    .empty-state a {
      color: var(--studio-blue);
      font-weight: var(--studio-font-weight-semibold);
    }

    .studio.scenes-mode {
      grid-template-columns:
        var(--studio-navigation-width)
        var(--studio-list-width)
        minmax(0, 1fr);
    }

    .primary-nav {
      display: flex;
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      flex-direction: column;
      gap: var(--studio-tight-gap);
      padding: var(--studio-sidebar-padding);
      border-inline-end: var(--studio-border-width) solid var(--studio-border);
      background: var(--secondary-background-color, #f5f6f8);
      contain: layout paint style;
    }

    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--studio-action-gap);
    }

    .mobile-name-label {
      display: none;
    }

    .actions > button {
      min-height: var(--studio-control-height);
    }

    .dialog-backdrop {
      position: fixed;
      z-index: var(--studio-z-modal);
      inset: 0;
      display: grid;
      place-items: center;
      overflow: auto;
      overscroll-behavior: contain;
      padding: var(--studio-dialog-padding);
      background: rgb(0 0 0 / 45%);
    }

    .dialog-card {
      width: min(var(--studio-dialog-max-width), 100%);
      max-height: calc(100vh - var(--studio-dialog-viewport-gutter));
      overflow: auto;
      padding: var(--studio-dialog-padding);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-dialog-radius);
      color: var(--primary-text-color);
      background: var(--studio-card);
      box-shadow: 0 var(--studio-dialog-shadow-offset)
        var(--studio-dialog-shadow-blur) rgb(0 0 0 / 28%);
    }

    .dialog-card p {
      margin-top: var(--studio-spacing-2xl);
      margin-bottom: 0;
      line-height: var(--studio-body-line-height);
    }

    .save-dialog .field,
    .transition-dialog .field {
      margin-top: var(--studio-spacing-4xl);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--studio-action-gap);
      margin-top: var(--studio-dialog-padding);
    }

    .controls {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--studio-section-gap);
      margin-top: var(--studio-section-gap);
    }

    .single-effect-settings {
      margin-bottom: var(--studio-section-gap);
    }

    .single-effect-settings .field {
      margin-top: 0;
    }

    .opaque-content h3 {
      margin: 0 0 var(--studio-compact-gap);
    }

    .opaque-content h3:not(:first-child) {
      margin-top: var(--studio-spacing-4xl);
    }

    .opaque-content p {
      margin: 0;
    }

    .opaque-content pre {
      max-width: 100%;
      margin: 0;
      padding: var(--studio-spacing-2xl);
      overflow: auto;
      border-radius: var(--studio-control-radius);
      background: var(--secondary-background-color, #f1f1f1);
      color: var(--primary-text-color);
      font: var(--studio-caption-size) / var(--studio-body-line-height)
        ui-monospace, SFMono-Regular, Consolas, monospace;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .paint-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--studio-control-gap);
      margin-top: var(--studio-field-margin);
    }

    .paint-off {
      display: inline-flex;
      align-items: center;
      gap: var(--studio-compact-gap);
      min-height: var(--studio-compact-control-height);
      padding: var(--studio-tight-gap) var(--studio-control-gap);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-button-radius);
      color: var(--primary-text-color);
      background: var(--studio-card);
      cursor: pointer;
    }

    .paint-off.active {
      border-color: color-mix(
        in srgb,
        var(--studio-blue) 58%,
        var(--studio-border)
      );
      box-shadow: inset 0 0 0 var(--studio-border-width)
        var(--studio-blue);
    }

    .paint-off-swatch {
      width: var(--studio-small-swatch-size);
      height: var(--studio-small-swatch-size);
      border: var(--studio-border-width) solid var(--studio-border);
      border-radius: var(--studio-round-radius);
      background: #000;
      box-shadow: inset 0 0 0 var(--studio-border-width)
        rgb(255 255 255 / 14%);
    }

    .read-only-copy {
      margin: 0 0 var(--studio-section-gap);
      line-height: var(--studio-muted-line-height);
    }

    .read-only-copy {
      color: var(--studio-muted);
    }

    .h6179-diy-approval {
      margin-bottom: var(--studio-section-gap);
      border-color: var(--warning-color, #ff9800);
    }

    .h6179-diy-approval p {
      line-height: var(--studio-muted-line-height);
    }

    .observed-diy-code {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--studio-control-gap);
      margin-bottom: var(--studio-field-margin);
    }

    .approval-status {
      margin-bottom: var(--studio-field-margin);
      color: var(--studio-muted);
    }

    .observed-diy-code .approval-status {
      margin-bottom: 0;
    }

    .observed-diy-code code {
      color: var(--primary-text-color);
      font-weight: var(--studio-font-weight-semibold);
    }

    /* Accommodates Home Assistant's docked sidebar on common 1024px and 1280px desktops. */
    @media (min-width: 901px) and (max-width: 1320px) {
      .studio.scenes-mode {
        flex-basis: 0;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-columns:
          var(--studio-stacked-navigation-width)
          minmax(0, 1fr);
      }

      .studio.custom-mode {
        flex-basis: 0;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-columns:
          var(--studio-stacked-navigation-width)
          minmax(0, 1fr);
      }

      .scenes-mode .primary-nav {
        grid-row: 1 / span 2;
      }

      .custom-mode .primary-nav {
        grid-row: 1 / span 2;
      }

      .scenes-mode > .editor {
        grid-row: 2;
        grid-column: 2;
      }

      .custom-mode > .editor {
        grid-row: 2;
        grid-column: 2;
      }

      .studio.video-mode {
        flex-basis: 0;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-columns:
          var(--studio-stacked-navigation-width)
          minmax(0, 1fr);
      }

      .video-mode .primary-nav {
        grid-row: 1 / span 2;
      }

      .video-mode .library {
        grid-row: 1;
        grid-column: 2;
        max-height: var(--studio-video-list-max-height);
        border-inline-end: 0;
        border-bottom: var(--studio-border-width) solid var(--studio-border);
      }

      .video-mode .editor {
        grid-row: 2;
        grid-column: 2;
      }
    }

    /* Switches from bounded panel grids to document-flow layout on narrow screens. */
    @media (max-width: 900px) {
      :host {
        height: auto;
        min-height: 100%;
        overflow: visible;
      }

      .studio {
        grid-template-columns:
          var(--studio-stacked-navigation-width)
          minmax(0, 1fr);
        min-height: 0;
        overflow: visible;
        flex: none;
      }

      .studio.scenes-mode,
      .studio.custom-mode {
        grid-template-columns:
          var(--studio-stacked-navigation-width)
          minmax(0, 1fr);
      }

      .custom-mode .library {
        grid-column: 2;
      }

      .video-mode .library {
        grid-column: 2;
      }

      .editor {
        grid-column: 2;
      }

      .controls {
        grid-template-columns: 1fr;
      }
    }

    /* Moves primary navigation into a horizontal row on phone and small tablet widths. */
    @media (max-width: 760px) {
      .studio {
        display: block;
      }

      .primary-nav {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: var(--studio-tight-gap);
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scrollbar-gutter: auto;
        padding: var(--studio-control-gap) var(--studio-chrome-gutter);
        border-inline-end: 0;
        border-bottom: var(--studio-border-width) solid var(--studio-border);
        scrollbar-width: none;
      }

      .primary-nav::-webkit-scrollbar {
        display: none;
      }

      .selector {
        width: auto;
        flex: 0 0 auto;
        text-align: center;
        white-space: nowrap;
      }

      .library {
        padding-block: var(--studio-section-gap);
      }

      .library .selector {
        text-align: start;
      }
    }

    /* Keeps device and entity controls on one phone row. */
    @media (max-width: 480px) {
      .studio-toolbar {
        height: var(--studio-app-header-height);
        min-height: var(--studio-app-header-height);
        align-items: center;
        flex-direction: row;
        gap: var(--studio-micro-gap);
        padding: var(--studio-tight-gap) var(--studio-compact-gap);
      }

      .device-selector {
        min-width: 0;
        flex: 1 1 auto;
      }

      .device-selector select {
        width: 100%;
        min-width: 0;
        min-height: var(--studio-control-height);
        padding-inline: var(--studio-compact-gap);
      }

      .studio-toolbar-controls {
        min-width: 0;
        flex: 0 0 auto;
        align-self: center;
      }

      .live-apply-control {
        gap: var(--studio-micro-gap);
      }

      .editor {
        display: flex;
        flex-direction: column;
      }

      .editor > .editor-heading {
        display: contents;
      }

      .editor > .editor-heading > .actions {
        order: 100;
        margin-top: var(--studio-section-gap);
      }

      .editor > .editor-heading > .editor-heading-title {
        order: -1;
      }

      .editor .mobile-editable-heading {
        margin-top: var(--studio-section-gap);
      }

      .editor .mobile-name-label {
        display: block;
        color: var(--studio-muted);
        font-size: var(--studio-parameter-label-size);
        font-weight: var(--studio-parameter-label-weight);
      }

      .mobile-redundant-heading {
        display: none;
      }

      .button-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      .button-row button:first-child {
        grid-column: 1 / -1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        scroll-behavior: auto !important;
      }

      .live-apply-status.pending {
        animation-duration: var(--studio-live-reduced-motion-duration);
      }

    }
  `],wa=17,Ta=`govee_strip_studio/effect_studio/recent_colours`,Ea=[[255,69,58],[255,159,10],[255,214,10],[48,209,88],[99,230,226],[100,210,255],[10,132,255],[94,92,230],[191,90,242],[255,45,85],[172,142,104],[255,255,255],[174,174,178],[99,99,102],[28,28,30],[255,127,0],[139,0,255]],Da=ja();function Oa(e){return[...Da[e%Da.length]]}function ka(){return b(Da)}function Aa(e){let t=nt(e);Da=Ma([[...e],...Da.filter(e=>nt(e)!==t)]),localStorage.setItem(Ta,JSON.stringify(Da))}function ja(){let e=localStorage.getItem(Ta);if(!e)return b(Ea);let t;try{t=JSON.parse(e)}catch(e){if(e instanceof SyntaxError)return b(Ea);throw e}return Array.isArray(t)?Ma(t.filter(Na).map(e=>[...e]).slice(0,wa)):b(Ea)}function Ma(e){let t=b(e);for(let e of Ea)t.length>=wa||t.some(t=>nt(t)===nt(e))||t.push([...e]);return t.slice(0,wa)}function Na(e){return Array.isArray(e)&&e.length===3&&e.every(e=>Number.isInteger(e)&&e>=0&&e<=255)}function Pa(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Fa=`modulepreload`,Ia=function(e,t){return new URL(e,t).href},La={},Ra=function(e){return e.pathname.endsWith(`.css`)},za=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},Ba=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Ia(t,n);let r=s(t),i=Ra(r);return za(La,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:Fa,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};export{sn as $,Ze as $t,bi as A,Ft as At,ki as B,it as Bt,Ai as C,Ut as Ct,Mi as D,Et as Dt,xi as E,Pt as Et,Hi as F,et as Ft,Gn as G,ut as Gt,pi as H,x as Ht,Si as I,v as It,bn as J,nt as Jt,Ln as K,st as Kt,Ci as L,ct as Lt,Di as M,Nt as Mt,Bi as N,jt as Nt,Fi as O,At as Ot,Ii as P,lt as Pt,Pn as Q,Qe as Qt,Pi as R,b as Rt,Ti as S,kt as St,Vi as T,zt as Tt,ii as U,ot as Ut,mi as V,S as Vt,Kn as W,rt as Wt,On as X,at as Xt,un as Y,ft as Yt,En as Z,$e as Zt,Yi as _,C as _t,Aa as a,o as an,qt as at,Ui as b,wt as bt,ha as c,mt as ct,ya as d,Rt as dt,qe as en,ln as et,va as f,Ct as ft,ra as g,yt as gt,pa as h,bt as ht,ka as i,Ue as in,Jt as it,Ei as j,Wt as jt,wi as k,Tt as kt,ga as l,pt as lt,Sa as m,_t as mt,Pa as n,m as nn,Qt as nt,Ca as o,Xt as ot,xa as p,Vt as pt,Bn as q,dt as qt,Oa as r,je as rn,Zt as rt,_a as s,Yt as st,Ba as t,h as tn,Kt as tt,ba as u,Lt as ut,Ji as v,St as vt,ji as w,Mt as wt,zi as x,It as xt,Wi as y,vt as yt,Oi as z,y as zt};