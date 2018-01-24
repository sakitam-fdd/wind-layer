const fs = require('fs')
const request = require('request')
const moment = require('moment')
const grib2json = require('weacast-grib2json')
const utils = require('../utils/index')
const config = require('../config/config')
let fetchTimer = null

utils.checkFolderExist(utils.resolve(config.sourceDataDir), true)
utils.checkFolderExist(utils.resolve(config.parseDataDir), true)

/**
 * 获取数据源文件
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getGribData = async (ctx, next) => {
  const _time = ctx.query.time && parseInt(ctx.query.time)
  try {
    const _data = await fetchGribData({
      time: _time
    })
    ctx.status = 200
    ctx.body = {
      code: 200,
      success: true,
      data: {
        time: _data.time,
        name: _data.name
      }
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      success: false,
      data: error
    }
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
  const _time = ctx.query.time && parseInt(ctx.query.time)
  try {
    const isValid = utils.checkTime(_time)
    if (isValid) {
      const hours = utils.roundHours(moment(_time).hour(), 6)
      const stamp = moment(_time).format('YYYYMMDD') + hours
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
          time: _time
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
    } else {
      ctx.status = 400
      ctx.body = {
        code: 400,
        success: false,
        message: '参数不合法',
        data: []
      }
    }
  } catch (error) {
    ctx.status = 500
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
  const _time = params.time && parseInt(params.time)
  try {
    const isValid = utils.checkTime(_time)
    if (!isValid) {
      return new Promise((resolve, reject) => {
        resolve({
          code: 400,
          success: false,
          message: '参数不合法',
          data: []
        })
      })
    } else {
      const hours = utils.roundHours(moment(_time).hour(), 6)
      const stamp = moment(_time).format('YYYYMMDD') + hours
      return new Promise((resolve, reject) => {
        const _sourcePath = utils.resolve(config.sourceDataDir + stamp + '.f000')
        const _sourceExist = utils.checkFileExists(_sourcePath)
        if (_sourceExist) {
          resolve({
            code: 200,
            success: true,
            data: {
              time: stamp,
              name: stamp + '.f000'
            }
          })
        } else {
          console.log(stamp, hours)
          request.get({
            url: config.serviceUrl,
            qs: {
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
            }
          }).on('response', response => {
            console.log(response)
            if (response.statusCode !== 200) {
              fetchGribData({
                time: moment(_time).subtract(6, 'hours')
              })
            } else {
              // 此时part为返回的流对象
              const newpath = utils.resolve(config.sourceDataDir + '/' + stamp + '.f000')
              // 生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
              const stream = fs.createWriteStream(newpath)
              // 写入文件流
              response.pipe(stream)
              stream.on('finish', function () {
                resolve({
                  code: 200,
                  success: true,
                  data: {
                    time: stamp,
                    name: stamp + '.f000'
                  }
                })
              })
            }
          }).on('error', error => {
            fetchGribData({
              time: moment(_time).subtract(6, 'hours')
            })
            console.log(error)
          })
        }
      })
    }
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
        time: moment().format('X')
      })
    }, 1000 * 10)
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
  ctx.status = 200
  ctx.body = {
    code: 200,
    success: true,
    data: 'stop auto fetch success'
  }
}

module.exports = {
  getData,
  autoFetch,
  stopAutoFetch,
  getGribData
}
