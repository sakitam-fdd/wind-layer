# `wind-gl-core`

> wind-gl-core core

## Usage

```js
import ScalarCore from 'wind-gl-core';
this.scalarRender = new ScalarCore(this.gl, {
  opacity: opt.opacity,
  renderForm: opt.renderForm,
  styleSpec: opt.styleSpec,
  getZoom: () => this.getMap().getZoom(),
  triggerRepaint: () => {
    this._redraw();
  }
});

this.scalarRender.getMercatorCoordinate = ([lng, lat]: [number, number]) => {
  const coords = map.coordToPoint(new Coordinate(lng, lat), map.getGLZoom());
  return [
    coords.x,
    coords.y,
  ];
};

this.getMap().on('zoom', this.handleZoom, this);

this.scalarRender.setData(data);
```
