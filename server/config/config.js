module.exports = {
  port: 3000, // 端口
  staticDir: 'public', // 静态文件目录
  serviceUrl: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
  sourceDataDir: '/sourceData/', // 二进制数据源
  parseDataDir: '/parseData/', // 转换后的json数据
  // extent: [73, 54, 136, 3], // [leftlon, toplat, rightlon, bottomlat]
  extent: [0, 90, 360, -90]
}
