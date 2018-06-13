const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { db, TodoTask } = require('../models');

/**
 * Get App update config with rules
 * @param {number} organizationId
 * @param {Object} options - sequelize option object
 * @public
 * @returns
 */
function create(todoTask) {
  return TodoTask.create(todoTask);
}

/**
 * Fetch tasks by date in ascending order.
 * The pinned tasks will be at the top of the list
 * @param {number} userId
 */
function fetch(userId) {
  return TodoTask.findAll({
    where: {
      userId,
    },
    order: [
      ['important', 'DESC'],
      ['done', 'ASC'],
      ['dateTime', 'ASC'],
    ],
  });
}

function getSummary(userId, startDate, endDate) {
  return TodoTask.findAll({
    where: {
      userId,
      dateTime: {
        [Op.between]: [
          startDate,
          endDate,
        ],
      },
    },
    order: [
      ['important', 'DESC'],
      ['dateTime', 'ASC'],
    ],
  });
}

function getDailySummary(userId) {
  const currentDate = moment.utc();
  return getSummary(
    userId,
    currentDate.startOf('date').toDate(),
    currentDate.endOf('date').toDate(),
  );
}

function toggleFlag(taskId, userId, field) {
  return db.transaction(async (transaction) => {
    const todoTask = await TodoTask.findOne({
      where: {
        userId,
        id: taskId,
      },
      transaction,
    });
    await todoTask.update(
      {
        [field]: !todoTask[field],
      },
      {
        transaction,
      },
    );
  });
}

/**
 * Mark task as important
 * @param {number} taskId
 */
function toggleImportant(taskId, userId) {
  return toggleFlag(taskId, userId, 'important');
}

/**
 * Mark task as done
 * @param {number} taskId
 */
function toggleDone(taskId, userId) {
  return toggleFlag(taskId, userId, 'done');
}

module.exports = {
  create,
  fetch,
  getDailySummary,
  toggleImportant,
  toggleDone,
};
