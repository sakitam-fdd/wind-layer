const controller = require('../controller/index')
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    success: true,
    message: 'success',
    data: 'success'
  }
})

router.get('/autofetch', controller.autoFetch)

router.get('/stopautofetch', controller.stopAutoFetch)

router.get('/getdata', controller.getData)

router.get('/getDataByFileName', controller.getDataByFileName)

router.get('/gribdata', controller.getGribData)

router.get('/getSourceTree', controller.getSourceTree)

router.get('/getParseTree', controller.getParseTree)

module.exports = router
