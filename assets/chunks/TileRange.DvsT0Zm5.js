import{a as h}from"./proj.Cr1UOlyj.js";import{a,b as u}from"./Object.BbzoBtIW.js";const f={IDLE:0,LOADING:1,LOADED:2,ERROR:3,EMPTY:4,ABORT:5};function m(e,t){var i=document.createElement("canvas");return e&&(i.width=e),t&&(i.height=t),i.getContext("2d")}function _(e,t){var i=t.parentNode;i&&i.replaceChild(e,t)}function d(e){return e&&e.parentNode?e.parentNode.removeChild(e):null}function y(e){for(;e.lastChild;)e.removeChild(e.lastChild)}function w(e){return e[0]>0&&e[1]>0}function v(e,t,i){return i===void 0&&(i=[0,0]),i[0]=e[0]*t+.5|0,i[1]=e[1]*t+.5|0,i}function x(e,t){return Array.isArray(e)?e:(t===void 0?t=[e,e]:t[0]=t[1]=e,t)}var c=function(e){function t(i){e.call(this),this.highWaterMark=i!==void 0?i:2048,this.count_=0,this.entries_={},this.oldest_=null,this.newest_=null}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.canExpireCache=function(){return this.getCount()>this.highWaterMark},t.prototype.clear=function(){this.count_=0,this.entries_={},this.oldest_=null,this.newest_=null,this.dispatchEvent(a.CLEAR)},t.prototype.containsKey=function(r){return this.entries_.hasOwnProperty(r)},t.prototype.forEach=function(r,n){for(var s=this.oldest_;s;)r.call(n,s.value_,s.key_,this),s=s.newer},t.prototype.get=function(r){var n=this.entries_[r];return h(n!==void 0,15),n===this.newest_||(n===this.oldest_?(this.oldest_=this.oldest_.newer,this.oldest_.older=null):(n.newer.older=n.older,n.older.newer=n.newer),n.newer=null,n.older=this.newest_,this.newest_.newer=n,this.newest_=n),n.value_},t.prototype.remove=function(r){var n=this.entries_[r];return h(n!==void 0,15),n===this.newest_?(this.newest_=n.older,this.newest_&&(this.newest_.newer=null)):n===this.oldest_?(this.oldest_=n.newer,this.oldest_&&(this.oldest_.older=null)):(n.newer.older=n.older,n.older.newer=n.newer),delete this.entries_[r],--this.count_,n.value_},t.prototype.getCount=function(){return this.count_},t.prototype.getKeys=function(){var r=new Array(this.count_),n=0,s;for(s=this.newest_;s;s=s.older)r[n++]=s.key_;return r},t.prototype.getValues=function(){var r=new Array(this.count_),n=0,s;for(s=this.newest_;s;s=s.older)r[n++]=s.value_;return r},t.prototype.peekLast=function(){return this.oldest_.value_},t.prototype.peekLastKey=function(){return this.oldest_.key_},t.prototype.peekFirstKey=function(){return this.newest_.key_},t.prototype.pop=function(){var r=this.oldest_;return delete this.entries_[r.key_],r.newer&&(r.newer.older=null),this.oldest_=r.newer,this.oldest_||(this.newest_=null),--this.count_,r.value_},t.prototype.replace=function(r,n){this.get(r),this.entries_[r].value_=n},t.prototype.set=function(r,n){h(!(r in this.entries_),16);var s={key_:r,newer:null,older:this.newest_,value_:n};this.newest_?this.newest_.newer=s:this.oldest_=s,this.newest_=s,this.entries_[r]=s,++this.count_},t.prototype.setSize=function(r){this.highWaterMark=r},t.prototype.prune=function(){for(;this.canExpireCache();)this.pop()},t}(u);const Y=c;var o=function(t,i,r,n){this.minX=t,this.maxX=i,this.minY=r,this.maxY=n};o.prototype.contains=function(t){return this.containsXY(t[1],t[2])};o.prototype.containsTileRange=function(t){return this.minX<=t.minX&&t.maxX<=this.maxX&&this.minY<=t.minY&&t.maxY<=this.maxY};o.prototype.containsXY=function(t,i){return this.minX<=t&&t<=this.maxX&&this.minY<=i&&i<=this.maxY};o.prototype.equals=function(t){return this.minX==t.minX&&this.minY==t.minY&&this.maxX==t.maxX&&this.maxY==t.maxY};o.prototype.extend=function(t){t.minX<this.minX&&(this.minX=t.minX),t.maxX>this.maxX&&(this.maxX=t.maxX),t.minY<this.minY&&(this.minY=t.minY),t.maxY>this.maxY&&(this.maxY=t.maxY)};o.prototype.getHeight=function(){return this.maxY-this.minY+1};o.prototype.getSize=function(){return[this.getWidth(),this.getHeight()]};o.prototype.getWidth=function(){return this.maxX-this.minX+1};o.prototype.intersects=function(t){return this.minX<=t.maxX&&this.maxX>=t.minX&&this.minY<=t.maxY&&this.maxY>=t.minY};function X(e,t,i,r,n){return n!==void 0?(n.minX=e,n.maxX=t,n.minY=i,n.maxY=r,n):new o(e,t,i,r)}export{Y as L,f as T,y as a,_ as b,m as c,o as d,X as e,w as h,d as r,v as s,x as t};
