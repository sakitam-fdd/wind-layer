import fs from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { RollupOptions, defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import glslify from 'rollup-plugin-glslify';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import sourcemaps from 'rollup-plugin-sourcemaps';

import { terser } from 'rollup-plugin-terser';

const rq = createRequire(import.meta.url);
const pkg = rq('./package.json');
const ROOT = fileURLToPath(import.meta.url);
const DEV = process.env.NODE_ENV === 'development';
const MINIFY = process.env.MINIFY;
const PROD = !DEV;

const r = (p: string) => resolve(ROOT, '..', p);

const external = [];

const plugins = [
  alias({
    entries: [
      { find: '@', replacement: r('./src') },
    ],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    preventAssignment: true,
  }),
  glslify(),
  json({
    namedExports: true,
  }),
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild({ target: 'node14' }),
];

const amdBuild: RollupOptions = {
  input: [r('src/index.ts'), r('src/worker.ts')],
  output: {
    format: 'amd',
    dir: 'dist/build/wgw',
    sourcemap: 'inline',
    indent: false,
    chunkFileNames: 'shared.js'
  },
  external,
  plugins,
  treeshake: !!MINIFY,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
};

const esmBuild: RollupOptions = {
  input: r('bundle/index.js'),
  output: {
    format: 'esm',
    file: pkg.module,
    sourcemap: true,
    indent: false,
    intro: fs.readFileSync('./bundle/prelude.js', 'utf8'),
  },
  external,
  plugins: [
    sourcemaps(),
  ],
  treeshake: false,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
};

const cjsBuild: RollupOptions = {
  input: r('bundle/index.js'),
  output: {
    format: 'cjs',
    file: pkg.commonjs,
    sourcemap: true,
    indent: false,
    intro: fs.readFileSync('./bundle/prelude.js', 'utf8'),
  },
  external,
  plugins: [
    sourcemaps(),
  ],
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
}

const umdBuild: RollupOptions = {
  input: r('bundle/index.js'),
  output: {
    format: 'umd',
    dir: undefined,
    name: pkg.namespace,
    sourcemap: !MINIFY,
    globals: {
    },
    file: MINIFY ? pkg.main.split('.').splice(pkg.main.split('.').length - 1, 0, 'min').join('.') : pkg.main,
    indent: false,
    intro: fs.readFileSync('./bundle/prelude.js', 'utf8'),
  },
  external,
  plugins: [
    sourcemaps(),
    ...(MINIFY ? [
      terser(),
    ] : []),
  ],
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
};

const typesBuild: RollupOptions = {
  input: r('src/index.ts'),
  output: {
    format: 'esm',
    file: pkg.types,
  },
  external,
  plugins: [
    dts({ respectExternal: true }),
  ],
};

const config = defineConfig([
  amdBuild,
]);

config.push(esmBuild);
config.push(umdBuild);

if (PROD) {
  config.push(cjsBuild);
}

config.push(typesBuild);

export default config;
