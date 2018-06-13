const config = require('config');
const line = require('@line/bot-sdk');
const httpStatus = require('http-status');
const moment = require('moment');

const todoService = require('../services/todo-task');
const todoParser = require('../lib/todo-parser');
const logger = require('../../shared/logger');

const lineConfig = {
  channelAccessToken: config.get('todo.line.channelAccessToken'),
  channelSecret: config.get('todo.line.channelSecret'),
};

const client = new line.Client(lineConfig);

async function edit(event) {
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: `${config.get('todo.webapp.domain')}/?userId=${event.source.userId}`,
  });
}

async function createTodo(event) {
  const todo = todoParser(event.message.text);
  const createdTodo = await todoService.create({
    ...todo,
    userId: event.source.userId,
  });
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: `Task created! - ${createdTodo.name} - ${moment(createdTodo.dateTime).format('LLL')}`,
  });
}

async function webhook(req, res) {
  res.status(httpStatus.OK).end();
  const [event] = req.body.events;
  if (event.message.text.toUpperCase() === 'EDIT') {
    await edit(event);
  } else {
    try {
      await createTodo(event);
    } catch (err) {
      logger.error('Failed to parse todo string', err);
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'Invalid command',
      });
    }
  }
}

module.exports = webhook;
