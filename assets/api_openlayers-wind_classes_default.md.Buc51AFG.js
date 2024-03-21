import{h as e,c as t,a,a8 as r}from"./chunks/framework.Xvg5rpFv.js";const g=JSON.parse('{"title":"Class: default","description":"","frontmatter":{},"headers":[],"relativePath":"api/openlayers-wind/classes/default.md","filePath":"api/openlayers-wind/classes/default.md","lastUpdated":null}'),d={name:"api/openlayers-wind/classes/default.md"},n=r('<h1 id="class-default" tabindex="-1">Class: default <a class="header-anchor" href="#class-default">¶</a></h1><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy">¶</a></h2><ul><li><p><code>Image</code></p><p>↳ <strong><code>default</code></strong></p></li></ul><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents">¶</a></h2><h3 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">¶</a></h3><ul><li><a href="./default.html#constructor">constructor</a></li></ul><h3 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">¶</a></h3><ul><li><a href="./default.html#viewprojection">viewProjection</a></li><li><a href="./default.html#pixelratio">pixelRatio</a></li></ul><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">¶</a></h3><ul><li><a href="./default.html#appendto">appendTo</a></li><li><a href="./default.html#start">start</a></li><li><a href="./default.html#stop">stop</a></li><li><a href="./default.html#canvasfunction">canvasFunction</a></li><li><a href="./default.html#project">project</a></li><li><a href="./default.html#unproject">unproject</a></li><li><a href="./default.html#intersectscoordinate">intersectsCoordinate</a></li><li><a href="./default.html#getdata">getData</a></li><li><a href="./default.html#setdata">setData</a></li><li><a href="./default.html#updateparams">updateParams</a></li><li><a href="./default.html#getparams">getParams</a></li><li><a href="./default.html#setwindoptions">setWindOptions</a></li><li><a href="./default.html#getwindoptions">getWindOptions</a></li><li><a href="./default.html#setmap">setMap</a></li><li><a href="./default.html#getmap">getMap</a></li><li><a href="./default.html#gettype">getType</a></li></ul><h2 id="constructors-1" tabindex="-1">Constructors <a class="header-anchor" href="#constructors-1">¶</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">¶</a></h3><p>• <strong>new default</strong>(<code>data</code>, <code>options?</code>): <a href="./default.html"><code>default</code></a></p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<a href="./../interfaces/IWindOptions.html"><code>IWindOptions</code></a>&gt;</td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">¶</a></h4><p><a href="./default.html"><code>default</code></a></p><h4 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides">¶</a></h4><p>ol.layer.Image.constructor</p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L43" target="_blank" rel="noreferrer">openlayers/src/index.ts:43</a></p><h2 id="properties-1" tabindex="-1">Properties <a class="header-anchor" href="#properties-1">¶</a></h2><h3 id="viewprojection" tabindex="-1">viewProjection <a class="header-anchor" href="#viewprojection">¶</a></h3><p>• <strong>viewProjection</strong>: <code>ProjectionLike</code></p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L39" target="_blank" rel="noreferrer">openlayers/src/index.ts:39</a></p><hr><h3 id="pixelratio" tabindex="-1">pixelRatio <a class="header-anchor" href="#pixelratio">¶</a></h3><p>• <strong>pixelRatio</strong>: <code>number</code></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L40" target="_blank" rel="noreferrer">openlayers/src/index.ts:40</a></p><h2 id="methods-1" tabindex="-1">Methods <a class="header-anchor" href="#methods-1">¶</a></h2><h3 id="appendto" tabindex="-1">appendTo <a class="header-anchor" href="#appendto">¶</a></h3><p>▸ <strong>appendTo</strong>(<code>map</code>): <code>void</code></p><p>append layer to map</p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>Map</code></td></tr></tbody></table><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">¶</a></h4><p><code>void</code></p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L91" target="_blank" rel="noreferrer">openlayers/src/index.ts:91</a></p><hr><h3 id="start" tabindex="-1">start <a class="header-anchor" href="#start">¶</a></h3><p>▸ <strong>start</strong>(): <code>void</code></p><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">¶</a></h4><p><code>void</code></p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L99" target="_blank" rel="noreferrer">openlayers/src/index.ts:99</a></p><hr><h3 id="stop" tabindex="-1">stop <a class="header-anchor" href="#stop">¶</a></h3><p>▸ <strong>stop</strong>(): <code>void</code></p><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">¶</a></h4><p><code>void</code></p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L105" target="_blank" rel="noreferrer">openlayers/src/index.ts:105</a></p><hr><h3 id="canvasfunction" tabindex="-1">canvasFunction <a class="header-anchor" href="#canvasfunction">¶</a></h3><p>▸ <strong>canvasFunction</strong>(<code>extent</code>, <code>resolution</code>, <code>pixelRatio</code>, <code>size</code>, <code>proj</code>): <code>HTMLCanvasElement</code></p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>extent</code></td><td style="text-align:left;"><code>Extent</code></td></tr><tr><td style="text-align:left;"><code>resolution</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>pixelRatio</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>size</code></td><td style="text-align:left;"><code>Size</code></td></tr><tr><td style="text-align:left;"><code>proj</code></td><td style="text-align:left;"><code>Projection</code></td></tr></tbody></table><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">¶</a></h4><p><code>HTMLCanvasElement</code></p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L111" target="_blank" rel="noreferrer">openlayers/src/index.ts:111</a></p><hr><h3 id="project" tabindex="-1">project <a class="header-anchor" href="#project">¶</a></h3><p>▸ <strong>project</strong>(<code>coordinate</code>): [<code>number</code>, <code>number</code>]</p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coordinate</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">¶</a></h4><p>[<code>number</code>, <code>number</code>]</p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L174" target="_blank" rel="noreferrer">openlayers/src/index.ts:174</a></p><hr><h3 id="unproject" tabindex="-1">unproject <a class="header-anchor" href="#unproject">¶</a></h3><p>▸ <strong>unproject</strong>(<code>pixel</code>): [<code>number</code>, <code>number</code>]</p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>pixel</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">¶</a></h4><p>[<code>number</code>, <code>number</code>]</p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L182" target="_blank" rel="noreferrer">openlayers/src/index.ts:182</a></p><hr><h3 id="intersectscoordinate" tabindex="-1">intersectsCoordinate <a class="header-anchor" href="#intersectscoordinate">¶</a></h3><p>▸ <strong>intersectsCoordinate</strong>(<code>coordinate</code>): <code>boolean</code></p><p>TODO: 空间判断出错，需要修复</p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coordinate</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">¶</a></h4><p><code>boolean</code></p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L192" target="_blank" rel="noreferrer">openlayers/src/index.ts:192</a></p><hr><h3 id="getdata" tabindex="-1">getData <a class="header-anchor" href="#getdata">¶</a></h3><p>▸ <strong>getData</strong>(): <code>undefined</code> | <a href="./Field.html"><code>Field</code></a></p><p>get wind layer data</p><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">¶</a></h4><p><code>undefined</code> | <a href="./Field.html"><code>Field</code></a></p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L222" target="_blank" rel="noreferrer">openlayers/src/index.ts:222</a></p><hr><h3 id="setdata" tabindex="-1">setData <a class="header-anchor" href="#setdata">¶</a></h3><p>▸ <strong>setData</strong>(<code>data</code>, <code>options?</code>): <a href="./default.html"><code>default</code></a></p><p>set layer data</p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>IField</code>&gt;</td></tr></tbody></table><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">¶</a></h4><p><a href="./default.html"><code>default</code></a></p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L232" target="_blank" rel="noreferrer">openlayers/src/index.ts:232</a></p><hr><h3 id="updateparams" tabindex="-1">updateParams <a class="header-anchor" href="#updateparams">¶</a></h3><p>▸ <strong>updateParams</strong>(<code>options?</code>): <a href="./default.html"><code>default</code></a></p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>IOptions</code>&gt;</td></tr></tbody></table><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">¶</a></h4><p><a href="./default.html"><code>default</code></a></p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L251" target="_blank" rel="noreferrer">openlayers/src/index.ts:251</a></p><hr><h3 id="getparams" tabindex="-1">getParams <a class="header-anchor" href="#getparams">¶</a></h3><p>▸ <strong>getParams</strong>(): <code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">¶</a></h4><p><code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L257" target="_blank" rel="noreferrer">openlayers/src/index.ts:257</a></p><hr><h3 id="setwindoptions" tabindex="-1">setWindOptions <a class="header-anchor" href="#setwindoptions">¶</a></h3><p>▸ <strong>setWindOptions</strong>(<code>options</code>): <code>void</code></p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>IOptions</code>&gt;</td></tr></tbody></table><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">¶</a></h4><p><code>void</code></p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L262" target="_blank" rel="noreferrer">openlayers/src/index.ts:262</a></p><hr><h3 id="getwindoptions" tabindex="-1">getWindOptions <a class="header-anchor" href="#getwindoptions">¶</a></h3><p>▸ <strong>getWindOptions</strong>(): <code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">¶</a></h4><p><code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L274" target="_blank" rel="noreferrer">openlayers/src/index.ts:274</a></p><hr><h3 id="setmap" tabindex="-1">setMap <a class="header-anchor" href="#setmap">¶</a></h3><p>▸ <strong>setMap</strong>(<code>map</code>): <code>void</code></p><p>set map</p><h4 id="parameters-9" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-9">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>Map</code></td></tr></tbody></table><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14">¶</a></h4><p><code>void</code></p><h4 id="overrides-1" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-1">¶</a></h4><p>ol.layer.Image.setMap</p><h4 id="defined-in-16" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-16">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L294" target="_blank" rel="noreferrer">openlayers/src/index.ts:294</a></p><hr><h3 id="getmap" tabindex="-1">getMap <a class="header-anchor" href="#getmap">¶</a></h3><p>▸ <strong>getMap</strong>(): <code>any</code></p><p>get map</p><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15">¶</a></h4><p><code>any</code></p><h4 id="defined-in-17" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-17">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L306" target="_blank" rel="noreferrer">openlayers/src/index.ts:306</a></p><hr><h3 id="gettype" tabindex="-1">getType <a class="header-anchor" href="#gettype">¶</a></h3><p>▸ <strong>getType</strong>(): <code>string</code></p><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16">¶</a></h4><p><code>string</code></p><h4 id="defined-in-18" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-18">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/openlayers/src/index.ts#L310" target="_blank" rel="noreferrer">openlayers/src/index.ts:310</a></p>',169),s=[n];function o(i,h,l,c,p,f){return a(),t("div",null,s)}const m=e(d,[["render",o]]);export{g as __pageData,m as default};
