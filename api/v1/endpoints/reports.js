const express = require('express');
const auth = require('../../../middleware/auth');
const { triggerReportGeneration, getReports } = require('../../../controllers/reports');

const router = express.Router();

// Protect all report routes
router.use(auth);

/**
 * @route   GET api/v1/reports/
 * @desc    Get all historical monthly reports for the authenticated user
 * @access  Private
 */
router.route('/')
  .get(getReports);

/**
 * @route   POST api/v1/reports/generate
 * @desc    Manually trigger the generation of a report for the previous month
 * @access  Private
 */
router.route('/generate')
  .post(triggerReportGeneration);

module.exports = router;