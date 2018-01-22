const controller = require('../controller/index')
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    code:0,
    success: true,
    message:'success',
    data: 'success'
  }
})

router.get('/getData', controller.getData)

router.get('/getGrib2Data', controller.getGribData)

module.exports = router
