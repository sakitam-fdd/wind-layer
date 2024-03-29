# colorScale

## 1.x [wind-core](../api/wind-core/index) 对应的颜色配置

关于颜色配置，在以往的配置中传入的是颜色数组会根据以下函数和格点数据的数据范围去计算匹配的颜色值，
```js
const indexFor = function (m) {  // map velocity speed to a style
    return Math.max(0, Math.min((that.COLOR_SCALE.length - 1),
      Math.round((m - min) / (max - min) * (that.COLOR_SCALE.length - 1))));
    
}
```

这样实现只能按照风速值范围等间隔渲染，无法做到精确匹配对应值的颜色。

在最新的版本中新增了此参数的类型，可以通过回调函数精确对应颜色值（但是会有一定的性能损失）

颜色配置支持三种方式：

- `String`：固定颜色值
- `Function`: 通过回调函数的风速值设定颜色（但是会有一定的性能损失）
- `String[]`: 按照风速值范围等间隔渲染，无法做到精确匹配对应值的颜色。

示例：

对应各个图层的 `options` 配置的 `windOptions` 中的 `colorScale`，其类型可以为以上三种

```ts
windOptions: {
    colorScale: [
      'rgb(36,104, 180)',
      'rgb(60,157, 194)',
      'rgb(128,205,193 )',
      'rgb(151,218,168 )',
      'rgb(198,231,181)',
      'rgb(238,247,217)',
      'rgb(255,238,159)',
      'rgb(252,217,125)',
      'rgb(255,182,100)',
      'rgb(252,150,75)',
      'rgb(250,112,52)',
      'rgb(245,64,32)',
      'rgb(237,45,28)',
      'rgb(220,24,32)',
      'rgb(180,0,35)',
    ],
},
```


## 2.x [wind-gl-core](../api/wind-gl-core/index) 对应的颜色配置（一般用于色斑图或者流体场、Arrow 图层的着色）

这个核心库中实现了 [mapbox-gl-style-spec](https://www.npmjs.com/package/@mapbox/mapbox-gl-style-spec) 的简单的渐变、分段渲染，并且
能够根据地图 zoom 层级进行插值渲染。

使用方式如以下方式：

- fill-color 的第一个参数可以为 `interpolate` 或者 `rasterize`，分别代表使用插值或者非插值方式，相关示例请查看 []()。
- fill-color 的第二个参数可以为 `['linear']` 获取 `['step', number]`，分别代表颜色是线性插值还是分段，相关示例请查看 []()。
- fill-color 的第三个参数固定为 `['get', 'value']`， 目前无实际意义，仅仅是为了统一和 mapbox 的样式规范和作为一个说明。

```ts
const layer = new Layer('wind', source, {
    styleSpec: {
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0,
            'rgba(98,113,183,255)',
            1,
            'rgba(57,97,159,255)',
            3,
            'rgba(74,148,169,255)',
            5,
            'rgba(77,141,123,255)',
            7,
            'rgba(83,165,83,255)',
            9,
            'rgba(53,159,53,255)',
            11,
            'rgba(167,157,81,255)',
            13,
            'rgba(159,127,58,255)',
            15,
            'rgba(161,108,92,255)',
            17,
            'rgba(129,58,78,255)',
            19,
            'rgba(175,80,136,255)',
            21,
            'rgba(117,74,147,255)',
            24,
            'rgba(109,97,163,255)',
            27,
            'rgba(68,105,141,255)',
            29,
            'rgba(92,144,152,255)',
            36,
            'rgba(125,68,165,255)',
            46,
            'rgba(231,215,215,256)',
            51,
            'rgba(219,212,135,256)',
            77,
            'rgba(205,202,112,256)',
            104,
            'rgba(128,128,128,255)'
        ],
        opacity: 1,
    },
});
```

