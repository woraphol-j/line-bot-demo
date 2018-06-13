const _ = require('lodash');
const moment = require('moment');

class TodoParsingError extends Error {
  constructor(message = 'Parse todo error', meta) {
    super(message);
    this.name = this.constructor.name;
    this.meta = meta;
  }
}

module.exports = function parseTodo(todoStr) {
  const commands = _.split(todoStr, ' : ');
  if (_.size(commands) < 2) {
    throw new TodoParsingError('not sufficient commands', {
      todoStr,
    });
  }

  const trimmedCommands = _.map(commands, _.trim);
  const date = trimmedCommands[1];
  let todoDate;
  if (date.toUpperCase() === 'TODAY') {
    todoDate = moment();
  } else if (date.toUpperCase() === 'TOMORROW') {
    todoDate = moment().add(1, 'd');
  } else {
    todoDate = moment(date, 'DD/MM/YY');
    if (!todoDate.isValid()) {
      throw new TodoParsingError('invalid date format');
    }
  }

  let todoTime;
  const time = _.nth(commands, 2);
  if (time) {
    todoTime = moment(time, 'HH:mm');
    if (!todoTime.isValid()) {
      throw new TodoParsingError('invalid time format');
    }
  } else {
    todoTime = moment('12:00');
  }

  const todoDateTime = todoDate.hour(todoTime.hour())
    .minute(todoTime.minute()).second(0).millisecond(0);

  return {
    name: commands[0],
    dateTime: todoDateTime,
  };
};
