const { assert } = require('chai');
const moment = require('moment');

const todoParser = require('../../../src/todo/lib/todo-parser');

describe('todo/lib/todo-parser', () => {
  it('should return definition', async () => {
    const todo = todoParser('go shopping : 1/1/18 : 12:30');
    assert.propertyVal(todo, 'name', 'go shopping');
    assert.ok(moment(todo.dateTime).isSame(moment('2018/01/01 12:30', 'YYYY/MM/DD HH:mm')));
  });
});
