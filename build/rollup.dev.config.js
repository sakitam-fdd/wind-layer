const serve = require('rollup-plugin-serve');
const {
  resolve, banner, lowerFirstChart,
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

let config;
const namespace = process.env.file;
const file = namespace === 'windlayer' ? lowerFirstChart(namespace) : namespace;

if (process.env.NODE_ENV === 'demo') {
  config = Object.assign(baseConfig, {
    output: [
      {
        file: resolve(`examples/${file}.js`),
        format: 'iife',
        // name: _package.namespace,
        banner: '',
        sourceMap: 'inline',
        // name: namespace,
      }
    ]
  })
} else {
  config = Object.assign(baseConfig, {
    output: [
      {
        file: resolve(`dist/${file}.js`),
        format: 'umd',
        name: namespace,
        ...common,
      },
      {
        file: `dist/${file}.common.js`,
        format: 'cjs',
        ...common,
      },
      {
        file: `dist/${file}.esm.js`,
        format: 'es',
        ...common,
      }
    ]
  });
}

// if (process.env.NODE_ENV === 'development') {
//   config.plugins.push(// Default options
//     serve({
//       open: true,
//       contentBase: [
//         'examples',
//         'dist',
//       ],
//       host: '127.0.0.1',
//       port: 2334,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       }
//     })
//   );
// }

module.exports = config;
