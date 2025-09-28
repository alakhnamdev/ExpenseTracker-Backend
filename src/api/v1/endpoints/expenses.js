const express = require('express');
const auth = require('../../../middleware/auth'); // auth middleware is in middleware folder
const { 
  addExpense, 
  getAllExpenses, 
  updateExpense, 
  deleteExpense,
  getCurrentMonthExpenses
} = require('../../../controllers/expenses');

const router = express.Router();

// Protect all routes in this file with JWT auth middleware
router.use(auth);

/**
 * @route   POST api/v1/expenses/
 * @desc    Add a new expense for the authenticated user
 * @access  Private
 */
/**
 * @route   GET api/v1/expenses/
 * @desc    Get all expenses for the authenticated user, with optional query filters (category, paymentMethod, search)
 * @access  Private
 */
router.route('/')
  .post(addExpense)
  .get(getAllExpenses);

/**
 * @route   GET api/v1/expenses/current-month
 * @desc    Get all expenses recorded in the current calendar month
 * @access  Private
 */
router.get('/current-month', getCurrentMonthExpenses);

/**
 * @route   PUT api/v1/expenses/:id
 * @desc    Update a specific expense by its ID
 * @access  Private
 */
/**
 * @route   DELETE api/v1/expenses/:id
 * @desc    Delete a specific expense by its ID
 * @access  Private
 */
router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;