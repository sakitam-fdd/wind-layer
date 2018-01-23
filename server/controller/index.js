const fs = require('fs')
const request = require('axios')
const moment = require('moment')
const grib2json = require('weacast-grib2json')
const utils = require('../utils/index')
const config = require('../config/config')
let fetchTimer = null

/**
 * 获取数据源文件
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getGribData = async (ctx, next) => {
  try {
    const hours = utils.roundHours(moment(ctx.query.time).hour(), 6)
    const stamp = moment(ctx.query.time).format('YYYYMMDD') + hours
    console.log(stamp)
    const response = await request({
      method: 'get',
      url: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
      params: {
        file: 'gfs.t' + hours + 'z.pgrb2.1p00.f000',
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
      responseType: 'stream',
      onUploadProgress: function (progressEvent) {
        console.log(progressEvent)
      }
    })
    // 此时part为返回的流对象
    const newpath = utils.resolve(config.sourceDataDir + '/' + stamp + '.f000')
    // 生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
    const stream = fs.createWriteStream(newpath)
    // 写入文件流
    response.data.pipe(stream)
    ctx.status = 200
    ctx.body = {
      code: 200,
      success: true,
      data: {
        time: stamp,
        name: stamp + '.f000'
      }
    }
    // stream.on('finish', function () {
    //   stream.close()
    //   ctx.status = 200
    //   ctx.body = {
    //     code: 200,
    //     success: true,
    //     data: {
    //       time: stamp,
    //       name: stamp + '.f000'
    //     }
    //   }
    // })
  } finally {
  }
}

/**
 * 如果json存在则直接加载本地数据
 * @param path
 * @returns {Promise<any>}
 */
const getLocalData = (path) => {
  return new Promise((resolve, reject) => {
    let bin = fs.readFileSync(path)
    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
      bin = bin.slice(3)
    }
    resolve(JSON.parse(bin.toString('utf-8')))
  })
}

/**
 * 获取data (对应时间数据不存在时实时获取转换，存在时直接调用)
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getData = async (ctx, next) => {
  try {
    const hours = utils.roundHours(moment(ctx.query.time).hour(), 6)
    const stamp = moment(ctx.query.time).format('YYYYMMDD') + hours
    const _sourcePath = utils.resolve(config.sourceDataDir + stamp + '.f000')
    const _parsePath = utils.resolve(config.parseDataDir + stamp + '.json')
    const _sourceExist = utils.checkFileExists(_sourcePath)
    const _parseExist = utils.checkFileExists(_parsePath)
    let _json
    if (_parseExist) {
      _json = await getLocalData(_parsePath)
    } else if (_sourceExist) {
      _json = await grib2json(_sourcePath, {
        data: true,
        output: _parsePath
      })
    } else {
      const _source = await fetchGribData({
        time: ctx.query.time
      })

      _json = await grib2json(utils.resolve(config.sourceDataDir + _source.name), {
        data: true,
        output: _parsePath
      })
    }
    ctx.status = 200
    ctx.body = {
      code: 0,
      success: true,
      message: 'success',
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

/**
 * 抓取任务
 * @param params
 * @returns {Promise<any>}
 */
const fetchGribData = params => {
  try {
    const hours = utils.roundHours(moment(params.time).hour(), 6)
    const stamp = moment(params.time).format('YYYYMMDD') + hours
    // const stamp = '2018012206'
    return new Promise((resolve, reject) => {
      request({
        method: 'get',
        url: 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl',
        params: {
          file: 'gfs.t' + hours + 'z.pgrb2.1p00.f000',
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
        responseType: 'stream',
        onUploadProgress: function (progressEvent) {
          console.log(progressEvent)
        }
      }).then(response => {
        // 此时part为返回的流对象
        const newpath = utils.resolve(config.sourceDataDir + '/' + stamp + '.f000')
        // 生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
        const stream = fs.createWriteStream(newpath)
        // 写入文件流
        response.data.pipe(stream)
        resolve({
          code: 200,
          success: true,
          data: {
            time: stamp,
            name: stamp + '.f000'
          }
        })
      }).catch(error => {
        reject(error)
      })
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * 自动定时抓取元数据(30min抓取一次)
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const autoFetch = async (ctx, next) => {
  if (fetchTimer) {
    ctx.status = 200
    ctx.body = {
      code: 200,
      success: true,
      data: 'already exist auto fetch task'
    }
  } else {
    fetchTimer = setInterval(() => {
      fetchGribData({
        time: moment.utc()
      })
    }, 1800000)
    ctx.status = 200
    ctx.body = {
      code: 200,
      success: true,
      data: 'auto fetch success'
    }
  }
}

/**
 * 终止自动获取任务
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const stopAutoFetch = async (ctx, next) => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
}

module.exports = {
  getData,
  autoFetch,
  stopAutoFetch,
  getGribData
}
