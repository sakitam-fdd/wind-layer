import{_ as e,c as t,o as a,ab as d}from"./chunks/framework.BBlJMq6K.js";const b=JSON.parse('{"title":"Class: default","description":"","frontmatter":{},"headers":[],"relativePath":"api/particles-poc/classes/default.md","filePath":"api/particles-poc/classes/default.md","lastUpdated":null}'),r={name:"api/particles-poc/classes/default.md"},n=d('<h1 id="class-default" tabindex="-1">Class: default <a class="header-anchor" href="#class-default">¶</a></h1><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents">¶</a></h2><h3 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">¶</a></h3><ul><li><a href="./default.html#constructor">constructor</a></li></ul><h3 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">¶</a></h3><ul><li><a href="./default.html#id">id</a></li><li><a href="./default.html#type">type</a></li><li><a href="./default.html#renderingmode">renderingMode</a></li><li><a href="./default.html#options">options</a></li><li><a href="./default.html#map">map</a></li><li><a href="./default.html#winddata">windData</a></li></ul><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">¶</a></h3><ul><li><a href="./default.html#updateoptions">updateOptions</a></li><li><a href="./default.html#initializeparticles">initializeParticles</a></li><li><a href="./default.html#setwind">setWind</a></li><li><a href="./default.html#onadd">onAdd</a></li><li><a href="./default.html#initialize">initialize</a></li><li><a href="./default.html#movestart">moveStart</a></li><li><a href="./default.html#moveend">moveEnd</a></li><li><a href="./default.html#getextent">getExtent</a></li><li><a href="./default.html#getsize">getSize</a></li><li><a href="./default.html#zoom">zoom</a></li><li><a href="./default.html#reset">reset</a></li><li><a href="./default.html#resize">resize</a></li><li><a href="./default.html#onremove">onRemove</a></li><li><a href="./default.html#update">update</a></li><li><a href="./default.html#drawtexture">drawTexture</a></li><li><a href="./default.html#drawscreen">drawScreen</a></li><li><a href="./default.html#drawparticles">drawParticles</a></li><li><a href="./default.html#prerender">prerender</a></li><li><a href="./default.html#render">render</a></li></ul><h2 id="constructors-1" tabindex="-1">Constructors <a class="header-anchor" href="#constructors-1">¶</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">¶</a></h3><p>• <strong>new default</strong>(<code>id</code>, <code>options?</code>): <a href="./default.html"><code>default</code></a></p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>id</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>ParticlesLayerOptions</code>&gt;</td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">¶</a></h4><p><a href="./default.html"><code>default</code></a></p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L182" target="_blank" rel="noreferrer">index.ts:182</a></p><h2 id="properties-1" tabindex="-1">Properties <a class="header-anchor" href="#properties-1">¶</a></h2><h3 id="id" tabindex="-1">id <a class="header-anchor" href="#id">¶</a></h3><p>• <strong>id</strong>: <code>string</code></p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L151" target="_blank" rel="noreferrer">index.ts:151</a></p><hr><h3 id="type" tabindex="-1">type <a class="header-anchor" href="#type">¶</a></h3><p>• <strong>type</strong>: <code>string</code> = <code>&#39;custom&#39;</code></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L152" target="_blank" rel="noreferrer">index.ts:152</a></p><hr><h3 id="renderingmode" tabindex="-1">renderingMode <a class="header-anchor" href="#renderingmode">¶</a></h3><p>• <strong>renderingMode</strong>: <code>&quot;2d&quot;</code> | <code>&quot;3d&quot;</code> = <code>&#39;2d&#39;</code></p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L153" target="_blank" rel="noreferrer">index.ts:153</a></p><hr><h3 id="options" tabindex="-1">options <a class="header-anchor" href="#options">¶</a></h3><p>• <strong>options</strong>: <code>ParticlesLayerOptions</code></p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L154" target="_blank" rel="noreferrer">index.ts:154</a></p><hr><h3 id="map" tabindex="-1">map <a class="header-anchor" href="#map">¶</a></h3><p>• <strong>map</strong>: <code>any</code></p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L155" target="_blank" rel="noreferrer">index.ts:155</a></p><hr><h3 id="winddata" tabindex="-1">windData <a class="header-anchor" href="#winddata">¶</a></h3><p>• <strong>windData</strong>: <code>any</code></p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L156" target="_blank" rel="noreferrer">index.ts:156</a></p><h2 id="methods-1" tabindex="-1">Methods <a class="header-anchor" href="#methods-1">¶</a></h2><h3 id="updateoptions" tabindex="-1">updateOptions <a class="header-anchor" href="#updateoptions">¶</a></h3><p>▸ <strong>updateOptions</strong>(<code>options</code>): <code>void</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>ParticlesLayerOptions</code>&gt;</td></tr></tbody></table><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">¶</a></h4><p><code>void</code></p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L196" target="_blank" rel="noreferrer">index.ts:196</a></p><hr><h3 id="initializeparticles" tabindex="-1">initializeParticles <a class="header-anchor" href="#initializeparticles">¶</a></h3><p>▸ <strong>initializeParticles</strong>(<code>count</code>): <code>void</code></p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>count</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">¶</a></h4><p><code>void</code></p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L205" target="_blank" rel="noreferrer">index.ts:205</a></p><hr><h3 id="setwind" tabindex="-1">setWind <a class="header-anchor" href="#setwind">¶</a></h3><p>▸ <strong>setWind</strong>(<code>windData</code>): <code>Promise</code>&lt;<code>unknown</code>&gt;</p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>windData</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">¶</a></h4><p><code>Promise</code>&lt;<code>unknown</code>&gt;</p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L240" target="_blank" rel="noreferrer">index.ts:240</a></p><hr><h3 id="onadd" tabindex="-1">onAdd <a class="header-anchor" href="#onadd">¶</a></h3><p>▸ <strong>onAdd</strong>(<code>map</code>, <code>gl</code>): <code>void</code></p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>gl</code></td><td style="text-align:left;"><code>WebGLRenderingContext</code></td></tr></tbody></table><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">¶</a></h4><p><code>void</code></p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L256" target="_blank" rel="noreferrer">index.ts:256</a></p><hr><h3 id="initialize" tabindex="-1">initialize <a class="header-anchor" href="#initialize">¶</a></h3><p>▸ <strong>initialize</strong>(): <code>void</code></p><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">¶</a></h4><p><code>void</code></p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L272" target="_blank" rel="noreferrer">index.ts:272</a></p><hr><h3 id="movestart" tabindex="-1">moveStart <a class="header-anchor" href="#movestart">¶</a></h3><p>▸ <strong>moveStart</strong>(): <code>void</code></p><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">¶</a></h4><p><code>void</code></p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L498" target="_blank" rel="noreferrer">index.ts:498</a></p><hr><h3 id="moveend" tabindex="-1">moveEnd <a class="header-anchor" href="#moveend">¶</a></h3><p>▸ <strong>moveEnd</strong>(): <code>void</code></p><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">¶</a></h4><p><code>void</code></p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L509" target="_blank" rel="noreferrer">index.ts:509</a></p><hr><h3 id="getextent" tabindex="-1">getExtent <a class="header-anchor" href="#getextent">¶</a></h3><p>▸ <strong>getExtent</strong>(): <code>any</code>[]</p><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">¶</a></h4><p><code>any</code>[]</p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L513" target="_blank" rel="noreferrer">index.ts:513</a></p><hr><h3 id="getsize" tabindex="-1">getSize <a class="header-anchor" href="#getsize">¶</a></h3><p>▸ <strong>getSize</strong>(): <code>number</code>[]</p><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">¶</a></h4><p><code>number</code>[]</p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L528" target="_blank" rel="noreferrer">index.ts:528</a></p><hr><h3 id="zoom" tabindex="-1">zoom <a class="header-anchor" href="#zoom">¶</a></h3><p>▸ <strong>zoom</strong>(): <code>void</code></p><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">¶</a></h4><p><code>void</code></p><h4 id="defined-in-16" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-16">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L532" target="_blank" rel="noreferrer">index.ts:532</a></p><hr><h3 id="reset" tabindex="-1">reset <a class="header-anchor" href="#reset">¶</a></h3><p>▸ <strong>reset</strong>(<code>flag?</code>): <code>void</code></p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>flag?</code></td><td style="text-align:left;"><code>boolean</code></td></tr></tbody></table><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">¶</a></h4><p><code>void</code></p><h4 id="defined-in-17" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-17">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L536" target="_blank" rel="noreferrer">index.ts:536</a></p><hr><h3 id="resize" tabindex="-1">resize <a class="header-anchor" href="#resize">¶</a></h3><p>▸ <strong>resize</strong>(): <code>void</code></p><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">¶</a></h4><p><code>void</code></p><h4 id="defined-in-18" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-18">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L567" target="_blank" rel="noreferrer">index.ts:567</a></p><hr><h3 id="onremove" tabindex="-1">onRemove <a class="header-anchor" href="#onremove">¶</a></h3><p>▸ <strong>onRemove</strong>(<code>map</code>): <code>void</code></p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">¶</a></h4><p><code>void</code></p><h4 id="defined-in-19" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-19">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L580" target="_blank" rel="noreferrer">index.ts:580</a></p><hr><h3 id="update" tabindex="-1">update <a class="header-anchor" href="#update">¶</a></h3><p>▸ <strong>update</strong>(): <code>void</code></p><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14">¶</a></h4><p><code>void</code></p><h4 id="defined-in-20" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-20">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L586" target="_blank" rel="noreferrer">index.ts:586</a></p><hr><h3 id="drawtexture" tabindex="-1">drawTexture <a class="header-anchor" href="#drawtexture">¶</a></h3><p>▸ <strong>drawTexture</strong>(<code>matrix</code>, <code>dateLineOffset</code>, <code>isGlobal</code>, <code>params</code>): <code>void</code></p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>matrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>dateLineOffset</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>isGlobal</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>params</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15">¶</a></h4><p><code>void</code></p><h4 id="defined-in-21" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-21">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L615" target="_blank" rel="noreferrer">index.ts:615</a></p><hr><h3 id="drawscreen" tabindex="-1">drawScreen <a class="header-anchor" href="#drawscreen">¶</a></h3><p>▸ <strong>drawScreen</strong>(): <code>void</code></p><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16">¶</a></h4><p><code>void</code></p><h4 id="defined-in-22" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-22">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L637" target="_blank" rel="noreferrer">index.ts:637</a></p><hr><h3 id="drawparticles" tabindex="-1">drawParticles <a class="header-anchor" href="#drawparticles">¶</a></h3><p>▸ <strong>drawParticles</strong>(<code>matrix</code>, <code>dateLineOffset</code>, <code>isGlobal</code>, <code>params</code>): <code>void</code></p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>matrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>dateLineOffset</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>isGlobal</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>params</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-17" tabindex="-1">Returns <a class="header-anchor" href="#returns-17">¶</a></h4><p><code>void</code></p><h4 id="defined-in-23" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-23">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L646" target="_blank" rel="noreferrer">index.ts:646</a></p><hr><h3 id="prerender" tabindex="-1">prerender <a class="header-anchor" href="#prerender">¶</a></h3><p>▸ <strong>prerender</strong>(<code>gl</code>, <code>projectionMatrix</code>, <code>projection</code>, <code>globeToMercMatrix</code>, <code>transition</code>, <code>centerInMercator</code>, <code>pixelsPerMeterRatio</code>): <code>void</code></p><h4 id="parameters-9" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-9">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>gl</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>projectionMatrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>projection</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>globeToMercMatrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>transition</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>centerInMercator</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>pixelsPerMeterRatio</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-18" tabindex="-1">Returns <a class="header-anchor" href="#returns-18">¶</a></h4><p><code>void</code></p><h4 id="defined-in-24" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-24">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L691" target="_blank" rel="noreferrer">index.ts:691</a></p><hr><h3 id="render" tabindex="-1">render <a class="header-anchor" href="#render">¶</a></h3><p>▸ <strong>render</strong>(<code>gl</code>, <code>projectionMatrix</code>, <code>projection</code>, <code>globeToMercMatrix</code>, <code>transition</code>, <code>centerInMercator</code>, <code>pixelsPerMeterRatio</code>): <code>void</code></p><h4 id="parameters-10" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-10">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>gl</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>projectionMatrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>projection</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>globeToMercMatrix</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>transition</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>centerInMercator</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>pixelsPerMeterRatio</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-19" tabindex="-1">Returns <a class="header-anchor" href="#returns-19">¶</a></h4><p><code>void</code></p><h4 id="defined-in-25" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-25">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/particles-poc/src/index.ts#L706" target="_blank" rel="noreferrer">index.ts:706</a></p>',200),i=[n];function o(s,l,c,h,f,p){return a(),t("div",null,i)}const g=e(r,[["render",o]]);export{b as __pageData,g as default};