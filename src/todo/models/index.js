const db = require('./db');
const TodoTask = require('./TodoTask');

// TODO: Should use a proper migration instead
db.sync({ force: false });

module.exports = {
  db,
  TodoTask,
};
