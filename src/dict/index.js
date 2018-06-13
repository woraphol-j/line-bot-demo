const line = require('@line/bot-sdk');
const config = require('config');

const webhook = require('./controllers/webhook');
const createRouter = require('../shared/create-router');

const lineConfig = {
  channelAccessToken: config.get('dict.line.channelAccessToken'),
  channelSecret: config.get('dict.line.channelSecret'),
};

const routes = [
  {
    path: '/webhook',
    method: 'post',
    middleware: [line.middleware(lineConfig)],
    handler: webhook,
  },
];

module.exports = function setup(app) {
  const router = createRouter(routes);
  app.use('/dict', router);
};
