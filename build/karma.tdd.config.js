/**
 * Created by FDD on 2017/11/6.
 * @desc 测试驱动开发
 */

const base = require('./karma.base.config.js')

module.exports = function (config) {
  config.set(Object.assign(base, {
    browsers: ['Chrome'],
    logLevel: config.LOG_INFO,
    reporters: ['mocha'],
    singleRun: true
  }))
}
