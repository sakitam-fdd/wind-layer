## colorScale

关于颜色配置，在以往的配置中传入的是颜色数组会根据以下函数和格点数据的数据范围去计算匹配的颜色值，
```js
const indexFor = function (m) {  // map velocity speed to a style
    return Math.max(0, Math.min((that.COLOR_SCALE.length - 1),
      Math.round((m - min) / (max - min) * (that.COLOR_SCALE.length - 1))));
    
}
```

这样实现只能按照风速值范围等间隔渲染，无法做到精确匹配对应值的颜色。

在最新的版本中新增了此参数的类型，可以通过回调函数精确对应颜色值（但是会有一定的性能损失）

```js

```
