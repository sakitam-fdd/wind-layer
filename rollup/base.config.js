// Config file for running Rollup in "normal" mode (non-watch)
// import fs from 'fs';
// import path from 'path';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import tslint from 'rollup-plugin-tslint';
import { resolve } from './utils';

const input = process.env.input;

module.exports = {
  input: resolve(input),
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    json({
      indent: ' '
    }),
    tslint({
      exclude: [
        'node_modules/**',
      ]
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
    }),
    babel({
      exclude: [
        resolve('node_modules/**')
      ]
    }),
    nodeResolve({
      mainFields: ['module', 'main'], // Default: ['module', 'main']
      browser: true,  // Default: false
      extensions: [ '.mjs', '.js', '.json', '.node', 'jsx', 'ts' ],  // Default: [ '.mjs', '.js', '.json', '.node' ]
      preferBuiltins: true,  // Default: true
    }),
    commonjs(),
  ],
  external: []
};
