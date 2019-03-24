module.exports = {
  port: 3333, // 端口
  staticDir: 'public', // 静态文件目录
  serviceUrl: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
  sourceDataDir: '/sourceData/', // 二进制数据源
  parseDataDir: '/parseData/', // 转换后的json数据
  // extent: [73, 3, 136, 54], // [leftlon, bottomlat, rightlon, toplat]
  extent: [0, -90, 360, 90],
  requestParams: {
    lev_10_m_above_ground: 'on',
    lev_surface: 'on',
    // var_TMP: 'off',
    var_UGRD: 'on',
    var_VGRD: 'on',
    subregion: 'on'
  }
};
