import{d as s}from"./Object.DdgBWT7D.js";import{J as c,a as f}from"./proj.BNE8J585.js";var p=function(){var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[i]=o[i])},n(e,t)};return function(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");n(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}}(),l=function(n){p(e,n);function e(t){var r=n.call(this)||this;r.projection=c(t.projection),r.attributions_=u(t.attributions),r.attributionsCollapsible_=t.attributionsCollapsible!==void 0?t.attributionsCollapsible:!0,r.loading=!1,r.state_=t.state!==void 0?t.state:"ready",r.wrapX_=t.wrapX!==void 0?t.wrapX:!1,r.interpolate_=!!t.interpolate,r.viewResolver=null,r.viewRejector=null;var o=r;return r.viewPromise_=new Promise(function(i,a){o.viewResolver=i,o.viewRejector=a}),r}return e.prototype.getAttributions=function(){return this.attributions_},e.prototype.getAttributionsCollapsible=function(){return this.attributionsCollapsible_},e.prototype.getProjection=function(){return this.projection},e.prototype.getResolutions=function(){return f()},e.prototype.getView=function(){return this.viewPromise_},e.prototype.getState=function(){return this.state_},e.prototype.getWrapX=function(){return this.wrapX_},e.prototype.getInterpolate=function(){return this.interpolate_},e.prototype.refresh=function(){this.changed()},e.prototype.setAttributions=function(t){this.attributions_=u(t),this.changed()},e.prototype.setState=function(t){this.state_=t,this.changed()},e}(s);function u(n){return n?Array.isArray(n)?function(e){return n}:typeof n=="function"?n:function(e){return[n]}:null}const h=l;export{h as S};