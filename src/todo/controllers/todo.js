const httpStatus = require('http-status');

const todoService = require('../services/todo-task');

async function fetch(req, res) {
  const tasks = await todoService.fetch(req.query.userId);
  res.json(tasks);
}

async function toggleDone(req, res) {
  const { userId } = req.query;
  await todoService.toggleDone(req.params.id, userId);
  res.status(httpStatus.OK).end();
}

async function toggleImportant(req, res) {
  const { userId } = req.query;
  await todoService.toggleImportant(req.params.id, userId);
  res.status(httpStatus.OK).end();
}

module.exports = {
  fetch,
  toggleDone,
  toggleImportant,
};
