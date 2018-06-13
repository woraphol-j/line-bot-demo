const Sequelize = require('sequelize');

const db = require('./db');

const TodoTask = db.define(
  'TodoTask',
  {
    name: {
      type: Sequelize.TEXT,
    },
    done: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    important: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    dateTime: {
      type: Sequelize.DATE,
    },
    userId: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'todo_tasks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
);

module.exports = TodoTask;
