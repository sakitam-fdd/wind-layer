const { uglify }  = require('rollup-plugin-uglify');
const {
  _package, banner,
  handleMinEsm, lowerFirstChart,
} = require('./utils');
const baseConfig = require('./rollup.base.config');
const ol = require('./ol/globals');

const common = {
  banner: banner,
  extend: false,
  globals: {
    ...ol,
    'maptalks': 'maptalks',
  },
};

const namespace = process.env.file;
const file = namespace === 'windlayer' ? lowerFirstChart(namespace) : namespace;

const config = Object.assign(baseConfig, {
  output: [
    {
      file: `dist/${file}.min.js`,
      format: 'umd',
      name: _package.namespace,
      ...common,
    }
  ]
});

config.plugins.push(uglify());

module.exports = config;
