function o(n,u){return n>u?1:n<u?-1:0}function v(n,u){return n.indexOf(u)>=0}function a(n,u,f){var r=n.length;if(n[0]<=u)return 0;if(u<=n[r-1])return r-1;var e;if(f>0){for(e=1;e<r;++e)if(n[e]<u)return e-1}else if(f<0){for(e=1;e<r;++e)if(n[e]<=u)return e}else for(e=1;e<r;++e){if(n[e]==u)return e;if(n[e]<u)return n[e-1]-u<u-n[e]?e-1:e}return r-1}function c(n,u,f){for(;u<f;){var r=n[u];n[u]=n[f],n[f]=r,++u,--f}}function i(n,u){for(var f=Array.isArray(u)?u:[u],r=f.length,e=0;e<r;e++)n[n.length]=f[e]}function h(n,u){var f=n.indexOf(u),r=f>-1;return r&&n.splice(f,1),r}function A(n,u){var f=n.length;if(f!==u.length)return!1;for(var r=0;r<f;r++)if(n[r]!==u[r])return!1;return!0}function x(n,u){var f=n.length,r=Array(n.length),e;for(e=0;e<f;e++)r[e]={index:e,value:n[e]};for(r.sort(function(t,s){return u(t.value,s.value)||t.index-s.index}),e=0;e<n.length;e++)n[e]=r[e].value}function p(n,u,f){var r=u||o;return n.every(function(e,t){if(t===0)return!0;var s=r(n[t-1],e);return!(s>0||f&&s===0)})}var O=42,d=256;function l(n){return Math.pow(n,3)}function m(n){return 1-l(1-n)}function y(n){return 3*n*n-2*n*n*n}function S(n){return n}export{d as D,m as a,c as b,a as c,i as d,A as e,y as f,l as g,p as h,v as i,O as j,S as l,o as n,h as r,x as s};
