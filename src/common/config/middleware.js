const path = require('path');
const isDev = think.env === 'development';
const cors = require('@koa/cors')
const jwt = require('koa-jwt')
const swaggerParser = require('think-swagger-parser')
const swaggerRouter = require('think-swagger-router')
const swaggerController = require('think-swagger-controller')
const whitelist = ['http://picker.cc', 'http://api.picker.la', 'http://zy.picker.la'];
module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      contentType(ctx) {
        // All request url starts of /api or request header contains `X-Requested-With: XMLHttpRequest` will output json error
        const APIRequest = /^\/v*/.test(ctx.request.path);
        console.log(ctx.request.path)
        const AJAXRequest = ctx.is('X-Requested-With', 'XMLHttpRequest');
        return APIRequest || AJAXRequest ? 'json' : 'html';
      },
      // basic set as string, then put 404.html, 500.html into error folder
      // templates: path.join(__dirname, 'error'),
      // customed set as object
      templates: {
        404: path.join(__dirname, 'error/404.html'),
        500: path.join(__dirname, 'error/500.html'),
        502: path.join(__dirname, 'error/502.html')
      },
      sourceMap: false,
      debug: isDev,
      error(err, ctx) {
        return console.error(err)
      }
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      // defaultModule: 'api',
      // defaultController: 'index',
      // defaultAction: 'index'
    }
  },
  {
    handle: (option, app) => {
      return (ctx, next) => {
        // const requestOrigin = ctx.origin
        // const allowedOrigins = ['https://picker.cc', 'http://api.picker.la']
        // const origin = ctx.origin
        // if (whitelist.includes(requestOrigin) || whitelist.includes('localhost')) {
        //   ctx.res.setHeader('Access-Control-Allow-Origin', requestOrigin)
        // }
        // ctx.res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
        // ctx.res.setHeader('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');
        // ctx.res.setHeader('Access-Control-Max-Age', '1728000');
        // ctx.res.setHeader('Content-Type', 'application/json;charset=utf-8');
        // ctx.res.setHeader('X-Powered-By', 'Nodepress 1.0.0');
        // console.log(ctx.accept.headers.origin + '------')
        // if (!whitelist.includes(requestOrigin)) {
          // return ctx.throw(`🙈 ${requestOrigin} is not a valid origin`);
          // let err = new Error(`🙈 ${requestOrigin} 请求无效!`);
          // err.status = 403;
          // throw err;
          // return ctx.throw(`🙈 ${requestOrigin} 请求无效!`);
        // }
        // console.log(ctx.header)
        // Custom 401 handling if you don't want to expose koa-jwt errors to users
        return next().catch((err) => {
          // if (err.status === 404) {
          //   ctx.status = 404
          //   ctx.body = '404'
          //   throw err;
          //
          // eslint-disable-next-line yoda
          if (401 === err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
          } else {
            ctx.body = 'Protected resource, use Authorization header to get access\n';
            throw err;
          }
        });
      };
    }
  },
  {
    handle: cors,
    options: {
    }
  },
  {
    handle: jwt,
    options: {
      secret: 'S1BNbRp2b'
    },
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+(?:\/subdomain_validation|signin|signout)?/) || ctx.url.match(/^\/v1\/apps\/\w+\/options?/) || ctx.url.match(/^\/v1\/apps\/\w+\/auth\/token?/))) {
        return false;
      } else if (ctx.url.match(ctx.url.match(/^\/v1*?/))) {
        return true
      }
    }
  },
  'logic',
  'controller'
  // {
  //   handle: swaggerParser,
  //   options: {
  //     debug: isDev,
  //     api_doc: './api/swagger.yaml',
  //     controller_dir: './app/controller'
  //   }
  // },
  // {
  //   handle: swaggerRouter,
  //   options: {
  //     debug: isDev
  //   }
  // },
  // {
  //   handle: swaggerController,
  //   options: {
  //     debug: isDev
  //   }
  // }
]
