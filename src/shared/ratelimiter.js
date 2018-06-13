const { RateLimiter } = require('limiter');

class RateLimitError extends Error {
  constructor(message = 'It is over the limit', meta) {
    super(message);
    this.name = this.constructor.name;
    this.meta = meta;
  }
}

function removeTokens(count, limiter) {
  return new Promise((resolve, reject) => {
    limiter.removeTokens(count, (err, remainingRequests) => {
      if (err) return reject(err);
      if (remainingRequests < 1) {
        return reject(new RateLimitError('reached the limit, please try again later.'));
      }

      resolve(remainingRequests);
      return undefined;
    });
  });
}

function createRateLimiter(value, unit, func) {
  const limiter = new RateLimiter(value, unit, true);
  return async (event) => {
    await removeTokens(1, limiter);
    const result = await func(event);
    return result;
  };
}

module.exports = createRateLimiter;
