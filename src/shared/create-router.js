const _ = require('lodash');
const { Router } = require('express');

function isAsync(fn) {
  return fn.constructor.name === 'AsyncFunction';
}

function wrap(handler) {
  if (!isAsync(handler)) {
    return handler;
  }

  return function wrapAsync(req, res, next) {
    handler(req, res, next).catch(next);
  };
}

function wrapAll(handlers) {
  return _.forEach(handlers, handler => wrap(handler));
}

/**
 * Create an express router based on the routes provided
 * @param {Array<object>} routes
 */
function createRouter(routes) {
  const router = Router();
  routes.forEach((route) => {
    const args = [];
    if (route.middleware) {
      args.push(...wrapAll(route.middleware));
    }

    args.push(wrap(route.handler));
    router[route.method.toLowerCase()](route.path, ...args);
  });

  return router;
}

module.exports = createRouter;
