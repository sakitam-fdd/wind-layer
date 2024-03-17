const { createTypeDocApp } = require('./markdown');
const path = require('path');

createTypeDocApp({
  name: 'Class Docs',
  tsconfig: path.resolve(__dirname, '../tsconfig.docs.json'),
  githubPages: true,
  disableSources: false,
  entryPoints: [
    path.resolve(__dirname, '../../packages/core/src/index.ts'),
    path.resolve(__dirname, '../../packages/gl-core/src/index.ts'),
    path.resolve(__dirname, '../../packages/maptalks/src/index.ts'),
    path.resolve(__dirname, '../../packages/mapbox-gl/src/index.ts'),
    path.resolve(__dirname, '../../packages/maplibre-gl/src/index.ts'),
    path.resolve(__dirname, '../../packages/src/src/index.ts'),
    path.resolve(__dirname, '../../packages/ol5/src/index.ts'),
    path.resolve(__dirname, '../../packages/openlayers/src/index.ts'),
    path.resolve(__dirname, '../../packages/leaflet/src/index.ts'),
    path.resolve(__dirname, '../../packages/amap/src/index.ts'),
    path.resolve(__dirname, '../../packages/bmap/src/index.ts'),
    path.resolve(__dirname, '../../packages/rbush/src/index.ts'),
    path.resolve(__dirname, '../../packages/particles-poc/src/index.ts'),
  ],
}).build();
