const fs = require('fs')
const path = require('path')
const request = require('axios')
const moment = require('moment')
const grib2json = require('weacast-grib2json')
const utils = require('../utils/index')
const config = require('../config/config')
const resolve = _path => path.resolve(__dirname, '..', _path)
const getGribData = async (ctx, next) => {
  try {
    const stamp = moment(ctx.query.timer).format('YYYYMMDD') + utils.roundHours(moment(ctx.query.timer).hour(), 6)
    await request({
      method:'get',
      url: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
      params: {
        file: 'gfs.t' + utils.roundHours(moment(ctx.query.timer).hour(), 6) + 'z.pgrb2.1p00.f000',
        lev_10_m_above_ground: 'on',
        lev_surface: 'on',
        var_TMP: 'on',
        var_UGRD: 'on',
        var_VGRD: 'on',
        leftlon: 0,
        rightlon: 360,
        toplat: 90,
        bottomlat: -90,
        dir: '/gfs.' + stamp
      },
      responseType: 'stream'
    }).then(function (response) {
      // 此时part为返回的流对象
      const newpath = path.resolve(__dirname, '..') + config.sourceDataDir + '/' + stamp + '.f000'
      // 生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
      const stream = fs.createWriteStream(newpath)
      // 写入文件流
      response.data.pipe(stream)
    }).catch(function (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        success: true,
        data: error
      }
    })
  } finally {
  }
}

/**
 * 获取data (对应时间数据不存在时实时获取转换，存在时直接调用)
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getData = async (ctx, next) => {
  try {
    // const stamp = moment(ctx.query.timer).format('YYYYMMDD') + utils.roundHours(moment(ctx.query.timer).hour(), 6)
    const stamp = '2018012206'
    const _sourcePath = resolve(config.sourceDataDir + stamp + '.f000')
    const _parsePath = resolve(config.parseDataDir + stamp + '.json')
    utils.checkFileExists(_sourcePath)
    const _json = await grib2json(_sourcePath, {
      data: true,
      output: _parsePath
    })
    ctx.status = 200
    ctx.body = {
      code: 0,
      success: true,
      message:'success',
      data: _json
    }
  } catch (error) {
    ctx.status = 200
    ctx.body = {
      code: 500,
      success: false,
      message: error,
      data: []
    }
  }
}
module.exports = {
  getData,
  getGribData
}
