const Emitter = require('events');
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa extends Emitter {
  constructor() {
    super();
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middleWares = [];
  }

  createContext(req, res) {
    const context = {};
    context.req = req;
    context.res = res;
    context.url = context.originalUrl = req.url;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    context.request = Object.create(this.request);
    context.response = Object.create(this.response);
    return context;
  }

  compose(ctx) {
    const createAsync = (fn, next) => {
      return async () => {
        await fn(ctx, next);
      }
    }

    let next = async () => {
      return Promise.resolve();
    }

    for (let i = this.middleWares.length - 1; i >= 0; i--) {
      next = createAsync(this.middleWares[i], next);
    }

    return next();
  }

  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be function!');
    }
    this.middleWares.push(fn);
  }

  handleRequest(ctx) {
    if (typeof ctx.body === 'string') {
      ctx.res.end(ctx.body);
    } else if (typeof ctx.body === 'object') {
      ctx.res.end(JSON.stringify(ctx.body));
    }
  }

  handleError(ctx, err) { 
    ctx.res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
    ctx.res.statusCode = 500;
    ctx.res.end(err.toString());
    this.emit('error', err);
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res);
      const fnMiddleware = this.compose(ctx);
      fnMiddleware.then(() => this.handleRequest(ctx)).catch(err => this.handleError(ctx, err));
    }
  }

  listen(...args) {
    return http.createServer(this.callback()).listen(...args);
  }
}

module.exports = Koa;