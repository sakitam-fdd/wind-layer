# `ol-wind`

> [openlayers](https://openlayers.org/) wind layer adapter

## Usage

### Install

```bash
pnpm i ol-wind -S
```

### Example

```js
import { WindLayer } from 'ol-wind';

const windLayer = new WindLayer(res, {
    forceRender: false,
    windOptions: {
      // colorScale: scale,
      velocityScale: 1 / 20,
      paths: 5000,
      // eslint-disable-next-line no-unused-vars
      colorScale: () => {
        // console.log(m);
        return '#ff473c';
      },
      width: 3,
      // colorScale: scale,
      generateParticleOption: false
    },
    // map: map,
    // projection: 'EPSG:4326'
});
    
console.log(map, windLayer);
    
map.addLayer(windLayer);
```
