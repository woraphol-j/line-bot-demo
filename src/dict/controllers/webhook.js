const config = require('config');
const line = require('@line/bot-sdk');
const httpStatus = require('http-status');
const NodeCache = require('node-cache');

const { get: getDefinition } = require('../services/dict');
const logger = require('../../shared/logger');
const createRateLimiter = require('../../shared/ratelimiter');

const lineConfig = {
  channelAccessToken: config.get('dict.line.channelAccessToken'),
  channelSecret: config.get('dict.line.channelSecret'),
};

const client = new line.Client(lineConfig);

// TODO: this might eat up the entire memory. Move it to a proper cache store
// such as Redis instead.
// Use caching to help prevent overwhelming the Oxford API
const dictCache = new NodeCache({ stdTTL: 600 });

function sendResult(event, { definition, synonyms }) {
  return client.replyMessage(event.replyToken, [
    {
      type: 'text',
      text: definition,
    },
    {
      type: 'text',
      text: synonyms,
    },
  ]);
}


// Set up rate limiting to prevent overwhelming the Oxford API
const [rateLimitValue, rateLimitUnit] = config.get('dict.ratelimit').split(':');
const getDefinitionWithLimit = createRateLimiter(
  parseInt(rateLimitValue, 10),
  rateLimitUnit,
  getDefinition,
);

async function webhook(req, res) {
  res.status(httpStatus.OK).end();
  const [event] = req.body.events;
  try {
    const word = event.message.text;
    let definition = dictCache.get(word);
    if (!definition) {
      logger.debug('cache miss for word:', word);
      definition = await getDefinitionWithLimit(word);
      dictCache.set(word, definition);
    }

    await sendResult(event, definition);
  } catch (err) {
    logger.error('Failed to get the definition', err);
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: err.message,
    });
  }
}

module.exports = webhook;
