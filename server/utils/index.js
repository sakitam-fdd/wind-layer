const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * 六小时执行一次 （00 || 06 || 12 || 18）
 * @param hours
 * @param interval
 * @returns {*}
 */
const roundHours = (hours, interval) => {
  if (interval > 0) {
    const result = (Math.floor(hours / interval) * interval);
    return result < 10 ? '0' + result.toString() : result
  }
};

/**
 * 检查数据源文件是否存在
 * @param path
 * @param mkdir
 * @returns {boolean}
 */
const checkFileExists = (path, mkdir) => {
  try {
    fs.statSync(path)
    return fs.existsSync(path)
  } catch (e) {
    if (mkdir) {
      fs.mkdirSync(path)
    }
    return false
  }
};

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
};

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
};

/**
 * resolve path
 * @param _path
 */
const resolve = _path => path.resolve(__dirname, '..', _path);

/**
 * 获取文件树
 * @param _path
 * @returns {Array}
 */
const getFileList = _path => {
  const result = []
  function finder (path_) {
    let files = fs.readdirSync(path_);
    files.forEach((val, index) => {
      let fPath = path.join(path_, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(val);
    })
  }
  finder(_path);
  return result;
};

/**
 * 获取文件扩展名
 * @param _string
 * @returns {*}
 */
const getFileExt = _string => {
  if (_string && _string.split) {
    const _arr = _string.split('.');
    return _arr[_arr.length - 1];
  } else {
    return false;
  }
};

const waiting = (timer = 500) => {
  return new Promise(resolve => {
    setTimeout(resolve, timer)
  })
};

module.exports = {
  waiting,
  checkTime,
  resolve,
  roundHours,
  checkFileExists,
  checkFolderExist,
  getFileList,
  getFileExt
};
