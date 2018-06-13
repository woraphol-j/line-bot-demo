const line = require('@line/bot-sdk');
const config = require('config');

const webhook = require('./controllers/webhook');
const { fetch, toggleDone, toggleImportant } = require('./controllers/todo');
const createRouter = require('../shared/create-router');
const { startWorker } = require('./workers/todo-summary');

const lineConfig = {
  channelAccessToken: config.get('todo.line.channelAccessToken'),
  channelSecret: config.get('todo.line.channelSecret'),
};

const routes = [
  {
    path: '/webhook',
    method: 'post',
    middleware: [line.middleware(lineConfig)],
    handler: webhook,
  },
  {
    path: '/',
    method: 'get',
    handler: fetch,
  },
  {
    path: '/:id/toggle-done',
    method: 'put',
    handler: toggleDone,
  },
  {
    path: '/:id/toggle-important',
    method: 'put',
    handler: toggleImportant,
  },
];

module.exports = function setup(app) {
  const router = createRouter(routes);
  startWorker();
  app.use('/todo', router);
};
