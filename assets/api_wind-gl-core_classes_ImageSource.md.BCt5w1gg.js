import{_ as e,c as a,o as t,ab as r}from"./chunks/framework.BBlJMq6K.js";const m=JSON.parse('{"title":"Class: ImageSource","description":"","frontmatter":{},"headers":[],"relativePath":"api/wind-gl-core/classes/ImageSource.md","filePath":"api/wind-gl-core/classes/ImageSource.md","lastUpdated":null}'),d={name:"api/wind-gl-core/classes/ImageSource.md"},o=r('<h1 id="class-imagesource" tabindex="-1">Class: ImageSource <a class="header-anchor" href="#class-imagesource">¶</a></h1><h2 id="hierarchy" tabindex="-1">Hierarchy <a class="header-anchor" href="#hierarchy">¶</a></h2><ul><li><p><code>EventEmitter</code></p><p>↳ <strong><code>ImageSource</code></strong></p></li></ul><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents">¶</a></h2><h3 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">¶</a></h3><ul><li><a href="./ImageSource.html#constructor">constructor</a></li></ul><h3 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">¶</a></h3><ul><li><a href="./ImageSource.html#id">id</a></li><li><a href="./ImageSource.html#type">type</a></li><li><a href="./ImageSource.html#minzoom">minZoom</a></li><li><a href="./ImageSource.html#maxzoom">maxZoom</a></li><li><a href="./ImageSource.html#roundzoom">roundZoom</a></li><li><a href="./ImageSource.html#tilesize">tileSize</a></li><li><a href="./ImageSource.html#options">options</a></li><li><a href="./ImageSource.html#url">url</a></li><li><a href="./ImageSource.html#renderer">renderer</a></li><li><a href="./ImageSource.html#dispatcher">dispatcher</a></li><li><a href="./ImageSource.html#layer">layer</a></li><li><a href="./ImageSource.html#parseoptions">parseOptions</a></li><li><a href="./ImageSource.html#coordinates">coordinates</a></li><li><a href="./ImageSource.html#wrapx">wrapX</a></li></ul><h3 id="accessors" tabindex="-1">Accessors <a class="header-anchor" href="#accessors">¶</a></h3><ul><li><a href="./ImageSource.html#sourcecache">sourceCache</a></li></ul><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">¶</a></h3><ul><li><a href="./ImageSource.html#onadd">onAdd</a></li><li><a href="./ImageSource.html#prepare">prepare</a></li><li><a href="./ImageSource.html#update">update</a></li><li><a href="./ImageSource.html#updateimage">updateImage</a></li><li><a href="./ImageSource.html#setcoordinates">setCoordinates</a></li><li><a href="./ImageSource.html#asyncactor">asyncActor</a></li><li><a href="./ImageSource.html#load">load</a></li><li><a href="./ImageSource.html#loaded">loaded</a></li><li><a href="./ImageSource.html#reload">reload</a></li><li><a href="./ImageSource.html#gettileurl">getTileUrl</a></li><li><a href="./ImageSource.html#loadtile">loadTile</a></li><li><a href="./ImageSource.html#hastile">hasTile</a></li><li><a href="./ImageSource.html#getfadetime">getFadeTime</a></li><li><a href="./ImageSource.html#aborttile">abortTile</a></li><li><a href="./ImageSource.html#unloadtile">unloadTile</a></li><li><a href="./ImageSource.html#destroy">destroy</a></li></ul><h2 id="constructors-1" tabindex="-1">Constructors <a class="header-anchor" href="#constructors-1">¶</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">¶</a></h3><p>• <strong>new ImageSource</strong>(<code>id</code>, <code>options</code>): <a href="./ImageSource.html"><code>ImageSource</code></a></p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>id</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><a href="./../interfaces/ImageSourceOptions.html"><code>ImageSourceOptions</code></a></td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">¶</a></h4><p><a href="./ImageSource.html"><code>ImageSource</code></a></p><h4 id="overrides" tabindex="-1">Overrides <a class="header-anchor" href="#overrides">¶</a></h4><p>EventEmitter.constructor</p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L74" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:74</a></p><h2 id="properties-1" tabindex="-1">Properties <a class="header-anchor" href="#properties-1">¶</a></h2><h3 id="id" tabindex="-1">id <a class="header-anchor" href="#id">¶</a></h3><p>• <strong>id</strong>: <code>string</code></p><p>数据源 id</p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L18" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:18</a></p><hr><h3 id="type" tabindex="-1">type <a class="header-anchor" href="#type">¶</a></h3><p>• <strong>type</strong>: <a href="./../enums/LayerSourceType.html#image"><code>image</code></a></p><p>数据源类型</p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L23" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:23</a></p><hr><h3 id="minzoom" tabindex="-1">minZoom <a class="header-anchor" href="#minzoom">¶</a></h3><p>• <strong>minZoom</strong>: <code>number</code></p><p>支持的最小层级</p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L28" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:28</a></p><hr><h3 id="maxzoom" tabindex="-1">maxZoom <a class="header-anchor" href="#maxzoom">¶</a></h3><p>• <strong>maxZoom</strong>: <code>number</code></p><p>支持的最大层级</p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L33" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:33</a></p><hr><h3 id="roundzoom" tabindex="-1">roundZoom <a class="header-anchor" href="#roundzoom">¶</a></h3><p>• <strong>roundZoom</strong>: <code>boolean</code> = <code>false</code></p><p>是否对层级进行四舍五入</p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L38" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:38</a></p><hr><h3 id="tilesize" tabindex="-1">tileSize <a class="header-anchor" href="#tilesize">¶</a></h3><p>• <strong>tileSize</strong>: <code>number</code></p><p>瓦片大小</p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L43" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:43</a></p><hr><h3 id="options" tabindex="-1">options <a class="header-anchor" href="#options">¶</a></h3><p>• <strong>options</strong>: <a href="./../interfaces/ImageSourceOptions.html"><code>ImageSourceOptions</code></a></p><p>配置项</p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L48" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:48</a></p><hr><h3 id="url" tabindex="-1">url <a class="header-anchor" href="#url">¶</a></h3><p>• <strong>url</strong>: <code>string</code> | [<code>string</code>, <code>string</code>]</p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L50" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:50</a></p><hr><h3 id="renderer" tabindex="-1">renderer <a class="header-anchor" href="#renderer">¶</a></h3><p>• <strong>renderer</strong>: <code>Renderer</code></p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L52" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:52</a></p><hr><h3 id="dispatcher" tabindex="-1">dispatcher <a class="header-anchor" href="#dispatcher">¶</a></h3><p>• <strong>dispatcher</strong>: <code>any</code></p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L54" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:54</a></p><hr><h3 id="layer" tabindex="-1">layer <a class="header-anchor" href="#layer">¶</a></h3><p>• <strong>layer</strong>: <code>WithNull</code>&lt;<a href="./BaseLayer.html"><code>BaseLayer</code></a>&gt;</p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L56" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:56</a></p><hr><h3 id="parseoptions" tabindex="-1">parseOptions <a class="header-anchor" href="#parseoptions">¶</a></h3><p>• <strong>parseOptions</strong>: <a href="./../interfaces/ParseOptionsType.html"><code>ParseOptionsType</code></a></p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L58" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:58</a></p><hr><h3 id="coordinates" tabindex="-1">coordinates <a class="header-anchor" href="#coordinates">¶</a></h3><p>• <strong>coordinates</strong>: <a href="./../types/Coordinates.html"><code>Coordinates</code></a></p><p>影像坐标</p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L63" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:63</a></p><hr><h3 id="wrapx" tabindex="-1">wrapX <a class="header-anchor" href="#wrapx">¶</a></h3><p>• <strong>wrapX</strong>: <code>boolean</code></p><p>是否跨世界渲染</p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L68" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:68</a></p><h2 id="accessors-1" tabindex="-1">Accessors <a class="header-anchor" href="#accessors-1">¶</a></h2><h3 id="sourcecache" tabindex="-1">sourceCache <a class="header-anchor" href="#sourcecache">¶</a></h3><p>• <code>get</code> <strong>sourceCache</strong>(): <code>default</code></p><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">¶</a></h4><p><code>default</code></p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L98" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:98</a></p><h2 id="methods-1" tabindex="-1">Methods <a class="header-anchor" href="#methods-1">¶</a></h2><h3 id="onadd" tabindex="-1">onAdd <a class="header-anchor" href="#onadd">¶</a></h3><p>▸ <strong>onAdd</strong>(<code>layer</code>, <code>cb?</code>): <code>void</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>layer</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>cb?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">¶</a></h4><p><code>void</code></p><h4 id="defined-in-16" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-16">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L102" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:102</a></p><hr><h3 id="prepare" tabindex="-1">prepare <a class="header-anchor" href="#prepare">¶</a></h3><p>▸ <strong>prepare</strong>(<code>renderer</code>, <code>dispatcher</code>, <code>parseOptions</code>): <code>void</code></p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>renderer</code></td><td style="text-align:left;"><code>Renderer</code></td></tr><tr><td style="text-align:left;"><code>dispatcher</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>parseOptions</code></td><td style="text-align:left;"><a href="./../interfaces/ParseOptionsType.html"><code>ParseOptionsType</code></a></td></tr></tbody></table><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">¶</a></h4><p><code>void</code></p><h4 id="defined-in-17" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-17">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L107" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:107</a></p><hr><h3 id="update" tabindex="-1">update <a class="header-anchor" href="#update">¶</a></h3><p>▸ <strong>update</strong>(<code>data</code>, <code>clear?</code>): <code>void</code></p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Default value</th></tr></thead><tbody><tr><td style="text-align:left;"><code>data</code></td><td style="text-align:left;"><code>ImageSourceInterval</code></td><td style="text-align:left;"><code>undefined</code></td></tr><tr><td style="text-align:left;"><code>clear</code></td><td style="text-align:left;"><code>boolean</code></td><td style="text-align:left;"><code>true</code></td></tr></tbody></table><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">¶</a></h4><p><code>void</code></p><h4 id="defined-in-18" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-18">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L113" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:113</a></p><hr><h3 id="updateimage" tabindex="-1">updateImage <a class="header-anchor" href="#updateimage">¶</a></h3><p>▸ <strong>updateImage</strong>(<code>options</code>, <code>clear?</code>): <code>void</code></p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Default value</th></tr></thead><tbody><tr><td style="text-align:left;"><code>options</code></td><td style="text-align:left;"><code>Pick</code>&lt;<a href="./../interfaces/ImageSourceOptions.html"><code>ImageSourceOptions</code></a>, <code>&quot;url&quot;</code> | <code>&quot;coordinates&quot;</code>&gt;</td><td style="text-align:left;"><code>undefined</code></td></tr><tr><td style="text-align:left;"><code>clear</code></td><td style="text-align:left;"><code>boolean</code></td><td style="text-align:left;"><code>true</code></td></tr></tbody></table><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">¶</a></h4><p><code>void</code></p><h4 id="defined-in-19" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-19">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L118" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:118</a></p><hr><h3 id="setcoordinates" tabindex="-1">setCoordinates <a class="header-anchor" href="#setcoordinates">¶</a></h3><p>▸ <strong>setCoordinates</strong>(<code>coordinates</code>): <code>void</code></p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coordinates</code></td><td style="text-align:left;"><a href="./../types/Coordinates.html"><code>Coordinates</code></a></td></tr></tbody></table><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">¶</a></h4><p><code>void</code></p><h4 id="defined-in-20" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-20">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L126" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:126</a></p><hr><h3 id="asyncactor" tabindex="-1">asyncActor <a class="header-anchor" href="#asyncactor">¶</a></h3><p>▸ <strong>asyncActor</strong>(<code>tile</code>, <code>url</code>): <code>Promise</code>&lt;<code>unknown</code>&gt;</p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>tile</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>url</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">¶</a></h4><p><code>Promise</code>&lt;<code>unknown</code>&gt;</p><h4 id="defined-in-21" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-21">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L131" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:131</a></p><hr><h3 id="load" tabindex="-1">load <a class="header-anchor" href="#load">¶</a></h3><p>▸ <strong>load</strong>(<code>cb?</code>): <code>void</code></p><p>兼容 TileJSON 加载，需要具体实现</p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>cb?</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">¶</a></h4><p><code>void</code></p><h4 id="defined-in-22" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-22">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L157" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:157</a></p><hr><h3 id="loaded" tabindex="-1">loaded <a class="header-anchor" href="#loaded">¶</a></h3><p>▸ <strong>loaded</strong>(): <code>boolean</code></p><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">¶</a></h4><p><code>boolean</code></p><h4 id="defined-in-23" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-23">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L165" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:165</a></p><hr><h3 id="reload" tabindex="-1">reload <a class="header-anchor" href="#reload">¶</a></h3><p>▸ <strong>reload</strong>(<code>clear</code>): <code>void</code></p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>clear</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">¶</a></h4><p><code>void</code></p><h4 id="defined-in-24" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-24">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L169" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:169</a></p><hr><h3 id="gettileurl" tabindex="-1">getTileUrl <a class="header-anchor" href="#gettileurl">¶</a></h3><p>▸ <strong>getTileUrl</strong>(<code>tileID</code>): <code>string</code>[]</p><h4 id="parameters-9" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-9">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>tileID</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">¶</a></h4><p><code>string</code>[]</p><h4 id="defined-in-25" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-25">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L181" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:181</a></p><hr><h3 id="loadtile" tabindex="-1">loadTile <a class="header-anchor" href="#loadtile">¶</a></h3><p>▸ <strong>loadTile</strong>(<code>tile</code>, <code>callback</code>): <code>any</code></p><h4 id="parameters-10" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-10">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>tile</code></td><td style="text-align:left;"><a href="./Tile.html"><code>Tile</code></a></td></tr><tr><td style="text-align:left;"><code>callback</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">¶</a></h4><p><code>any</code></p><h4 id="defined-in-26" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-26">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L189" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:189</a></p><hr><h3 id="hastile" tabindex="-1">hasTile <a class="header-anchor" href="#hastile">¶</a></h3><p>▸ <strong>hasTile</strong>(<code>coord</code>): <code>boolean</code></p><h4 id="parameters-11" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-11">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>coord</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">¶</a></h4><p><code>boolean</code></p><h4 id="defined-in-27" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-27">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L237" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:237</a></p><hr><h3 id="getfadetime" tabindex="-1">getFadeTime <a class="header-anchor" href="#getfadetime">¶</a></h3><p>▸ <strong>getFadeTime</strong>(): <code>number</code></p><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14">¶</a></h4><p><code>number</code></p><h4 id="defined-in-28" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-28">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L241" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:241</a></p><hr><h3 id="aborttile" tabindex="-1">abortTile <a class="header-anchor" href="#aborttile">¶</a></h3><p>▸ <strong>abortTile</strong>(<code>tile</code>, <code>callback</code>): <code>void</code></p><h4 id="parameters-12" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-12">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>tile</code></td><td style="text-align:left;"><a href="./Tile.html"><code>Tile</code></a></td></tr><tr><td style="text-align:left;"><code>callback</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15">¶</a></h4><p><code>void</code></p><h4 id="defined-in-29" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-29">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L245" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:245</a></p><hr><h3 id="unloadtile" tabindex="-1">unloadTile <a class="header-anchor" href="#unloadtile">¶</a></h3><p>▸ <strong>unloadTile</strong>(<code>tile</code>, <code>cb</code>): <code>void</code></p><h4 id="parameters-13" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-13">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>tile</code></td><td style="text-align:left;"><code>any</code></td></tr><tr><td style="text-align:left;"><code>cb</code></td><td style="text-align:left;"><code>any</code></td></tr></tbody></table><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16">¶</a></h4><p><code>void</code></p><h4 id="defined-in-30" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-30">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L275" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:275</a></p><hr><h3 id="destroy" tabindex="-1">destroy <a class="header-anchor" href="#destroy">¶</a></h3><p>▸ <strong>destroy</strong>(): <code>void</code></p><h4 id="returns-17" tabindex="-1">Returns <a class="header-anchor" href="#returns-17">¶</a></h4><p><code>void</code></p><h4 id="defined-in-31" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-31">¶</a></h4><p><a href="https://github.com/sakitam-fdd/wind-layer/blob/master/packages/gl-core/src/source/image.ts#L277" target="_blank" rel="noreferrer">gl-core/src/source/image.ts:277</a></p>',248),s=[o];function c(i,n,h,l,g,f){return t(),a("div",null,s)}const b=e(d,[["render",c]]);export{m as __pageData,b as default};