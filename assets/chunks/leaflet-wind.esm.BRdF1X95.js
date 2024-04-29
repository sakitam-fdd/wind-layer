import{W as K,d as Q,i as tt,f as et,a as F,c as it}from"./wind-core.esm.CHEVv6qw.js";import{F as Rt}from"./wind-core.esm.CHEVv6qw.js";import{h as st,f as ot,i as y,b as nt,S as at,O as R,B as rt,L as C,c as v,r as ht,p as ct,M as u,P as lt,V as _,d as mt}from"./index.CGiPxbJQ.js";import{D as Bt,I as jt,e as Ot,R as Wt,a as It,T as kt,g as Dt,j as Et}from"./index.CGiPxbJQ.js";import{a as p}from"./leaflet-src.Blu32DaZ.js";import"./commonjsHelpers.Cpj98o6Y.js";class A extends p.Layer{constructor(t,e,i){super(t,e,i)}initialize(t,e,i){if(!t)throw Error("layer id must be specified");this._layerId=t,p.Util.setOptions(this,i),this.devicePixelRatio=this.options.devicePixelRatio||window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI}_createCanvas(t,e){const i=it(this._width,this._height,this.devicePixelRatio);return i.id=String(t),this._map.getPanes().overlayPane.appendChild(i),i}_reset(){const t=this._map.containerPointToLayerPoint([0,0]);p.DomUtil.setPosition(this.canvas,t),this._redraw()}_onResize(t){this.canvas.style.width=t.newSize.x+"px",this.canvas.style.height=t.newSize.y+"px",this._width=t.newSize.x,this._height=t.newSize.y,this._resizeCanvas(this.devicePixelRatio)}_zoomStart(){this._moveStart()}_moveStart(){this._updating||(this._updating=!0)}_animateZoom(t){const e=this._map.getZoomScale(t.zoom,this._map.getZoom()),i=this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(),t.zoom,t.center);p.DomUtil.setTransform(this.canvas,i,e)}_resizeCanvas(t){this.canvas.width=this._width*t,this.canvas.height=this._height*t}_redraw(){this._render()}_render(){}project(t){const e=this._map.latLngToContainerPoint(new p.LatLng(t[1],t[0]));return[e.x*this.devicePixelRatio,e.y*this.devicePixelRatio]}unproject(t){const e=this._map.containerPointToLatLng(new p.Point(t[0],t[1]));return[e.lng,e.lat]}intersectsCoordinate(t){return this._map.getBounds().contains(p.latLng(t[1],t[0]))}onAdd(t){this._map=t;const e=t.getSize();this._width=e.x,this._height=e.y,this.canvas=this._createCanvas(this._layerId,this.options.zIndex||1);const i=this._map.options.zoomAnimation&&p.Browser.any3d;return p.DomUtil.addClass(this.canvas,"leaflet-zoom-"+(i?"animated":"hide")),this._map.on(this.getEvents(),this),this._resetView(),this._render(),this}_resetView(t){}onMoveEnd(){this._reset()}onRemove(){return this._map.getPanes().overlayPane.removeChild(this.canvas),this._map.off(this.getEvents(),this),this.canvas=null,this}getEvents(){const t={resize:this._onResize,viewreset:this._render,moveend:this.onMoveEnd,zoomstart:this._render,zoomend:this._render};return this._map.options.zoomAnimation&&p.Browser.any3d&&(t.zoomanim=this._animateZoom),t}}class Pt extends A{initialize(t,e,i){super.initialize(t,e,i),this.field=void 0,this.pickWindOptions(),e&&this.setData(e,i.fieldOptions)}_redraw(){this._render()}_render(){const t=this.getWindOptions();if(!this.wind&&this._map){const e=this.canvas.getContext("2d"),i=this.getData();this.wind=new K(e,t,i),this.wind.project=this.project.bind(this),this.wind.unproject=this.unproject.bind(this),this.wind.intersectsCoordinate=this.intersectsCoordinate.bind(this),this.wind.postrender=()=>{}}this.wind.prerender(),this.wind.render()}onRemove(){return this.wind&&(this.wind.stop(),this.wind=null),super.onRemove()}pickWindOptions(){Object.keys(Q).forEach(t=>{t in this.options&&(this.options.windOptions===void 0&&(this.options.windOptions={}),this.options.windOptions[t]=this.options[t])})}getData(){return this.field}setData(t,e={}){var i;return t&&t.checkFields&&t.checkFields()?this.field=t:tt(t)?this.field=et(t,e):console.error("Illegal data"),this.field&&((i=this==null?void 0:this.wind)==null||i.updateData(this.field)),this}setWindOptions(t){const e=this.options.windOptions||{};if(this.options=F(this.options,{windOptions:F(e,t||{})}),this.wind){const i=this.options.windOptions;this.wind.setOptions(i),this.wind.prerender()}}getWindOptions(){return this.options.windOptions||{}}}const{clamp:pt}=y,dt=63710088e-1,ut=2*Math.PI*dt;function wt(n){return ut*Math.cos(n*Math.PI/180)}function X(n){return(180+n)/360}function V(n){return(180-180/Math.PI*Math.log(Math.tan(Math.PI/4+n*Math.PI/360)))/360}function j(n,t){return n/wt(t)}function b(n,t=0){return n*360-180+t*360}function B(n){const t=180-n*360;return 360/Math.PI*Math.atan(Math.exp(t*Math.PI/180))-90}const M=85.051129;function x(n,t=0){const e=pt(n.lat,-M,M);return{x:X(n.lng),y:V(e),z:j(t,e)}}function gt(n){let t=1/0,e=1/0,i=-1/0,o=-1/0;for(const a of n)t=Math.min(t,a.x),e=Math.min(e,a.y),i=Math.max(i,a.x),o=Math.max(o,a.y);const s=i-t,r=o-e,h=Math.max(s,r),c=Math.max(0,Math.floor(-Math.log(h)/Math.LN2)),l=Math.pow(2,c);return{z:c,x:Math.floor((t+i)/2*l),y:Math.floor((e+o)/2*l),extent:[t,e,i,o]}}const{degToRad:Z,radToDeg:ft}=y;st(!0);ot([]);class _t{constructor(t,e,i){this.worldMatrix=new u,this.mercatorMatrix=new u,this.labelPlaneMatrix=new u,this.glCoordMatrix=new u;const{width:o,height:s}=t,r=ft(Math.atan(3/4)),h=.1,c=1e21;this.viewState=t,this.scene=i,this.scene.matrixAutoUpdate=!1,this.scene.worldMatrixNeedsUpdate=!0,this.camera=e==="orthographic"?new R(-o/2,o/2,s/2,-s/2,h,c):new lt(r,o/s,h,c),this.camera.matrixAutoUpdate=!1,this.camera.position.z=600,this.setup()}setup(){const{width:t,height:e,fov:i}=this.viewState,o=Z(this.viewState.maxPitch);this.camera.aspect=t/e,this.halfFov=i/2,this.cameraToCenterDistance=.5/Math.tan(this.halfFov)*e,this.acuteAngle=Math.PI/2-o,this.update()}update(){const{width:t,height:e,elevation:i,_horizonShift:o,worldSize:s}=this.viewState,r=this.viewState.getCenter(),h=this.viewState.getPitch(),c=Z(h),l=this.viewState.getBearing(),a=this.viewState.getFovRad(),m=this.viewState.getCameraPosition(),d=a/2,w=Math.cos(Math.PI/2-c),g=Math.PI/2+c;this.cameraToCenterDistance=.5/Math.tan(d)*e;const f=this.viewState.project(r),U=new u().fromRotationZ(Math.PI),N=new u().fromScale(new _(-s,s,s)),Y=new u().fromTranslation(new _(-f.x,f.y,0)),O=e/50,W=Math.max(O*w,O),I=a*(.5+this.viewState.centerOffset().y/e),k=j(1,r.lat)*s||1,G=i?i.getMinElevationBelowMSL()*k:0,P=(m[2]*s-G)/Math.cos(c),q=Math.sin(I)*P/Math.sin(y.clamp(Math.PI-g-I,.01,Math.PI-.01)),H=w*q+P,$=P*(1/o),D=Math.min(H*1.01,$);this.mercatorMatrix=new u().scale(new _(s,s,s/k));const J=new u().fromTranslation(new _(0,0,this.cameraToCenterDistance));this.labelPlaneMatrix=new u;const z=new u;z.scale(new _(1,-1,1)),z.translate(new _(-1,-1,0)),z.scale(new _(2/t,2/e,1)),this.glCoordMatrix=z,this.camera.aspect=t/e,this.cameraTranslateZ=this.cameraToCenterDistance,this.camera instanceof R?this.camera.projectionMatrix.orthographic(-t/2,t/2,e/2,-e/2,W,D):this.camera.projectionMatrix.perspective(a,t/e,W,D);const E=new u().premultiply(J).premultiply(new u().fromRotationX(c)).premultiply(new u().fromRotationZ(-Z(l)));i&&(E.elements[14]=m[2]*s),this.camera.worldMatrix.copy(E),this.camera.updateMatrixWorld(),this.scene&&(this.scene.localMatrix=new mt().premultiply(U).premultiply(N).premultiply(Y))}}function T(n){const t=1<<n.z;return{left:n.wrapedX/t,top:n.wrapedY/t,right:(n.wrapedX+1)/t,bottom:(n.wrapedY+1)/t}}function S(n){const{z:t,x:e,y:i}=n,o=n.wrap,s=1<<t,r=b(e/s,o),h=b((e+1)/s,o),c=B(i/s),l=B((i+1)/s);return[r,l,h,c]}function xt(n){const t=n==null?void 0:n.getBounds(),e=t.getSouthWest(),i=t.getNorthEast(),[o,s,r,h]=[e.lng,e.lat,i.lng,i.lat],c=Math.max(s,M),l=Math.min(h,-M),a=x({lng:o,lat:l}),m=x({lng:r,lat:c});return[a.x,a.y,m.x,m.y]}function L(n){const t=n.zoom;return n.minzoom!==void 0&&t<n.minzoom?n.minzoom:n.maxzoom!==void 0&&n.maxzoom<t?n.maxzoom:t}class yt{constructor(){this.tileSize=512,this.maxPitch=60,this._horizonShift=.1}get width(){return this._width}get height(){return this._height}get fov(){return this.getFovRad()/Math.PI*180}get worldSize(){const t=Math.pow(2,this.zoom-1);return this.tileSize*t}getCenter(){return this._center}getPitch(){return 0}getBearing(){return 0}getFovRad(){return .6435011087932844}getCameraPosition(){return[0,0,0]}centerOffset(){return{x:0,y:0}}project(t){const e=y.clamp(t.lat,-M,M),i=X(t.lng),o=V(e);return{x:i*this.worldSize,y:o*this.worldSize,z:0}}get pixelsPerMeter(){return j(1,this._center.lat)*this.worldSize}unproject(t){const e=b(t[0]),i=B(t[1]);return[e,i]}update(t){this._center=t.center,this._width=t.width,this._height=t.height,this.zoom=t.zoom}}function Mt(n,t,e){const i=t[1],o=t[0],s=i-o;return{x:n===i&&e?n:((n-o)%s+s)%s+o,wrap:Math.floor(n/i)}}class Ct extends A{initialize(t,e,i){super.initialize(t,e,i),this.viewState=new yt,this._currentTiles=[],this._unLimitTiles=[],this.source=e}_resizeCanvas(t){super._resizeCanvas(t),this.renderer&&this.renderer.setSize(this._width,this._height),this.layer&&this.layer.resize(this._width,this._height),this._render()}get camera(){return this.sync.camera}getTileSize(){var e;const t=y.isNumber(this.source.tileSize)?this.source.tileSize:((e=this.source.tileSize)==null?void 0:e[0])||512;return new p.Point(t,t)}_redraw(){if(this._map&&this.source){const t=L({zoom:this._map.getZoom(),minzoom:this.source.minZoom,maxzoom:this.source.maxZoom});t!==this._tileZoom&&(this._tileZoom=t),this._update()}return this}_render(){this._map&&this.viewState&&this.viewState.update({center:this._map.getCenter(),zoom:this._map.getZoom(),width:this._width,height:this._height}),this.gl||(this.gl=y.getContext(this.canvas,{preserveDrawingBuffer:!1,antialias:!0,stencil:!0},!0),this.renderer=new nt(this.gl,{autoClear:!1,extensions:["OES_texture_float","OES_texture_float_linear","WEBGL_color_buffer_float","EXT_color_buffer_float"]}),this.scene=new at,this.sync=new _t(this.viewState,"perspective",this.scene),this.planeCamera=new R(0,1,1,0,0,1),this.layer=new rt(this.source,{renderer:this.renderer,scene:this.scene},{renderType:this.options.renderType,renderFrom:this.options.renderFrom,styleSpec:this.options.styleSpec,displayRange:this.options.displayRange,widthSegments:this.options.widthSegments,heightSegments:this.options.heightSegments,wireframe:this.options.wireframe,picking:this.options.picking,mask:this.processMask(),getZoom:()=>this.viewState.zoom,triggerRepaint:()=>{requestAnimationFrame(()=>this._update())},getTileProjSize:t=>{const e=1/Math.pow(2,t);return[e,e]},getPixelsToUnits:()=>{const e=this.canvas.clientHeight/2-.5,i=this.canvas.clientWidth/2-1/2,o=x(this.viewState.unproject([i,e])),s=x(this.viewState.unproject([i+1,e+1]));return[Math.abs(s.x-o.x),Math.abs(o.y-s.y)]},getPixelsToProjUnit:()=>[this.viewState.pixelsPerMeter,this.viewState.pixelsPerMeter],getViewTiles:(t,e)=>{let{type:i}=t;if(i=i!==C.timeline?i:t.privateType,!this._map)return[];const o=[];if(i===C.image){const s=t.coordinates.map(h=>x({lng:h[0],lat:h[1]})),r=gt(s);if(!t.wrapX){const h=r.x,c=r.y,l=r.z,a=0;o.push(new v(l,a,l,h,c,{getTileBounds:()=>[t.coordinates[0][0],t.coordinates[2][1],t.coordinates[1][0],t.coordinates[0][1]],getTileProjBounds:()=>({left:r.extent[0]+a,top:r.extent[1],right:r.extent[2]+a,bottom:r.extent[3]})}))}}else if(i===C.tile){const s=this._currentTiles;for(let r=0;r<s.length;r++){const h=s[r],{x:c,y:l,z:a,wrap:m}=h;t.wrapX?o.push(new v(a,m,a,c,l,{getTileBounds:S,getTileProjBounds:T})):h.wrap===0&&o.push(new v(a,m,a,c,l,{getTileBounds:S,getTileProjBounds:T}))}}return o},getExtent:()=>xt(this._map),getGridTiles:t=>{const e=t.wrapX;if(!this._map)return[];const i=this._unLimitTiles,o=[];for(let s=0;s<i.length;s++){const r=i[s],{x:h,y:c,z:l,wrap:a}=r;e?o.push(new v(l,a,l,h,c,{getTileBounds:S,getTileProjBounds:T})):r.wrap===0&&o.push(new v(l,a,l,h,c,{getTileBounds:S,getTileProjBounds:T}))}return o}})),this.sync&&this.sync.update(),this.layer&&this.layer.update(),this.glPrerender(),this.glRender()}glPrerender(){var e;this.scene.worldMatrixNeedsUpdate=!0,this.scene.updateMatrixWorld(),this.camera.updateMatrixWorld();const t=this.calcWrappedWorlds();(e=this.layer)==null||e.prerender({worlds:t,camera:this.camera,planeCamera:this.planeCamera})}glRender(){var e;this.scene.worldMatrixNeedsUpdate=!0,this.scene.updateMatrixWorld(),this.camera.updateMatrixWorld();const t=this.calcWrappedWorlds();(e=this.layer)==null||e.render({worlds:t,camera:this.camera,planeCamera:this.planeCamera})}async picker(t){if(!this.options.picking)return console.warn("[Layer]: please enable picking options!"),null;if(!this.layer||!t||!this._map)return console.warn("[Layer]: layer not initialized!"),null;const e=this._map.project(t);return this.layer.picker([e.x,e.y])}calcWrappedWorlds(){return[0]}_resetView(t){const e=t&&(t.pinch||t.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),e,e)}_resetGrid(){const t=this._map,e=t.options.crs,i=this.getTileSize(),o=this._tileZoom,s=this._map.getPixelWorldBounds(this._tileZoom);s&&(this._globalTileRange=this._pxBoundsToTileRange(s)),this._wrapX=e.wrapLng&&[Math.floor(t.project([0,e.wrapLng[0]],o).x/i.x),Math.ceil(t.project([0,e.wrapLng[1]],o).x/i.y)],this._wrapY=e.wrapLat&&[Math.floor(t.project([e.wrapLat[0],0],o).y/i.x),Math.ceil(t.project([e.wrapLat[1],0],o).y/i.y)]}_setView(t,e,i,o){let s=Math.round(e);this.options.maxZoom!==void 0&&s>this.options.maxZoom||this.options.minZoom!==void 0&&s<this.options.minZoom?s=void 0:s=L({minzoom:this.source.minZoom,maxzoom:this.source.maxZoom,zoom:s});const r=this.options.updateWhenZooming&&s!==this._tileZoom;(!o||r)&&(this._tileZoom=s,this._resetGrid(),s!==void 0&&this._update(t))}_tileCoordsToBounds(t){const e=this._tileCoordsToNwSe(t);let i=new p.LatLngBounds(e[0],e[1]);return this.source.wrapX||(i=this._map.wrapLatLngBounds(i)),i}_tileCoordsToNwSe(t){const e=this._map,i=this.getTileSize(),o=t.scaleBy(i),s=o.add(i),r=e.unproject(o,t.z),h=e.unproject(s,t.z);return[r,h]}_isValidTile(t){const e=this._map.options.crs;if(!e.infinite){const i=this._globalTileRange;if(!e.wrapLng&&(t.x<i.min.x||t.x>i.max.x)||!e.wrapLat&&(t.y<i.min.y||t.y>i.max.y))return!1}return!0}_wrapCoords(t){const e=this._wrapX?Mt(t.x,this._wrapX):{x:t.x,wrap:0},i=new p.Point(e.x,this._wrapY&&!this.source.wrapX?p.Util.wrapNum(t.y,this._wrapY):t.y);return i.z=t.z,i.wrap=e.wrap,i}_update(t){const e=this._map;if(!e||!this.source)return;const i=L({zoom:e.getZoom(),minzoom:this.source.minZoom,maxzoom:this.source.maxZoom});if(t===void 0&&(t=e.getCenter()),this._tileZoom===void 0)return;const o=this._getTiledPixelBounds(t,this._tileZoom),s=this._pxBoundsToTileRange(o),r=s.getCenter(),h=[];if(!(isFinite(s.min.x)&&isFinite(s.min.y)&&isFinite(s.max.x)&&isFinite(s.max.y)))throw new Error("Attempted to load an infinite number of tiles");if(Math.abs(i-this._tileZoom)>1){this._setView(t,i);return}for(let a=s.min.y;a<=s.max.y;a++)for(let m=s.min.x;m<=s.max.x;m++){const d=new p.Point(m,a);d.z=this._tileZoom,this._isValidTile(d)&&h.push(this._wrapCoords(d))}h.sort((a,m)=>a.distanceTo(r)-m.distanceTo(r));const c=e.getZoom(),l=this._getTiledPixelBounds(t,c);if(l){const a=this._pxBoundsToTileRange(l),m=s.getCenter(),d=[];for(let w=a.min.y;w<=a.max.y;w++)for(let g=a.min.x;g<=a.max.x;g++){const f=new p.Point(g,w);f.z=c,this._isValidTile(f)&&d.push(this._wrapCoords(f))}d.sort((w,g)=>w.distanceTo(m)-g.distanceTo(m)),this._unLimitTiles=d}return this._currentTiles=h,this._render(),h}_getTiledPixelBounds(t,e){const i=this._map,o=i._animatingZoom?Math.max(i._animateToZoom,i.getZoom()):i.getZoom(),s=i.getZoomScale(o,e),r=i.project(t,e).floor(),h=i.getSize().divideBy(s*2);return new p.Bounds(r.subtract(h),r.add(h))}_pxBoundsToTileRange(t){const e=this.getTileSize();return new p.Bounds(t.min.unscaleBy(e).floor(),t.max.unscaleBy(e).ceil().subtract([1,1]))}handleZoom(){this._resetView(),this.layer&&this.layer.handleZoom()}onMoveEnd(){this._reset(),!(!this._map||this._map._animatingZoom)&&this.layer&&this.layer.moveEnd()}onMoveStart(){this.layer&&this.layer.moveStart()}_animateZoom(t){super._animateZoom(t),this._setView(t.center,t.zoom,!0,t.noUpdate),this.handleZoom()}getEvents(){const t={resize:this._onResize,viewreset:this._resetView,moveend:this.onMoveEnd,movestart:this.onMoveStart,zoom:this.handleZoom,zoomend:this._reset};return this._map.options.zoomAnimation&&p.Browser.any3d&&(t.zoomanim=this._animateZoom),t}updateOptions(t){this.options={...this.options,...t||{}},this.layer&&this.layer.updateOptions(t),this._redraw()}getMask(){return this.options.mask}processMask(){if(this.options.mask){const t=this.options.mask,e=t.data;ht(e,!0);const i=c=>{const l=[];for(let a=0;a<c.length;a++){const m=c[a],d=x(m);l.push([d.x,d.y])}return l},o=e.features,s=o.length;let r=0;const h=[];for(;r<s;r++){const c=o[r],l=c.geometry.coordinates,a=c.geometry.type;if(a==="Polygon")h.push({type:"Feature",properties:{},geometry:{type:"Polygon",coordinates:c.geometry.coordinates.map(m=>i(m))}});else if(a==="MultiPolygon"){const m=[];for(let d=0;d<l.length;d++){const w=l[d],g=[];for(let f=0;f<w.length;f++)g.push(i(l[d][f]));m.push(g)}h.push({type:"Feature",properties:{},geometry:{type:"MultiPolygon",coordinates:m}})}}return{data:ct(h),type:t.type}}}setMask(t){this.options.mask=Object.assign({},this.options.mask,t),this.layer&&this.layer.setMask(this.processMask())}onRemove(){var t,e;return this.layer&&(this.layer.destroy(),this.layer=null),this.source&&(Array.isArray(this.source.sourceCache)?(t=this.source.sourceCache)==null||t.forEach(i=>{i==null||i.clearTiles()}):(e=this.source.sourceCache)==null||e.clearTiles()),this._currentTiles=[],this._unLimitTiles=[],this.gl=null,this._tileZoom=void 0,super.onRemove()}}export{Bt as DecodeType,Rt as Field,jt as ImageSource,C as LayerSourceType,Ot as MaskType,Wt as RenderFrom,It as RenderType,v as TileID,kt as TileSource,Dt as TimelineSource,Ct as WebglLayer,Pt as WindLayer,Et as configDeps};