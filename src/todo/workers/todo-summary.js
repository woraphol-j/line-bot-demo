const { Client } = require('@line/bot-sdk');
const Bluebird = require('bluebird');
const config = require('config');
const { CronJob } = require('cron');
const _ = require('lodash');
const moment = require('moment');

const { getDailySummary } = require('../services/todo-task');
const { fetchAll } = require('../services/user');

const client = new Client({
  channelAccessToken: config.get('todo.line.channelAccessToken'),
  channelSecret: config.get('todo.line.channelSecret'),
});

function printTask(task) {
  return `${moment(task.dateTime).format('lll')} - ${task.name}`;
}

async function sendTaskSummary({ userId }) {
  const tasks = await getDailySummary(userId);
  const [doneTasks, todoTasks] = _.partition(tasks, 'done');
  let finalMessage = ['[[[ Task Summary ]]]'];
  if (!_.isEmpty(doneTasks)) {
    const doneMessages = _.map(doneTasks, printTask);
    finalMessage = [
      ...finalMessage,
      'Completed Tasks',
      ...doneMessages,
    ];
  }

  if (!_.isEmpty(todoTasks)) {
    const todoMessages = _.map(todoTasks, printTask);
    finalMessage = [
      ...finalMessage,
      'Todo Tasks',
      ...todoMessages,
    ];
  }

  await client.pushMessage(userId, {
    type: 'text',
    text: _.isEmpty(finalMessage)
      ? 'No tasks done or to do today'
      : finalMessage.join('\n'),
  });
}

const cronJobs = _.map(
  _.split(config.get('todo.worker.crons'), ','),
  cron => new CronJob({
    cronTime: cron,
    async onTick() {
      const users = await fetchAll();
      await Bluebird.mapSeries(users, sendTaskSummary);
    },
    start: false,
    timeZone: config.get('todo.worker.timezone'),
  }),
);

function startWorker() {
  _.forEach(cronJobs, (cronJob) => {
    cronJob.start();
  });
}

module.exports = {
  startWorker,
};
