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
import { terser } from 'rollup-plugin-terser';

const rq = createRequire(import.meta.url);
const pkg = rq('./package.json');
const ROOT = fileURLToPath(import.meta.url);
const DEV = process.env.NODE_ENV === 'development';
const MINIFY = process.env.MINIFY;
const PROD = !DEV;

const r = (p: string) => resolve(ROOT, '..', p);

const umdExternal = [
  'ol',
  'ol/size',
  'ol/layer',
  'ol/PluggableMap',
  'ol/coordinate',
  'ol/proj',
  'ol/transform',
  'ol/extent',
  'ol/renderer/canvas/Layer',
  'ol/source/ImageCanvas',
  'ol/renderer/Map',
  'ol/renderer/canvas/ImageLayer'
];

const external = [
  ...umdExternal,
  ...Object.keys(pkg.dependencies),
];

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
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild({ target: 'esnext', sourceMap: true }),
  json({
    namedExports: true,
  }),
];

const esmBuild: RollupOptions = {
  input: r('src/index.ts'),
  output: {
    format: 'esm',
    file: pkg.module,
    sourcemap: true,
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
};

const cjsBuild: RollupOptions = {
  input: r('src/index.ts'),
  output: {
    format: 'cjs',
    file: pkg.commonjs,
    sourcemap: true,
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning);
  },
}

const umdBuild: RollupOptions = {
  input: r('src/index.ts'),
  output: {
    format: 'umd',
    dir: undefined,
    name: pkg.namespace,
    sourcemap: !MINIFY,
    file: MINIFY ? pkg.main.split('.').splice(pkg.main.split('.').length - 1, 0, 'min').join('.') : pkg.main,
    globals: {
      ol: 'ol',
      'ol/size': 'src.size',
      'ol/layer': 'src.layer',
      'ol/proj': 'src.proj',
      'ol/transform': 'src.transform',
      'ol/source/ImageCanvas': 'src.source.ImageCanvas',
      'ol/PluggableMap': 'src.PluggableMap',
      'ol/coordinate': 'src.coordinate',
      'ol/extent': 'src.extent',
      'ol/renderer/canvas/Layer': 'src.renderer.canvas.ImageLayer', // CanvasLayer is not export
      'ol/renderer/Map': 'src.renderer.canvas.Map',
      'ol/renderer/canvas/ImageLayer': 'src.renderer.canvas.ImageLayer',
    },
  },
  external: umdExternal,
  plugins: [
    ...plugins,
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

const config = defineConfig([]);

config.push(esmBuild);
config.push(umdBuild);

if (PROD) {
  config.push(cjsBuild);
}

config.push(typesBuild);

export default config;
