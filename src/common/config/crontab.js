/* eslint-disable eol-last */
module.exports = [{
  interval: '3 days',
  // cron: '*/1 * * * *',
  handle: 'admin/crontab/cloa',
  type: 'one',
  enable: true // 关闭当前定时器，默认true
}];
/*
module.exports = [{
  type: 'one',
  interval: 1 * 60 * 1000,
  handle: 'crontab/sync_comment'
}];
*/