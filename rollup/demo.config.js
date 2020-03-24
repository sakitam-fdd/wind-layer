import path from 'path';
import json from '@rollup/plugin-json';
// import babel from 'rollup-plugin-babel';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

const resolve = _path => path.resolve(__dirname, '../', _path);

const config = {
  input: [
    resolve('examples/index.ts'),
  ],
  output: {
    // file: './examples/index.js',
    format: 'iife',
    // name: _package.namespace,
    banner: '',
    dir: './examples/bundle',
    sourceMap: 'inline',
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    json({
      indent: ' '
    }),
    // tslint({
    //   exclude: [
    //     'node_modules/**',
    //   ]
    // }),
    typescript({
      tsconfig: 'tsconfig.demo.json',
    }),
    // babel({
    //   exclude: [
    //     resolve('node_modules/**')
    //   ]
    // }),
    nodeResolve({
      mainFields: ['module', 'main'], // Default: ['module', 'main']
      browser: true,  // Default: false
      extensions: [ '.mjs', '.js', '.json', '.node', 'jsx', 'ts' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]
      preferBuiltins: true,  // Default: true
    }),
    commonjs(),
    buble({
      objectAssign: true,
      transforms: { generator: false },
    }),
  ],
  external: undefined
};

// Use multiple entry points in your rollup bundle.
// config.plugins.push(multiEntry({
//   exports: false
// }));

export default config;
