import type { AnyLayer } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TileSource, Layer, RenderType } from '@sakitam-gis/mapbox-wind';

mapboxgl.accessToken = 'pk.eyJ1IjoidTEwaW50IiwiYSI6InQtMnZvTkEifQ.c8mhXquPE7_xoB3P4Ag8cA';

const map = new mapboxgl.Map({
  container: 'map',
  // style: 'mapbox://styles/mapbox/satellite-streets-v12',
  style: {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: {
          visibility: 'none',
        },
      },
    ],
  },
  center: { lng: 105.70150033978689, lat: 22.76021405309811 }, // starting position [lng, lat]
  zoom: 0, // starting zoom
  antialias: true,
});

map.on('load', async () => {
  const source = new TileSource('temp', {
    tileSize: 256,
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    minZoom: 0,
    maxZoom: 18,
    roundZoom: true,
    subdomains: ['a', 'b', 'c', 'd'],
    wrapX: true,
    // tileBounds: [-90, -45, 90, 45],
  });

  let flag = 0;
  map.on('click', () => {
    if (flag === 0) {
      flag = 1;
      source.update({ url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' }, false);
    } else {
      flag = 0;
      source.update({ url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' }, false);
    }
  });

  const layer = new Layer('temp', source, {
    styleSpec: {
      'fill-color': ['interpolate', ['step', 3], ['get', 'value'], 0, '#000', 1, '#fff'],
      opacity: ['interpolate', ['exponential', 0.5], ['zoom'], 1, 1, 2, 1],
    },
    renderType: RenderType.image,
    picking: true,
  });

  map.addLayer(layer as unknown as AnyLayer);

  map.on('click', (e) => {
    layer.picker(e.lngLat).then((v) => {
      console.log(v);
    });
  });
});
