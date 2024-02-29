import{_ as e,c as r,o as a,a as t}from"./app.8688f4f3.js";const u=JSON.parse('{"title":"Class: TimelineSource","description":"","frontmatter":{"sidebar":"auto","editLinks":false,"sidebarDepth":4},"headers":[{"level":2,"title":"Hierarchy","slug":"hierarchy","link":"#hierarchy","children":[]},{"level":2,"title":"Constructors","slug":"constructors","link":"#constructors","children":[{"level":3,"title":"constructor","slug":"constructor","link":"#constructor","children":[]}]},{"level":2,"title":"Properties","slug":"properties","link":"#properties","children":[{"level":3,"title":"#cache","slug":"cache","link":"#cache","children":[]},{"level":3,"title":"#current","slug":"current","link":"#current","children":[]},{"level":3,"title":"#fadeTime","slug":"fadetime","link":"#fadetime","children":[]},{"level":3,"title":"#index","slug":"index","link":"#index","children":[]},{"level":3,"title":"#loaded","slug":"loaded","link":"#loaded","children":[]},{"level":3,"title":"#next","slug":"next","link":"#next","children":[]},{"level":3,"title":"#sourceCache","slug":"sourcecache","link":"#sourcecache","children":[]},{"level":3,"title":"#track","slug":"track","link":"#track","children":[]},{"level":3,"title":"coordinates","slug":"coordinates","link":"#coordinates","children":[]},{"level":3,"title":"dispatcher","slug":"dispatcher","link":"#dispatcher","children":[]},{"level":3,"title":"id","slug":"id","link":"#id","children":[]},{"level":3,"title":"intervals","slug":"intervals","link":"#intervals","children":[]},{"level":3,"title":"layer","slug":"layer","link":"#layer","children":[]},{"level":3,"title":"maxZoom","slug":"maxzoom","link":"#maxzoom","children":[]},{"level":3,"title":"minZoom","slug":"minzoom","link":"#minzoom","children":[]},{"level":3,"title":"options","slug":"options","link":"#options","children":[]},{"level":3,"title":"parseOptions","slug":"parseoptions","link":"#parseoptions","children":[]},{"level":3,"title":"renderer","slug":"renderer","link":"#renderer","children":[]},{"level":3,"title":"roundZoom","slug":"roundzoom","link":"#roundzoom","children":[]},{"level":3,"title":"tileBounds","slug":"tilebounds","link":"#tilebounds","children":[]},{"level":3,"title":"tileSize","slug":"tilesize","link":"#tilesize","children":[]},{"level":3,"title":"type","slug":"type","link":"#type","children":[]},{"level":3,"title":"wrapX","slug":"wrapx","link":"#wrapx","children":[]}]},{"level":2,"title":"Accessors","slug":"accessors","link":"#accessors","children":[{"level":3,"title":"cache","slug":"cache-1","link":"#cache-1","children":[]},{"level":3,"title":"privateType","slug":"privatetype","link":"#privatetype","children":[]},{"level":3,"title":"source","slug":"source","link":"#source","children":[]},{"level":3,"title":"sourceCache","slug":"sourcecache-1","link":"#sourcecache-1","children":[]},{"level":3,"title":"track","slug":"track-1","link":"#track-1","children":[]}]},{"level":2,"title":"Methods","slug":"methods","link":"#methods","children":[{"level":3,"title":"animate","slug":"animate","link":"#animate","children":[]},{"level":3,"title":"clear","slug":"clear","link":"#clear","children":[]},{"level":3,"title":"destroy","slug":"destroy","link":"#destroy","children":[]},{"level":3,"title":"emit","slug":"emit","link":"#emit","children":[]},{"level":3,"title":"getFadeTime","slug":"getfadetime","link":"#getfadetime","children":[]},{"level":3,"title":"has","slug":"has","link":"#has","children":[]},{"level":3,"title":"load","slug":"load","link":"#load","children":[]},{"level":3,"title":"loaded","slug":"loaded-1","link":"#loaded-1","children":[]},{"level":3,"title":"off","slug":"off","link":"#off","children":[]},{"level":3,"title":"on","slug":"on","link":"#on","children":[]},{"level":3,"title":"onAdd","slug":"onadd","link":"#onadd","children":[]},{"level":3,"title":"once","slug":"once","link":"#once","children":[]},{"level":3,"title":"pause","slug":"pause","link":"#pause","children":[]},{"level":3,"title":"play","slug":"play","link":"#play","children":[]},{"level":3,"title":"prepare","slug":"prepare","link":"#prepare","children":[]},{"level":3,"title":"restart","slug":"restart","link":"#restart","children":[]},{"level":3,"title":"resume","slug":"resume","link":"#resume","children":[]},{"level":3,"title":"stop","slug":"stop","link":"#stop","children":[]},{"level":3,"title":"tilesLoadEnd","slug":"tilesloadend","link":"#tilesloadend","children":[]}]}],"relativePath":"api/classes/gl_core_src.TimelineSource.md","lastUpdated":1709225622000}'),d={name:"api/classes/gl_core_src.TimelineSource.md"},i=t('<p><a href="./../">Class Docs</a> / <a href="./../modules/gl_core_src">gl-core/src</a> / TimelineSource</p><h1 id="class-timelinesource" tabindex="-1">Class: TimelineSource <a class="header-anchor" href="#class-timelinesource">\xB6</a></h1><p><a href="./../modules/gl_core_src">gl-core/src</a>.TimelineSource</p><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy">\xB6</a></h2><ul><li><p><code>EventEmitter</code></p><p>\u21B3 <strong><code>TimelineSource</code></strong></p></li></ul><h2 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">\xB6</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">\xB6</a></h3><p>\u2022 <strong>new TimelineSource</strong>(<code>id</code>, <code>options</code>)</p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>id</code></td><td style="text-align:left;"><code>string</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>TimelineSourceOptions</code></td></tr></tbody></table><h4 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides">\xB6</a></h4><p>EventEmitter.constructor</p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L139" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:139</a></p><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">\xB6</a></h2><h3 id="cache" tabindex="-1">#cache <a class="header-anchor" href="#cache">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#cache</strong>: <code>Map</code>&lt;<code>string</code>, <code>any</code>&gt;</p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L137" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:137</a></p><hr><h3 id="current" tabindex="-1">#current <a class="header-anchor" href="#current">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#current</strong>: <a href="./gl_core_src.ImageSource"><code>ImageSource</code></a> | <a href="./gl_core_src.TileSource"><code>TileSource</code></a></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L129" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:129</a></p><hr><h3 id="fadetime" tabindex="-1">#fadeTime <a class="header-anchor" href="#fadetime">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#fadeTime</strong>: <code>number</code> = <code>0</code></p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L133" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:133</a></p><hr><h3 id="index" tabindex="-1">#index <a class="header-anchor" href="#index">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#index</strong>: <code>number</code></p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L132" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:132</a></p><hr><h3 id="loaded" tabindex="-1">#loaded <a class="header-anchor" href="#loaded">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#loaded</strong>: <code>boolean</code> = <code>false</code></p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L126" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:126</a></p><hr><h3 id="next" tabindex="-1">#next <a class="header-anchor" href="#next">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#next</strong>: <a href="./gl_core_src.ImageSource"><code>ImageSource</code></a> | <a href="./gl_core_src.TileSource"><code>TileSource</code></a></p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L130" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:130</a></p><hr><h3 id="sourcecache" tabindex="-1">#sourceCache <a class="header-anchor" href="#sourcecache">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#sourceCache</strong>: <code>default</code>[]</p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L127" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:127</a></p><hr><h3 id="track" tabindex="-1">#track <a class="header-anchor" href="#track">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>#track</strong>: <code>default</code></p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L135" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:135</a></p><hr><h3 id="coordinates" tabindex="-1">coordinates <a class="header-anchor" href="#coordinates">\xB6</a></h3><p>\u2022 <strong>coordinates</strong>: <code>WithUndef</code>&lt;<a href="./../modules/gl_core_src#coordinates"><code>Coordinates</code></a>&gt;</p><p>\u5F71\u50CF\u5750\u6807</p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L102" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:102</a></p><hr><h3 id="dispatcher" tabindex="-1">dispatcher <a class="header-anchor" href="#dispatcher">\xB6</a></h3><p>\u2022 <strong>dispatcher</strong>: <code>any</code></p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L116" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:116</a></p><hr><h3 id="id" tabindex="-1">id <a class="header-anchor" href="#id">\xB6</a></h3><p>\u2022 <strong>id</strong>: <code>string</code></p><p>\u6570\u636E\u6E90 id</p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L72" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:72</a></p><hr><h3 id="intervals" tabindex="-1">intervals <a class="header-anchor" href="#intervals">\xB6</a></h3><p>\u2022 <strong>intervals</strong>: (<code>ImageSourceInterval</code> | <code>TileSourceInterval</code>)[]</p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L124" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:124</a></p><hr><h3 id="layer" tabindex="-1">layer <a class="header-anchor" href="#layer">\xB6</a></h3><p>\u2022 <strong>layer</strong>: <code>WithNull</code>&lt;<a href="./gl_core_src.BaseLayer"><code>BaseLayer</code></a>&gt;</p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L118" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:118</a></p><hr><h3 id="maxzoom" tabindex="-1">maxZoom <a class="header-anchor" href="#maxzoom">\xB6</a></h3><p>\u2022 <strong>maxZoom</strong>: <code>number</code></p><p>\u652F\u6301\u7684\u6700\u5927\u5C42\u7EA7</p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L87" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:87</a></p><hr><h3 id="minzoom" tabindex="-1">minZoom <a class="header-anchor" href="#minzoom">\xB6</a></h3><p>\u2022 <strong>minZoom</strong>: <code>number</code></p><p>\u652F\u6301\u7684\u6700\u5C0F\u5C42\u7EA7</p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L82" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:82</a></p><hr><h3 id="options" tabindex="-1">options <a class="header-anchor" href="#options">\xB6</a></h3><p>\u2022 <strong>options</strong>: <code>TimelineSourceOptions</code></p><p>\u914D\u7F6E\u9879</p><h4 id="defined-in-16" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-16">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L107" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:107</a></p><hr><h3 id="parseoptions" tabindex="-1">parseOptions <a class="header-anchor" href="#parseoptions">\xB6</a></h3><p>\u2022 <strong>parseOptions</strong>: <a href="./../modules/gl_core_src#parseoptionstype"><code>ParseOptionsType</code></a></p><h4 id="defined-in-17" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-17">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L120" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:120</a></p><hr><h3 id="renderer" tabindex="-1">renderer <a class="header-anchor" href="#renderer">\xB6</a></h3><p>\u2022 <strong>renderer</strong>: <code>Renderer</code></p><h4 id="defined-in-18" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-18">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L114" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:114</a></p><hr><h3 id="roundzoom" tabindex="-1">roundZoom <a class="header-anchor" href="#roundzoom">\xB6</a></h3><p>\u2022 <strong>roundZoom</strong>: <code>boolean</code> = <code>false</code></p><p>\u751F\u6210\u74E6\u7247\u65F6\u7684\u914D\u7F6E</p><h4 id="defined-in-19" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-19">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L92" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:92</a></p><hr><h3 id="tilebounds" tabindex="-1">tileBounds <a class="header-anchor" href="#tilebounds">\xB6</a></h3><p>\u2022 <strong>tileBounds</strong>: <code>undefined</code> | <a href="./../modules/gl_core_src#bounds"><code>Bounds</code></a></p><h4 id="defined-in-20" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-20">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L122" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:122</a></p><hr><h3 id="tilesize" tabindex="-1">tileSize <a class="header-anchor" href="#tilesize">\xB6</a></h3><p>\u2022 <strong>tileSize</strong>: <code>number</code></p><p>\u74E6\u7247\u5927\u5C0F</p><h4 id="defined-in-21" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-21">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L97" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:97</a></p><hr><h3 id="type" tabindex="-1">type <a class="header-anchor" href="#type">\xB6</a></h3><p>\u2022 <strong>type</strong>: <a href="./../enums/gl_core_src.LayerSourceType#timeline"><code>timeline</code></a></p><p>\u6570\u636E\u6E90\u7C7B\u578B</p><h4 id="defined-in-22" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-22">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L77" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:77</a></p><hr><h3 id="wrapx" tabindex="-1">wrapX <a class="header-anchor" href="#wrapx">\xB6</a></h3><p>\u2022 <strong>wrapX</strong>: <code>boolean</code></p><p>\u662F\u5426\u8DE8\u4E16\u754C\u6E32\u67D3</p><h4 id="defined-in-23" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-23">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L112" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:112</a></p><h2 id="accessors" tabindex="-1">Accessors <a class="header-anchor" href="#accessors">\xB6</a></h2><h3 id="cache-1" tabindex="-1">cache <a class="header-anchor" href="#cache-1">\xB6</a></h3><p>\u2022 <code>get</code> <strong>cache</strong>(): <code>Map</code>&lt;<code>string</code>, <code>any</code>&gt;</p><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">\xB6</a></h4><p><code>Map</code>&lt;<code>string</code>, <code>any</code>&gt;</p><h4 id="defined-in-24" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-24">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L255" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:255</a></p><hr><h3 id="privatetype" tabindex="-1">privateType <a class="header-anchor" href="#privatetype">\xB6</a></h3><p>\u2022 <code>get</code> <strong>privateType</strong>(): <a href="./../enums/gl_core_src.LayerSourceType"><code>LayerSourceType</code></a></p><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">\xB6</a></h4><p><a href="./../enums/gl_core_src.LayerSourceType"><code>LayerSourceType</code></a></p><h4 id="defined-in-25" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-25">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L251" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:251</a></p><hr><h3 id="source" tabindex="-1">source <a class="header-anchor" href="#source">\xB6</a></h3><p>\u2022 <code>get</code> <strong>source</strong>(): (<a href="./gl_core_src.ImageSource"><code>ImageSource</code></a> | <a href="./gl_core_src.TileSource"><code>TileSource</code></a>)[]</p><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">\xB6</a></h4><p>(<a href="./gl_core_src.ImageSource"><code>ImageSource</code></a> | <a href="./gl_core_src.TileSource"><code>TileSource</code></a>)[]</p><h4 id="defined-in-26" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-26">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L259" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:259</a></p><hr><h3 id="sourcecache-1" tabindex="-1">sourceCache <a class="header-anchor" href="#sourcecache-1">\xB6</a></h3><p>\u2022 <code>get</code> <strong>sourceCache</strong>(): <code>default</code>[]</p><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">\xB6</a></h4><p><code>default</code>[]</p><h4 id="defined-in-27" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-27">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L263" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:263</a></p><hr><h3 id="track-1" tabindex="-1">track <a class="header-anchor" href="#track-1">\xB6</a></h3><p>\u2022 <code>get</code> <strong>track</strong>(): <code>default</code></p><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">\xB6</a></h4><p><code>default</code></p><h4 id="defined-in-28" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-28">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L247" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:247</a></p><h2 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">\xB6</a></h2><h3 id="animate" tabindex="-1">animate <a class="header-anchor" href="#animate">\xB6</a></h3><p>\u25B8 <strong>animate</strong>(<code>__namedParameters</code>): <code>void</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>__namedParameters</code></td><td style="text-align:left;"><code>Object</code></td></tr></tbody></table><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-29" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-29">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L304" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:304</a></p><hr><h3 id="clear" tabindex="-1">clear <a class="header-anchor" href="#clear">\xB6</a></h3><p>\u25B8 <strong>clear</strong>(): <a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><p>\u6E05\u7A7A\u6240\u6709\u7684\u8BA2\u9605\u8005</p><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">\xB6</a></h4><p><a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><h4 id="inherited-from" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from">\xB6</a></h4><p>EventEmitter.clear</p><h4 id="defined-in-30" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-30">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:165</p><hr><h3 id="destroy" tabindex="-1">destroy <a class="header-anchor" href="#destroy">\xB6</a></h3><p>\u25B8 <strong>destroy</strong>(): <code>void</code></p><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-31" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-31">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L387" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:387</a></p><hr><h3 id="emit" tabindex="-1">emit <a class="header-anchor" href="#emit">\xB6</a></h3><p>\u25B8 <strong>emit</strong>(<code>type</code>, <code>args?</code>): <code>any</code></p><p>\u89E6\u53D1\u4E8B\u4EF6</p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>args?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">\xB6</a></h4><p><code>any</code></p><h4 id="inherited-from-1" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-1">\xB6</a></h4><p>EventEmitter.emit</p><h4 id="defined-in-32" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-32">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:160</p><hr><h3 id="getfadetime" tabindex="-1">getFadeTime <a class="header-anchor" href="#getfadetime">\xB6</a></h3><p>\u25B8 <strong>getFadeTime</strong>(): <code>number</code></p><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">\xB6</a></h4><p><code>number</code></p><h4 id="defined-in-33" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-33">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L296" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:296</a></p><hr><h3 id="has" tabindex="-1">has <a class="header-anchor" href="#has">\xB6</a></h3><p>\u25B8 <strong>has</strong>(<code>type</code>): <code>any</code></p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">\xB6</a></h4><p><code>any</code></p><h4 id="inherited-from-2" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-2">\xB6</a></h4><p>EventEmitter.has</p><h4 id="defined-in-34" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-34">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:161</p><hr><h3 id="load" tabindex="-1">load <a class="header-anchor" href="#load">\xB6</a></h3><p>\u25B8 <strong>load</strong>(<code>cb?</code>): <code>void</code></p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>cb?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-35" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-35">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L363" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:363</a></p><hr><h3 id="loaded-1" tabindex="-1">loaded <a class="header-anchor" href="#loaded-1">\xB6</a></h3><p>\u25B8 <strong>loaded</strong>(): <code>boolean</code></p><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">\xB6</a></h4><p><code>boolean</code></p><h4 id="defined-in-36" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-36">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L383" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:383</a></p><hr><h3 id="off" tabindex="-1">off <a class="header-anchor" href="#off">\xB6</a></h3><p>\u25B8 <strong>off</strong>(<code>type</code>, <code>handler?</code>, <code>context?</code>): <a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><p>\u53D6\u6D88\u76D1\u542C</p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>handler?</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>context?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">\xB6</a></h4><p><a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><h4 id="inherited-from-3" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-3">\xB6</a></h4><p>EventEmitter.off</p><h4 id="defined-in-37" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-37">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:154</p><hr><h3 id="on" tabindex="-1">on <a class="header-anchor" href="#on">\xB6</a></h3><p>\u25B8 <strong>on</strong>(<code>type</code>, <code>handler</code>, <code>context?</code>): <a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><p>\u6DFB\u52A0\u8BA2\u9605\u8005</p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>any</code></td><td style="text-align:left;">\u4E8B\u4EF6\u7C7B\u578B</td></tr><tr><td style="text-align:left;"><code>handler</code></td><td style="text-align:left;"><code>any</code></td><td style="text-align:left;">\u56DE\u8C03\u51FD\u6570</td></tr><tr><td style="text-align:left;"><code>context?</code></td><td style="text-align:left;"><code>any</code></td><td style="text-align:left;">\u4E0A\u4E0B\u6587</td></tr></tbody></table><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14">\xB6</a></h4><p><a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><h4 id="inherited-from-4" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-4">\xB6</a></h4><p>EventEmitter.on</p><h4 id="defined-in-38" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-38">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:140</p><hr><h3 id="onadd" tabindex="-1">onAdd <a class="header-anchor" href="#onadd">\xB6</a></h3><p>\u25B8 <strong>onAdd</strong>(<code>layer</code>): <code>void</code></p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>layer</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-39" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-39">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L267" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:267</a></p><hr><h3 id="once" tabindex="-1">once <a class="header-anchor" href="#once">\xB6</a></h3><p>\u25B8 <strong>once</strong>(<code>type</code>, <code>handler</code>, <code>context?</code>): <a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><p>\u6DFB\u52A0\u4E00\u6B21\u6027\u8BA2\u9605\u8005</p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>type</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>handler</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>context?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16">\xB6</a></h4><p><a href="./gl_core_src.TimelineSource"><code>TimelineSource</code></a></p><h4 id="inherited-from-5" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-5">\xB6</a></h4><p>EventEmitter.once</p><h4 id="defined-in-40" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-40">\xB6</a></h4><p>node_modules/.pnpm/@sakitam-gis+vis-engine@1.5.2/node_modules/@sakitam-gis/vis-engine/dist/index.d.ts:147</p><hr><h3 id="pause" tabindex="-1">pause <a class="header-anchor" href="#pause">\xB6</a></h3><p>\u25B8 <strong>pause</strong>(): <code>void</code></p><h4 id="returns-17" tabindex="-1">Returns <a class="header-anchor" href="#returns-17">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-41" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-41">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L343" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:343</a></p><hr><h3 id="play" tabindex="-1">play <a class="header-anchor" href="#play">\xB6</a></h3><p>\u25B8 <strong>play</strong>(): <code>void</code></p><h4 id="returns-18" tabindex="-1">Returns <a class="header-anchor" href="#returns-18">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-42" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-42">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L338" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:338</a></p><hr><h3 id="prepare" tabindex="-1">prepare <a class="header-anchor" href="#prepare">\xB6</a></h3><p>\u25B8 <strong>prepare</strong>(<code>renderer</code>, <code>dispatcher</code>, <code>parseOptions</code>): <code>void</code></p><h4 id="parameters-9" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-9">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>renderer</code></td><td style="text-align:left;"><code>Renderer</code></td></tr><tr><td style="text-align:left;"><code>dispatcher</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>parseOptions</code></td><td style="text-align:left;"><a href="./../modules/gl_core_src#parseoptionstype"><code>ParseOptionsType</code></a></td></tr></tbody></table><h4 id="returns-19" tabindex="-1">Returns <a class="header-anchor" href="#returns-19">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-43" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-43">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L284" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:284</a></p><hr><h3 id="restart" tabindex="-1">restart <a class="header-anchor" href="#restart">\xB6</a></h3><p>\u25B8 <strong>restart</strong>(): <code>void</code></p><h4 id="returns-20" tabindex="-1">Returns <a class="header-anchor" href="#returns-20">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-44" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-44">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L358" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:358</a></p><hr><h3 id="resume" tabindex="-1">resume <a class="header-anchor" href="#resume">\xB6</a></h3><p>\u25B8 <strong>resume</strong>(): <code>void</code></p><h4 id="returns-21" tabindex="-1">Returns <a class="header-anchor" href="#returns-21">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-45" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-45">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L348" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:348</a></p><hr><h3 id="stop" tabindex="-1">stop <a class="header-anchor" href="#stop">\xB6</a></h3><p>\u25B8 <strong>stop</strong>(): <code>void</code></p><h4 id="returns-22" tabindex="-1">Returns <a class="header-anchor" href="#returns-22">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-46" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-46">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L353" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:353</a></p><hr><h3 id="tilesloadend" tabindex="-1">tilesLoadEnd <a class="header-anchor" href="#tilesloadend">\xB6</a></h3><p>\u25B8 <strong>tilesLoadEnd</strong>(): <code>void</code></p><h4 id="returns-23" tabindex="-1">Returns <a class="header-anchor" href="#returns-23">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-47" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-47">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/12f3939/packages/gl-core/src/source/Timeline.ts#L300" target="_blank" rel="noreferrer">packages/gl-core/src/source/Timeline.ts:300</a></p>',341),n=[i];function s(c,o,l,h,p,f){return a(),r("div",null,n)}const m=e(d,[["render",s]]);export{u as __pageData,m as default};
