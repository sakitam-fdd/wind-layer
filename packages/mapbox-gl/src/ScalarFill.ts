import mapboxgl from 'mapbox-gl';

function isValide(val) {
  return val !== undefined && val !== null && !isNaN(val);
}

function getCoords(lng: number, lat: number) {
  const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat({
    lng,
    lat,
  });
  return [
    mercatorCoordinate.x,
    mercatorCoordinate.y,
  ];
}

export default class ScalarFill {
  constructor(id, options = {}) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '2d';
    this.options = options;
  }

  onAdd(map, gl) {
    this.gl = gl;
    this.map = map;

    if (this.data) {
      this.initialize(map, gl);
    }
  }

  getField(gl, data) {
    let pos;
    if (data.isGfs) {
      const data1 = data[0];
      const min = Math.min.apply(null, data1.data);
      const max = Math.max.apply(null, data1.data);
      const velocityData = [];
      for (let i = 0; i < data1.data.length; i++) {
        const r = Math.floor(255 * (data1.data[i] - min) / (max - min));
        velocityData.push(r);
        velocityData.push(0);
        velocityData.push(0);
        velocityData.push(255);
      }

      pos = [
        ...getCoords(uData.header.lo1, uData.header.la1),
        ...getCoords(uData.header.lo1, uData.header.la2),
        ...getCoords(uData.header.lo2, uData.header.la1),

        ...getCoords(uData.header.lo2, uData.header.la1),
        ...getCoords(uData.header.lo1, uData.header.la2),
        ...getCoords(uData.header.lo2, uData.header.la2),
      ];

      this.quadBuffer = util.createBuffer(
        gl,
        new Float32Array(pos),
      );

      return {
        width: data.header.nx,
        height: data.header.ny,
        min,
        max,
        texture: util.createTexture(gl, gl.LINEAR, new Uint8Array(velocityData), uData.header.nx, uData.header.ny),
      };
    } else {
      // const image = loadImage(data.url);
      const image = data.image;
      pos = [
        ...getCoords(...data.extent[0]),
        ...getCoords(...data.extent[1]),
        ...getCoords(...data.extent[2]),

        ...getCoords(...data.extent[2]),
        ...getCoords(...data.extent[1]),
        ...getCoords(...data.extent[3]),
      ];

      this.quadBuffer = util.createBuffer(
        gl,
        new Float32Array(pos),
      );

      return {
        width: data.width,
        height: data.height,
        min: data.min,
        max: data.max,
        texture: util.createTexture(gl, gl.LINEAR, image, image.width, image.height),
      };
    }
  }

  setWind(data) {
    if (this.gl) {
      this.data = this.getField(this.gl, data);
    }
    if (this.map) {
      this.initialize(this.map, this.gl);
      this.map.triggerRepaint();
    }
  }

  zoom() {
    Object.entries(this._zoomUpdatable).forEach(([k, v]) => {
      this._setPropertyValue(k, v);
    });
  }

  draw() {

  }

  // This is called when the map is destroyed or the gl context lost.
  onRemove(map) {
    delete this.gl;
    delete this.map;
    map.off('zoom', this.zoom);
  }

  render(gl, matrix) {
    if (this.data) {
      // const bounds = this.map.getBounds();
      // const eastIter = Math.max(0, Math.ceil((bounds.getEast() - 180) / 360));
      // const westIter = Math.max(0, Math.ceil((bounds.getWest() + 180) / -360));
      this.draw(matrix, 0);
      // for (let i = 1; i <= eastIter; i++) {
      //   // this.wind.render(this.map, matrix, i);
      //   this.draw(gl, matrix, i);
      // }
      // for (let i = 1; i <= westIter; i++) {
      //   this.draw(gl, matrix, -i);
      // }
    }
  }
}
