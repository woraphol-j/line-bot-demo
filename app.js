// const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const cors = require('cors');

const setupDict = require('./src/dict');
const setupTodo = require('./src/todo');

const app = express();
// TODO: Restrict all but the todo app domain
app.use(cors());

// Setup sub apps
setupDict(app);
setupTodo(app);

app.set('port', config.get('app.port'));

module.exports = app;
