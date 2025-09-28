const express = require("express");
const auth = require("../../../middleware/auth");
const {
  createBudget,
  getAllBudgets,
  deleteBudget,
  updateBudget,
} = require("../../../controllers/budgets");

const router = express.Router();

// Use auth middleware for all routes in this file
router.use(auth);

/**
 * @route   POST api/v1/budgets/
 * @desc    Create a new budget for a category or update an existing one
 * @access  Private
 */
/**
 * @route   GET api/v1/budgets/
 * @desc    Get all budgets for the authenticated user
 * @access  Private
 */
router.route("/").post(createBudget).get(getAllBudgets);

/**
 * @route   PUT api/v1/budgets/:id
 * @desc    Update a specific budget by its ID
 * @access  Private
 */
/**
 * @route   DELETE api/v1/budgets/:id
 * @desc    Delete a specific budget by its ID
 * @access  Private
 */
router.route("/:id").put(updateBudget).delete(deleteBudget);

module.exports = router;
