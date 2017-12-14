/**
 * Created by FDD on 2017/11/6.
 * @desc 单元测试
 */

const base = require('./karma.base.config.js')
module.exports = function (config) {
  config.set(Object.assign(base, {
    browsers: ['Chrome'],
    reporters: ['mocha'],
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    singleRun: true
  }))
}
