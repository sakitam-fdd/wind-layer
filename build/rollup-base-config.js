// Config file for running Rollup in "normal" mode (non-watch)

const path = require('path');
const babel = require('rollup-plugin-babel'); // ES2015 tran
const cjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const eslint = require('rollup-plugin-eslint');
const friendlyFormatter = require("eslint-friendly-formatter");
const _package = require('../package.json');
const eslintConfig = require('../.eslintrc');
const time = new Date();
const year = time.getFullYear();
const banner = `/*!\n * author: ${_package.author} 
 * ${_package.name} v${_package.version}
 * build-time: ${year}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}
 * LICENSE: ${_package.license}
 * (c) 2017-${year} ${_package.homepage}\n */`;

const resolve = _path => path.resolve(__dirname, '../', _path);
const lowerFirstChart = str => {
  return (str.replace(/( |^)[A-Z]/g, (L) => L.toLowerCase()))
}

const input = process.env.input;
const namespace = process.env.file;
const file = namespace === 'windlayer' ? lowerFirstChart(namespace) : namespace;

const genConfig = (opts) => {
  const config = {
    watch: false,
    input: {
      input: resolve(`src/${input}`),
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
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      globals: {},
      name: namespace
    }
  };
  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return config
}

const handleMinEsm = name => {
  if (typeof name === 'string') {
    let arr_ = name.split('.');
    let arrTemp = [];
    arr_.forEach((item, index) => {
      if (index < arr_.length - 1) {
        arrTemp.push(item)
      } else {
        arrTemp.push('min');
        arrTemp.push(item)
      }
    });
    return arrTemp.join('.');
  }
}

module.exports = [
  {
    file: resolve(`dist/${file}.js`),
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
].map(genConfig);
