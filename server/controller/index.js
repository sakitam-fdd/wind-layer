const os = require('os');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const utils = require('../utils/index');
const config = require('../config/config');
const grib2jsonCommand = process.env.GRIB2JSON || utils.resolve(`bin/${os.platform() === 'win32' ? 'grib2json.cmd' : 'grib2json'}`);
let fetchTimer = null;

/**
 * 获取数据源文件
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getGribData = async (ctx, next) => {
  const _time = (ctx.query.time && moment.utc(moment(parseInt(ctx.query.time))))
  try {
    const _data = await fetchGribData({
      time: _time
    })
    ctx.status = 200
    ctx.body = {
      code: 200,
      success: true,
      data: {
        time: _data.data.time,
        timeStamp: _data.data.timeStamp,
        name: _data.data.name
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
};

const grib2json = (path_, options) => {
  return new Promise((resolve, reject) => {
    execFile(`${grib2jsonCommand} --data --output ${options.output} --names --compact ${path_}`,
      {
        maxBuffer: 8 * 1024 * 1024
      }, function (error, stdout, stderr) {
        if (error) {
          reject(error);
          return
        }
        if (options.output) {
          fs.readJson(options.output, (error, json) => {
            if (error) {
              reject(error);
              return
            }
            resolve(json)
          })
        } else {
          let json = JSON.parse(stdout)
          resolve(json)
        }
      })
  })
}

/**
 * 获取data (对应时间数据不存在时实时获取转换，存在时直接调用)
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getData = async (ctx, next) => {
  const _time = (ctx.query.time && moment.utc(moment(parseInt(ctx.query.time))))
  try {
    const isValid = utils.checkTime(_time)
    if (isValid) {
      const hours = utils.roundHours(moment(_time).hour(), 6)
      const stamp = moment(_time).format('YYYYMMDD') + hours
      utils.checkFolderExist(utils.resolve(config.staticDir + config.parseDataDir), true)
      const _sourcePath = utils.resolve(config.staticDir + config.sourceDataDir + stamp + '.f000')
      const _parsePath = utils.resolve(config.staticDir + config.parseDataDir + stamp + '.json')
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
        if (_source && _source.code === 200) {
          _json = await grib2json(utils.resolve(config.staticDir + config.sourceDataDir + _source.data.name), {
            data: true,
            output: _parsePath
          })
        }
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
  const _time = params.time
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
        const _sourcePath = utils.resolve(config.staticDir + config.sourceDataDir + stamp + '.f000')
        const _sourceExist = utils.checkFileExists(_sourcePath)
        if (_sourceExist) {
          resolve({
            code: 200,
            success: true,
            data: {
              time: stamp,
              timeStamp: moment(_time).format('X'),
              name: stamp + '.f000'
            }
          })
        } else {
          axios({
            method: 'get',
            url: config.serviceUrl,
            responseType: 'stream',
            params: {
              file: 'gfs.t' + hours + 'z.pgrb2.1p00.f000',
              lev_10_m_above_ground: 'on',
              lev_surface: 'on',
              var_TMP: 'on',
              var_UGRD: 'on',
              var_VGRD: 'on',
              subregion: 'on',
              leftlon: config.extent[0],
              rightlon: config.extent[2],
              toplat: config.extent[1],
              bottomlat: config.extent[3],
              dir: '/gfs.' + stamp
            }
          }).then(response => {
            if (response.statusCode !== 200) {
              console.log('current data not Exist')
              fetchGribData({
                time: moment(_time).subtract(6, 'hours')
              }).then(_res => {
                if (_res && _res.code === 200) {
                  resolve(_res)
                }
              })
            } else {
              utils.checkFolderExist(utils.resolve(config.staticDir + config.sourceDataDir), true)
              // 此时part为返回的流对象
              const newpath = utils.resolve(config.staticDir + config.sourceDataDir + '/' + stamp + '.f000')
              // 生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
              const stream = fs.createWriteStream(newpath)
              // 写入文件流
              response.data.pipe(stream)
              stream.on('finish', function () {
                resolve({
                  code: 200,
                  success: true,
                  data: {
                    time: stamp,
                    timeStamp: moment(_time).format('X'),
                    name: stamp + '.f000'
                  }
                })
              })
            }
          }).catch(() => {
            fetchGribData({
              time: moment(_time).subtract(6, 'hours')
            }).then(_res => {
              if (_res && _res.code === 200) {
                resolve(_res)
              }
            })
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
    fetchGribData({ // first load
      time: moment.utc()
    })
    fetchTimer = setInterval(() => { // interval load | 30min
      fetchGribData({
        time: moment.utc()
      })
    }, 1000 * 60 * 30)
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

/**
 * 通过文件名获取数据
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getDataByFileName = async (ctx, next) => {
  const _type = utils.getFileExt(ctx.query.filename)
  if (_type === 'json') {
    const _parsePath = utils.resolve(config.staticDir + config.parseDataDir + ctx.query.filename)
    const _parseExist = utils.checkFileExists(_parsePath)
    if (_parseExist) {
      const _data = await getLocalData(_parsePath)
      ctx.status = 200
      ctx.body = {
        code: 200,
        success: true,
        data: _data
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: 205,
        success: false,
        data: 'file not exist'
      }
      next()
    }
  } else if (_type === 'f000') {
    const _sourcePath = utils.resolve(config.staticDir + config.sourceDataDir + ctx.query.filename);
    const _sourceExist = utils.checkFileExists(_sourcePath);
    const _parsePath = utils.resolve(config.staticDir + config.parseDataDir + ctx.query.filename.replace('.f000', '.json'))
    if (_sourceExist) {
      const _data = await grib2json(_sourcePath, {
        data: true,
        output: _parsePath
      })
      ctx.status = 200
      ctx.body = {
        code: 200,
        success: true,
        data: _data
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code: 205,
        success: false,
        data: 'file not exist'
      }
      next()
    }
  } else {
    ctx.status = 400
    ctx.body = {
      code: 400,
      success: false,
      data: '缺少查询参数'
    }
    next()
  }
}

/**
 * 获取源文件树
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getSourceTree = async (ctx, next) => {
  let files = utils.getFileList(utils.resolve(config.staticDir + config.sourceDataDir))
  files = files.map(file => {
    return {
      filePath: 'http://' + ctx.request.host + config.sourceDataDir + file,
      fileName: file
    }
  })
  ctx.status = 200
  ctx.body = {
    code: 200,
    success: true,
    data: files
  }
}

/**
 * 获取转换后的json文件树
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const getParseTree = async (ctx, next) => {
  let files = utils.getFileList(utils.resolve(config.staticDir + config.parseDataDir))
  files = files.map(file => {
    return {
      filePath: 'http://' + ctx.request.host + config.parseDataDir + file,
      fileName: file
    }
  })
  ctx.status = 200
  ctx.body = {
    code: 200,
    success: true,
    data: files
  }
}

module.exports = {
  getData,
  autoFetch,
  stopAutoFetch,
  getGribData,
  getSourceTree,
  getParseTree,
  getDataByFileName
}
