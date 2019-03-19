// const fs = require('fs-extra');
// const writer = fs.createWriteStream('test.txt');
//
// const reader = fs.createReadStream('package.json');
// reader.pipe(writer);
//
// writer.on('finish', () => {
//   console.error('写入已完成');
// });
//
//
// writer.on('end', function () {
//   console.error('写入结束');
// });

const getP = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(111);
    }, 500);
  })
}


const getT = async () => {
  try {
    const a = await getP();
    console.log(a);
    return a;
  } catch (e) {
    console.log('e', e);
  }
};

getT().then(res => {
  console.log(res);
});
