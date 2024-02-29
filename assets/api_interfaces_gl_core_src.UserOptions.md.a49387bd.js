import{_ as e,c as t,o as r,a}from"./app.8688f4f3.js";const y=JSON.parse('{"title":"Interface: UserOptions","description":"","frontmatter":{"sidebar":"auto","editLinks":false,"sidebarDepth":4},"headers":[{"level":2,"title":"Hierarchy","slug":"hierarchy","link":"#hierarchy","children":[]},{"level":2,"title":"Properties","slug":"properties","link":"#properties","children":[{"level":3,"title":"displayRange","slug":"displayrange","link":"#displayrange","children":[]},{"level":3,"title":"flipY","slug":"flipy","link":"#flipy","children":[]},{"level":3,"title":"heightSegments","slug":"heightsegments","link":"#heightsegments","children":[]},{"level":3,"title":"mask","slug":"mask","link":"#mask","children":[]},{"level":3,"title":"picking","slug":"picking","link":"#picking","children":[]},{"level":3,"title":"renderFrom","slug":"renderfrom","link":"#renderfrom","children":[]},{"level":3,"title":"renderType","slug":"rendertype","link":"#rendertype","children":[]},{"level":3,"title":"styleSpec","slug":"stylespec","link":"#stylespec","children":[]},{"level":3,"title":"widthSegments","slug":"widthsegments","link":"#widthsegments","children":[]},{"level":3,"title":"wireframe","slug":"wireframe","link":"#wireframe","children":[]}]}],"relativePath":"api/interfaces/gl_core_src.UserOptions.md","lastUpdated":null}'),d={name:"api/interfaces/gl_core_src.UserOptions.md"},n=a('<p><a href="./../">Class Docs</a> / <a href="./../modules/gl_core_src">gl-core/src</a> / UserOptions</p><h1 id="interface-useroptions" tabindex="-1">Interface: UserOptions <a class="header-anchor" href="#interface-useroptions">\xB6</a></h1><p><a href="./../modules/gl_core_src">gl-core/src</a>.UserOptions</p><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy">\xB6</a></h2><ul><li><p><strong><code>UserOptions</code></strong></p><p>\u21B3 <a href="./gl_core_src.BaseLayerOptions"><code>BaseLayerOptions</code></a></p></li></ul><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">\xB6</a></h2><h3 id="displayrange" tabindex="-1">displayRange <a class="header-anchor" href="#displayrange">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>displayRange</strong>: [<code>number</code>, <code>number</code>]</p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L64" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:64</a></p><hr><h3 id="flipy" tabindex="-1">flipY <a class="header-anchor" href="#flipy">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>flipY</strong>: <code>boolean</code></p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L69" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:69</a></p><hr><h3 id="heightsegments" tabindex="-1">heightSegments <a class="header-anchor" href="#heightsegments">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>heightSegments</strong>: <code>number</code></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L66" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:66</a></p><hr><h3 id="mask" tabindex="-1">mask <a class="header-anchor" href="#mask">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>mask</strong>: <code>Object</code></p><p>\u53EF\u4EE5\u4E3A\u4EFB\u610F GeoJSON \u6570\u636E</p><h4 id="type-declaration" tabindex="-1">Type declaration <a class="header-anchor" href="#type-declaration">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>Attributes</code>[]</td></tr><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><a href="./../enums/gl_core_src.MaskType"><code>MaskType</code></a></td></tr></tbody></table><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L78" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:78</a></p><hr><h3 id="picking" tabindex="-1">picking <a class="header-anchor" href="#picking">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>picking</strong>: <code>boolean</code></p><p>\u662F\u5426\u5F00\u542F\u62FE\u53D6</p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L74" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:74</a></p><hr><h3 id="renderfrom" tabindex="-1">renderFrom <a class="header-anchor" href="#renderfrom">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>renderFrom</strong>: <a href="./../enums/gl_core_src.RenderFrom"><code>RenderFrom</code></a></p><p>\u6307\u5B9A\u6E32\u67D3\u901A\u9053</p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L43" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:43</a></p><hr><h3 id="rendertype" tabindex="-1">renderType <a class="header-anchor" href="#rendertype">\xB6</a></h3><p>\u2022 <strong>renderType</strong>: <a href="./../enums/gl_core_src.RenderType"><code>RenderType</code></a></p><p>\u6E32\u67D3\u7C7B\u578B \u76EE\u524D\u652F\u6301\u4E09\u79CD\u7C7B\u578B\uFF1A 0\uFF1A\u666E\u901A raster \u74E6\u7247\u6E32\u67D3 1\uFF1A\u6C14\u8C61\u6570\u636E\u7684\u8272\u6591\u56FE\u6E32\u67D3 2\uFF1A\u98CE\u7B49 vector \u6570\u636E\u7684\u7C92\u5B50\u6E32\u67D3</p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L39" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:39</a></p><hr><h3 id="stylespec" tabindex="-1">styleSpec <a class="header-anchor" href="#stylespec">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>styleSpec</strong>: <code>Object</code></p><h4 id="type-declaration-1" tabindex="-1">Type declaration <a class="header-anchor" href="#type-declaration-1">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code>dropRate?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>dropRateBump?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>fadeOpacity?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>fill-color?</code></td><td style="text-align:left;"><code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>numParticles?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>opacity?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr><tr><td style="text-align:left;"><code>size?</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td><td style="text-align:left;">arrow size</td></tr><tr><td style="text-align:left;"><code>space?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">arrow space</td></tr><tr><td style="text-align:left;"><code>speedFactor?</code></td><td style="text-align:left;"><code>number</code> | <code>any</code>[]</td><td style="text-align:left;">-</td></tr></tbody></table><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L44" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:44</a></p><hr><h3 id="widthsegments" tabindex="-1">widthSegments <a class="header-anchor" href="#widthsegments">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>widthSegments</strong>: <code>number</code></p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L65" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:65</a></p><hr><h3 id="wireframe" tabindex="-1">wireframe <a class="header-anchor" href="#wireframe">\xB6</a></h3><p>\u2022 <code>Optional</code> <strong>wireframe</strong>: <code>boolean</code></p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/b27a903/packages/gl-core/src/renderer/index.ts#L67" target="_blank" rel="noreferrer">packages/gl-core/src/renderer/index.ts:67</a></p>',63),i=[n];function l(s,c,o,h,p,g){return r(),t("div",null,i)}const b=e(d,[["render",l]]);export{y as __pageData,b as default};
