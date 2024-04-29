import{k as q,f as b,B as $,E as N}from"./Object.DdgBWT7D.js";import{T as W,c as y,I as B,R as H}from"./TileRange.BZS1LfrN.js";import{b as f,U as V,a4 as C,l as J,a5 as T,a6 as x,J as w,m as Q,g as O,a7 as tt,S as et,a as it,a8 as m,u as rt,c as F}from"./proj.BNE8J585.js";import{T as v}from"./TileState.DENk7BAX.js";import{S as nt}from"./Source.D9yXulch.js";import{D as j,a as ot}from"./common.CRN0zELA.js";import{a as at}from"./intersectsextent.DO7gmjzY.js";import{t as g,s as st}from"./size.DSor2vHC.js";import{M as lt,U as ut}from"./Projection.Bg0YEavu.js";import"./dom.i4NIYYs1.js";import"./has.DEIyT5tI.js";import"./Image.C3dCXgkY.js";import"./ImageState.BQAwWc_S.js";import"./easing.vFiYzKl6.js";var ct=function(){function n(e){this.highWaterMark=e!==void 0?e:2048,this.count_=0,this.entries_={},this.oldest_=null,this.newest_=null}return n.prototype.canExpireCache=function(){return this.highWaterMark>0&&this.getCount()>this.highWaterMark},n.prototype.expireCache=function(e){for(;this.canExpireCache();)this.pop()},n.prototype.clear=function(){this.count_=0,this.entries_={},this.oldest_=null,this.newest_=null},n.prototype.containsKey=function(e){return this.entries_.hasOwnProperty(e)},n.prototype.forEach=function(e){for(var t=this.oldest_;t;)e(t.value_,t.key_,this),t=t.newer},n.prototype.get=function(e,t){var i=this.entries_[e];return f(i!==void 0,15),i===this.newest_||(i===this.oldest_?(this.oldest_=this.oldest_.newer,this.oldest_.older=null):(i.newer.older=i.older,i.older.newer=i.newer),i.newer=null,i.older=this.newest_,this.newest_.newer=i,this.newest_=i),i.value_},n.prototype.remove=function(e){var t=this.entries_[e];return f(t!==void 0,15),t===this.newest_?(this.newest_=t.older,this.newest_&&(this.newest_.newer=null)):t===this.oldest_?(this.oldest_=t.newer,this.oldest_&&(this.oldest_.older=null)):(t.newer.older=t.older,t.older.newer=t.newer),delete this.entries_[e],--this.count_,t.value_},n.prototype.getCount=function(){return this.count_},n.prototype.getKeys=function(){var e=new Array(this.count_),t=0,i;for(i=this.newest_;i;i=i.older)e[t++]=i.key_;return e},n.prototype.getValues=function(){var e=new Array(this.count_),t=0,i;for(i=this.newest_;i;i=i.older)e[t++]=i.value_;return e},n.prototype.peekLast=function(){return this.oldest_.value_},n.prototype.peekLastKey=function(){return this.oldest_.key_},n.prototype.peekFirstKey=function(){return this.newest_.key_},n.prototype.peek=function(e){if(this.containsKey(e))return this.entries_[e].value_},n.prototype.pop=function(){var e=this.oldest_;return delete this.entries_[e.key_],e.newer&&(e.newer.older=null),this.oldest_=e.newer,this.oldest_||(this.newest_=null),--this.count_,e.value_},n.prototype.replace=function(e,t){this.get(e),this.entries_[e].value_=t},n.prototype.set=function(e,t){f(!(e in this.entries_),16);var i={key_:e,newer:null,older:this.newest_,value_:t};this.newest_?this.newest_.newer=i:this.oldest_=i,this.newest_=i,this.entries_[e]=i,++this.count_},n.prototype.setSize=function(e){this.highWaterMark=e},n}();const ht=ct;function R(n,e,t,i){return i!==void 0?(i[0]=n,i[1]=e,i[2]=t,i):[n,e,t]}function S(n,e,t){return n+"/"+e+"/"+t}function z(n){return S(n[0],n[1],n[2])}function ft(n){return n.split("/").map(Number)}function pt(n){return(n[1]<<n[0])+n[2]}function dt(n,e){var t=n[0],i=n[1],r=n[2];if(e.getMinZoom()>t||t>e.getMaxZoom())return!1;var o=e.getFullTileRange(t);return o?o.containsXY(i,r):!0}var gt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),vt=function(n){gt(e,n);function e(){return n!==null&&n.apply(this,arguments)||this}return e.prototype.expireCache=function(t){for(;this.canExpireCache();){var i=this.peekLast();if(i.getKey()in t)break;this.pop().release()}},e.prototype.pruneExceptNewestZ=function(){if(this.getCount()!==0){var t=this.peekFirstKey(),i=ft(t),r=i[0];this.forEach((function(o){o.tileCoord[0]!==r&&(this.remove(z(o.tileCoord)),o.release())}).bind(this))}},e}(ht);const Z=vt,E={TILELOADSTART:"tileloadstart",TILELOADEND:"tileloadend",TILELOADERROR:"tileloaderror"};var _t=[0,0,0],d=5,yt=function(){function n(e){this.minZoom=e.minZoom!==void 0?e.minZoom:0,this.resolutions_=e.resolutions,f(q(this.resolutions_,function(a,s){return s-a},!0),17);var t;if(!e.origins){for(var i=0,r=this.resolutions_.length-1;i<r;++i)if(!t)t=this.resolutions_[i]/this.resolutions_[i+1];else if(this.resolutions_[i]/this.resolutions_[i+1]!==t){t=void 0;break}}this.zoomFactor_=t,this.maxZoom=this.resolutions_.length-1,this.origin_=e.origin!==void 0?e.origin:null,this.origins_=null,e.origins!==void 0&&(this.origins_=e.origins,f(this.origins_.length==this.resolutions_.length,20));var o=e.extent;o!==void 0&&!this.origin_&&!this.origins_&&(this.origin_=V(o)),f(!this.origin_&&this.origins_||this.origin_&&!this.origins_,18),this.tileSizes_=null,e.tileSizes!==void 0&&(this.tileSizes_=e.tileSizes,f(this.tileSizes_.length==this.resolutions_.length,19)),this.tileSize_=e.tileSize!==void 0?e.tileSize:this.tileSizes_?null:j,f(!this.tileSize_&&this.tileSizes_||this.tileSize_&&!this.tileSizes_,22),this.extent_=o!==void 0?o:null,this.fullTileRanges_=null,this.tmpSize_=[0,0],this.tmpExtent_=[0,0,0,0],e.sizes!==void 0?this.fullTileRanges_=e.sizes.map(function(a,s){var l=new W(Math.min(0,a[0]),Math.max(a[0]-1,-1),Math.min(0,a[1]),Math.max(a[1]-1,-1));if(o){var u=this.getTileRangeForExtentAndZ(o,s);l.minX=Math.max(u.minX,l.minX),l.maxX=Math.min(u.maxX,l.maxX),l.minY=Math.max(u.minY,l.minY),l.maxY=Math.min(u.maxY,l.maxY)}return l},this):o&&this.calculateTileRanges_(o)}return n.prototype.forEachTileCoord=function(e,t,i){for(var r=this.getTileRangeForExtentAndZ(e,t),o=r.minX,a=r.maxX;o<=a;++o)for(var s=r.minY,l=r.maxY;s<=l;++s)i([t,o,s])},n.prototype.forEachTileCoordParentTileRange=function(e,t,i,r){var o,a,s,l=null,u=e[0]-1;for(this.zoomFactor_===2?(a=e[1],s=e[2]):l=this.getTileCoordExtent(e,r);u>=this.minZoom;){if(this.zoomFactor_===2?(a=Math.floor(a/2),s=Math.floor(s/2),o=y(a,a,s,s,i)):o=this.getTileRangeForExtentAndZ(l,u,i),t(u,o))return!0;--u}return!1},n.prototype.getExtent=function(){return this.extent_},n.prototype.getMaxZoom=function(){return this.maxZoom},n.prototype.getMinZoom=function(){return this.minZoom},n.prototype.getOrigin=function(e){return this.origin_?this.origin_:this.origins_[e]},n.prototype.getResolution=function(e){return this.resolutions_[e]},n.prototype.getResolutions=function(){return this.resolutions_},n.prototype.getTileCoordChildTileRange=function(e,t,i){if(e[0]<this.maxZoom){if(this.zoomFactor_===2){var r=e[1]*2,o=e[2]*2;return y(r,r+1,o,o+1,t)}var a=this.getTileCoordExtent(e,i||this.tmpExtent_);return this.getTileRangeForExtentAndZ(a,e[0]+1,t)}return null},n.prototype.getTileRangeForTileCoordAndZ=function(e,t,i){if(t>this.maxZoom||t<this.minZoom)return null;var r=e[0],o=e[1],a=e[2];if(t===r)return y(o,a,o,a,i);if(this.zoomFactor_){var s=Math.pow(this.zoomFactor_,t-r),l=Math.floor(o*s),u=Math.floor(a*s);if(t<r)return y(l,l,u,u,i);var c=Math.floor(s*(o+1))-1,h=Math.floor(s*(a+1))-1;return y(l,c,u,h,i)}var p=this.getTileCoordExtent(e,this.tmpExtent_);return this.getTileRangeForExtentAndZ(p,t,i)},n.prototype.getTileRangeExtent=function(e,t,i){var r=this.getOrigin(e),o=this.getResolution(e),a=g(this.getTileSize(e),this.tmpSize_),s=r[0]+t.minX*a[0]*o,l=r[0]+(t.maxX+1)*a[0]*o,u=r[1]+t.minY*a[1]*o,c=r[1]+(t.maxY+1)*a[1]*o;return C(s,u,l,c,i)},n.prototype.getTileRangeForExtentAndZ=function(e,t,i){var r=_t;this.getTileCoordForXYAndZ_(e[0],e[3],t,!1,r);var o=r[1],a=r[2];return this.getTileCoordForXYAndZ_(e[2],e[1],t,!0,r),y(o,r[1],a,r[2],i)},n.prototype.getTileCoordCenter=function(e){var t=this.getOrigin(e[0]),i=this.getResolution(e[0]),r=g(this.getTileSize(e[0]),this.tmpSize_);return[t[0]+(e[1]+.5)*r[0]*i,t[1]-(e[2]+.5)*r[1]*i]},n.prototype.getTileCoordExtent=function(e,t){var i=this.getOrigin(e[0]),r=this.getResolution(e[0]),o=g(this.getTileSize(e[0]),this.tmpSize_),a=i[0]+e[1]*o[0]*r,s=i[1]-(e[2]+1)*o[1]*r,l=a+o[0]*r,u=s+o[1]*r;return C(a,s,l,u,t)},n.prototype.getTileCoordForCoordAndResolution=function(e,t,i){return this.getTileCoordForXYAndResolution_(e[0],e[1],t,!1,i)},n.prototype.getTileCoordForXYAndResolution_=function(e,t,i,r,o){var a=this.getZForResolution(i),s=i/this.getResolution(a),l=this.getOrigin(a),u=g(this.getTileSize(a),this.tmpSize_),c=s*(e-l[0])/i/u[0],h=s*(l[1]-t)/i/u[1];return r?(c=T(c,d)-1,h=T(h,d)-1):(c=x(c,d),h=x(h,d)),R(a,c,h,o)},n.prototype.getTileCoordForXYAndZ_=function(e,t,i,r,o){var a=this.getOrigin(i),s=this.getResolution(i),l=g(this.getTileSize(i),this.tmpSize_),u=(e-a[0])/s/l[0],c=(a[1]-t)/s/l[1];return r?(u=T(u,d)-1,c=T(c,d)-1):(u=x(u,d),c=x(c,d)),R(i,u,c,o)},n.prototype.getTileCoordForCoordAndZ=function(e,t,i){return this.getTileCoordForXYAndZ_(e[0],e[1],t,!1,i)},n.prototype.getTileCoordResolution=function(e){return this.resolutions_[e[0]]},n.prototype.getTileSize=function(e){return this.tileSize_?this.tileSize_:this.tileSizes_[e]},n.prototype.getFullTileRange=function(e){return this.fullTileRanges_?this.fullTileRanges_[e]:this.extent_?this.getTileRangeForExtentAndZ(this.extent_,e):null},n.prototype.getZForResolution=function(e,t){var i=b(this.resolutions_,e,t||0);return J(i,this.minZoom,this.maxZoom)},n.prototype.tileCoordIntersectsViewport=function(e,t){return at(t,0,t.length,2,this.getTileCoordExtent(e))},n.prototype.calculateTileRanges_=function(e){for(var t=this.resolutions_.length,i=new Array(t),r=this.minZoom;r<t;++r)i[r]=this.getTileRangeForExtentAndZ(e,r);this.fullTileRanges_=i},n}();const G=yt;function L(n){var e=n.getDefaultTileGrid();return e||(e=Ft(n),n.setDefaultTileGrid(e)),e}function mt(n,e,t){var i=e[0],r=n.getTileCoordCenter(e),o=P(t);if(et(o,r))return e;var a=O(o),s=Math.ceil((o[0]-r[0])/a);return r[0]+=a*s,n.getTileCoordForCoordAndZ(r,i)}function Tt(n,e,t,i){var r=i!==void 0?i:"top-left",o=A(n,e,t);return new G({extent:n,origin:tt(n,r),resolutions:o,tileSize:t})}function xt(n){var e=n||{},t=e.extent||w("EPSG:3857").getExtent(),i={extent:t,minZoom:e.minZoom,tileSize:e.tileSize,resolutions:A(t,e.maxZoom,e.tileSize,e.maxResolution)};return new G(i)}function A(n,e,t,i){for(var r=e!==void 0?e:ot,o=Q(n),a=O(n),s=g(t!==void 0?t:j),l=i>0?i:Math.max(a/s[0],o/s[1]),u=r+1,c=new Array(u),h=0;h<u;++h)c[h]=l/Math.pow(2,h);return c}function Ft(n,e,t,i){var r=P(n);return Tt(r,e,t,i)}function P(n){n=w(n);var e=n.getExtent();if(!e){var t=180*lt[ut.DEGREES]/n.getMetersPerUnit();e=C(-t,-t,t,t)}return e}var U=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),St=function(n){U(e,n);function e(t){var i=n.call(this,{attributions:t.attributions,attributionsCollapsible:t.attributionsCollapsible,projection:t.projection,state:t.state,wrapX:t.wrapX,interpolate:t.interpolate})||this;i.on,i.once,i.un,i.opaque_=t.opaque!==void 0?t.opaque:!1,i.tilePixelRatio_=t.tilePixelRatio!==void 0?t.tilePixelRatio:1,i.tileGrid=t.tileGrid!==void 0?t.tileGrid:null;var r=[256,256];return i.tileGrid&&g(i.tileGrid.getTileSize(i.tileGrid.getMinZoom()),r),i.tileCache=new Z(t.cacheSize||0),i.tmpSize=[0,0],i.key_=t.key||"",i.tileOptions={transition:t.transition,interpolate:t.interpolate},i.zDirection=t.zDirection?t.zDirection:0,i}return e.prototype.canExpireCache=function(){return this.tileCache.canExpireCache()},e.prototype.expireCache=function(t,i){var r=this.getTileCacheForProjection(t);r&&r.expireCache(i)},e.prototype.forEachLoadedTile=function(t,i,r,o){var a=this.getTileCacheForProjection(t);if(!a)return!1;for(var s=!0,l,u,c,h=r.minX;h<=r.maxX;++h)for(var p=r.minY;p<=r.maxY;++p)u=S(i,h,p),c=!1,a.containsKey(u)&&(l=a.get(u),c=l.getState()===v.LOADED,c&&(c=o(l)!==!1)),c||(s=!1);return s},e.prototype.getGutterForProjection=function(t){return 0},e.prototype.getKey=function(){return this.key_},e.prototype.setKey=function(t){this.key_!==t&&(this.key_=t,this.changed())},e.prototype.getOpaque=function(t){return this.opaque_},e.prototype.getResolutions=function(){return this.tileGrid?this.tileGrid.getResolutions():null},e.prototype.getTile=function(t,i,r,o,a){return it()},e.prototype.getTileGrid=function(){return this.tileGrid},e.prototype.getTileGridForProjection=function(t){return this.tileGrid?this.tileGrid:L(t)},e.prototype.getTileCacheForProjection=function(t){var i=this.getProjection();return f(i===null||m(i,t),68),this.tileCache},e.prototype.getTilePixelRatio=function(t){return this.tilePixelRatio_},e.prototype.getTilePixelSize=function(t,i,r){var o=this.getTileGridForProjection(r),a=this.getTilePixelRatio(i),s=g(o.getTileSize(t),this.tmpSize);return a==1?s:st(s,a,this.tmpSize)},e.prototype.getTileCoordForTileUrlFunction=function(t,i){var r=i!==void 0?i:this.getProjection(),o=this.getTileGridForProjection(r);return this.getWrapX()&&r.isGlobal()&&(t=mt(o,t,r)),dt(t,o)?t:null},e.prototype.clear=function(){this.tileCache.clear()},e.prototype.refresh=function(){this.clear(),n.prototype.refresh.call(this)},e.prototype.updateCacheSize=function(t,i){var r=this.getTileCacheForProjection(i);t>r.highWaterMark&&(r.highWaterMark=t)},e.prototype.useTile=function(t,i,r,o){},e}(nt),Et=function(n){U(e,n);function e(t,i){var r=n.call(this,t)||this;return r.tile=i,r}return e}($);const Ct=St;function wt(n,e){var t=/\{z\}/g,i=/\{x\}/g,r=/\{y\}/g,o=/\{-y\}/g;return function(a,s,l){if(a)return n.replace(t,a[0].toString()).replace(i,a[1].toString()).replace(r,a[2].toString()).replace(o,function(){var u=a[0],c=e.getFullTileRange(u);f(c,55);var h=c.getHeight()-a[2]-1;return h.toString()})}}function Pt(n,e){for(var t=n.length,i=new Array(t),r=0;r<t;++r)i[r]=wt(n[r],e);return Rt(i)}function Rt(n){return n.length===1?n[0]:function(e,t,i){if(e){var r=pt(e),o=rt(r,n.length);return n[o](e,t,i)}else return}}function Ot(n){var e=[],t=/\{([a-z])-([a-z])\}/.exec(n);if(t){var i=t[1].charCodeAt(0),r=t[2].charCodeAt(0),o=void 0;for(o=i;o<=r;++o)e.push(n.replace(t[0],String.fromCharCode(o)));return e}if(t=/\{(\d+)-(\d+)\}/.exec(n),t){for(var a=parseInt(t[2],10),s=parseInt(t[1],10);s<=a;s++)e.push(n.replace(t[0],s.toString()));return e}return e.push(n),e}var jt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),zt=function(n){jt(e,n);function e(t){var i=n.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,opaque:t.opaque,projection:t.projection,state:t.state,tileGrid:t.tileGrid,tilePixelRatio:t.tilePixelRatio,wrapX:t.wrapX,transition:t.transition,interpolate:t.interpolate,key:t.key,attributionsCollapsible:t.attributionsCollapsible,zDirection:t.zDirection})||this;return i.generateTileUrlFunction_=i.tileUrlFunction===e.prototype.tileUrlFunction,i.tileLoadFunction=t.tileLoadFunction,t.tileUrlFunction&&(i.tileUrlFunction=t.tileUrlFunction),i.urls=null,t.urls?i.setUrls(t.urls):t.url&&i.setUrl(t.url),i.tileLoadingKeys_={},i}return e.prototype.getTileLoadFunction=function(){return this.tileLoadFunction},e.prototype.getTileUrlFunction=function(){return Object.getPrototypeOf(this).tileUrlFunction===this.tileUrlFunction?this.tileUrlFunction.bind(this):this.tileUrlFunction},e.prototype.getUrls=function(){return this.urls},e.prototype.handleTileChange=function(t){var i=t.target,r=F(i),o=i.getState(),a;o==v.LOADING?(this.tileLoadingKeys_[r]=!0,a=E.TILELOADSTART):r in this.tileLoadingKeys_&&(delete this.tileLoadingKeys_[r],a=o==v.ERROR?E.TILELOADERROR:o==v.LOADED?E.TILELOADEND:void 0),a!=null&&this.dispatchEvent(new Et(a,i))},e.prototype.setTileLoadFunction=function(t){this.tileCache.clear(),this.tileLoadFunction=t,this.changed()},e.prototype.setTileUrlFunction=function(t,i){this.tileUrlFunction=t,this.tileCache.pruneExceptNewestZ(),typeof i<"u"?this.setKey(i):this.changed()},e.prototype.setUrl=function(t){var i=Ot(t);this.urls=i,this.setUrls(i)},e.prototype.setUrls=function(t){this.urls=t;var i=t.join(`
`);this.generateTileUrlFunction_?this.setTileUrlFunction(Pt(t,this.tileGrid),i):this.setKey(i)},e.prototype.tileUrlFunction=function(t,i,r){},e.prototype.useTile=function(t,i,r){var o=S(t,i,r);this.tileCache.containsKey(o)&&this.tileCache.get(o)},e}(Ct);const Zt=zt;var Gt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),Lt=function(n){Gt(e,n);function e(t){var i=this,r=t.imageSmoothing!==void 0?t.imageSmoothing:!0;return t.interpolate!==void 0&&(r=t.interpolate),i=n.call(this,{attributions:t.attributions,cacheSize:t.cacheSize,opaque:t.opaque,projection:t.projection,state:t.state,tileGrid:t.tileGrid,tileLoadFunction:t.tileLoadFunction?t.tileLoadFunction:At,tilePixelRatio:t.tilePixelRatio,tileUrlFunction:t.tileUrlFunction,url:t.url,urls:t.urls,wrapX:t.wrapX,transition:t.transition,interpolate:r,key:t.key,attributionsCollapsible:t.attributionsCollapsible,zDirection:t.zDirection})||this,i.crossOrigin=t.crossOrigin!==void 0?t.crossOrigin:null,i.tileClass=t.tileClass!==void 0?t.tileClass:B,i.tileCacheForProjection={},i.tileGridForProjection={},i.reprojectionErrorThreshold_=t.reprojectionErrorThreshold,i.renderReprojectionEdges_=!1,i}return e.prototype.canExpireCache=function(){if(this.tileCache.canExpireCache())return!0;for(var t in this.tileCacheForProjection)if(this.tileCacheForProjection[t].canExpireCache())return!0;return!1},e.prototype.expireCache=function(t,i){var r=this.getTileCacheForProjection(t);this.tileCache.expireCache(this.tileCache==r?i:{});for(var o in this.tileCacheForProjection){var a=this.tileCacheForProjection[o];a.expireCache(a==r?i:{})}},e.prototype.getGutterForProjection=function(t){return this.getProjection()&&t&&!m(this.getProjection(),t)?0:this.getGutter()},e.prototype.getGutter=function(){return 0},e.prototype.getKey=function(){var t=n.prototype.getKey.call(this);return this.getInterpolate()||(t+=":disable-interpolation"),t},e.prototype.getOpaque=function(t){return this.getProjection()&&t&&!m(this.getProjection(),t)?!1:n.prototype.getOpaque.call(this,t)},e.prototype.getTileGridForProjection=function(t){var i=this.getProjection();if(this.tileGrid&&(!i||m(i,t)))return this.tileGrid;var r=F(t);return r in this.tileGridForProjection||(this.tileGridForProjection[r]=L(t)),this.tileGridForProjection[r]},e.prototype.getTileCacheForProjection=function(t){var i=this.getProjection();if(!i||m(i,t))return this.tileCache;var r=F(t);return r in this.tileCacheForProjection||(this.tileCacheForProjection[r]=new Z(this.tileCache.highWaterMark)),this.tileCacheForProjection[r]},e.prototype.createTile_=function(t,i,r,o,a,s){var l=[t,i,r],u=this.getTileCoordForTileUrlFunction(l,a),c=u?this.tileUrlFunction(u,o,a):void 0,h=new this.tileClass(l,c!==void 0?v.IDLE:v.EMPTY,c!==void 0?c:"",this.crossOrigin,this.tileLoadFunction,this.tileOptions);return h.key=s,h.addEventListener(N.CHANGE,this.handleTileChange.bind(this)),h},e.prototype.getTile=function(t,i,r,o,a){var s=this.getProjection();if(!s||!a||m(s,a))return this.getTileInternal(t,i,r,o,s||a);var l=this.getTileCacheForProjection(a),u=[t,i,r],c=void 0,h=z(u);l.containsKey(h)&&(c=l.get(h));var p=this.getKey();if(c&&c.key==p)return c;var X=this.getTileGridForProjection(s),M=this.getTileGridForProjection(a),k=this.getTileCoordForTileUrlFunction(u,a),_=new H(s,X,a,M,u,k,this.getTilePixelRatio(o),this.getGutter(),(function(D,I,Y,K){return this.getTileInternal(D,I,Y,K,s)}).bind(this),this.reprojectionErrorThreshold_,this.renderReprojectionEdges_,this.getInterpolate());return _.key=p,c?(_.interimTile=c,_.refreshInterimChain(),l.replace(h,_)):l.set(h,_),_},e.prototype.getTileInternal=function(t,i,r,o,a){var s=null,l=S(t,i,r),u=this.getKey();if(!this.tileCache.containsKey(l))s=this.createTile_(t,i,r,o,a,u),this.tileCache.set(l,s);else if(s=this.tileCache.get(l),s.key!=u){var c=s;s=this.createTile_(t,i,r,o,a,u),c.getState()==v.IDLE?s.interimTile=c.interimTile:s.interimTile=c,s.refreshInterimChain(),this.tileCache.replace(l,s)}return s},e.prototype.setRenderReprojectionEdges=function(t){if(this.renderReprojectionEdges_!=t){this.renderReprojectionEdges_=t;for(var i in this.tileCacheForProjection)this.tileCacheForProjection[i].clear();this.changed()}},e.prototype.setTileGridForProjection=function(t,i){{var r=w(t);if(r){var o=F(r);o in this.tileGridForProjection||(this.tileGridForProjection[o]=i)}}},e}(Zt);function At(n,e){n.getImage().src=e}const Ut=Lt;var Xt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),Mt=function(n){Xt(e,n);function e(t){var i=this,r=t||{},o=r.imageSmoothing!==void 0?r.imageSmoothing:!0;r.interpolate!==void 0&&(o=r.interpolate);var a=r.projection!==void 0?r.projection:"EPSG:3857",s=r.tileGrid!==void 0?r.tileGrid:xt({extent:P(a),maxResolution:r.maxResolution,maxZoom:r.maxZoom,minZoom:r.minZoom,tileSize:r.tileSize});return i=n.call(this,{attributions:r.attributions,cacheSize:r.cacheSize,crossOrigin:r.crossOrigin,interpolate:o,opaque:r.opaque,projection:a,reprojectionErrorThreshold:r.reprojectionErrorThreshold,tileGrid:s,tileLoadFunction:r.tileLoadFunction,tilePixelRatio:r.tilePixelRatio,tileUrlFunction:r.tileUrlFunction,url:r.url,urls:r.urls,wrapX:r.wrapX!==void 0?r.wrapX:!0,transition:r.transition,attributionsCollapsible:r.attributionsCollapsible,zDirection:r.zDirection})||this,i.gutter_=r.gutter!==void 0?r.gutter:0,i}return e.prototype.getGutter=function(){return this.gutter_},e}(Ut);const kt=Mt;var Dt=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}}(),It='&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.',ie=function(n){Dt(e,n);function e(t){var i=t||{},r=i.imageSmoothing!==void 0?i.imageSmoothing:!0;i.interpolate!==void 0&&(r=i.interpolate);var o;i.attributions!==void 0?o=i.attributions:o=[It];var a=i.crossOrigin!==void 0?i.crossOrigin:"anonymous",s=i.url!==void 0?i.url:"https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";return n.call(this,{attributions:o,attributionsCollapsible:!1,cacheSize:i.cacheSize,crossOrigin:a,interpolate:r,maxZoom:i.maxZoom!==void 0?i.maxZoom:19,opaque:i.opaque!==void 0?i.opaque:!0,reprojectionErrorThreshold:i.reprojectionErrorThreshold,tileLoadFunction:i.tileLoadFunction,transition:i.transition,url:s,wrapX:i.wrapX,zDirection:i.zDirection})||this}return e}(kt);export{It as ATTRIBUTION,ie as default};