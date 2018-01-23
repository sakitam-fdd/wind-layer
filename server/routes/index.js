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

router.get('/gribdata', controller.getGribData)

module.exports = router
