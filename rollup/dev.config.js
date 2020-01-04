import { banner, pkg, resolve } from './utils';
import baseConfig from './base.config';

const common = {
  banner,
  extend: false,
  globals: {
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
