import{_ as e,c as t,o as d,ab as a}from"./chunks/framework.BBlJMq6K.js";const u=JSON.parse('{"title":"Class: Field","description":"","frontmatter":{},"headers":[],"relativePath":"api/leaflet-wind/classes/Field.md","filePath":"api/leaflet-wind/classes/Field.md","lastUpdated":null}'),r={name:"api/leaflet-wind/classes/Field.md"},n=a('<h1 id="class-field" tabindex="-1">Class: Field <a class="header-anchor" href="#class-field">¶</a></h1><h2 id="table-of-contents" tabindex="-1">Table of contents <a class="header-anchor" href="#table-of-contents">¶</a></h2><h3 id="constructors" tabindex="-1">Constructors <a class="header-anchor" href="#constructors">¶</a></h3><ul><li><a href="./Field.html#constructor">constructor</a></li></ul><h3 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties">¶</a></h3><ul><li><a href="./Field.html#grid">grid</a></li><li><a href="./Field.html#range">range</a></li></ul><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods">¶</a></h3><ul><li><a href="./Field.html#buildgrid">buildGrid</a></li><li><a href="./Field.html#release">release</a></li><li><a href="./Field.html#extent">extent</a></li><li><a href="./Field.html#calculaterange">calculateRange</a></li><li><a href="./Field.html#contains">contains</a></li><li><a href="./Field.html#getdecimalindexes">getDecimalIndexes</a></li><li><a href="./Field.html#valueat">valueAt</a></li><li><a href="./Field.html#interpolatedvalueat">interpolatedValueAt</a></li><li><a href="./Field.html#hasvalueat">hasValueAt</a></li><li><a href="./Field.html#valueatindexes">valueAtIndexes</a></li><li><a href="./Field.html#lonlatatindexes">lonLatAtIndexes</a></li><li><a href="./Field.html#randomize">randomize</a></li><li><a href="./Field.html#checkfields">checkFields</a></li></ul><h2 id="constructors-1" tabindex="-1">Constructors <a class="header-anchor" href="#constructors-1">¶</a></h2><h3 id="constructor" tabindex="-1">constructor <a class="header-anchor" href="#constructor">¶</a></h3><p>• <strong>new Field</strong>(<code>params</code>): <a href="./Field.html"><code>Field</code></a></p><h4 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>params</code></td><td style="text-align:left;"><code>IField</code></td></tr></tbody></table><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns">¶</a></h4><p><a href="./Field.html"><code>Field</code></a></p><h4 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in">¶</a></h4><p>core/dist/index.d.ts:109</p><h2 id="properties-1" tabindex="-1">Properties <a class="header-anchor" href="#properties-1">¶</a></h2><h3 id="grid" tabindex="-1">grid <a class="header-anchor" href="#grid">¶</a></h3><p>• <strong>grid</strong>: (<code>null</code> | <code>Vector</code>)[][]</p><h4 id="defined-in-1" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-1">¶</a></h4><p>core/dist/index.d.ts:106</p><hr><h3 id="range" tabindex="-1">range <a class="header-anchor" href="#range">¶</a></h3><p>• <strong>range</strong>: <code>undefined</code> | (<code>undefined</code> | <code>number</code>)[]</p><h4 id="defined-in-2" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-2">¶</a></h4><p>core/dist/index.d.ts:107</p><h2 id="methods-1" tabindex="-1">Methods <a class="header-anchor" href="#methods-1">¶</a></h2><h3 id="buildgrid" tabindex="-1">buildGrid <a class="header-anchor" href="#buildgrid">¶</a></h3><p>▸ <strong>buildGrid</strong>(): (<code>null</code> | <code>Vector</code>)[][]</p><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1">¶</a></h4><p>(<code>null</code> | <code>Vector</code>)[][]</p><h4 id="defined-in-3" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-3">¶</a></h4><p>core/dist/index.d.ts:110</p><hr><h3 id="release" tabindex="-1">release <a class="header-anchor" href="#release">¶</a></h3><p>▸ <strong>release</strong>(): <code>void</code></p><p>release data</p><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2">¶</a></h4><p><code>void</code></p><h4 id="defined-in-4" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-4">¶</a></h4><p>core/dist/index.d.ts:114</p><hr><h3 id="extent" tabindex="-1">extent <a class="header-anchor" href="#extent">¶</a></h3><p>▸ <strong>extent</strong>(): <code>number</code>[]</p><p>grib data extent 格点数据范围</p><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3">¶</a></h4><p><code>number</code>[]</p><h4 id="defined-in-5" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-5">¶</a></h4><p>core/dist/index.d.ts:119</p><hr><h3 id="calculaterange" tabindex="-1">calculateRange <a class="header-anchor" href="#calculaterange">¶</a></h3><p>▸ <strong>calculateRange</strong>(): <code>undefined</code> | <code>any</code>[]</p><p>calculate vector value range</p><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4">¶</a></h4><p><code>undefined</code> | <code>any</code>[]</p><h4 id="defined-in-6" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-6">¶</a></h4><p>core/dist/index.d.ts:136</p><hr><h3 id="contains" tabindex="-1">contains <a class="header-anchor" href="#contains">¶</a></h3><p>▸ <strong>contains</strong>(<code>lon</code>, <code>lat</code>): <code>any</code></p><h4 id="parameters-1" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-1">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>lon</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>lat</code></td><td style="text-align:left;"><code>number</code></td></tr></tbody></table><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5">¶</a></h4><p><code>any</code></p><h4 id="defined-in-7" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-7">¶</a></h4><p>core/dist/index.d.ts:144</p><hr><h3 id="getdecimalindexes" tabindex="-1">getDecimalIndexes <a class="header-anchor" href="#getdecimalindexes">¶</a></h3><p>▸ <strong>getDecimalIndexes</strong>(<code>lon</code>, <code>lat</code>): <code>number</code>[]</p><p>获取经纬度所在的位置索引</p><h4 id="parameters-2" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-2">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>lon</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>lat</code></td><td style="text-align:left;"><code>number</code></td></tr></tbody></table><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6">¶</a></h4><p><code>number</code>[]</p><h4 id="defined-in-8" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-8">¶</a></h4><p>core/dist/index.d.ts:150</p><hr><h3 id="valueat" tabindex="-1">valueAt <a class="header-anchor" href="#valueat">¶</a></h3><p>▸ <strong>valueAt</strong>(<code>lon</code>, <code>lat</code>): <code>null</code> | <code>Vector</code></p><p>Nearest value at lon-lat coordinates 线性插值</p><h4 id="parameters-3" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-3">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>lon</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>lat</code></td><td style="text-align:left;"><code>number</code></td></tr></tbody></table><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7">¶</a></h4><p><code>null</code> | <code>Vector</code></p><h4 id="defined-in-9" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-9">¶</a></h4><p>core/dist/index.d.ts:157</p><hr><h3 id="interpolatedvalueat" tabindex="-1">interpolatedValueAt <a class="header-anchor" href="#interpolatedvalueat">¶</a></h3><p>▸ <strong>interpolatedValueAt</strong>(<code>lon</code>, <code>lat</code>): <code>null</code> | <code>Vector</code></p><p>Get interpolated grid value lon-lat coordinates 双线性插值</p><h4 id="parameters-4" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-4">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>lon</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>lat</code></td><td style="text-align:left;"><code>number</code></td></tr></tbody></table><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8">¶</a></h4><p><code>null</code> | <code>Vector</code></p><h4 id="defined-in-10" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-10">¶</a></h4><p>core/dist/index.d.ts:164</p><hr><h3 id="hasvalueat" tabindex="-1">hasValueAt <a class="header-anchor" href="#hasvalueat">¶</a></h3><p>▸ <strong>hasValueAt</strong>(<code>lon</code>, <code>lat</code>): <code>boolean</code></p><h4 id="parameters-5" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-5">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>lon</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>lat</code></td><td style="text-align:left;"><code>number</code></td></tr></tbody></table><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9">¶</a></h4><p><code>boolean</code></p><h4 id="defined-in-11" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-11">¶</a></h4><p>core/dist/index.d.ts:165</p><hr><h3 id="valueatindexes" tabindex="-1">valueAtIndexes <a class="header-anchor" href="#valueatindexes">¶</a></h3><p>▸ <strong>valueAtIndexes</strong>(<code>i</code>, <code>j</code>): <code>null</code> | <code>Vector</code></p><p>Value for grid indexes</p><h4 id="parameters-6" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-6">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code>i</code></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">column index (integer)</td></tr><tr><td style="text-align:left;"><code>j</code></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">row index (integer)</td></tr></tbody></table><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10">¶</a></h4><p><code>null</code> | <code>Vector</code></p><h4 id="defined-in-12" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-12">¶</a></h4><p>core/dist/index.d.ts:213</p><hr><h3 id="lonlatatindexes" tabindex="-1">lonLatAtIndexes <a class="header-anchor" href="#lonlatatindexes">¶</a></h3><p>▸ <strong>lonLatAtIndexes</strong>(<code>i</code>, <code>j</code>): <code>number</code>[]</p><p>Lon-Lat for grid indexes</p><h4 id="parameters-7" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-7">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code>i</code></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">column index (integer)</td></tr><tr><td style="text-align:left;"><code>j</code></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">row index (integer)</td></tr></tbody></table><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11">¶</a></h4><p><code>number</code>[]</p><p>[lon, lat]</p><h4 id="defined-in-13" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-13">¶</a></h4><p>core/dist/index.d.ts:220</p><hr><h3 id="randomize" tabindex="-1">randomize <a class="header-anchor" href="#randomize">¶</a></h3><p>▸ <strong>randomize</strong>(<code>o</code>, <code>width</code>, <code>height</code>, <code>unproject</code>): <code>IPosition</code></p><p>生成粒子位置</p><h4 id="parameters-8" tabindex="-1">Parameters <a class="header-anchor" href="#parameters-8">¶</a></h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>o</code></td><td style="text-align:left;"><code>undefined</code> | <code>IPosition</code></td></tr><tr><td style="text-align:left;"><code>width</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>height</code></td><td style="text-align:left;"><code>number</code></td></tr><tr><td style="text-align:left;"><code>unproject</code></td><td style="text-align:left;">(<code>a</code>: <code>number</code>[]) =&gt; <code>null</code> | [<code>number</code>, <code>number</code>]</td></tr></tbody></table><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12">¶</a></h4><p><code>IPosition</code></p><p>IPosition</p><h4 id="defined-in-14" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-14">¶</a></h4><p>core/dist/index.d.ts:241</p><hr><h3 id="checkfields" tabindex="-1">checkFields <a class="header-anchor" href="#checkfields">¶</a></h3><p>▸ <strong>checkFields</strong>(): <code>boolean</code></p><p>判断是否是 <code>Field</code> 的实例</p><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13">¶</a></h4><p><code>boolean</code></p><p>boolean</p><h4 id="defined-in-15" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in-15">¶</a></h4><p>core/dist/index.d.ts:246</p>',147),l=[n];function i(o,c,h,s,f,p){return d(),t("div",null,l)}const b=e(r,[["render",i]]);export{u as __pageData,b as default};
