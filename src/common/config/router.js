/* eslint-disable spaced-comment */
module.exports = [
  [/\/v1\/apps\/(\w+)\/taxonomies\/(\w+)\/terms\/slug:(\w+)$/, '/api/v1/apps/taxonomies/_slug?appId=:1&taxonomy=:2&slug=:3', 'get, post'],
  [/\/v1\/apps\/(\w+)\/users\/(\d+)\/likes?/, '/api/v1/apps/users/likes?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/users\/(\d+)\/posts?/, '/api/v1/apps/users/posts?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/menus\/(\d+)?/, '/api/v1/apps/menus?appId=:1&id=:2', 'get'],

  [/\/v1\/apps\/(\w+)\/users\/(\d+)/, '/api/v1/apps/users/_id?appId=:1&id=:2', 'get, post'],
  [/\/v1\/apps\/(\w+)\/file?/, '/api/v1/apps/file?appId=:1', 'rest'],
  [/\/v1\/apps\/(\w+)\/auth?(\/\w+)$/, '/api/v1/apps/auth/:2?appId=:1', 'get, post'],
  [/\/v1\/apps\/(\w+)\/posts\/counts?/, '/api/v1/apps/posts/counts?appId=:1', 'get'],
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/replies?/, '/api/v1/apps/posts/replies?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/comments\/(\d+)?/, '/api/v1/apps/comments?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/comments-(\w+)?/, '/api/v1/apps/comments?appId=:1&action=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/(\w+)\/(\d+)$/, '/api/v1/apps/:2/_id?appId=:1&id=:3', 'get, post'],
  [/\/v1\/apps\/(\w+)\/(\w+)\/(\d+)\/(delete)$/, '/api/v1/apps/:2/_id/:4?appId=:1&id=:3', 'post'],
  [/\/v1\/apps\/(\w+)\/posts$/, '/api/v1/apps/posts?appId=:1', 'get'],

  // LIKES API
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/(\w+)\/mine\/(\w+)?/, '/api/v1/apps/posts/:3/mine?appId=:1&id=:2&action=:4', 'get, post'],
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/(\w+)\/new?/, '/api/v1/apps/posts/:3/new?appId=:1&id=:2', 'post'],
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/likes?/, '/api/v1/apps/posts/likes?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/views?/, '/api/v1/apps/posts/views?appId=:1&id=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/posts\/(\d+)\/assets?/, '/api/v1/apps/posts/assets?appId=:1&id=:2', 'get'],

  [/\/v1\/apps\/(\w+)\/me\/likes?/, '/api/v1/apps/me/likes?appId=:1', 'get'],
  // V2 版本
  [/\/v2\/apps\/(\w+)\/me\/likes?/, '/api/v2/apps/me/likes?appId=:1', 'get'],
  [/\/v2\/(\w+)$/, '/api/v2/:1', 'get, post'],
  [/\/v1\/apps\/(\w+)\/me\/posts?/, '/api/v1/apps/me/posts?appId=:1', 'get'],

  [/\/v1\/apps\/(\w+)\/users\/login:(\w+)?/, '/api/v1/apps/users/login?appId=:1&user_login=:2', 'get'],
  [/\/v1\/apps\/(\w+)\/(\w+)\/slug:([\w-]+)(?:\/(\w+))?/, '/api/v1/apps/:2/_slug/:4?appId=:1&slug=:3', 'get, post'],
  // 分类法 api
  [/\/v1\/apps\/(\w+)\/taxonomies\/(\w+)\/terms$/, '/api/v1/apps/taxonomies/terms?appId=:1&taxonomy=:2&action=:3', 'get, post'],
  [/\/v1\/apps\/(\w+)\/taxonomies\/(\w+)\/terms\/slug:(\w+)$/, '/api/v1/apps/taxonomies/_slug?appId=:1&taxonomy=:2&slug=:3', 'get, post'],

  // GET POST
  // apps/$app/taxonomies/$taxonomy/terms/slug:$slug
  [/\/v1\/apps\/(\w+)$/, '/api/v1/apps/app?appId=:1', 'get, post'],
  [/\/v1\/apps\/(\w+)\/(\w+)\/(\w+)?/, '/api/v1/apps/:2/:3?appId=:1', 'get, post'],
  [/\/v1\/apps\/(\w+)\/(\w+)$/, '/api/v1/apps/:2?appId=:1', 'get, post'],
  [/\/v1\/org\/(\d+)\/me?/, '/api/v1/org/me/index?orgId=:1', 'get'],
  [/\/v1\/org\/(\d+)\/(subdomain_validation|signin|signout)?/, '/api/v1/org/public?orgId=:1&action=:2', 'rest'],
  [/\/v1\/org\/(\w+)\/(\w+)(?:\/(\d+))?/, '/api/v1/org/:2?appId=:1&id=:3', 'rest'],
  [/\/v1\/app?/, '/api/v1/app', 'rest'],
  [/\/v1\/file?/, '/api/v1/file', 'rest'],
  [/\/v1(?:\/(\w+))?/, '/api/v1/public?action=:1', 'rest'],
]

