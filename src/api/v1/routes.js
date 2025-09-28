const express = require('express');

// The main router for the API version 1
const routes = express.Router();

// Import the individual endpoint routers
const authRoutes = require('./endpoints/auth');
const expenseRoutes = require('./endpoints/expenses');
const budgetRoutes = require('./endpoints/budgets');
const dashboardRoutes = require('./endpoints/dashboard');
const reportRoutes = require('./endpoints/reports');

// Include individual route files with a prefix
routes.use('/auth', authRoutes);
routes.use('/expenses', expenseRoutes);
routes.use('/budgets', budgetRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/reports', reportRoutes);

// Health check route to verify the server is running
routes.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = routes;