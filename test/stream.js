const fs = require('fs-extra');
const writer = fs.createWriteStream('test.txt');

const reader = fs.createReadStream('package.json');
reader.pipe(writer);

writer.on('finish', () => {
  console.error('写入已完成');
});


writer.on('end', function () {
  console.error('写入结束');
});
