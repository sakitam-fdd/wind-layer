// Config file for running Rollup in "normal" mode (non-watch)

const path = require('path');
const babel = require('rollup-plugin-babel'); // ES2015 tran
const cjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const eslint = require('rollup-plugin-eslint');
const friendlyFormatter = require("eslint-friendly-formatter");
const _package = require('../package.json')
const eslintConfig = require('../.eslintrc')
const year = new Date().getFullYear();
const banner = `/*!\n * ${_package.name} v${_package.version}\n * LICENSE : ${_package.license}\n * (c) 2017-${year} ${_package.homepage}\n */`;

const resolve = _path => path.resolve(__dirname, '../', _path)

const genConfig = (opts) => {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        eslint(Object.assign({}, eslintConfig, {
          formatter: friendlyFormatter,
          exclude: [resolve('node_modules')]
        })),
        babel({
          exclude: 'node_modules/**' // only transpile our source code
        }),
        nodeResolve({
          jsnext: true,
          main: true,
          browser: true
        }),
        cjs()
      ],
      external: ['openlayers']
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      globals: {
        openlayers: 'ol'
      },
      name: _package.namespace
    }
  }
  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return config
}

const handleMinEsm = name => {
  if (typeof name === 'string') {
    let arr_ = name.split('.')
    let arrTemp = []
    arr_.forEach((item, index) => {
      if (index < arr_.length - 1) {
        arrTemp.push(item)
      } else {
        arrTemp.push('min')
        arrTemp.push(item)
      }
    })
    return arrTemp.join('.')
  }
}

module.exports = [
  {
    file: resolve(_package.unpkg),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve(handleMinEsm(_package.unpkg)),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve(_package.main),
    format: 'cjs'
  },
  {
    file: resolve(_package.module),
    format: 'es'
  }
].map(genConfig)
