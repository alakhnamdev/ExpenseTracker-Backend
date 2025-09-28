const Expense = require('../models/expense');
const mongoose = require('mongoose');

const addExpense = async (req, res) => {
  const { amount, category, date, paymentMethod, notes } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: 'Please provide amount and category.' });
  }

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      amount,
      category,
      date,
      paymentMethod,
      notes,
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding expense.', error: error.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const { category, paymentMethod, search } = req.query;
    const query = { userId: req.user.id };

    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (search) {
      // Case-insensitive search on notes
      query.notes = { $regex: search, $options: 'i' };
    }

    const expenses = await Expense.find(query).sort({ date: -1 }); // Sort by most recent
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving expenses.', error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    // Find and update in one step, ensuring the expense belongs to the user
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or user not authorized.' });
    }

    res.json(expense);
  } catch (error) {
    // Handle potential CastError if the ID format is invalid
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID format.' });
    }
    res.status(500).json({ message: 'Server error while updating expense.', error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    // Find and delete in one step, ensuring the expense belongs to the user
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or user not authorized.' });
    }

    res.json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    // Handle potential CastError if the ID format is invalid
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID format.' });
    }
    res.status(500).json({ message: 'Server error while deleting expense.', error: error.message });
  }
};

const getCurrentMonthExpenses = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Convert dates to YYYY-MM-DD format to match the Expense schema
    const startDateString = startOfMonth.toISOString().slice(0, 10);
    const endDateString = endOfMonth.toISOString().slice(0, 10);

    const expenses = await Expense.find({
      userId: req.user.id,
      date: {
      $gte: startDateString,
      $lt: endDateString,
      },
    })
    .select('-notes -_id -createdAt -updatedAt -__v') // Exclude userId, _id, createdAt, updatedAt, __v
    .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving current month expenses.', error: error.message });
  }
};

module.exports = { addExpense, getAllExpenses, updateExpense, deleteExpense, getCurrentMonthExpenses };