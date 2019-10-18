const Koa = require('./lib/application');

const app = new Koa();

const filterFaviconMiddleware = () => {
  return async (ctx, next) => {
    if (ctx.url !== '/favicon.ico') {
      await next();
    }
  }
}

app.use(filterFaviconMiddleware());

app.use(async (ctx, next) => {
  console.log('1111');
  await next();
  console.log(ctx.response.status);
  console.log('3333');
  ctx.body = 'hello ' + ctx.request.query.name;
});

app.use(async (ctx, next) => {
  console.log('2222');
  next();
})

app.listen(3000, 'localhost', (err) => {
  console.log('😄server listen at port 3000');
});

