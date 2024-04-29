import{a as St,c as Ee,W as _e,d as ye,i as me,f as Ie,w as xt}from"./wind-core.esm.CHEVv6qw.js";import{F as _n}from"./wind-core.esm.CHEVv6qw.js";function m(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t}let Oe=0;function te(t){return t.ol_uid||(t.ol_uid=++Oe)}function Kt(t){const e=ft();for(let n=0,i=t.length;n<i;++n)ot(e,t[n]);return e}function ee(t,e){return ve(t,e[0],e[1])}function Re(t,e){return t[0]<=e[0]&&e[2]<=t[2]&&t[1]<=e[1]&&e[3]<=t[3]}function ve(t,e,n){return t[0]<=e&&e<=t[2]&&t[1]<=n&&n<=t[3]}function ft(){return[1/0,1/0,-1/0,-1/0]}function Se(t,e,n,i,s){return s?(s[0]=t,s[1]=e,s[2]=n,s[3]=i,s):[t,e,n,i]}function Pe(t){return Se(1/0,1/0,-1/0,-1/0,t)}function Te(t,e){return t[0]==e[0]&&t[2]==e[2]&&t[1]==e[1]&&t[3]==e[3]}function we(t,e){return e[0]<t[0]&&(t[0]=e[0]),e[2]>t[2]&&(t[2]=e[2]),e[1]<t[1]&&(t[1]=e[1]),e[3]>t[3]&&(t[3]=e[3]),t}function ot(t,e){e[0]<t[0]&&(t[0]=e[0]),e[0]>t[2]&&(t[2]=e[0]),e[1]<t[1]&&(t[1]=e[1]),e[1]>t[3]&&(t[3]=e[1])}function Me(t){return[t[0],t[1]]}function Le(t){return[t[2],t[1]]}function Ae(t){return[(t[0]+t[2])/2,(t[1]+t[3])/2]}function at(t){return t[3]-t[1]}function Ce(t,e,n){const i=n||ft();return ie(t,e)?(t[0]>e[0]?i[0]=t[0]:i[0]=e[0],t[1]>e[1]?i[1]=t[1]:i[1]=e[1],t[2]<e[2]?i[2]=t[2]:i[2]=e[2],t[3]<e[3]?i[3]=t[3]:i[3]=e[3]):Pe(i),i}function ne(t){return[t[0],t[3]]}function De(t){return[t[2],t[3]]}function C(t){return t[2]-t[0]}function ie(t,e){return t[0]<=e[2]&&t[2]>=e[0]&&t[1]<=e[3]&&t[3]>=e[1]}function We(t,e){const n=(t[2]-t[0])/2*(e-1),i=(t[3]-t[1])/2*(e-1);t[0]-=n,t[2]+=n,t[1]-=i,t[3]+=i}const Ne={PROPERTYCHANGE:"propertychange"},Dt=typeof Object.assign=="function"?Object.assign:function(t,e){if(t==null)throw new TypeError("Cannot convert undefined or null to object");const n=Object(t);for(let i=1,s=arguments.length;i<s;++i){const o=arguments[i];if(o!=null)for(const r in o)o.hasOwnProperty(r)&&(n[r]=o[r])}return n};function se(t){for(const e in t)delete t[e]}function Ge(t){const e=function(n){const i=t.listener,s=t.bindTo||t.target;return t.callOnce&&K(t),i.call(s,n)};return t.boundListener=e,e}function oe(t,e,n,i){let s;for(let o=0,r=t.length;o<r;++o)if(s=t[o],s.listener===e&&s.bindTo===n)return i&&(s.deleteIndex=o),s}function Wt(t,e){const n=t.ol_lm;return n?n[e]:void 0}function re(t){let e=t.ol_lm;return e||(e=t.ol_lm={}),e}function ce(t,e){const n=Wt(t,e);if(n){for(let s=0,o=n.length;s<o;++s)t.removeEventListener(e,n[s].boundListener),se(n[s]);n.length=0;const i=t.ol_lm;i&&(delete i[e],Object.keys(i).length===0&&delete t.ol_lm)}}function N(t,e,n,i,s){const o=re(t);let r=o[e];r||(r=o[e]=[]);let c=oe(r,n,i,!1);return c?s||(c.callOnce=!1):(c={bindTo:i,callOnce:!!s,listener:n,target:t,type:e},t.addEventListener(e,Ge(c)),r.push(c)),c}function Vt(t,e,n,i){return N(t,e,n,i,!0)}function Ht(t,e,n,i){const s=Wt(t,e);if(s){const o=oe(s,n,i,!0);o&&K(o)}}function K(t){if(t&&t.target){t.target.removeEventListener(t.type,t.boundListener);const e=Wt(t.target,t.type);if(e){const n="deleteIndex"in t?t.deleteIndex:e.indexOf(t);n!==-1&&e.splice(n,1),e.length===0&&ce(t.target,t.type)}se(t)}}function be(t){const e=re(t);for(const n in e)ce(t,n)}function lt(){}const k=function(){};k.prototype.disposed_=!1;k.prototype.dispose=function(){this.disposed_||(this.disposed_=!0,this.disposeInternal())};k.prototype.disposeInternal=lt;const At=function(t){this.propagationStopped,this.type=t,this.target=null};At.prototype.preventDefault=At.prototype.stopPropagation=function(){this.propagationStopped=!0};const tt=At,M=function(){k.call(this),this.pendingRemovals_={},this.dispatching_={},this.listeners_={}};m(M,k);M.prototype.addEventListener=function(t,e){let n=this.listeners_[t];n||(n=this.listeners_[t]=[]),n.indexOf(e)===-1&&n.push(e)};M.prototype.dispatchEvent=function(t){const e=typeof t=="string"?new tt(t):t,n=e.type;e.target=this;const i=this.listeners_[n];let s;if(i){n in this.dispatching_||(this.dispatching_[n]=0,this.pendingRemovals_[n]=0),++this.dispatching_[n];for(let o=0,r=i.length;o<r;++o)if(i[o].call(this,e)===!1||e.propagationStopped){s=!1;break}if(--this.dispatching_[n],this.dispatching_[n]===0){let o=this.pendingRemovals_[n];for(delete this.pendingRemovals_[n];o--;)this.removeEventListener(n,lt);delete this.dispatching_[n]}return s}};M.prototype.disposeInternal=function(){be(this)};M.prototype.getListeners=function(t){return this.listeners_[t]};M.prototype.hasListener=function(t){return t?t in this.listeners_:Object.keys(this.listeners_).length>0};M.prototype.removeEventListener=function(t,e){const n=this.listeners_[t];if(n){const i=n.indexOf(e);t in this.pendingRemovals_?(n[i]=lt,++this.pendingRemovals_[t]):(n.splice(i,1),n.length===0&&delete this.listeners_[t])}};const et={CHANGE:"change",CLEAR:"clear",CONTEXTMENU:"contextmenu",CLICK:"click",DBLCLICK:"dblclick",DRAGENTER:"dragenter",DRAGOVER:"dragover",DROP:"drop",ERROR:"error",KEYDOWN:"keydown",KEYPRESS:"keypress",LOAD:"load",MOUSEDOWN:"mousedown",MOUSEMOVE:"mousemove",MOUSEOUT:"mouseout",MOUSEUP:"mouseup",MOUSEWHEEL:"mousewheel",MSPOINTERDOWN:"MSPointerDown",RESIZE:"resize",TOUCHSTART:"touchstart",TOUCHMOVE:"touchmove",TOUCHEND:"touchend",WHEEL:"wheel"},G=function(){M.call(this),this.revision_=0};m(G,M);G.prototype.changed=function(){++this.revision_,this.dispatchEvent(et.CHANGE)};G.prototype.dispatchEvent;G.prototype.getRevision=function(){return this.revision_};G.prototype.on=function(t,e){if(Array.isArray(t)){const n=t.length,i=new Array(n);for(let s=0;s<n;++s)i[s]=N(this,t[s],e);return i}else return N(this,t,e)};G.prototype.once=function(t,e){if(Array.isArray(t)){const n=t.length,i=new Array(n);for(let s=0;s<n;++s)i[s]=Vt(this,t[s],e);return i}else return Vt(this,t,e)};G.prototype.un=function(t,e){if(Array.isArray(t)){for(let n=0,i=t.length;n<i;++n)Ht(this,t[n],e);return}else Ht(this,t,e)};const ae=G,Ct=function(t,e,n){tt.call(this,t),this.key=e,this.oldValue=n};m(Ct,tt);const T=function(t){ae.call(this),te(this),this.values_={},t!==void 0&&this.setProperties(t)};m(T,ae);const Pt={};function ue(t){return Pt.hasOwnProperty(t)?Pt[t]:Pt[t]="change:"+t}T.prototype.get=function(t){let e;return this.values_.hasOwnProperty(t)&&(e=this.values_[t]),e};T.prototype.getKeys=function(){return Object.keys(this.values_)};T.prototype.getProperties=function(){return Dt({},this.values_)};T.prototype.notify=function(t,e){let n;n=ue(t),this.dispatchEvent(new Ct(n,t,e)),n=Ne.PROPERTYCHANGE,this.dispatchEvent(new Ct(n,t,e))};T.prototype.set=function(t,e,n){if(n)this.values_[t]=e;else{const i=this.values_[t];this.values_[t]=e,i!==e&&this.notify(t,i)}};T.prototype.setProperties=function(t,e){for(const n in t)this.set(n,t[n],e)};T.prototype.unset=function(t,e){if(t in this.values_){const n=this.values_[t];delete this.values_[t],e||this.notify(t,n)}};const p={OPACITY:"opacity",VISIBLE:"visible",EXTENT:"extent",Z_INDEX:"zIndex",MAX_RESOLUTION:"maxResolution",MIN_RESOLUTION:"minResolution",SOURCE:"source"};function Ue(t,e,n){return Math.min(Math.max(t,e),n)}const je=function(){let t;return"cosh"in Math?t=Math.cosh:t=function(e){const n=Math.exp(e);return(n+1/n)/2},t}();function Xe(t){const e=t.length;for(let i=0;i<e;i++){let s=i,o=Math.abs(t[i][i]);for(let c=i+1;c<e;c++){const a=Math.abs(t[c][i]);a>o&&(o=a,s=c)}if(o===0)return null;const r=t[s];t[s]=t[i],t[i]=r;for(let c=i+1;c<e;c++){const a=-t[c][i]/t[i][i];for(let l=i;l<e+1;l++)i==l?t[c][l]=0:t[c][l]+=a*t[i][l]}}const n=new Array(e);for(let i=e-1;i>=0;i--){n[i]=t[i][e]/t[i][i];for(let s=i-1;s>=0;s--)t[s][e]-=t[s][i]*n[i]}return n}function Tt(t){return t*Math.PI/180}function wt(t,e){const n=t%e;return n*e<0?n+e:n}const g=function(t){T.call(this);const e=Dt({},t);e[p.OPACITY]=t.opacity!==void 0?t.opacity:1,e[p.VISIBLE]=t.visible!==void 0?t.visible:!0,e[p.Z_INDEX]=t.zIndex!==void 0?t.zIndex:0,e[p.MAX_RESOLUTION]=t.maxResolution!==void 0?t.maxResolution:1/0,e[p.MIN_RESOLUTION]=t.minResolution!==void 0?t.minResolution:0,this.setProperties(e),this.state_={layer:this,managed:!0},this.type};m(g,T);g.prototype.getType=function(){return this.type};g.prototype.getLayerState=function(){return this.state_.opacity=Ue(this.getOpacity(),0,1),this.state_.sourceState=this.getSourceState(),this.state_.visible=this.getVisible(),this.state_.extent=this.getExtent(),this.state_.zIndex=this.getZIndex(),this.state_.maxResolution=this.getMaxResolution(),this.state_.minResolution=Math.max(this.getMinResolution(),0),this.state_};g.prototype.getLayersArray=function(t){};g.prototype.getLayerStatesArray=function(t){};g.prototype.getExtent=function(){return this.get(p.EXTENT)};g.prototype.getMaxResolution=function(){return this.get(p.MAX_RESOLUTION)};g.prototype.getMinResolution=function(){return this.get(p.MIN_RESOLUTION)};g.prototype.getOpacity=function(){return this.get(p.OPACITY)};g.prototype.getSourceState=function(){};g.prototype.getVisible=function(){return this.get(p.VISIBLE)};g.prototype.getZIndex=function(){return this.get(p.Z_INDEX)};g.prototype.setExtent=function(t){this.set(p.EXTENT,t)};g.prototype.setMaxResolution=function(t){this.set(p.MAX_RESOLUTION,t)};g.prototype.setMinResolution=function(t){this.set(p.MIN_RESOLUTION,t)};g.prototype.setOpacity=function(t){this.set(p.OPACITY,t)};g.prototype.setVisible=function(t){this.set(p.VISIBLE,t)};g.prototype.setZIndex=function(t){this.set(p.Z_INDEX,t)};const he={UNDEFINED:"undefined",LOADING:"loading",READY:"ready",ERROR:"error"};function Bt(t,e){const n=document.createElement("CANVAS");return t&&(n.width=t),e&&(n.height=e),n.getContext("2d")}const Fe={IMAGE:"IMAGE",TILE:"TILE",VECTOR_TILE:"VECTOR_TILE",VECTOR:"VECTOR"},xe={POSTCOMPOSE:"postcompose",PRECOMPOSE:"precompose",RENDER:"render"},L=function(t){const e=Dt({},t);delete e.source,g.call(this,e),this.mapPrecomposeKey_=null,this.mapRenderKey_=null,this.sourceChangeKey_=null,t.map&&this.setMap(t.map),N(this,ue(p.SOURCE),this.handleSourcePropertyChange_,this);const n=t.source?t.source:null;this.setSource(n)};m(L,g);L.prototype.getLayersArray=function(t){const e=t||[];return e.push(this),e};L.prototype.getLayerStatesArray=function(t){const e=t||[];return e.push(this.getLayerState()),e};L.prototype.getSource=function(){return this.get(p.SOURCE)||null};L.prototype.getSourceState=function(){const t=this.getSource();return t?t.getState():he.UNDEFINED};L.prototype.handleSourceChange_=function(){this.changed()};L.prototype.handleSourcePropertyChange_=function(){this.sourceChangeKey_&&(K(this.sourceChangeKey_),this.sourceChangeKey_=null);const t=this.getSource();t&&(this.sourceChangeKey_=N(t,et.CHANGE,this.handleSourceChange_,this)),this.changed()};L.prototype.setMap=function(t){this.mapPrecomposeKey_&&(K(this.mapPrecomposeKey_),this.mapPrecomposeKey_=null),t||this.changed(),this.mapRenderKey_&&(K(this.mapRenderKey_),this.mapRenderKey_=null),t&&(this.mapPrecomposeKey_=N(t,xe.PRECOMPOSE,function(e){const n=this.getLayerState();n.managed=!1,n.zIndex=1/0,e.frameState.layerStatesArray.push(n),e.frameState.layerStates[te(this)]=n},this),this.mapRenderKey_=N(this,et.CHANGE,t.render,t),this.changed())};L.prototype.setSource=function(t){this.set(p.SOURCE,t)};const E={IDLE:0,LOADING:1,LOADED:2,ERROR:3},Nt=function(t){const e=t||{};L.call(this,e),this.type=Fe.IMAGE};m(Nt,L);Nt.prototype.getSource;/**
 * @license
 * Latitude/longitude spherical geodesy formulae taken from
 * http://www.movable-type.co.uk/scripts/latlong.html
 * Licensed under CC-BY-3.0.
 */const Ke=63710088e-1;function $t(t,e,n){const i=n||Ke,s=Tt(t[1]),o=Tt(e[1]),r=(o-s)/2,c=Tt(e[0]-t[0])/2,a=Math.sin(r)*Math.sin(r)+Math.sin(c)*Math.sin(c)*Math.cos(s)*Math.cos(o);return 2*i*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}const nt={DEGREES:"degrees",FEET:"ft",METERS:"m",PIXELS:"pixels",TILE_PIXELS:"tile-pixels",USFEET:"us-ft"},V={};V[nt.DEGREES]=2*Math.PI*6370997/360;V[nt.FEET]=.3048;V[nt.METERS]=1;V[nt.USFEET]=1200/3937;const ut=nt,I=function(t){this.code_=t.code,this.units_=t.units,this.extent_=t.extent!==void 0?t.extent:null,this.worldExtent_=t.worldExtent!==void 0?t.worldExtent:null,this.axisOrientation_=t.axisOrientation!==void 0?t.axisOrientation:"enu",this.global_=t.global!==void 0?t.global:!1,this.canWrapX_=!!(this.global_&&this.extent_),this.getPointResolutionFunc_=t.getPointResolution,this.defaultTileGrid_=null,this.metersPerUnit_=t.metersPerUnit};I.prototype.canWrapX=function(){return this.canWrapX_};I.prototype.getCode=function(){return this.code_};I.prototype.getExtent=function(){return this.extent_};I.prototype.getUnits=function(){return this.units_};I.prototype.getMetersPerUnit=function(){return this.metersPerUnit_||V[this.units_]};I.prototype.getWorldExtent=function(){return this.worldExtent_};I.prototype.getAxisOrientation=function(){return this.axisOrientation_};I.prototype.isGlobal=function(){return this.global_};I.prototype.setGlobal=function(t){this.global_=t,this.canWrapX_=!!(t&&this.extent_)};I.prototype.getDefaultTileGrid=function(){return this.defaultTileGrid_};I.prototype.setDefaultTileGrid=function(t){this.defaultTileGrid_=t};I.prototype.setExtent=function(t){this.extent_=t,this.canWrapX_=!!(this.global_&&t)};I.prototype.setWorldExtent=function(t){this.worldExtent_=t};I.prototype.setGetPointResolution=function(t){this.getPointResolutionFunc_=t};I.prototype.getPointResolutionFunc=function(){return this.getPointResolutionFunc_};const it=I,dt=6378137,F=Math.PI*dt,Ve=[-F,-F,F,F],He=[-180,-85,180,85];function W(t){it.call(this,{code:t,units:ut.METERS,extent:Ve,global:!0,worldExtent:He,getPointResolution:function(e,n){return e/je(n[1]/dt)}})}m(W,it);const Yt=[new W("EPSG:3857"),new W("EPSG:102100"),new W("EPSG:102113"),new W("EPSG:900913"),new W("urn:ogc:def:crs:EPSG:6.18:3:3857"),new W("urn:ogc:def:crs:EPSG::3857"),new W("http://www.opengis.net/gml/srs/epsg.xml#3857")];function Be(t,e,n){const i=t.length,s=n>1?n:2;let o=e;o===void 0&&(s>2?o=t.slice():o=new Array(i));const r=F;for(let c=0;c<i;c+=s){o[c]=r*t[c]/180;let a=dt*Math.log(Math.tan(Math.PI*(t[c+1]+90)/360));a>r?a=r:a<-r&&(a=-r),o[c+1]=a}return o}function $e(t,e,n){const i=t.length,s=n>1?n:2;let o=e;o===void 0&&(s>2?o=t.slice():o=new Array(i));for(let r=0;r<i;r+=s)o[r]=180*t[r]/F,o[r+1]=360*Math.atan(Math.exp(t[r+1]/dt))/Math.PI-90;return o}const Ye=6378137,qt=[-180,-90,180,90],qe=Math.PI*Ye/180;function D(t,e){it.call(this,{code:t,units:ut.DEGREES,extent:qt,axisOrientation:e,global:!0,metersPerUnit:qe,worldExtent:qt})}m(D,it);const Zt=[new D("CRS:84"),new D("EPSG:4326","neu"),new D("urn:ogc:def:crs:EPSG::4326","neu"),new D("urn:ogc:def:crs:EPSG:6.6:4326","neu"),new D("urn:ogc:def:crs:OGC:1.3:CRS84"),new D("urn:ogc:def:crs:OGC:2:84"),new D("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new D("urn:x-ogc:def:crs:EPSG:4326","neu")];let fe={};function Ze(t){return fe[t]||null}function Qe(t,e){fe[t]=e}let x={};function ht(t,e,n){const i=t.getCode(),s=e.getCode();i in x||(x[i]={}),x[i][s]=n}function ze(t,e){let n;return t in x&&e in x[t]&&(n=x[t][e]),n}function Gt(t,e,n){let i;if(e!==void 0){for(let s=0,o=t.length;s<o;++s)e[s]=t[s];i=e}else i=t.slice();return i}function Je(t,e,n){if(e!==void 0&&t!==e){for(let i=0,s=t.length;i<s;++i)e[i]=t[i];t=e}return t}function ke(t){Qe(t.getCode(),t),ht(t,t,Gt)}function tn(t){t.forEach(ke)}function J(t){let e=null;return t instanceof it?e=t:typeof t=="string"&&(e=Ze(t)),e}function Qt(t,e,n,i){t=J(t);let s;const o=t.getPointResolutionFunc();if(o)s=o(e,n);else if(t.getUnits()==ut.DEGREES&&!i||i==ut.DEGREES)s=e;else{const c=bt(t,J("EPSG:4326"));let a=[n[0]-e/2,n[1],n[0]+e/2,n[1],n[0],n[1]-e/2,n[0],n[1]+e/2];a=c(a,a,2);const l=$t(a.slice(0,2),a.slice(2,4)),v=$t(a.slice(4,6),a.slice(6,8));s=(l+v)/2;const f=i?V[i]:t.getMetersPerUnit();f!==void 0&&(s/=f)}return s}function zt(t){tn(t),t.forEach(function(e){t.forEach(function(n){e!==n&&ht(e,n,Gt)})})}function en(t,e,n,i){t.forEach(function(s){e.forEach(function(o){ht(s,o,n),ht(o,s,i)})})}function Jt(t,e){if(t===e)return!0;const n=t.getUnits()===e.getUnits();return(t.getCode()===e.getCode()||bt(t,e)===Gt)&&n}function bt(t,e){const n=t.getCode(),i=e.getCode();let s=ze(n,i);return s||(s=Je),s}function le(t,e){const n=J(t),i=J(e);return bt(n,i)}function rt(t,e,n){return le(e,n)(t,void 0,t.length)}function nn(){zt(Yt),zt(Zt),en(Zt,Yt,Be,$e)}nn();const S=function(t,e,n,i){M.call(this),this.extent=t,this.pixelRatio_=n,this.resolution=e,this.state=i};m(S,M);S.prototype.changed=function(){this.dispatchEvent(et.CHANGE)};S.prototype.getExtent=function(){return this.extent};S.prototype.getImage=function(){};S.prototype.getPixelRatio=function(){return this.pixelRatio_};S.prototype.getResolution=function(){return this.resolution};S.prototype.getState=function(){return this.state};S.prototype.load=function(){};const H=function(t,e,n,i,s){this.loader_=s!==void 0?s:null;const o=s!==void 0?E.IDLE:E.LOADED;S.call(this,t,e,n,o),this.canvas_=i,this.error_=null};m(H,S);H.prototype.getError=function(){return this.error_};H.prototype.handleLoad_=function(t){t?(this.error_=t,this.state=E.ERROR):this.state=E.LOADED,this.changed()};H.prototype.load=function(){this.state==E.IDLE&&(this.state=E.LOADING,this.changed(),this.loader_(this.handleLoad_.bind(this)))};H.prototype.getImage=function(){return this.canvas_};const sn=.5;function on(t,e,n){const i=t.length;if(t[0]<=e)return 0;if(e<=t[i-1])return i-1;{let s;if(n>0){for(s=1;s<i;++s)if(t[s]<e)return s-1}else if(n<0){for(s=1;s<i;++s)if(t[s]<=e)return s}else for(s=1;s<i;++s){if(t[s]==e)return s;if(t[s]<e)return t[s-1]-e<e-t[s]?s-1:s}return i-1}}function rn(t,e,n,i){const s=rt(n,e,t);let o=Qt(e,i,n);const r=e.getMetersPerUnit();r!==void 0&&(o*=r);const c=t.getMetersPerUnit();c!==void 0&&(o/=c);const a=t.getExtent();if(!a||ee(a,s)){const l=Qt(t,o,s)/o;isFinite(l)&&l>0&&(o/=l)}return o}function Mt(t,e,n,i){const s=n-t,o=i-e,r=Math.sqrt(s*s+o*o);return[Math.round(n+s/r),Math.round(i+o/r)]}function cn(t,e,n,i,s,o,r,c,a,l,v){const f=Bt(Math.round(n*t),Math.round(n*e));if(a.length===0)return f.canvas;f.scale(n,n);const y=ft();a.forEach(function(_,B,pt){we(y,_.extent)});const P=C(y),O=at(y),d=Bt(Math.round(n*P/i),Math.round(n*O/i)),u=n/i;a.forEach(function(_,B,pt){const R=_.extent[0]-y[0],A=-(_.extent[3]-y[3]),j=C(_.extent),X=at(_.extent);d.drawImage(_.image,l,l,_.image.width-2*l,_.image.height-2*l,R*u,A*u,j*u,X*u)});const h=ne(r);return c.getTriangles().forEach(function(_,B,pt){const R=_.source,A=_.target;let j=R[0][0],X=R[0][1],$=R[1][0],Y=R[1][1],q=R[2][0],gt=R[2][1];const Z=(A[0][0]-h[0])/o,Q=-(A[0][1]-h[1])/o,Et=(A[1][0]-h[0])/o,_t=-(A[1][1]-h[1])/o,yt=(A[2][0]-h[0])/o,mt=-(A[2][1]-h[1])/o,It=j,Ot=X;j=0,X=0,$-=It,Y-=Ot,q-=It,gt-=Ot;const ge=[[$,Y,0,0,Et-Z],[q,gt,0,0,yt-Z],[0,0,$,Y,_t-Q],[0,0,q,gt,mt-Q]],z=Xe(ge);if(!z)return;f.save(),f.beginPath();const Rt=(Z+Et+yt)/3,vt=(Q+_t+mt)/3,jt=Mt(Rt,vt,Z,Q),Xt=Mt(Rt,vt,Et,_t),Ft=Mt(Rt,vt,yt,mt);f.moveTo(Xt[0],Xt[1]),f.lineTo(jt[0],jt[1]),f.lineTo(Ft[0],Ft[1]),f.clip(),f.transform(z[0],z[2],z[1],z[3],Z,Q),f.translate(y[0]-It,y[3]-Ot),f.scale(i/n,-i/n),f.drawImage(d.canvas,0,0),f.restore()}),v&&(f.save(),f.strokeStyle="black",f.lineWidth=1,c.getTriangles().forEach(function(_,B,pt){const R=_.target,A=(R[0][0]-h[0])/o,j=-(R[0][1]-h[1])/o,X=(R[1][0]-h[0])/o,$=-(R[1][1]-h[1])/o,Y=(R[2][0]-h[0])/o,q=-(R[2][1]-h[1])/o;f.beginPath(),f.moveTo(X,$),f.lineTo(A,j),f.lineTo(Y,q),f.closePath(),f.stroke()}),f.restore()),f.canvas}const an=10,kt=.25,st=function(t,e,n,i,s){this.sourceProj_=t,this.targetProj_=e;let o={};const r=le(this.targetProj_,this.sourceProj_);this.transformInv_=function(d){const u=d[0]+"/"+d[1];return o[u]||(o[u]=r(d)),o[u]},this.maxSourceExtent_=i,this.errorThresholdSquared_=s*s,this.triangles_=[],this.wrapsXInSource_=!1,this.canWrapXInSource_=this.sourceProj_.canWrapX()&&!!i&&!!this.sourceProj_.getExtent()&&C(i)==C(this.sourceProj_.getExtent()),this.sourceWorldWidth_=this.sourceProj_.getExtent()?C(this.sourceProj_.getExtent()):null,this.targetWorldWidth_=this.targetProj_.getExtent()?C(this.targetProj_.getExtent()):null;const c=ne(n),a=De(n),l=Le(n),v=Me(n),f=this.transformInv_(c),y=this.transformInv_(a),P=this.transformInv_(l),O=this.transformInv_(v);if(this.addQuad_(c,a,l,v,f,y,P,O,an),this.wrapsXInSource_){let d=1/0;this.triangles_.forEach(function(u,h,_){d=Math.min(d,u.source[0][0],u.source[1][0],u.source[2][0])}),this.triangles_.forEach((function(u){if(Math.max(u.source[0][0],u.source[1][0],u.source[2][0])-d>this.sourceWorldWidth_/2){const h=[[u.source[0][0],u.source[0][1]],[u.source[1][0],u.source[1][1]],[u.source[2][0],u.source[2][1]]];h[0][0]-d>this.sourceWorldWidth_/2&&(h[0][0]-=this.sourceWorldWidth_),h[1][0]-d>this.sourceWorldWidth_/2&&(h[1][0]-=this.sourceWorldWidth_),h[2][0]-d>this.sourceWorldWidth_/2&&(h[2][0]-=this.sourceWorldWidth_);const _=Math.min(h[0][0],h[1][0],h[2][0]);Math.max(h[0][0],h[1][0],h[2][0])-_<this.sourceWorldWidth_/2&&(u.source=h)}}).bind(this))}o={}};st.prototype.addTriangle_=function(t,e,n,i,s,o){this.triangles_.push({source:[i,s,o],target:[t,e,n]})};st.prototype.addQuad_=function(t,e,n,i,s,o,r,c,a){const l=Kt([s,o,r,c]),v=this.sourceWorldWidth_?C(l)/this.sourceWorldWidth_:null,f=this.sourceWorldWidth_,y=this.sourceProj_.canWrapX()&&v>.5&&v<1;let P=!1;if(a>0){if(this.targetProj_.isGlobal()&&this.targetWorldWidth_){const O=Kt([t,e,n,i]),d=C(O)/this.targetWorldWidth_;P|=d>kt}!y&&this.sourceProj_.isGlobal()&&v&&(P|=v>kt)}if(!(!P&&this.maxSourceExtent_&&!ie(l,this.maxSourceExtent_))){if(!P&&(!isFinite(s[0])||!isFinite(s[1])||!isFinite(o[0])||!isFinite(o[1])||!isFinite(r[0])||!isFinite(r[1])||!isFinite(c[0])||!isFinite(c[1])))if(a>0)P=!0;else return;if(a>0){if(!P){const O=[(t[0]+n[0])/2,(t[1]+n[1])/2],d=this.transformInv_(O);let u;y?u=(wt(s[0],f)+wt(r[0],f))/2-wt(d[0],f):u=(s[0]+r[0])/2-d[0];const h=(s[1]+r[1])/2-d[1];P=u*u+h*h>this.errorThresholdSquared_}if(P){if(Math.abs(t[0]-n[0])<=Math.abs(t[1]-n[1])){const O=[(e[0]+n[0])/2,(e[1]+n[1])/2],d=this.transformInv_(O),u=[(i[0]+t[0])/2,(i[1]+t[1])/2],h=this.transformInv_(u);this.addQuad_(t,e,O,u,s,o,d,h,a-1),this.addQuad_(u,O,n,i,h,d,r,c,a-1)}else{const O=[(t[0]+e[0])/2,(t[1]+e[1])/2],d=this.transformInv_(O),u=[(n[0]+i[0])/2,(n[1]+i[1])/2],h=this.transformInv_(u);this.addQuad_(t,O,u,i,s,d,h,c,a-1),this.addQuad_(O,e,n,u,d,o,r,h,a-1)}return}}if(y){if(!this.canWrapXInSource_)return;this.wrapsXInSource_=!0}this.addTriangle_(t,n,i,s,r,c),this.addTriangle_(t,e,n,s,o,r)}};st.prototype.calculateSourceExtent=function(){const t=ft();return this.triangles_.forEach(function(e,n,i){const s=e.source;ot(t,s[0]),ot(t,s[1]),ot(t,s[2])}),t};st.prototype.getTriangles=function(){return this.triangles_};const un=st,b=function(t,e,n,i,s,o){this.targetProj_=e,this.maxSourceExtent_=t.getExtent();const r=e.getExtent(),c=r?Ce(n,r):n,a=Ae(c),l=rn(t,e,a,i),v=sn;this.triangulation_=new un(t,e,c,this.maxSourceExtent_,l*v),this.targetResolution_=i,this.targetExtent_=n;const f=this.triangulation_.calculateSourceExtent();this.sourceImage_=o(f,l,s),this.sourcePixelRatio_=this.sourceImage_?this.sourceImage_.getPixelRatio():1,this.canvas_=null,this.sourceListenerKey_=null;let y=E.LOADED;this.sourceImage_&&(y=E.IDLE),S.call(this,n,i,this.sourcePixelRatio_,y)};m(b,S);b.prototype.disposeInternal=function(){this.state==E.LOADING&&this.unlistenSource_(),S.prototype.disposeInternal.call(this)};b.prototype.getImage=function(){return this.canvas_};b.prototype.getProjection=function(){return this.targetProj_};b.prototype.reproject_=function(){const t=this.sourceImage_.getState();if(t==E.LOADED){const e=C(this.targetExtent_)/this.targetResolution_,n=at(this.targetExtent_)/this.targetResolution_;this.canvas_=cn(e,n,this.sourcePixelRatio_,this.sourceImage_.getResolution(),this.maxSourceExtent_,this.targetResolution_,this.targetExtent_,this.triangulation_,[{extent:this.sourceImage_.getExtent(),image:this.sourceImage_.getImage()}],0)}this.state=t,this.changed()};b.prototype.load=function(){if(this.state==E.IDLE){this.state=E.LOADING,this.changed();const t=this.sourceImage_.getState();t==E.LOADED||t==E.ERROR?this.reproject_():(this.sourceListenerKey_=N(this.sourceImage_,et.CHANGE,function(e){const n=this.sourceImage_.getState();(n==E.LOADED||n==E.ERROR)&&(this.unlistenSource_(),this.reproject_())},this),this.sourceImage_.load())}};b.prototype.unlistenSource_=function(){K(this.sourceListenerKey_),this.sourceListenerKey_=null};const hn=b,w=function(t){T.call(this),this.projection_=J(t.projection),this.attributions_=this.adaptAttributions_(t.attributions),this.state_=t.state!==void 0?t.state:he.READY,this.wrapX_=t.wrapX!==void 0?t.wrapX:!1};m(w,T);w.prototype.adaptAttributions_=function(t){return t?Array.isArray(t)?function(e){return t}:typeof t=="function"?t:function(e){return[t]}:null};w.prototype.forEachFeatureAtCoordinate=lt;w.prototype.getAttributions=function(){return this.attributions_};w.prototype.getProjection=function(){return this.projection_};w.prototype.getResolutions=function(){};w.prototype.getState=function(){return this.state_};w.prototype.getWrapX=function(){return this.wrapX_};w.prototype.refresh=function(){this.changed()};w.prototype.setAttributions=function(t){this.attributions_=this.adaptAttributions_(t),this.changed()};w.prototype.setState=function(t){this.state_=t,this.changed()};const de=w,Lt={IMAGELOADSTART:"imageloadstart",IMAGELOADEND:"imageloadend",IMAGELOADERROR:"imageloaderror"},ct=function(t,e){tt.call(this,t),this.image=e};m(ct,tt);const U=function(t){de.call(this,{attributions:t.attributions,extent:t.extent,projection:t.projection,state:t.state}),this.resolutions_=t.resolutions!==void 0?t.resolutions:null,this.reprojectedImage_=null,this.reprojectedRevision_=0};m(U,de);U.prototype.getResolutions=function(){return this.resolutions_};U.prototype.findNearestResolution=function(t){if(this.resolutions_){const e=on(this.resolutions_,t,0);t=this.resolutions_[e]}return t};U.prototype.getImage=function(t,e,n,i){const s=this.getProjection();if(!s||!i||Jt(s,i))return s&&(i=s),this.getImageInternal(t,e,n,i);if(this.reprojectedImage_){if(this.reprojectedRevision_==this.getRevision()&&Jt(this.reprojectedImage_.getProjection(),i)&&this.reprojectedImage_.getResolution()==e&&Te(this.reprojectedImage_.getExtent(),t))return this.reprojectedImage_;this.reprojectedImage_.dispose(),this.reprojectedImage_=null}return this.reprojectedImage_=new hn(s,i,t,e,n,(function(o,r,c){return this.getImageInternal(o,r,c,s)}).bind(this)),this.reprojectedRevision_=this.getRevision(),this.reprojectedImage_};U.prototype.getImageInternal=function(t,e,n,i){};U.prototype.handleImageChange=function(t){const e=t.target;switch(e.getState()){case E.LOADING:this.dispatchEvent(new ct(Lt.IMAGELOADSTART,e));break;case E.LOADED:this.dispatchEvent(new ct(Lt.IMAGELOADEND,e));break;case E.ERROR:this.dispatchEvent(new ct(Lt.IMAGELOADERROR,e));break}};const pe=U,Ut=function(t){pe.call(this,{attributions:t.attributions,projection:t.projection,resolutions:t.resolutions,state:t.state}),this.canvasFunction_=t.canvasFunction,this.canvas_=null,this.renderedRevision_=0,this.ratio_=t.ratio!==void 0?t.ratio:1.5};m(Ut,pe);Ut.prototype.getImageInternal=function(t,e,n,i){e=this.findNearestResolution(e);let s=this.canvas_;if(s&&this.renderedRevision_==this.getRevision()&&s.getResolution()==e&&s.getPixelRatio()==n&&Re(s.getExtent(),t))return s;t=t.slice(),We(t,this.ratio_);const o=C(t)/e,r=at(t)/e,c=[o*n,r*n],a=this.canvasFunction_(t,e,n,c,i);return a&&(s=new H(t,e,n,a)),this.canvas_=s,this.renderedRevision_=this.getRevision(),s};const fn={windOptions:{}};class ln extends Nt{constructor(e,n={}){const i=St({},fn,n);super(n),this.options=i,this.wind=null,this.type="IMAGE",this.start=this.start.bind(this),this.stop=this.stop.bind(this),this.pickWindOptions();const s={logo:n.logo,state:n.state,attributions:n.attributions,resolutions:n.resolutions,canvasFunction:this.canvasFunction.bind(this),ratio:n.hasOwnProperty("ratio")?n.ratio:1};this.setSource(new Ut(s)),e&&this.setData(e,n.fieldOptions)}appendTo(e){if(e)this.setMap(e);else throw new Error("not map object")}start(){this.wind&&this.wind.start()}stop(){this.wind&&this.wind.stop()}canvasFunction(e,n,i,s,o){return this.pixelRatio=i,this.canvas?(this.canvas.width=s[0],this.canvas.height=s[1]):this.canvas=Ee(s[0],s[1],i,null),this.canvas&&this.render(this.canvas),this.canvas}getContext(){if(this.canvas!==null)return this.canvas.getContext("2d")}render(e){const n=this.getMap();if(!this.getData()||!n)return this;const i=this.getWindOptions();if(e&&!this.wind){const s=this.getData(),o=this.getContext();o&&(this.wind=new _e(o,i,s),this.wind.project=this.project.bind(this),this.wind.unproject=this.unproject.bind(this),this.wind.intersectsCoordinate=this.intersectsCoordinate.bind(this),this.wind.postrender=()=>{this.changed()})}return this.wind&&(this.wind.prerender(),this.wind.render()),this}project(e){const i=this.getMap().getPixelFromCoordinate(rt(e,"EPSG:4326",this.viewProjection));return[i[0]*this.pixelRatio,i[1]*this.pixelRatio]}unproject(e){const i=this.getMap().getCoordinateFromPixel(e);return rt(i,this.viewProjection,"EPSG:4326")}intersectsCoordinate(e){const n=this.getMap();if(!n)return!1;const i=n.getView(),s=n.getSize();if(i&&s){const o=i.calculateExtent([s[0]*this.pixelRatio,s[1]*this.pixelRatio]);return ee(o,rt(e,"EPSG:4326",this.viewProjection))}return!1}pickWindOptions(){Object.keys(ye).forEach(e=>{e in this.options&&(this.options.windOptions===void 0&&(this.options.windOptions={}),this.options.windOptions[e]=this.options[e])})}getData(){return this.field}setData(e,n={}){var s;return e&&e.checkFields&&e.checkFields()?this.field=e:me(e)?this.field=Ie(e,n):console.error("Illegal data"),this.getMap()&&this.canvas&&this.field&&((s=this==null?void 0:this.wind)==null||s.updateData(this.field),this.render(this.canvas)),this}updateParams(e={}){return xt("will move to setWindOptions"),this.setWindOptions(e),this}getParams(){return xt("will move to getWindOptions"),this.getWindOptions()}setWindOptions(e){const n=this.options.windOptions||{};this.options=St(this.options,{windOptions:St(n,e||{})}),this.wind&&(this.wind.setOptions(this.options.windOptions),this.wind.prerender())}getWindOptions(){return this.options.windOptions||{}}getProjection(){let e;const n=this.getMap();return n?e=n.getView()&&n.getView().getProjection():e="EPSG:3857",e}setMap(e){return!e&&this.wind&&this.wind.stop(),this.set("originMap",e),this.viewProjection=this.getProjection(),super.setMap(e)}getMap(){return this.get("originMap")}getType(){return this.type}}const pn=ln;export{_n as Field,pn as WindLayer,ln as default};