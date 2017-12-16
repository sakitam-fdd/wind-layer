// Karma configuration
// Generated on Wed Nov 22 2017 10:48:56 GMT+0800 (中国标准时间)
const path = require('path');
const _package = require('../package.json');
const babel = require('rollup-plugin-babel');
const resolve = _path => path.resolve(__dirname, '../', _path)
module.exports = {

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '..',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha', 'expect'],

  // list of files / patterns to load in the browser
  files: [
    'node_modules/openlayers/dist/ol.js',
    'src/**/*.js',
    'test/*.js'
  ],

  // list of files to exclude
  exclude: [
  ],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    'src/*.js': ['rollup', 'coverage']
  },

  rollupPreprocessor: {
    name: _package.namespace,
    input: resolve('src/index.js'),
    file: resolve(_package.unpkg),
    format: 'umd',
    plugins: [
      babel()
    ]
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    type : 'html',
    dir : 'coverage/',
    instrumenterOptions: {
      istanbul: { noCompact: true }
    }
  },

  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'],

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity
}
