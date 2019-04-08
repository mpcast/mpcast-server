const { runHttpQuery } = require('apollo-server-core');

module.exports = (options = {}) => {
  return tjsContext => {
    return runHttpQuery([], {
      method: tjsContext.request.method,
      options,
      query:
        tjsContext.request.method === 'POST'
          ? tjsContext.post()
          : tjsContext.param()
    }).then(
      rsp => {
        tjsContext.set('Content-Type', 'application/json');
        tjsContext.body = rsp;
      },
      err => {
        if (err.name !== 'HttpQueryError') throw err;

        err.headers &&
          Object.keys(err.headers).forEach(header => {
            tjsContext.set(header, err.headers[header]);
          });

        tjsContext.status = err.statusCode;
        tjsContext.body = err.message;
      }
    );


  };
};
