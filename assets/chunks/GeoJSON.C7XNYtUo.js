import{u as I,l as X,E as Y,d as B,o as W,h as _,a as k,p as z}from"./Object.DdgBWT7D.js";import{b as $,D as J,E as G,C as Q,G as V,L as q,H as b,J as g,a8 as tt,a as p,j as et,a0 as rt,y as nt}from"./proj.BNE8J585.js";import{G as v,i as K,d as it,S as F,a as ot,b as st,c as at,e as ut,f as lt}from"./inflate.CR1fXO-E.js";import{U as ht}from"./Projection.Bg0YEavu.js";import{m as ft,a as ct,d as D,b as pt,c as yt,e as dt,g as w,h as gt,i as vt,l as mt,o as N,j as _t,k as Ct,P as M,n as Pt}from"./Polygon.DrFvfP63.js";import{f as Gt,b as Ot,c as Ft,d as wt,e as Mt}from"./intersectsextent.DO7gmjzY.js";import{l as St}from"./length.Db1PyEzj.js";import"./transform.CU9krZJA.js";import"./has.DEIyT5tI.js";var jt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),xt=function(o){jt(r,o);function r(t){var e=o.call(this)||this;if(e.on,e.once,e.un,e.id_=void 0,e.geometryName_="geometry",e.style_=null,e.styleFunction_=void 0,e.geometryChangeKey_=null,e.addChangeListener(e.geometryName_,e.handleGeometryChanged_),t)if(typeof t.getSimplifiedGeometry=="function"){var n=t;e.setGeometry(n)}else{var i=t;e.setProperties(i)}return e}return r.prototype.clone=function(){var t=new r(this.hasProperties()?this.getProperties():null);t.setGeometryName(this.getGeometryName());var e=this.getGeometry();e&&t.setGeometry(e.clone());var n=this.getStyle();return n&&t.setStyle(n),t},r.prototype.getGeometry=function(){return this.get(this.geometryName_)},r.prototype.getId=function(){return this.id_},r.prototype.getGeometryName=function(){return this.geometryName_},r.prototype.getStyle=function(){return this.style_},r.prototype.getStyleFunction=function(){return this.styleFunction_},r.prototype.handleGeometryChange_=function(){this.changed()},r.prototype.handleGeometryChanged_=function(){this.geometryChangeKey_&&(I(this.geometryChangeKey_),this.geometryChangeKey_=null);var t=this.getGeometry();t&&(this.geometryChangeKey_=X(t,Y.CHANGE,this.handleGeometryChange_,this)),this.changed()},r.prototype.setGeometry=function(t){this.set(this.geometryName_,t)},r.prototype.setStyle=function(t){this.style_=t,this.styleFunction_=t?At(t):void 0,this.changed()},r.prototype.setId=function(t){this.id_=t,this.changed()},r.prototype.setGeometryName=function(t){this.removeChangeListener(this.geometryName_,this.handleGeometryChanged_),this.geometryName_=t,this.addChangeListener(this.geometryName_,this.handleGeometryChanged_),this.handleGeometryChanged_()},r}(B);function At(o){if(typeof o=="function")return o;var r;if(Array.isArray(o))r=o;else{$(typeof o.getZIndex=="function",41);var t=o;r=[t]}return function(){return r}}function U(o,r,t,e,n,i,s){var a,u,l=(t-r)/e;if(l===1)a=r;else if(l===2)a=r,u=n;else if(l!==0){for(var h=o[r],f=o[r+1],y=0,d=[0],c=r+e;c<t;c+=e){var m=o[c],P=o[c+1];y+=Math.sqrt((m-h)*(m-h)+(P-f)*(P-f)),d.push(y),h=m,f=P}var E=n*y,C=W(d,E);C<0?(u=(E-d[-C-2])/(d[-C-1]-d[-C-2]),a=r+(-C-2)*e):a=r+C*e}for(var R=s>1?s:2,L=i||new Array(R),c=0;c<R;++c)L[c]=a===void 0?NaN:u===void 0?o[a+c]:J(o[a+c],o[a+e+c],u);return L}function S(o,r,t,e,n,i){if(t==r)return null;var s;if(n<o[r+e-1])return i?(s=o.slice(r,r+e),s[e-1]=n,s):null;if(o[t-1]<n)return i?(s=o.slice(t-e,t),s[e-1]=n,s):null;if(n==o[r+e-1])return o.slice(r,r+e);for(var a=r/e,u=t/e;a<u;){var l=a+u>>1;n<o[(l+1)*e-1]?u=l:a=l+1}var h=o[a*e-1];if(n==h)return o.slice((a-1)*e,(a-1)*e+e);var f=o[(a+1)*e-1],y=(n-h)/(f-h);s=[];for(var d=0;d<e-1;++d)s.push(J(o[(a-1)*e+d],o[a*e+d],y));return s.push(n),s}function Et(o,r,t,e,n,i,s){if(s)return S(o,r,t[t.length-1],e,n,i);var a;if(n<o[e-1])return i?(a=o.slice(0,e),a[e-1]=n,a):null;if(o[o.length-1]<n)return i?(a=o.slice(o.length-e),a[e-1]=n,a):null;for(var u=0,l=t.length;u<l;++u){var h=t[u];if(r!=h){if(n<o[r+e-1])return null;if(n<=o[h-1])return S(o,r,h,e,n,!1);r=h}}return null}var Rt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Lt=function(o){Rt(r,o);function r(t,e){var n=o.call(this)||this;return n.flatMidpoint_=null,n.flatMidpointRevision_=-1,n.maxDelta_=-1,n.maxDeltaRevision_=-1,e!==void 0&&!Array.isArray(t[0])?n.setFlatCoordinates(e,t):n.setCoordinates(t,e),n}return r.prototype.appendCoordinate=function(t){this.flatCoordinates?_(this.flatCoordinates,t):this.flatCoordinates=t.slice(),this.changed()},r.prototype.clone=function(){var t=new r(this.flatCoordinates.slice(),this.layout);return t.applyProperties(this),t},r.prototype.closestPointXY=function(t,e,n,i){return i<G(this.getExtent(),t,e)?i:(this.maxDeltaRevision_!=this.getRevision()&&(this.maxDelta_=Math.sqrt(ft(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,0)),this.maxDeltaRevision_=this.getRevision()),ct(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,this.maxDelta_,!1,t,e,n,i))},r.prototype.forEachSegment=function(t){return Gt(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t)},r.prototype.getCoordinateAtM=function(t,e){if(this.layout!=v.XYM&&this.layout!=v.XYZM)return null;var n=e!==void 0?e:!1;return S(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,n)},r.prototype.getCoordinates=function(){return K(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)},r.prototype.getCoordinateAt=function(t,e){return U(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,e,this.stride)},r.prototype.getLength=function(){return St(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)},r.prototype.getFlatMidpoint=function(){return this.flatMidpointRevision_!=this.getRevision()&&(this.flatMidpoint_=this.getCoordinateAt(.5,this.flatMidpoint_),this.flatMidpointRevision_=this.getRevision()),this.flatMidpoint_},r.prototype.getSimplifiedGeometryInternal=function(t){var e=[];return e.length=it(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t,e,0),new r(e,v.XY)},r.prototype.getType=function(){return"LineString"},r.prototype.intersectsExtent=function(t){return Ot(this.flatCoordinates,0,this.flatCoordinates.length,this.stride,t)},r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,1),this.flatCoordinates||(this.flatCoordinates=[]),this.flatCoordinates.length=D(this.flatCoordinates,0,t,this.stride),this.changed()},r}(F);const j=Lt;var Nt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Tt=function(o){Nt(r,o);function r(t,e,n){var i=o.call(this)||this;if(i.ends_=[],i.maxDelta_=-1,i.maxDeltaRevision_=-1,Array.isArray(t[0]))i.setCoordinates(t,e);else if(e!==void 0&&n)i.setFlatCoordinates(e,t),i.ends_=n;else{for(var s=i.getLayout(),a=t,u=[],l=[],h=0,f=a.length;h<f;++h){var y=a[h];h===0&&(s=y.getLayout()),_(u,y.getFlatCoordinates()),l.push(u.length)}i.setFlatCoordinates(s,u),i.ends_=l}return i}return r.prototype.appendLineString=function(t){this.flatCoordinates?_(this.flatCoordinates,t.getFlatCoordinates().slice()):this.flatCoordinates=t.getFlatCoordinates().slice(),this.ends_.push(this.flatCoordinates.length),this.changed()},r.prototype.clone=function(){var t=new r(this.flatCoordinates.slice(),this.layout,this.ends_.slice());return t.applyProperties(this),t},r.prototype.closestPointXY=function(t,e,n,i){return i<G(this.getExtent(),t,e)?i:(this.maxDeltaRevision_!=this.getRevision()&&(this.maxDelta_=Math.sqrt(pt(this.flatCoordinates,0,this.ends_,this.stride,0)),this.maxDeltaRevision_=this.getRevision()),yt(this.flatCoordinates,0,this.ends_,this.stride,this.maxDelta_,!1,t,e,n,i))},r.prototype.getCoordinateAtM=function(t,e,n){if(this.layout!=v.XYM&&this.layout!=v.XYZM||this.flatCoordinates.length===0)return null;var i=e!==void 0?e:!1,s=n!==void 0?n:!1;return Et(this.flatCoordinates,0,this.ends_,this.stride,t,i,s)},r.prototype.getCoordinates=function(){return ot(this.flatCoordinates,0,this.ends_,this.stride)},r.prototype.getEnds=function(){return this.ends_},r.prototype.getLineString=function(t){return t<0||this.ends_.length<=t?null:new j(this.flatCoordinates.slice(t===0?0:this.ends_[t-1],this.ends_[t]),this.layout)},r.prototype.getLineStrings=function(){for(var t=this.flatCoordinates,e=this.ends_,n=this.layout,i=[],s=0,a=0,u=e.length;a<u;++a){var l=e[a],h=new j(t.slice(s,l),n);i.push(h),s=l}return i},r.prototype.getFlatMidpoints=function(){for(var t=[],e=this.flatCoordinates,n=0,i=this.ends_,s=this.stride,a=0,u=i.length;a<u;++a){var l=i[a],h=U(e,n,l,s,.5);_(t,h),n=l}return t},r.prototype.getSimplifiedGeometryInternal=function(t){var e=[],n=[];return e.length=st(this.flatCoordinates,0,this.ends_,this.stride,t,e,0,n),new r(e,v.XY,n)},r.prototype.getType=function(){return"MultiLineString"},r.prototype.intersectsExtent=function(t){return Ft(this.flatCoordinates,0,this.ends_,this.stride,t)},r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,2),this.flatCoordinates||(this.flatCoordinates=[]);var n=dt(this.flatCoordinates,0,t,this.stride,this.ends_);this.flatCoordinates.length=n.length===0?0:n[n.length-1],this.changed()},r}(F);const It=Tt;var Xt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Yt=function(o){Xt(r,o);function r(t,e){var n=o.call(this)||this;return e&&!Array.isArray(t[0])?n.setFlatCoordinates(e,t):n.setCoordinates(t,e),n}return r.prototype.appendPoint=function(t){this.flatCoordinates?_(this.flatCoordinates,t.getFlatCoordinates()):this.flatCoordinates=t.getFlatCoordinates().slice(),this.changed()},r.prototype.clone=function(){var t=new r(this.flatCoordinates.slice(),this.layout);return t.applyProperties(this),t},r.prototype.closestPointXY=function(t,e,n,i){if(i<G(this.getExtent(),t,e))return i;for(var s=this.flatCoordinates,a=this.stride,u=0,l=s.length;u<l;u+=a){var h=Q(t,e,s[u],s[u+1]);if(h<i){i=h;for(var f=0;f<a;++f)n[f]=s[u+f];n.length=a}}return i},r.prototype.getCoordinates=function(){return K(this.flatCoordinates,0,this.flatCoordinates.length,this.stride)},r.prototype.getPoint=function(t){var e=this.flatCoordinates?this.flatCoordinates.length/this.stride:0;return t<0||e<=t?null:new w(this.flatCoordinates.slice(t*this.stride,(t+1)*this.stride),this.layout)},r.prototype.getPoints=function(){for(var t=this.flatCoordinates,e=this.layout,n=this.stride,i=[],s=0,a=t.length;s<a;s+=n){var u=new w(t.slice(s,s+n),e);i.push(u)}return i},r.prototype.getType=function(){return"MultiPoint"},r.prototype.intersectsExtent=function(t){for(var e=this.flatCoordinates,n=this.stride,i=0,s=e.length;i<s;i+=n){var a=e[i],u=e[i+1];if(V(t,a,u))return!0}return!1},r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,1),this.flatCoordinates||(this.flatCoordinates=[]),this.flatCoordinates.length=D(this.flatCoordinates,0,t,this.stride),this.changed()},r}(F);const H=Yt;function kt(o,r,t,e){for(var n=[],i=b(),s=0,a=t.length;s<a;++s){var u=t[s];i=q(o,r,u[0],e),n.push((i[0]+i[2])/2,(i[1]+i[3])/2),r=u[u.length-1]}return n}var $t=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Jt=function(o){$t(r,o);function r(t,e,n){var i=o.call(this)||this;if(i.endss_=[],i.flatInteriorPointsRevision_=-1,i.flatInteriorPoints_=null,i.maxDelta_=-1,i.maxDeltaRevision_=-1,i.orientedRevision_=-1,i.orientedFlatCoordinates_=null,!n&&!Array.isArray(t[0])){for(var s=i.getLayout(),a=t,u=[],l=[],h=0,f=a.length;h<f;++h){var y=a[h];h===0&&(s=y.getLayout());for(var d=u.length,c=y.getEnds(),m=0,P=c.length;m<P;++m)c[m]+=d;_(u,y.getFlatCoordinates()),l.push(c)}e=s,t=u,n=l}return e!==void 0&&n?(i.setFlatCoordinates(e,t),i.endss_=n):i.setCoordinates(t,e),i}return r.prototype.appendPolygon=function(t){var e;if(!this.flatCoordinates)this.flatCoordinates=t.getFlatCoordinates().slice(),e=t.getEnds().slice(),this.endss_.push();else{var n=this.flatCoordinates.length;_(this.flatCoordinates,t.getFlatCoordinates()),e=t.getEnds().slice();for(var i=0,s=e.length;i<s;++i)e[i]+=n}this.endss_.push(e),this.changed()},r.prototype.clone=function(){for(var t=this.endss_.length,e=new Array(t),n=0;n<t;++n)e[n]=this.endss_[n].slice();var i=new r(this.flatCoordinates.slice(),this.layout,e);return i.applyProperties(this),i},r.prototype.closestPointXY=function(t,e,n,i){return i<G(this.getExtent(),t,e)?i:(this.maxDeltaRevision_!=this.getRevision()&&(this.maxDelta_=Math.sqrt(gt(this.flatCoordinates,0,this.endss_,this.stride,0)),this.maxDeltaRevision_=this.getRevision()),vt(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,this.maxDelta_,!0,t,e,n,i))},r.prototype.containsXY=function(t,e){return wt(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t,e)},r.prototype.getArea=function(){return mt(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride)},r.prototype.getCoordinates=function(t){var e;return t!==void 0?(e=this.getOrientedFlatCoordinates().slice(),N(e,0,this.endss_,this.stride,t)):e=this.flatCoordinates,at(e,0,this.endss_,this.stride)},r.prototype.getEndss=function(){return this.endss_},r.prototype.getFlatInteriorPoints=function(){if(this.flatInteriorPointsRevision_!=this.getRevision()){var t=kt(this.flatCoordinates,0,this.endss_,this.stride);this.flatInteriorPoints_=_t(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t),this.flatInteriorPointsRevision_=this.getRevision()}return this.flatInteriorPoints_},r.prototype.getInteriorPoints=function(){return new H(this.getFlatInteriorPoints().slice(),v.XYM)},r.prototype.getOrientedFlatCoordinates=function(){if(this.orientedRevision_!=this.getRevision()){var t=this.flatCoordinates;Ct(t,0,this.endss_,this.stride)?this.orientedFlatCoordinates_=t:(this.orientedFlatCoordinates_=t.slice(),this.orientedFlatCoordinates_.length=N(this.orientedFlatCoordinates_,0,this.endss_,this.stride)),this.orientedRevision_=this.getRevision()}return this.orientedFlatCoordinates_},r.prototype.getSimplifiedGeometryInternal=function(t){var e=[],n=[];return e.length=ut(this.flatCoordinates,0,this.endss_,this.stride,Math.sqrt(t),e,0,n),new r(e,v.XY,n)},r.prototype.getPolygon=function(t){if(t<0||this.endss_.length<=t)return null;var e;if(t===0)e=0;else{var n=this.endss_[t-1];e=n[n.length-1]}var i=this.endss_[t].slice(),s=i[i.length-1];if(e!==0)for(var a=0,u=i.length;a<u;++a)i[a]-=e;return new M(this.flatCoordinates.slice(e,s),this.layout,i)},r.prototype.getPolygons=function(){for(var t=this.layout,e=this.flatCoordinates,n=this.endss_,i=[],s=0,a=0,u=n.length;a<u;++a){var l=n[a].slice(),h=l[l.length-1];if(s!==0)for(var f=0,y=l.length;f<y;++f)l[f]-=s;var d=new M(e.slice(s,h),t,l);i.push(d),s=h}return i},r.prototype.getType=function(){return"MultiPolygon"},r.prototype.intersectsExtent=function(t){return Mt(this.getOrientedFlatCoordinates(),0,this.endss_,this.stride,t)},r.prototype.setCoordinates=function(t,e){this.setLayout(e,t,3),this.flatCoordinates||(this.flatCoordinates=[]);var n=Pt(this.flatCoordinates,0,t,this.stride,this.endss_);if(n.length===0)this.flatCoordinates.length=0;else{var i=n[n.length-1];this.flatCoordinates.length=i.length===0?0:i[i.length-1]}this.changed()},r}(F);const Kt=Jt;var Dt=function(){function o(){this.dataProjection=void 0,this.defaultFeatureProjection=void 0,this.supportedMediaTypes=null}return o.prototype.getReadOptions=function(r,t){var e;if(t){var n=t.dataProjection?g(t.dataProjection):this.readProjection(r);t.extent&&n&&n.getUnits()===ht.TILE_PIXELS&&(n=g(n),n.setWorldExtent(t.extent)),e={dataProjection:n,featureProjection:t.featureProjection}}return this.adaptOptions(e)},o.prototype.adaptOptions=function(r){return k({dataProjection:this.dataProjection,featureProjection:this.defaultFeatureProjection},r)},o.prototype.getType=function(){return p()},o.prototype.readFeature=function(r,t){return p()},o.prototype.readFeatures=function(r,t){return p()},o.prototype.readGeometry=function(r,t){return p()},o.prototype.readProjection=function(r){return p()},o.prototype.writeFeature=function(r,t){return p()},o.prototype.writeFeatures=function(r,t){return p()},o.prototype.writeGeometry=function(r,t){return p()},o}();function Z(o,r,t){var e=t?g(t.featureProjection):null,n=t?g(t.dataProjection):null,i;if(e&&n&&!tt(e,n)?i=(r?o.clone():o).transform(r?e:n,r?n:e):i=o,r&&t&&t.decimals!==void 0){var s=Math.pow(10,t.decimals),a=function(u){for(var l=0,h=u.length;l<h;++l)u[l]=Math.round(u[l]*s)/s;return u};i===o&&(i=o.clone()),i.applyTransform(a)}return i}var Ut=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Ht=function(o){Ut(r,o);function r(t){var e=o.call(this)||this;return e.geometries_=t||null,e.changeEventsKeys_=[],e.listenGeometriesChange_(),e}return r.prototype.unlistenGeometriesChange_=function(){this.changeEventsKeys_.forEach(I),this.changeEventsKeys_.length=0},r.prototype.listenGeometriesChange_=function(){if(this.geometries_)for(var t=0,e=this.geometries_.length;t<e;++t)this.changeEventsKeys_.push(X(this.geometries_[t],Y.CHANGE,this.changed,this))},r.prototype.clone=function(){var t=new r(null);return t.setGeometries(this.geometries_),t.applyProperties(this),t},r.prototype.closestPointXY=function(t,e,n,i){if(i<G(this.getExtent(),t,e))return i;for(var s=this.geometries_,a=0,u=s.length;a<u;++a)i=s[a].closestPointXY(t,e,n,i);return i},r.prototype.containsXY=function(t,e){for(var n=this.geometries_,i=0,s=n.length;i<s;++i)if(n[i].containsXY(t,e))return!0;return!1},r.prototype.computeExtent=function(t){et(t);for(var e=this.geometries_,n=0,i=e.length;n<i;++n)rt(t,e[n].getExtent());return t},r.prototype.getGeometries=function(){return T(this.geometries_)},r.prototype.getGeometriesArray=function(){return this.geometries_},r.prototype.getGeometriesArrayRecursive=function(){for(var t=[],e=this.geometries_,n=0,i=e.length;n<i;++n)e[n].getType()===this.getType()?t=t.concat(e[n].getGeometriesArrayRecursive()):t.push(e[n]);return t},r.prototype.getSimplifiedGeometry=function(t){if(this.simplifiedGeometryRevision!==this.getRevision()&&(this.simplifiedGeometryMaxMinSquaredTolerance=0,this.simplifiedGeometryRevision=this.getRevision()),t<0||this.simplifiedGeometryMaxMinSquaredTolerance!==0&&t<this.simplifiedGeometryMaxMinSquaredTolerance)return this;for(var e=[],n=this.geometries_,i=!1,s=0,a=n.length;s<a;++s){var u=n[s],l=u.getSimplifiedGeometry(t);e.push(l),l!==u&&(i=!0)}if(i){var h=new r(null);return h.setGeometriesArray(e),h}else return this.simplifiedGeometryMaxMinSquaredTolerance=t,this},r.prototype.getType=function(){return"GeometryCollection"},r.prototype.intersectsExtent=function(t){for(var e=this.geometries_,n=0,i=e.length;n<i;++n)if(e[n].intersectsExtent(t))return!0;return!1},r.prototype.isEmpty=function(){return this.geometries_.length===0},r.prototype.rotate=function(t,e){for(var n=this.geometries_,i=0,s=n.length;i<s;++i)n[i].rotate(t,e);this.changed()},r.prototype.scale=function(t,e,n){var i=n;i||(i=nt(this.getExtent()));for(var s=this.geometries_,a=0,u=s.length;a<u;++a)s[a].scale(t,e,i);this.changed()},r.prototype.setGeometries=function(t){this.setGeometriesArray(T(t))},r.prototype.setGeometriesArray=function(t){this.unlistenGeometriesChange_(),this.geometries_=t,this.listenGeometriesChange_(),this.changed()},r.prototype.applyTransform=function(t){for(var e=this.geometries_,n=0,i=e.length;n<i;++n)e[n].applyTransform(t);this.changed()},r.prototype.translate=function(t,e){for(var n=this.geometries_,i=0,s=n.length;i<s;++i)n[i].translate(t,e);this.changed()},r.prototype.disposeInternal=function(){this.unlistenGeometriesChange_(),o.prototype.disposeInternal.call(this)},r}(lt);function T(o){for(var r=[],t=0,e=o.length;t<e;++t)r.push(o[t].clone());return r}const Zt=Ht;var Bt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Wt=function(o){Bt(r,o);function r(){return o.call(this)||this}return r.prototype.getType=function(){return"json"},r.prototype.readFeature=function(t,e){return this.readFeatureFromObject(O(t),this.getReadOptions(t,e))},r.prototype.readFeatures=function(t,e){return this.readFeaturesFromObject(O(t),this.getReadOptions(t,e))},r.prototype.readFeatureFromObject=function(t,e){return p()},r.prototype.readFeaturesFromObject=function(t,e){return p()},r.prototype.readGeometry=function(t,e){return this.readGeometryFromObject(O(t),this.getReadOptions(t,e))},r.prototype.readGeometryFromObject=function(t,e){return p()},r.prototype.readProjection=function(t){return this.readProjectionFromObject(O(t))},r.prototype.readProjectionFromObject=function(t){return p()},r.prototype.writeFeature=function(t,e){return JSON.stringify(this.writeFeatureObject(t,e))},r.prototype.writeFeatureObject=function(t,e){return p()},r.prototype.writeFeatures=function(t,e){return JSON.stringify(this.writeFeaturesObject(t,e))},r.prototype.writeFeaturesObject=function(t,e){return p()},r.prototype.writeGeometry=function(t,e){return JSON.stringify(this.writeGeometryObject(t,e))},r.prototype.writeGeometryObject=function(t,e){return p()},r}(Dt);function O(o){if(typeof o=="string"){var r=JSON.parse(o);return r||null}else return o!==null?o:null}const zt=Wt;var Qt=function(){var o=function(r,t){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])},o(r,t)};return function(r,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");o(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}}(),Ce=function(o){Qt(r,o);function r(t){var e=this,n=t||{};return e=o.call(this)||this,e.dataProjection=g(n.dataProjection?n.dataProjection:"EPSG:4326"),n.featureProjection&&(e.defaultFeatureProjection=g(n.featureProjection)),e.geometryName_=n.geometryName,e.extractGeometryName_=n.extractGeometryName,e.supportedMediaTypes=["application/geo+json","application/vnd.geo+json"],e}return r.prototype.readFeatureFromObject=function(t,e){var n=null;t.type==="Feature"?n=t:n={type:"Feature",geometry:t,properties:null};var i=x(n.geometry,e),s=new xt;return this.geometryName_?s.setGeometryName(this.geometryName_):this.extractGeometryName_&&"geometry_name"in n!==void 0&&s.setGeometryName(n.geometry_name),s.setGeometry(i),"id"in n&&s.setId(n.id),n.properties&&s.setProperties(n.properties,!0),s},r.prototype.readFeaturesFromObject=function(t,e){var n=t,i=null;if(n.type==="FeatureCollection"){var s=t;i=[];for(var a=s.features,u=0,l=a.length;u<l;++u)i.push(this.readFeatureFromObject(a[u],e))}else i=[this.readFeatureFromObject(t,e)];return i},r.prototype.readGeometryFromObject=function(t,e){return x(t,e)},r.prototype.readProjectionFromObject=function(t){var e=t.crs,n;return e?e.type=="name"?n=g(e.properties.name):e.type==="EPSG"?n=g("EPSG:"+e.properties.code):$(!1,36):n=this.dataProjection,n},r.prototype.writeFeatureObject=function(t,e){e=this.adaptOptions(e);var n={type:"Feature",geometry:null,properties:null},i=t.getId();if(i!==void 0&&(n.id=i),!t.hasProperties())return n;var s=t.getProperties(),a=t.getGeometry();return a&&(n.geometry=A(a,e),delete s[t.getGeometryName()]),z(s)||(n.properties=s),n},r.prototype.writeFeaturesObject=function(t,e){e=this.adaptOptions(e);for(var n=[],i=0,s=t.length;i<s;++i)n.push(this.writeFeatureObject(t[i],e));return{type:"FeatureCollection",features:n}},r.prototype.writeGeometryObject=function(t,e){return A(t,this.adaptOptions(e))},r}(zt);function x(o,r){if(!o)return null;var t;switch(o.type){case"Point":{t=qt(o);break}case"LineString":{t=bt(o);break}case"Polygon":{t=ne(o);break}case"MultiPoint":{t=ee(o);break}case"MultiLineString":{t=te(o);break}case"MultiPolygon":{t=re(o);break}case"GeometryCollection":{t=Vt(o);break}default:throw new Error("Unsupported GeoJSON type: "+o.type)}return Z(t,!1,r)}function Vt(o,r){var t=o.geometries.map(function(e){return x(e,r)});return new Zt(t)}function qt(o){return new w(o.coordinates)}function bt(o){return new j(o.coordinates)}function te(o){return new It(o.coordinates)}function ee(o){return new H(o.coordinates)}function re(o){return new Kt(o.coordinates)}function ne(o){return new M(o.coordinates)}function A(o,r){o=Z(o,!0,r);var t=o.getType(),e;switch(t){case"Point":{e=le(o);break}case"LineString":{e=oe(o);break}case"Polygon":{e=he(o,r);break}case"MultiPoint":{e=ae(o);break}case"MultiLineString":{e=se(o);break}case"MultiPolygon":{e=ue(o,r);break}case"GeometryCollection":{e=ie(o,r);break}case"Circle":{e={type:"GeometryCollection",geometries:[]};break}default:throw new Error("Unsupported geometry type: "+t)}return e}function ie(o,r){var t=o.getGeometriesArray().map(function(e){var n=k({},r);return delete n.featureProjection,A(e,n)});return{type:"GeometryCollection",geometries:t}}function oe(o,r){return{type:"LineString",coordinates:o.getCoordinates()}}function se(o,r){return{type:"MultiLineString",coordinates:o.getCoordinates()}}function ae(o,r){return{type:"MultiPoint",coordinates:o.getCoordinates()}}function ue(o,r){var t;return r&&(t=r.rightHanded),{type:"MultiPolygon",coordinates:o.getCoordinates(t)}}function le(o,r){return{type:"Point",coordinates:o.getCoordinates()}}function he(o,r){var t;return r&&(t=r.rightHanded),{type:"Polygon",coordinates:o.getCoordinates(t)}}export{Ce as default};
