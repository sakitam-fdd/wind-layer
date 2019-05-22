const { banner } = require('../../../scripts/utils');
const baseConfig = require('../../../rollup/rollup-base');

const _package = require('../package.json');
const bannerString = banner(_package);

const common = {
  banner: bannerString,
  extend: true,
  globals: {
    'maptalks': 'maptalks'
  },
};

module.exports = Object.assign(baseConfig, {
  output: [
    {
      file: _package.main,
      format: 'umd',
      name: _package.namespace,
      ...common,
    },
    {
      file: _package.commonjs,
      format: 'cjs',
      ...common,
    },
    {
      file: _package.module,
      format: 'es',
      ...common,
    }
  ]
});
