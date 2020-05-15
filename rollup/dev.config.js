import { banner, pkg, resolve } from './utils';
import baseConfig from './base.config';
import { globals as olGlobals } from './external/ol';
import { globals as maptalksGlobals } from './external/maptalks';
import { globals as openlayersGlobals } from './external/openlayers';
import { globals as leafletGlobals } from './external/leaflet';
import { globals as mapboxGlobals } from './external/mapbox';

const extend = process.env.extend;

const common = {
  banner,
  extend: !!extend,
  // exports: 'named',
  globals: {
    ...olGlobals,
    ...maptalksGlobals,
    ...openlayersGlobals,
    ...leafletGlobals,
    ...mapboxGlobals,
  },
};


const config = Object.assign(baseConfig, {
  output: [
    {
      file: resolve(pkg.main),
      format: 'umd',
      name: pkg.namespace,
      ...common,
    },
    {
      file: resolve(pkg.commonjs),
      format: 'cjs',
      ...common,
    },
    {
      file: resolve(pkg.module),
      format: 'es',
      ...common,
    },
  ],
});

export default config;
