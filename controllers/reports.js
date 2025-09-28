const db = require('../schema/sqlite');
const Expense = require('../models/expense');
const Budget = require('../models/budget');
const mongoose = require('mongoose');

/**
 * Generates and saves a report for a specific month.
 * This is an internal function, not an API endpoint.
 */
const generateMonthlyReport = async (userId, year, month) => {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 1);
  const reportMonth = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Define a reusable match stage for this month's expenses
  const matchStage = {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startOfMonth.toISOString().slice(0, 10), $lt: endOfMonth.toISOString().slice(0, 10) }
    }
  };

  // 1. Calculate Total Spent
  const totalSpentResult = await Expense.aggregate([
    matchStage,
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;

  // 2. Find Top Spending Category
  const topCategoryResult = await Expense.aggregate([
    matchStage,
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);
  const topCategory = topCategoryResult.length > 0 ? topCategoryResult[0]._id : 'N/A';

  // 3. Find Overbudget Categories
  const budgets = await Budget.find({ userId });
  const monthlySpending = await Expense.aggregate([matchStage, { $group: { _id: '$category', total: { $sum: '$amount' } } }]);

  const overbudgetCategories = [];
  for (const spending of monthlySpending) {
    const budget = budgets.find(b => b.category === spending._id);
    if (budget && spending.total > budget.monthlyLimit) {
      overbudgetCategories.push(spending._id);
    }
  }

  // 4. Save to SQLite (Upsert)
  const stmt = `
    INSERT INTO monthly_reports (userId, reportMonth, totalSpent, topCategory, overbudgetCategories)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(userId, reportMonth) DO UPDATE SET
    totalSpent=excluded.totalSpent,
    topCategory=excluded.topCategory,
    overbudgetCategories=excluded.overbudgetCategories;
  `;

  db.run(stmt, [userId, reportMonth, totalSpent, topCategory, JSON.stringify(overbudgetCategories)]);
};

/**
 * @route   POST api/v1/reports/generate
 * @desc    Generate and save a report for the previous month
 * @access  Private
 */
const triggerReportGeneration = async (req, res) => {
  try {
    const now = new Date();
    // Go back one day from the start of the current month to get the previous month
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    await generateMonthlyReport(req.user.id, lastMonth.getFullYear(), lastMonth.getMonth());
    res.status(200).json({ message: 'Monthly report generation triggered successfully for the previous month.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while generating report.', error: error.message });
  }
};

/**
 * @route   GET api/v1/reports
 * @desc    Get all saved monthly reports for the user
 * @access  Private
 */
const getReports = (req, res) => {
  const sql = "SELECT reportMonth, totalSpent, topCategory, overbudgetCategories FROM monthly_reports WHERE userId = ? ORDER BY reportMonth DESC";
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve reports.', error: err.message });
    }
    // Parse the JSON string back into an array
    const reports = rows.map(row => ({ ...row, overbudgetCategories: JSON.parse(row.overbudgetCategories) }));
    res.json(reports);
  });
};

module.exports = { generateMonthlyReport, triggerReportGeneration, getReports };