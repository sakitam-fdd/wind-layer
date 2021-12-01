const { createTypeDocApp } = require('./markdown');
const path = require('path');

createTypeDocApp({
  name: 'API Documentation',
  tsconfig: path.resolve(__dirname, '../tsconfig.docs.json'),
  // entryPointStrategy: 'packages',
  githubPages: true,
  disableSources: true,
  entryPoints: [
    path.resolve(__dirname, '../../packages/core/src/index.ts'),
    path.resolve(__dirname, '../../packages/leaflet/src/index.ts'),
  ],
}).build();
