const Koa = require('koa');
const Router = require('koa-router');
const youtube = require('./youtube')

const GOOGLE_APIKEY = process.env.GOOGLE_APIKEY
const PORT = process.env.PORT || 8080

const app = new Koa();
const router = new Router();

router.get('/channel/:channelId', (ctx, next) => {
  const channelId = ctx.params.channelId

  return youtube.search(channelId).then((videoList) => {
    ctx.set('Content-Type', 'application/json')
    ctx.body = videoList
    ctx.status = 200
  }).catch((error) => {
    ctx.throw(error, 500);
  })
})

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods())

  youtube.connect(GOOGLE_APIKEY).then((result) => {
    console.log(result)
    app.listen(PORT, () => {
      console.log(`Koa server listening on ${PORT}`)
    });
  })
