import * as mapboxgl from 'mapbox-gl';
import { ScalarFill as ScalarCore } from 'wind-gl-core';

function getCoords([lng, lat]: [number, number]): [number, number] {
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
  private gl: WebGLRenderingContext;
  private map: mapboxgl.Map;
  private id: string;
  private type: string;
  private renderingMode: '2d' | '3d';
  private options: any;
  private data: any;
  private scalarFill: ScalarCore;

  constructor(id: string, data: any, options = {}) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '2d';
    this.options = options;

    this.data = data;

    this.handleZoom = this.handleZoom.bind(this);
  }

  handleZoom() {
    if (this.scalarFill) {
      this.scalarFill.handleZoom();
    }
  }

  initialize() {
    if (!this.scalarFill && this.gl) {
      this.scalarFill = new ScalarCore(this.gl, {
        opacity: this.options.opacity,
        renderForm: this.options.renderForm,
        styleSpec: this.options.styleSpec,
        getZoom: () => this.map.getZoom(),
        triggerRepaint: () => {
          this.map.triggerRepaint();
        }
      });

      this.scalarFill.getMercatorCoordinate = getCoords;

      this.map.on('zoom', this.handleZoom);
    }

    this.scalarFill.setData(this.data);
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.gl = gl;
    this.map = map;

    if (this.map) {
      this.initialize();
    }
  }

  setData(data: any) {
    this.data = data;
    if (this.map) {
      this.initialize();
    }
  }

  // This is called when the map is destroyed or the gl context lost.
  onRemove(map: mapboxgl.Map) {
    delete this.gl;
    delete this.map;
    map.off('zoom', this.handleZoom);
  }

  render(gl: WebGLRenderingContext, matrix: number[]) {
    if (this.data && this.scalarFill) {
      const bounds = this.map.getBounds();
      const eastIter = Math.max(0, Math.ceil((bounds.getEast() - 180) / 360));
      const westIter = Math.max(0, Math.ceil((bounds.getWest() + 180) / -360));
      this.scalarFill.render(matrix, 0);
      for (let i = 1; i <= eastIter; i++) {
        // this.wind.render(this.map, matrix, i);
        this.scalarFill.render(matrix, i);
      }
      for (let i = 1; i <= westIter; i++) {
        this.scalarFill.render(matrix, -i);
      }
    }
  }
}
