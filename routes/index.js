var express = require('express');
var router = express.Router();

/* GET home page. */
const tasksRouter = require('./task.api.js');
router.use('/tasks', tasksRouter);

const usersRouter = require('./user.api.js');
router.use('/users', usersRouter);

module.exports = router;
