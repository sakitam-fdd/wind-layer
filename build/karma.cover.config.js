/**
 * Created by FDD on 2017/11/6.
 * @desc 单元测试覆盖率
 */

const base = require('./karma.base.config.js')
module.exports = function (config) {
  const options = Object.assign(base, {
    browsers: ['Chrome'],
    reporters: ['mocha', 'coverage'],
    logLevel: config.LOG_INFO,
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      reporters: [
        {type: 'lcov', subdir: '.'},
        {type: 'text-summary', subdir: '.'},
      ]
    },
    singleRun: true
  })
  options.rollupPreprocessor.sourcemap = 'inline';
  const plugins = options.rollupPreprocessor.plugins;
  const idx = plugins.findIndex(plugin => {
    return plugin.name === 'babel';
  });
  if (idx >= 0) {
    const babel = require('rollup-plugin-babel');
    plugins.splice(idx, 1, babel({
      plugins: [['istanbul']]
    }));
  }
  config.set(options);
}
