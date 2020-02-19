import { banner, pkg, resolve } from './utils';
import baseConfig from './base.config';
import { globals as olGlobals } from './external/ol';
import { globals as maptalksGlobals } from './external/maptalks';
import { globals as openlayersGlobals } from './external/openlayers';

const common = {
  banner,
  extend: false,
  // exports: 'named',
  globals: {
    ...olGlobals,
    ...maptalksGlobals,
    ...openlayersGlobals,
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
