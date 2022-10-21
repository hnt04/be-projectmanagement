const express = require('express');
const { createUsers, getUsers, getSingleUsers, editUsers, deleteUsers } = require('../controllers/user.controller');
const router = express.Router();

// CREATE
/**
 * @route POST api/users
 * @description Create new user
 * @access private, assigner
 */
router.post('/', createUsers);

// GET ALL USERS
/**
 * @route GET API/users
 * @description Get a list of users
 * @access private
 */
router.get('/', getUsers);

// GET SINGLE USER
/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get('/:id', getSingleUsers);

// UPDATE
/**
 * @route PUT api/users
 * @description update a user
 * @access public
 */
router.put('/:id', editUsers);

// // DELETE
/**
 * @route DELETE api/users
 * @description delete a user
 * @access public
 */
router.delete('/:id', deleteUsers);

module.exports = router;
