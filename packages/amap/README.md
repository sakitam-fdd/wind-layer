# `amap-wind`

> [amap](https://amap.com) wind layer adapter

## Usage

### Install

```bash
pnpm i amap-wind -D
```

### Example

```tsx
requireSDK('//webapi.amap.com/maps?v=1.4.2', '6cb85da518029607d421917b7ddeb94a', 'webapi.amap.com')
  .then(flag => {
    if (flag) {
      const map = new AMap.Map('amap', {
        resizeEnable: true,
        zoom: 0,
        center: [113.53450137499999, 34.44104525],
        zooms: [0, 18]
      });

      import('amap-wind').then(({ WindLayer }) => {
        fetch(this.$withBase('/data/wind.json'))
          .then(res => res.json())
          .then(res => {
            const windLayer = new WindLayer(res, {
              windOptions: {
                // colorScale: scale,
                velocityScale: 1 / 20,
                paths: 5000,
                // eslint-disable-next-line no-unused-vars
                colorScale: [
                  "rgb(36,104, 180)",
                  "rgb(60,157, 194)",
                  "rgb(128,205,193 )",
                  "rgb(151,218,168 )",
                  "rgb(198,231,181)",
                  "rgb(238,247,217)",
                  "rgb(255,238,159)",
                  "rgb(252,217,125)",
                  "rgb(255,182,100)",
                  "rgb(252,150,75)",
                  "rgb(250,112,52)",
                  "rgb(245,64,32)",
                  "rgb(237,45,28)",
                  "rgb(220,24,32)",
                  "rgb(180,0,35)"
                ],
                lineWidth: 2,
                // colorScale: scale,
                generateParticleOption: false
              },
              zIndex: 20,
            });

            console.log(map, windLayer);

            windLayer.appendTo(map);
          });
      });
    }
  })
  .catch(e => console.error(e));
```
