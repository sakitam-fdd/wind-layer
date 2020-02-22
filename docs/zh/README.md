---
home: true
title: wind-layer
description: 风场插件.
actionText: 开始使用
actionLink: /start/
footer: sakitam-fdd
---

## wind-layer

a [openlayers](http://openlayers.org) | [bmap](https://map.baidu.com/) | [amap](https://ditu.amap.com/) | [maptalks](https://maptalks.org/) extension to windjs

### 版本

目前最新版本为`v1.0.0`体验版。

### 安装

#### 使用 npm 或 yarn 安装

::: tip
**我们推荐使用 npm 或 yarn 的方式进行开发**，
不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，
享受整个生态圈和工具链带来的诸多好处。
:::

```bash
# npm
npm install wind-layer

# yarn
yarn add wind-layer
```

#### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 ``。

我们在仓库发布包内的 `dist` 目录下提供了 `` 以及 ``；

```html
<script src=""></script>
```

### 示例

```html
<template>
  <div class="demo-content">
    <m-map
      ref="map"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
    >
      <m-tile-layer
        :url="'http://{s}.tile.osm.org/{z}/{x}/{y}.png'"
        :subdomains="subdomain" :renderer="'gl'"></m-tile-layer>
    </m-map>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        center: [120.2, 30.2],
        subdomain: ['a', 'b', 'c'],
        zoom: 2,
      };
    },
    watch: {},
    mounted() {},
    methods: {},
  };
</script>
<style lang="less">
  .demo-content {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #cbe0ff;
  }
</style>
```

引入样式：

```jsx
```
