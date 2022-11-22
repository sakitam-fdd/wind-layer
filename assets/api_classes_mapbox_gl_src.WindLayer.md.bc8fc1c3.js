import{_ as e,c as a,o as r,a as t}from"./app.d4ded0dd.js";const b=JSON.parse('{"title":"Class: WindLayer","description":"","frontmatter":{"sidebar":"auto","editLinks":false,"sidebarDepth":4},"headers":[{"level":2,"title":"Hierarchy","slug":"hierarchy","link":"#hierarchy","children":[]},{"level":2,"title":"Constructors","slug":"constructors","link":"#constructors","children":[{"level":3,"title":"constructor","slug":"constructor","link":"#constructor","children":[]}]},{"level":2,"title":"Properties","slug":"properties","link":"#properties","children":[{"level":3,"title":"canvas","slug":"canvas","link":"#canvas","children":[]},{"level":3,"title":"field","slug":"field","link":"#field","children":[]},{"level":3,"title":"id","slug":"id","link":"#id","children":[]},{"level":3,"title":"map","slug":"map","link":"#map","children":[]},{"level":3,"title":"options","slug":"options","link":"#options","children":[]},{"level":3,"title":"renderingMode","slug":"renderingmode","link":"#renderingmode","children":[]},{"level":3,"title":"type","slug":"type","link":"#type","children":[]},{"level":3,"title":"wind","slug":"wind","link":"#wind","children":[]}]},{"level":2,"title":"Methods","slug":"methods","link":"#methods","children":[{"level":3,"title":"addTo","slug":"addto","link":"#addto","children":[]},{"level":3,"title":"clear","slug":"clear","link":"#clear","children":[]},{"level":3,"title":"getData","slug":"getdata","link":"#getdata","children":[]},{"level":3,"title":"getMap","slug":"getmap","link":"#getmap","children":[]},{"level":3,"title":"getWindOptions","slug":"getwindoptions","link":"#getwindoptions","children":[]},{"level":3,"title":"handleResize","slug":"handleresize","link":"#handleresize","children":[]},{"level":3,"title":"initialize","slug":"initialize","link":"#initialize","children":[]},{"level":3,"title":"intersectsCoordinate","slug":"intersectscoordinate","link":"#intersectscoordinate","children":[]},{"level":3,"title":"onAdd","slug":"onadd","link":"#onadd","children":[]},{"level":3,"title":"pickWindOptions","slug":"pickwindoptions","link":"#pickwindoptions","children":[]},{"level":3,"title":"project","slug":"project","link":"#project","children":[]},{"level":3,"title":"registerEvents","slug":"registerevents","link":"#registerevents","children":[]},{"level":3,"title":"remove","slug":"remove","link":"#remove","children":[]},{"level":3,"title":"render","slug":"render","link":"#render","children":[]},{"level":3,"title":"resizeCanvas","slug":"resizecanvas","link":"#resizecanvas","children":[]},{"level":3,"title":"setData","slug":"setdata","link":"#setdata","children":[]},{"level":3,"title":"setMap","slug":"setmap","link":"#setmap","children":[]},{"level":3,"title":"setWindOptions","slug":"setwindoptions","link":"#setwindoptions","children":[]},{"level":3,"title":"stop","slug":"stop","link":"#stop","children":[]},{"level":3,"title":"unproject","slug":"unproject","link":"#unproject","children":[]},{"level":3,"title":"unregisterEvents","slug":"unregisterevents","link":"#unregisterevents","children":[]}]}],"relativePath":"api/classes/mapbox_gl_src.WindLayer.md","lastUpdated":1669143070000}'),d={name:"api/classes/mapbox_gl_src.WindLayer.md"},n=t('<p><a href="./../">Class Docs</a> / <a href="./../modules/mapbox_gl_src">mapbox-gl/src</a> / WindLayer</p><h1 id="class-windlayer" tabindex="-1">Class: WindLayer <a class="header-anchor" href="#class-windlayer">\xB6</a></h1><p><a href="./../modules/mapbox_gl_src">mapbox-gl/src</a>.WindLayer</p><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy">\xB6</a></h2><ul><li><p><code>default</code></p><p>\u21B3 <strong><code>WindLayer</code></strong></p></li></ul><h2 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">\xB6</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">\xB6</a></h3><p>\u2022 <strong>new WindLayer</strong>(<code>id</code>, <code>data</code>, <code>options?</code>)</p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>id</code></td><td style="text-align:left;"><code>string</code> | <code>number</code></td></tr><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides">\xB6</a></h4><p>Overlay.constructor</p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L37" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:37</a></p><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">\xB6</a></h2><h3 id="canvas" tabindex="-1">canvas <a class="header-anchor" href="#canvas">\xB6</a></h3><p>\u2022 <code>Protected</code> <strong>canvas</strong>: <code>null</code> | <code>HTMLCanvasElement</code></p><h4 id="inherited-from" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from">\xB6</a></h4><p>Overlay.canvas</p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L25" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:25</a></p><hr><h3 id="field" tabindex="-1">field <a class="header-anchor" href="#field">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>field</strong>: <code>undefined</code> | <a href="./maptalks_src.Field"><code>Field</code></a></p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L34" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:34</a></p><hr><h3 id="id" tabindex="-1">id <a class="header-anchor" href="#id">\xB6</a></h3><p>\u2022 <strong>id</strong>: <code>string</code> | <code>number</code></p><h4 id="inherited-from-1" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-1">\xB6</a></h4><p><a href="http://Overlay.id" target="_blank" rel="noreferrer">Overlay.id</a></p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L30" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:30</a></p><hr><h3 id="map" tabindex="-1">map <a class="header-anchor" href="#map">\xB6</a></h3><p>\u2022 <strong>map</strong>: <code>Map</code></p><h4 id="inherited-from-2" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-2">\xB6</a></h4><p>Overlay.map</p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L23" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:23</a></p><hr><h3 id="options" tabindex="-1">options <a class="header-anchor" href="#options">\xB6</a></h3><p>\u2022 <strong>options</strong>: <a href="./../interfaces/mapbox_gl_src.IWindOptions"><code>IWindOptions</code></a></p><h4 id="overrides-1" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-1">\xB6</a></h4><p>Overlay.options</p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L33" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:33</a></p><hr><h3 id="renderingmode" tabindex="-1">renderingMode <a class="header-anchor" href="#renderingmode">\xB6</a></h3><p>\u2022 <strong>renderingMode</strong>: <code>string</code></p><h4 id="inherited-from-3" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-3">\xB6</a></h4><p>Overlay.renderingMode</p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L29" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:29</a></p><hr><h3 id="type" tabindex="-1">type <a class="header-anchor" href="#type">\xB6</a></h3><p>\u2022 <strong>type</strong>: <code>string</code></p><h4 id="inherited-from-4" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-4">\xB6</a></h4><p>Overlay.type</p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L28" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:28</a></p><hr><h3 id="wind" tabindex="-1">wind <a class="header-anchor" href="#wind">\xB6</a></h3><p>\u2022 <code>Private</code> <strong>wind</strong>: <code>WindCore</code></p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L35" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:35</a></p><h2 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">\xB6</a></h2><h3 id="addto" tabindex="-1">addTo <a class="header-anchor" href="#addto">\xB6</a></h3><p>\u25B8 <strong>addTo</strong>(<code>map</code>): <code>void</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>Map</code></td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">\xB6</a></h4><p><code>void</code></p><h4 id="inherited-from-5" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-5">\xB6</a></h4><p>Overlay.addTo</p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L151" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:151</a></p><hr><h3 id="clear" tabindex="-1">clear <a class="header-anchor" href="#clear">\xB6</a></h3><p>\u25B8 <strong>clear</strong>(): <code>void</code></p><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">\xB6</a></h4><p><code>void</code></p><h4 id="inherited-from-6" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-6">\xB6</a></h4><p>Overlay.clear</p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L130" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:130</a></p><hr><h3 id="getdata" tabindex="-1">getData <a class="header-anchor" href="#getdata">\xB6</a></h3><p>\u25B8 <strong>getData</strong>(): <code>undefined</code> | <a href="./maptalks_src.Field"><code>Field</code></a></p><p>get wind layer data</p><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">\xB6</a></h4><p><code>undefined</code> | <a href="./maptalks_src.Field"><code>Field</code></a></p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L160" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:160</a></p><hr><h3 id="getmap" tabindex="-1">getMap <a class="header-anchor" href="#getmap">\xB6</a></h3><p>\u25B8 <strong>getMap</strong>(): <code>Map</code></p><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">\xB6</a></h4><p><code>Map</code></p><h4 id="inherited-from-7" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-7">\xB6</a></h4><p>Overlay.getMap</p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L147" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:147</a></p><hr><h3 id="getwindoptions" tabindex="-1">getWindOptions <a class="header-anchor" href="#getwindoptions">\xB6</a></h3><p>\u25B8 <strong>getWindOptions</strong>(): <code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">\xB6</a></h4><p><code>Partial</code>&lt;<code>IOptions</code>&gt;</p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L199" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:199</a></p><hr><h3 id="handleresize" tabindex="-1">handleResize <a class="header-anchor" href="#handleresize">\xB6</a></h3><p>\u25B8 <strong>handleResize</strong>(): <code>void</code></p><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L66" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:66</a></p><hr><h3 id="initialize" tabindex="-1">initialize <a class="header-anchor" href="#initialize">\xB6</a></h3><p>\u25B8 <strong>initialize</strong>(): <code>HTMLCanvasElement</code></p><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">\xB6</a></h4><p><code>HTMLCanvasElement</code></p><h4 id="inherited-from-8" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-8">\xB6</a></h4><p>Overlay.initialize</p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L74" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:74</a></p><hr><h3 id="intersectscoordinate" tabindex="-1">intersectsCoordinate <a class="header-anchor" href="#intersectscoordinate">\xB6</a></h3><p>\u25B8 <strong>intersectsCoordinate</strong>(<code>coordinate</code>): <code>boolean</code></p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coordinate</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">\xB6</a></h4><p><code>boolean</code></p><h4 id="inherited-from-9" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-9">\xB6</a></h4><p>Overlay.intersectsCoordinate</p><h4 id="defined-in-16" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-16">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L119" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:119</a></p><hr><h3 id="onadd" tabindex="-1">onAdd <a class="header-anchor" href="#onadd">\xB6</a></h3><p>\u25B8 <strong>onAdd</strong>(<code>map</code>): <code>void</code></p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>Map</code></td></tr></tbody></table><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">\xB6</a></h4><p><code>void</code></p><h4 id="overrides-2" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-2">\xB6</a></h4><p>Overlay.onAdd</p><h4 id="defined-in-17" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-17">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L50" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:50</a></p><hr><h3 id="pickwindoptions" tabindex="-1">pickWindOptions <a class="header-anchor" href="#pickwindoptions">\xB6</a></h3><p>\u25B8 <strong>pickWindOptions</strong>(): <code>void</code></p><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-18" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-18">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L145" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:145</a></p><hr><h3 id="project" tabindex="-1">project <a class="header-anchor" href="#project">\xB6</a></h3><p>\u25B8 <strong>project</strong>(<code>coordinates</code>): <code>number</code>[]</p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coordinates</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">\xB6</a></h4><p><code>number</code>[]</p><h4 id="inherited-from-10" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-10">\xB6</a></h4><p>Overlay.project</p><h4 id="defined-in-19" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-19">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L98" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:98</a></p><hr><h3 id="registerevents" tabindex="-1">registerEvents <a class="header-anchor" href="#registerevents">\xB6</a></h3><p>\u25B8 <strong>registerEvents</strong>(): <code>void</code></p><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-20" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-20">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L73" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:73</a></p><hr><h3 id="remove" tabindex="-1">remove <a class="header-anchor" href="#remove">\xB6</a></h3><p>\u25B8 <strong>remove</strong>(): <code>void</code></p><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">\xB6</a></h4><p><code>void</code></p><h4 id="overrides-3" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-3">\xB6</a></h4><p>Overlay.remove</p><h4 id="defined-in-21" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-21">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L135" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:135</a></p><hr><h3 id="render" tabindex="-1">render <a class="header-anchor" href="#render">\xB6</a></h3><p>\u25B8 <strong>render</strong>(): <code>void</code></p><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">\xB6</a></h4><p><code>void</code></p><h4 id="overrides-4" tabindex="-1">Overrides <a class="header-anchor" href="#overrides-4">\xB6</a></h4><p>Overlay.render</p><h4 id="defined-in-22" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-22">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L103" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:103</a></p><hr><h3 id="resizecanvas" tabindex="-1">resizeCanvas <a class="header-anchor" href="#resizecanvas">\xB6</a></h3><p>\u25B8 <strong>resizeCanvas</strong>(<code>canvas</code>): <code>void</code></p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>canvas</code></td><td style="text-align:left;"><code>HTMLCanvasElement</code></td></tr></tbody></table><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14">\xB6</a></h4><p><code>void</code></p><h4 id="inherited-from-11" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-11">\xB6</a></h4><p>Overlay.resizeCanvas</p><h4 id="defined-in-23" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-23">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L60" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:60</a></p><hr><h3 id="setdata" tabindex="-1">setData <a class="header-anchor" href="#setdata">\xB6</a></h3><p>\u25B8 <strong>setData</strong>(<code>data</code>, <code>options?</code>): <a href="./mapbox_gl_src.WindLayer"><code>WindLayer</code></a></p><p>set layer data</p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>IField</code>&gt;</td></tr></tbody></table><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15">\xB6</a></h4><p><a href="./mapbox_gl_src.WindLayer"><code>WindLayer</code></a></p><h4 id="defined-in-24" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-24">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L170" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:170</a></p><hr><h3 id="setmap" tabindex="-1">setMap <a class="header-anchor" href="#setmap">\xB6</a></h3><p>\u25B8 <strong>setMap</strong>(<code>map</code>): <a href="./mapbox_gl_src.WindLayer"><code>WindLayer</code></a></p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>map</code></td><td style="text-align:left;"><code>Map</code></td></tr></tbody></table><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16">\xB6</a></h4><p><a href="./mapbox_gl_src.WindLayer"><code>WindLayer</code></a></p><h4 id="inherited-from-12" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-12">\xB6</a></h4><p>Overlay.setMap</p><h4 id="defined-in-25" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-25">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L142" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:142</a></p><hr><h3 id="setwindoptions" tabindex="-1">setWindOptions <a class="header-anchor" href="#setwindoptions">\xB6</a></h3><p>\u25B8 <strong>setWindOptions</strong>(<code>options</code>): <code>void</code></p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Partial</code>&lt;<code>IOptions</code>&gt;</td></tr></tbody></table><h4 id="returns-17" tabindex="-1">Returns <a class="header-anchor" href="#returns-17">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-26" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-26">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L186" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:186</a></p><hr><h3 id="stop" tabindex="-1">stop <a class="header-anchor" href="#stop">\xB6</a></h3><p>\u25B8 <strong>stop</strong>(): <code>void</code></p><h4 id="returns-18" tabindex="-1">Returns <a class="header-anchor" href="#returns-18">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-27" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-27">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L97" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:97</a></p><hr><h3 id="unproject" tabindex="-1">unproject <a class="header-anchor" href="#unproject">\xB6</a></h3><p>\u25B8 <strong>unproject</strong>(<code>pixel</code>): <code>number</code>[]</p><h4 id="parameters-9" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-9">\xB6</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>pixel</code></td><td style="text-align:left;">[<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-19" tabindex="-1">Returns <a class="header-anchor" href="#returns-19">\xB6</a></h4><p><code>number</code>[]</p><h4 id="inherited-from-13" tabindex="-1">Inherited from <a class="header-anchor" href="#inherited-from-13">\xB6</a></h4><p>Overlay.unproject</p><h4 id="defined-in-28" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-28">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/Overlay.ts#L111" target="_blank" rel="noreferrer">packages/mapbox-gl/src/Overlay.ts:111</a></p><hr><h3 id="unregisterevents" tabindex="-1">unregisterEvents <a class="header-anchor" href="#unregisterevents">\xB6</a></h3><p>\u25B8 <strong>unregisterEvents</strong>(): <code>void</code></p><h4 id="returns-20" tabindex="-1">Returns <a class="header-anchor" href="#returns-20">\xB6</a></h4><p><code>void</code></p><h4 id="defined-in-29" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-29">\xB6</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/4323d1e/packages/mapbox-gl/src/index.ts#L85" target="_blank" rel="noreferrer">packages/mapbox-gl/src/index.ts:85</a></p>',257),i=[n];function s(h,o,l,c,p,f){return r(),a("div",null,i)}const m=e(d,[["render",s]]);export{b as __pageData,m as default};
