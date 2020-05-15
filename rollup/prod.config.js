// import { uglify } from 'rollup-plugin-uglify';
import { terser } from 'rollup-plugin-terser';
import { banner, pkg, resolve, handleMinEsm } from './utils';
import baseConfig from './base.config';

import { globals as olGlobals } from './external/ol';
import { globals as maptalksGlobals } from './external/maptalks';
import { globals as openlayersGlobals } from './external/openlayers';
import { globals as leafletGlobals } from './external/leaflet';
import { globals as mapboxGlobals } from './external/mapbox';

const extend = process.env.extend;

const common = {
  banner: banner,
  extend: !!extend,
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
      file: resolve(handleMinEsm(pkg.main)),
      format: 'umd',
      name: pkg.namespace,
      ...common,
    }
  ],
  treeshake: true,
});

config.plugins.push(terser());

export default config;
