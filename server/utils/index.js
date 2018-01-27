const fs = require('fs')
const path = require('path')
const moment = require('moment')

/**
 * 六小时执行一次 （00 || 06 || 12 || 18）
 * @param hours
 * @param interval
 * @returns {*}
 */
const roundHours = (hours, interval) => {
  if (interval > 0) {
    const result = (Math.floor(hours / interval) * interval)
    return result < 10 ? '0' + result.toString() : result
  }
}

/**
 * 检查数据源文件是否存在
 * @param path
 * @param mkdir
 * @returns {boolean}
 */
const checkFileExists = (path, mkdir) => {
  try {
    fs.statSync(path)
    return true
  } catch (e) {
    if (mkdir) {
      fs.mkdirSync(path)
    }
    return false
  }
}

/**
 * 判断文件夹是否存在
 * @param path
 * @param mkdir
 * @returns {boolean}
 */
const checkFolderExist = (path, mkdir) => {
  if (!fs.existsSync(path)) {
    if (mkdir) {
      fs.mkdirSync(path)
    }
    return false
  } else {
    return true
  }
}

/**
 * 检查时间是否合法
 * @param _time
 * @returns {boolean}
 */
const checkTime = _time => {
  try {
    moment(_time)
    if (moment.utc().diff(_time, 'days') > 30) {
      // 最多获取两周数据
      return false
    } else {
      return true
    }
  } catch (error) {
    return false
  }
}

/**
 * resolve path
 * @param _path
 */
const resolve = _path => path.resolve(__dirname, '..', _path)

module.exports = {
  checkTime,
  resolve,
  roundHours,
  checkFileExists,
  checkFolderExist
}
