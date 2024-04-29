import{U as R,P as B,M as w}from"./Projection.Bg0YEavu.js";function ta(){return function(){throw new Error("Unimplemented abstract method.")}()}var vr=0;function ea(r){return r.ol_uid||(r.ol_uid=String(++vr))}var tr="6.15.1",er=function(){var r=function(a,n){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var s in u)Object.prototype.hasOwnProperty.call(u,s)&&(f[s]=u[s])},r(a,n)};return function(a,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");r(a,n);function f(){this.constructor=a}a.prototype=n===null?Object.create(n):(f.prototype=n.prototype,new f)}}(),lr=function(r){er(a,r);function a(n){var f=this,u="v"+tr.split("-")[0],s="Assertion failed. See https://openlayers.org/en/"+u+"/doc/errors/#"+n+" for details.";return f=r.call(this,s)||this,f.code=n,f.name="AssertionError",f.message=s,f}return a}(Error);const hr=lr;function gr(r,a){if(!r)throw new hr(a)}const g={UNKNOWN:0,INTERSECTING:1,ABOVE:2,RIGHT:4,BELOW:8,LEFT:16};function la(r){for(var a=b(),n=0,f=r.length;n<f;++n)Mr(a,r[n]);return a}function Er(r,a,n){var f=Math.min.apply(null,r),u=Math.min.apply(null,a),s=Math.max.apply(null,r),i=Math.max.apply(null,a);return L(f,u,s,i,n)}function ha(r,a,n){return n?(n[0]=r[0]-a,n[1]=r[1]-a,n[2]=r[2]+a,n[3]=r[3]+a,n):[r[0]-a,r[1]-a,r[2]+a,r[3]+a]}function ga(r,a){return a?(a[0]=r[0],a[1]=r[1],a[2]=r[2],a[3]=r[3],a):r.slice()}function Ea(r,a,n){var f,u;return a<r[0]?f=r[0]-a:r[2]<a?f=a-r[2]:f=0,n<r[1]?u=r[1]-n:r[3]<n?u=n-r[3]:u=0,f*f+u*u}function da(r,a){return dr(r,a[0],a[1])}function Ma(r,a){return r[0]<=a[0]&&a[2]<=r[2]&&r[1]<=a[1]&&a[3]<=r[3]}function dr(r,a,n){return r[0]<=a&&a<=r[2]&&r[1]<=n&&n<=r[3]}function K(r,a){var n=r[0],f=r[1],u=r[2],s=r[3],i=a[0],o=a[1],c=g.UNKNOWN;return i<n?c=c|g.LEFT:i>u&&(c=c|g.RIGHT),o<f?c=c|g.BELOW:o>s&&(c=c|g.ABOVE),c===g.UNKNOWN&&(c=g.INTERSECTING),c}function b(){return[1/0,1/0,-1/0,-1/0]}function L(r,a,n,f,u){return u?(u[0]=r,u[1]=a,u[2]=n,u[3]=f,u):[r,a,n,f]}function k(r){return L(1/0,1/0,-1/0,-1/0,r)}function Pa(r,a){var n=r[0],f=r[1];return L(n,f,n,f,a)}function Sa(r,a,n,f,u){var s=k(u);return Pr(s,r,a,n,f)}function wa(r,a){return r[0]==a[0]&&r[2]==a[2]&&r[1]==a[1]&&r[3]==a[3]}function ya(r,a){return a[0]<r[0]&&(r[0]=a[0]),a[2]>r[2]&&(r[2]=a[2]),a[1]<r[1]&&(r[1]=a[1]),a[3]>r[3]&&(r[3]=a[3]),r}function Mr(r,a){a[0]<r[0]&&(r[0]=a[0]),a[0]>r[2]&&(r[2]=a[0]),a[1]<r[1]&&(r[1]=a[1]),a[1]>r[3]&&(r[3]=a[1])}function Pr(r,a,n,f,u){for(;n<f;n+=u)Sr(r,a[n],a[n+1]);return r}function Sr(r,a,n){r[0]=Math.min(r[0],a),r[1]=Math.min(r[1],n),r[2]=Math.max(r[2],a),r[3]=Math.max(r[3],n)}function Ta(r,a){var n;return n=a(p(r)),n||(n=a(j(r)),n)||(n=a(rr(r)),n)||(n=a(x(r)),n)?n:!1}function ma(r){var a=0;return Ur(r)||(a=M(r)*Tr(r)),a}function p(r){return[r[0],r[1]]}function j(r){return[r[2],r[1]]}function wr(r){return[(r[0]+r[2])/2,(r[1]+r[3])/2]}function Ua(r,a){var n;return a==="bottom-left"?n=p(r):a==="bottom-right"?n=j(r):a==="top-left"?n=x(r):a==="top-right"?n=rr(r):gr(!1,13),n}function Oa(r,a,n,f,u){var s=yr(r,a,n,f),i=s[0],o=s[1],c=s[2],t=s[3],v=s[4],h=s[5],e=s[6],l=s[7];return L(Math.min(i,c,v,e),Math.min(o,t,h,l),Math.max(i,c,v,e),Math.max(o,t,h,l),u)}function yr(r,a,n,f){var u=a*f[0]/2,s=a*f[1]/2,i=Math.cos(n),o=Math.sin(n),c=u*i,t=u*o,v=s*i,h=s*o,e=r[0],l=r[1];return[e-c+h,l-t-v,e-c-h,l-t+v,e+c-h,l+t+v,e+c+h,l+t-v,e-c+h,l-t-v]}function Tr(r){return r[3]-r[1]}function Ra(r,a,n){var f=n||b();return mr(r,a)?(r[0]>a[0]?f[0]=r[0]:f[0]=a[0],r[1]>a[1]?f[1]=r[1]:f[1]=a[1],r[2]<a[2]?f[2]=r[2]:f[2]=a[2],r[3]<a[3]?f[3]=r[3]:f[3]=a[3]):k(f),f}function x(r){return[r[0],r[3]]}function rr(r){return[r[2],r[3]]}function M(r){return r[2]-r[0]}function mr(r,a){return r[0]<=a[2]&&r[2]>=a[0]&&r[1]<=a[3]&&r[3]>=a[1]}function Ur(r){return r[2]<r[0]||r[3]<r[1]}function Ca(r,a){return a?(a[0]=r[0],a[1]=r[1],a[2]=r[2],a[3]=r[3],a):r}function Ga(r,a,n){var f=!1,u=K(r,a),s=K(r,n);if(u===g.INTERSECTING||s===g.INTERSECTING)f=!0;else{var i=r[0],o=r[1],c=r[2],t=r[3],v=a[0],h=a[1],e=n[0],l=n[1],A=(l-h)/(e-v),y=void 0,T=void 0;s&g.ABOVE&&!(u&g.ABOVE)&&(y=e-(l-t)/A,f=y>=i&&y<=c),!f&&s&g.RIGHT&&!(u&g.RIGHT)&&(T=l-(e-c)*A,f=T>=o&&T<=t),!f&&s&g.BELOW&&!(u&g.BELOW)&&(y=e-(l-o)/A,f=y>=i&&y<=c),!f&&s&g.LEFT&&!(u&g.LEFT)&&(T=l-(e-i)*A,f=T>=o&&T<=t)}return f}function Or(r,a,n,f){var u=[];if(f>1)for(var s=r[2]-r[0],i=r[3]-r[1],o=0;o<f;++o)u.push(r[0]+s*o/f,r[1],r[2],r[1]+i*o/f,r[2]-s*o/f,r[3],r[0],r[3]-i*o/f);else u=[r[0],r[1],r[2],r[1],r[2],r[3],r[0],r[3]];a(u,u,2);for(var c=[],t=[],o=0,v=u.length;o<v;o+=2)c.push(u[o]),t.push(u[o+1]);return Er(c,t,n)}function Rr(r,a){var n=a.getExtent(),f=wr(r);if(a.canWrapX()&&(f[0]<n[0]||f[0]>=n[2])){var u=M(n),s=Math.floor((f[0]-n[0])/u),i=s*u;r[0]-=i,r[2]-=i}return r}function Ia(r,a){if(a.canWrapX()){var n=a.getExtent();if(!isFinite(r[0])||!isFinite(r[2]))return[[n[0],r[1],n[2],r[3]]];Rr(r,a);var f=M(n);if(M(r)>f)return[[n[0],r[1],n[2],r[3]]];if(r[0]<n[0])return[[r[0]+f,r[1],n[2],r[3]],[n[0],r[1],r[2],r[3]]];if(r[2]>n[2])return[[r[0],r[1],n[2],r[3]],[n[0],r[1],r[2]-f,r[3]]]}return[r]}function J(r,a,n){return Math.min(Math.max(r,a),n)}var Cr=function(){var r;return"cosh"in Math?r=Math.cosh:r=function(a){var n=Math.exp(a);return(n+1/n)/2},r}(),Aa=function(){var r;return"log2"in Math?r=Math.log2:r=function(a){return Math.log(a)*Math.LOG2E},r}();function Na(r,a,n,f,u,s){var i=u-n,o=s-f;if(i!==0||o!==0){var c=((r-n)*i+(a-f)*o)/(i*i+o*o);c>1?(n=u,f=s):c>0&&(n+=i*c,f+=o*c)}return Gr(r,a,n,f)}function Gr(r,a,n,f){var u=n-r,s=f-a;return u*u+s*s}function Fa(r){for(var a=r.length,n=0;n<a;n++){for(var f=n,u=Math.abs(r[n][n]),s=n+1;s<a;s++){var i=Math.abs(r[s][n]);i>u&&(u=i,f=s)}if(u===0)return null;var o=r[f];r[f]=r[n],r[n]=o;for(var c=n+1;c<a;c++)for(var t=-r[c][n]/r[n][n],v=n;v<a+1;v++)n==v?r[c][v]=0:r[c][v]+=t*r[n][v]}for(var h=new Array(a),e=a-1;e>=0;e--){h[e]=r[e][a]/r[e][e];for(var l=e-1;l>=0;l--)r[l][a]-=r[l][e]*h[e]}return h}function $(r){return r*Math.PI/180}function Ir(r,a){var n=r%a;return n*a<0?n+a:n}function La(r,a,n){return r+n*(a-r)}function ar(r,a){var n=Math.pow(10,a);return Math.round(r*n)/n}function _a(r,a){return Math.floor(ar(r,a))}function $a(r,a){return Math.ceil(ar(r,a))}function Wa(r,a){return r[0]+=+a[0],r[1]+=+a[1],r}function Ar(r,a){for(var n=!0,f=r.length-1;f>=0;--f)if(r[f]!=a[f]){n=!1;break}return n}function Da(r,a){var n=Math.cos(a),f=Math.sin(a),u=r[0]*n-r[1]*f,s=r[1]*n+r[0]*f;return r[0]=u,r[1]=s,r}function qa(r,a){return r[0]*=a,r[1]*=a,r}function Ba(r,a){if(a.canWrapX()){var n=M(a.getExtent()),f=nr(r,a,n);f&&(r[0]-=f*n)}return r}function nr(r,a,n){var f=a.getExtent(),u=0;if(a.canWrapX()&&(r[0]<f[0]||r[0]>f[2])){var s=n||M(f);u=Math.floor((r[0]-f[0])/s)}return u}var Nr=function(){var r=function(a,n){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var s in u)Object.prototype.hasOwnProperty.call(u,s)&&(f[s]=u[s])},r(a,n)};return function(a,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");r(a,n);function f(){this.constructor=a}a.prototype=n===null?Object.create(n):(f.prototype=n.prototype,new f)}}(),C=6378137,U=Math.PI*C,Fr=[-U,-U,U,U],Lr=[-180,-85,180,85],N=C*Math.log(Math.tan(Math.PI/2)),m=function(r){Nr(a,r);function a(n){return r.call(this,{code:n,units:R.METERS,extent:Fr,global:!0,worldExtent:Lr,getPointResolution:function(f,u){return f/Cr(u[1]/C)}})||this}return a}(B),z=[new m("EPSG:3857"),new m("EPSG:102100"),new m("EPSG:102113"),new m("EPSG:900913"),new m("http://www.opengis.net/def/crs/EPSG/0/3857"),new m("http://www.opengis.net/gml/srs/epsg.xml#3857")];function _r(r,a,n){var f=r.length,u=n>1?n:2,s=a;s===void 0&&(u>2?s=r.slice():s=new Array(f));for(var i=0;i<f;i+=u){s[i]=U*r[i]/180;var o=C*Math.log(Math.tan(Math.PI*(+r[i+1]+90)/360));o>N?o=N:o<-N&&(o=-N),s[i+1]=o}return s}function $r(r,a,n){var f=r.length,u=n>1?n:2,s=a;s===void 0&&(u>2?s=r.slice():s=new Array(f));for(var i=0;i<f;i+=u)s[i]=180*r[i]/U,s[i+1]=360*Math.atan(Math.exp(r[i+1]/C))/Math.PI-90;return s}var Wr=function(){var r=function(a,n){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(f,u){f.__proto__=u}||function(f,u){for(var s in u)Object.prototype.hasOwnProperty.call(u,s)&&(f[s]=u[s])},r(a,n)};return function(a,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");r(a,n);function f(){this.constructor=a}a.prototype=n===null?Object.create(n):(f.prototype=n.prototype,new f)}}(),Dr=6378137,Z=[-180,-90,180,90],qr=Math.PI*Dr/180,P=function(r){Wr(a,r);function a(n,f){return r.call(this,{code:n,units:R.DEGREES,extent:Z,axisOrientation:f,global:!0,metersPerUnit:qr,worldExtent:Z})||this}return a}(B),Q=[new P("CRS:84"),new P("EPSG:4326","neu"),new P("urn:ogc:def:crs:OGC:1.3:CRS84"),new P("urn:ogc:def:crs:OGC:2:84"),new P("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),new P("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new P("http://www.opengis.net/def/crs/EPSG/0/4326","neu")],F={};function Br(){F={}}function Xr(r){return F[r]||F[r.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/,"EPSG:$3")]||null}function Hr(r,a){F[r]=a}var S={};function Vr(){S={}}function O(r,a,n){var f=r.getCode(),u=a.getCode();f in S||(S[f]={}),S[f][u]=n}function Kr(r,a){var n;return r in S&&a in S[r]&&(n=S[r][a]),n}var Jr=63710088e-1;function Y(r,a,n){var f=n||Jr,u=$(r[1]),s=$(a[1]),i=(s-u)/2,o=$(a[0]-r[0])/2,c=Math.sin(i)*Math.sin(i)+Math.sin(o)*Math.sin(o)*Math.cos(u)*Math.cos(s);return 2*f*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))}var W=!0;function fr(r){var a=r===void 0?!0:r;W=!a}function _(r,a,n){var f;if(a!==void 0){for(var u=0,s=r.length;u<s;++u)a[u]=r[u];f=a}else f=r.slice();return f}function X(r,a,n){if(a!==void 0&&r!==a){for(var f=0,u=r.length;f<u;++f)a[f]=r[f];r=a}return r}function ur(r){Hr(r.getCode(),r),O(r,r,_)}function sr(r){r.forEach(ur)}function d(r){return typeof r=="string"?Xr(r):r||null}function zr(r,a,n,f){r=d(r);var u,s=r.getPointResolutionFunc();if(s){if(u=s(a,n),f&&f!==r.getUnits()){var i=r.getMetersPerUnit();i&&(u=u*i/w[f])}}else{var o=r.getUnits();if(o==R.DEGREES&&!f||f==R.DEGREES)u=a;else{var c=G(r,d("EPSG:4326"));if(c===X&&o!==R.DEGREES)u=a*r.getMetersPerUnit();else{var t=[n[0]-a/2,n[1],n[0]+a/2,n[1],n[0],n[1]-a/2,n[0],n[1]+a/2];t=c(t,t,2);var v=Y(t.slice(0,2),t.slice(2,4)),h=Y(t.slice(4,6),t.slice(6,8));u=(v+h)/2}var i=f?w[f]:r.getMetersPerUnit();i!==void 0&&(u/=i)}}return u}function D(r){sr(r),r.forEach(function(a){r.forEach(function(n){a!==n&&O(a,n,_)})})}function ir(r,a,n,f){r.forEach(function(u){a.forEach(function(s){O(u,s,n),O(s,u,f)})})}function Zr(){Br(),Vr()}function Qr(r,a){return r?typeof r=="string"?d(r):r:d(a)}function q(r){return function(a,n,f){for(var u=a.length,s=f!==void 0?f:2,i=n!==void 0?n:new Array(u),o=0;o<u;o+=s)for(var c=r(a.slice(o,o+s)),t=c.length,v=0,h=s;v<h;++v)i[o+v]=v>=t?a[o+v]:c[v];return i}}function Yr(r,a,n,f){var u=d(r),s=d(a);O(u,s,q(n)),O(s,u,q(f))}function br(r,a){return fr(),I(r,"EPSG:4326",a!==void 0?a:"EPSG:3857")}function kr(r,a){var n=I(r,a!==void 0?a:"EPSG:3857","EPSG:4326"),f=n[0];return(f<-180||f>180)&&(n[0]=Ir(f+180,360)-180),n}function pr(r,a){if(r===a)return!0;var n=r.getUnits()===a.getUnits();if(r.getCode()===a.getCode())return n;var f=G(r,a);return f===_&&n}function G(r,a){var n=r.getCode(),f=a.getCode(),u=Kr(n,f);return u||(u=X),u}function H(r,a){var n=d(r),f=d(a);return G(n,f)}function I(r,a,n){var f=H(a,n);return f(r,void 0,r.length)}function V(r,a,n,f){var u=H(a,n);return Or(r,u,void 0,f)}function jr(r,a,n){var f=G(a,n);return f(r)}var E=null;function or(r){E=d(r)}function xr(){E=null}function ra(){return E}function aa(){or("EPSG:4326")}function na(r,a){return E?I(r,a,E):r}function fa(r,a){return E?I(r,E,a):(W&&!Ar(r,[0,0])&&r[0]>=-180&&r[0]<=180&&r[1]>=-90&&r[1]<=90&&(W=!1,console.warn("Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates.")),r)}function ua(r,a){return E?V(r,a,E):r}function sa(r,a){return E?V(r,E,a):r}function ia(r,a){if(!E)return r;var n=d(a).getUnits(),f=E.getUnits();return n&&f?r*w[n]/w[f]:r}function oa(r,a){if(!E)return r;var n=d(a).getUnits(),f=E.getUnits();return n&&f?r*w[f]/w[n]:r}function ca(r,a,n){return function(f){var u,s;if(r.canWrapX()){var i=r.getExtent(),o=M(i);f=f.slice(0),s=nr(f,r,o),s&&(f[0]=f[0]-s*o),f[0]=J(f[0],i[0],i[2]),f[1]=J(f[1],i[1],i[3]),u=n(f)}else u=n(f);return s&&a.canWrapX()&&(u[0]+=s*M(a.getExtent())),u}}function cr(){D(z),D(Q),ir(Q,z,_r,$r)}cr();const Xa=Object.freeze(Object.defineProperty({__proto__:null,METERS_PER_UNIT:w,Projection:B,addCommon:cr,addCoordinateTransforms:Yr,addEquivalentProjections:D,addEquivalentTransforms:ir,addProjection:ur,addProjections:sr,clearAllProjections:Zr,clearUserProjection:xr,cloneTransform:_,createProjection:Qr,createSafeCoordinateTransform:ca,createTransformFromCoordinateTransform:q,disableCoordinateWarning:fr,equivalent:pr,fromLonLat:br,fromUserCoordinate:fa,fromUserExtent:sa,fromUserResolution:oa,get:d,getPointResolution:zr,getTransform:H,getTransformFromProjections:G,getUserProjection:ra,identityTransform:X,setUserProjection:or,toLonLat:kr,toUserCoordinate:na,toUserExtent:ua,toUserResolution:ia,transform:I,transformExtent:V,transformWithProjections:jr,useGeographic:aa},Symbol.toStringTag,{value:"Module"}));export{Mr as $,hr as A,ra as B,Gr as C,La as D,Ea as E,Pa as F,dr as G,b as H,Ca as I,d as J,H as K,Sa as L,Na as M,Ta as N,Pr as O,mr as P,Ma as Q,Ga as R,da as S,yr as T,x as U,rr as V,j as W,p as X,Aa as Y,ma as Z,la as _,ta as a,ya as a0,Fa as a1,I as a2,zr as a3,L as a4,$a as a5,_a as a6,Ua as a7,pr as a8,ur as a9,Kr as aa,D as ab,Yr as ac,ca as ad,K as ae,g as af,ha as ag,Rr as ah,ia as ai,G as aj,Ia as ak,Xa as al,gr as b,ea as c,Ra as d,Oa as e,fa as f,M as g,wa as h,Ur as i,k as j,ga as k,J as l,Tr as m,$ as n,Qr as o,fr as p,sa as q,Da as r,qa as s,na as t,Ir as u,Wa as v,Ba as w,ua as x,wr as y,Ar as z};