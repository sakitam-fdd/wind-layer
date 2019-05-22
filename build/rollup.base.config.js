
// Config file for running Rollup in "normal" mode (non-watch)
const path = require('path');
const buble = require('rollup-plugin-buble');
const json = require('rollup-plugin-json');
const cjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const { eslint } = require('rollup-plugin-eslint');
const friendlyFormatter = require('eslint-friendly-formatter');

const { _package } = require('./utils');

const resolve = _path => path.resolve(__dirname, '../', _path);

module.exports = {
  input: resolve('src/index.js'),
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    json({
      // include: resolve('package.json'),
      indent: ' '
    }),
    eslint({
      configFile: resolve('.eslintrc.js'),
      formatter: friendlyFormatter,
      exclude: [
        '**/**.css',
        '**/**.scss',
        '**/**.less',
        resolve('node_modules')
      ]
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    cjs(),
    buble({
      objectAssign: true
    }),
  ],
  external: ['maptalks'],
};
