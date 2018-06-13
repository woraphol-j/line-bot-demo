const { TodoTask } = require('../models');

/**
* Find all users in the system
*/
function fetchAll() {
  return TodoTask.findAll({
    group: 'userId',
    attributes: ['userId'],
  });
}

module.exports = {
  fetchAll,
};
