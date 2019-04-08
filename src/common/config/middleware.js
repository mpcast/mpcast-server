const path = require('path');
const isDev = think.env === 'development';
const cors = require('@koa/cors')
const jwt = require('koa-jwt')
const payload = require('think-payload');
const graphql = require('../middlware/graphql')
const { makeExecutableSchema } = require('graphql-tools');
// const Reslovers = require('../../graphql/resolvers')
// const Schema = require('../../graphql/schema')
// const swaggerParser = require('think-swagger-parser')
// const swaggerRouter = require('think-swagger-router')
// const swaggerController = require('think-swagger-controller')
// const whitelist = ['http://picker.cc', 'http://api.picker.la', 'http://zy.picker.la'];
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
      contentType (ctx) {
        // All request url starts of /api or request header contains `X-Requested-With: XMLHttpRequest` will output json error
        const APIRequest = /^\/v*/.test(ctx.request.path);
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
      error (err, ctx) {
        return console.error(err)
      }
    }
  },
  {
    handle: payload,
    options: {
      maxFileSize: 200 * 1024 * 1024
    }
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
        return next().catch((err) => {
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
    options: {}
  },
  // {
  //   match: '/graphql',
  //   handle: graphql,
  //   options: {
  //     schema: makeExecutableSchema({
  //       typeDefs: Schema,
  //       resolvers: Reslovers
  //     })
  //   }
  // },
  {
    handle: jwt,
    options: {
      secret: 'S1BNbRp2b'
    },
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      // if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+\/subdomain_validation|signin|signout?/))) {
      // if (ctx.url === '')
      // console.log(ctx.request.header['x-app-id'])
      // if ()
      // console.log('show .....')
      // const appId = ctx.request.header['x-app-id']
      // console.log('appId + ' + appId)
      // if (!think.isEmpty(appId)) {
      //   if (appId === 'B1yDrzqEf') {
      //     return false
      //   }
      // }
      if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+\/subdomain_validation|signin|signout?/) ||
        ctx.url.match(/^\/v1\/apps\/\w+\/options?/) ||
        ctx.url.match(/^\/v1\/apps\/\w+\/auth\/token|verify?/))) {

        return false;
      } else if (ctx.url.match(ctx.url.match(/^\/v1*?/) || ctx.url.match(/^\/v2*?/))) {
        return true
      }
    }
  },
  'logic',
  'controller'
]
