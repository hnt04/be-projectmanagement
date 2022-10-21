const express = require('express');
const { createTasks, getTasks, getSingleTask, editTasks, deleteTasks } = require('../controllers/task.controller');
const router = express.Router();

// CREATE
/**
 * @route POST api/tasks
 * @description create a task
 * @access public
 */
router.post('/', createTasks);

// GET ALL TASKS
/**
 * @route GET API/tasks
 * @description Get a list of tasks
 * @access private
 */
router.get('/', getTasks);

// GET SINGLE TASK
/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
 router.get('/:id', getSingleTask);

// UPDATE
/**
 * @route PUT api/tasks
 * @description update a task
 * @access public
 */
router.put('/:id', editTasks);

// // DELETE
/**
 * @route DELETE api/tasks
 * @description delete a task
 * @access public
 */
router.delete('/:id', deleteTasks);

module.exports = router;
