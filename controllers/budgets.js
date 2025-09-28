const Budget = require('../models/budget');

const createBudget = async (req, res) => {
  const { category, monthlyLimit } = req.body;
  const userId = req.user.id;
  console.log("createBudget request received:", req.body);

  if (!category || typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
    return res.status(400).json({ message: 'Please provide a valid category and a positive monthlyLimit.' });
  }

  try {
    // Upsert: find a budget for this user and category, or create it if it doesn't exist.
    const newBudget = new Budget({ userId, category, monthlyLimit });
    const budget = await newBudget.save();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error while setting budget.', error: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    // Find and update in one step, ensuring the budgets belongs to the user

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or user not authorized.' });
    }

    res.json(budget);
  } catch (error) {
    // Handle potential CastError if the ID format is invalid
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID format.' });
    }
    res.status(500).json({ message: 'Server error while updating budget.', error: error.message });
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    if (!budgets) {
      return res.status(404).json({ message: 'No budgets found for this user.' });
    }
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving budgets.', error: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or user not authorized.' });
    }

    res.json({ message: 'Budget deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid budget ID format.' });
    }
    res.status(500).json({ message: 'Server error while deleting budget.', error: error.message });
  }
};

module.exports = {
  createBudget,
  updateBudget,
  getAllBudgets,
  deleteBudget,
};