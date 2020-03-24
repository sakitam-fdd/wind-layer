// Config file for running Rollup in "normal" mode (non-watch)
import json from '@rollup/plugin-json';
// import babel from 'rollup-plugin-babel';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { resolve } from './utils';
import { external as olExternal } from './external/ol';
import { external as maptalksExternal } from './external/maptalks';
import { external as openlayersExternal } from './external/openlayers';

const input = process.env.input;

export default {
  input: resolve(input),
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
      // clean: true,
      // useTsconfigDeclarationDir: true,
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    json({
      indent: ' '
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
  external: [
    ...olExternal,
    ...maptalksExternal,
    ...openlayersExternal,
  ]
};
