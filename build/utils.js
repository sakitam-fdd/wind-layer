const path = require('path');
const _package = require('../package.json');
const resolve = _path => path.resolve(__dirname, '../', _path);

const time = new Date();
const year = time.getFullYear();
const banner = `/*!\n * author: ${_package.author} 
 * ${_package.name} v${_package.version}
 * build-time: ${year}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}
 * LICENSE: ${_package.license}
 * (c) 2017-${year} ${_package.homepage}\n */`;

/**
 * handle min file
 * @param name
 * @returns {string}
 */
const handleMinEsm = name => {
  if (typeof name === 'string') {
    let arr_ = name.split('.');
    let arrTemp = [];
    arr_.forEach((item, index) => {
      if (index < arr_.length - 1) {
        arrTemp.push(item);
      } else {
        arrTemp.push('min');
        arrTemp.push(item);
      }
    });
    return arrTemp.join('.');
  }
};


const lowerFirstChart = str => {
  return (str.replace(/( |^)[A-Z]/g, (L) => L.toLowerCase()))
};


module.exports = {
  _package,
  resolve,
  banner,
  handleMinEsm,
  lowerFirstChart,
};
