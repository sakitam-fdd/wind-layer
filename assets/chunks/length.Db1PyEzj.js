function L(r,n,q,c){for(var g=r[n],h=r[n+1],p=0,v=n+c;v<q;v+=c){var a=r[v],u=r[v+1];p+=Math.sqrt((a-g)*(a-g)+(u-h)*(u-h)),g=a,h=u}return p}export{L as l};
