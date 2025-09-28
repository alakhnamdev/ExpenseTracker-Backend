const Expense = require('../models/expense');
const mongoose = require('mongoose');

const getMonthlyTotal = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Convert dates to YYYY-MM-DD format to match your schema
    const startDateString = startOfMonth.toISOString().slice(0, 10);
    const endDateString = endOfMonth.toISOString().slice(0, 10);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: {
            $gte: startDateString,
            $lt: endDateString,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].totalAmount : 0;
    res.json({ totalAmount: total });
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating monthly total.', error: error.message });
  }
};

const getTopSpendingCategory = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startDateString = startOfMonth.toISOString().slice(0, 10);
    const endDateString = endOfMonth.toISOString().slice(0, 10);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDateString, $lt: endDateString },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 1 },
      {
        $project: { _id: 0, category: '$_id', totalSpent: 1 },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ message: 'No spending data found for the current month.' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating top spending category.', error: error.message });
  }
};

const getTopPaymentMethods = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 }, // Count the number of transactions for each method
        },
      },
      { $sort: { count: -1 } }, // Sort by the most used
      { $limit: 3 }, // Limit to the top 3
      {
        $project: { _id: 0, paymentMethod: '$_id', count: 1 },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ message: 'No transaction data found.' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating top payment methods.', error: error.message });
  }
};

const getCategorySpending = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startDateString = startOfMonth.toISOString().slice(0, 10);
    const endDateString = endOfMonth.toISOString().slice(0, 10);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDateString, $lt: endDateString },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
      { $sort: { totalSpent: -1 } }, // Sort from highest to lowest spending
      {
        $project: { _id: 0, category: '$_id', totalSpent: 1 },
      },
    ]);

    res.json(result); // Returns an array, which will be empty if no data
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating category spending.', error: error.message });
  }
};

const getSpendingTrend = async (req, res) => {
  try {
    // Allow filtering by a specific number of days, defaulting to 30
    const days = parseInt(req.query.days, 10) || 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Convert dates to 'YYYY-MM-DD' string format to match the schema
    const startDateString = startDate.toISOString().slice(0, 10);
    const endDateString = endDate.toISOString().slice(0, 10);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: {
            $gte: startDateString,
            $lte: endDateString, // Use lte to include today
          },
        },
      },
      {
        $group: {
          _id: '$date', // Group expenses by date
          totalSpent: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date in ascending order
      { $project: { _id: 0, date: '$_id', totalSpent: 1 } },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating spending trend.', error: error.message });
  }
};

module.exports = { getMonthlyTotal, getTopSpendingCategory, getTopPaymentMethods, getCategorySpending, getSpendingTrend };