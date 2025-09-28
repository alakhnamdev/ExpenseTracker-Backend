const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file.
const dbPath = path.resolve(__dirname, '../../src/database/reports.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database for reports.');
    db.run(`CREATE TABLE IF NOT EXISTS monthly_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      reportMonth TEXT NOT NULL, -- Format: YYYY-MM
      totalSpent REAL NOT NULL,
      topCategory TEXT,
      overbudgetCategories TEXT, -- Stored as a JSON string
      UNIQUE(userId, reportMonth)
    )`);
  }
});

module.exports = db;