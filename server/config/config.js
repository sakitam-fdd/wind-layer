module.exports = {
  port: 3000, // 端口
  serviceUrl: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
  sourceDataDir: 'public/sourceData/', // 二进制数据源
  parseDataDir: 'public/parseData/' // 转换后的json数据
}
