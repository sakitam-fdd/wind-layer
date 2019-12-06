import path from 'path';

const modulePath = process.env.modulePath;
const resolve = _path => path.resolve(__dirname, `../packages/${modulePath}`, _path);

const pkg = require(`../packages/${modulePath}/package.json`);

const time = new Date();
const year = time.getFullYear();
const banner = `/*!\n * author: ${pkg.author} 
 * ${pkg.name} v${pkg.version}
 * build-time: ${year}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}
 * LICENSE: ${pkg.license}
 * (c) 2017-${year} ${pkg.homepage}\n */`;

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

export {
  pkg,
  resolve,
  banner,
  handleMinEsm,
  lowerFirstChart,
};
