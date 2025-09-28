const express = require('express');
const auth = require('../../../middleware/auth');
const {
  getMonthlyTotal,
  getTopSpendingCategory,
  getTopPaymentMethods,
  getCategorySpending,
  getSpendingTrend
} = require('../../../controllers/dashboard');

const router = express.Router();

// Protect all routes in this file with JWT auth middleware
router.use(auth);

/**
 * @route   GET api/v1/dashboard/monthly-total
 * @desc    Get the total expenses for the current month
 * @access  Private
 */
router.get('/monthly-total', getMonthlyTotal);

/**
 * @route   GET api/v1/dashboard/top-category
 * @desc    Get the top spending category for the current month
 * @access  Private
 */
router.get('/top-category', getTopSpendingCategory);

/**
 * @route   GET api/v1/dashboard/top-payment-methods
 * @desc    Get the top 3 most used payment methods
 * @access  Private
 */
router.get('/top-payment-methods', getTopPaymentMethods);

/**
 * @route   GET api/v1/dashboard/category-spending
 * @desc    Get total spending for all categories for the current month
 * @access  Private
 */
router.get('/category-spending', getCategorySpending);

/**
 * @route   GET api/v1/dashboard/spending-trend
 * @desc    Get daily spending totals for a line graph (defaults to last 30 days)
 * @access  Private
 */
router.get('/spending-trend', getSpendingTrend);

module.exports = router;