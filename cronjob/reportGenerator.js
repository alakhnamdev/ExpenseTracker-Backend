const cron = require('node-cron');
const User = require('../models/user');
const { generateMonthlyReport } = require('../controllers/reports');

/**
 * Initializes and starts the scheduled cron job for generating monthly reports.
 */
const startReportGenerationJob = () => {
  // Schedule the task to run at 5 minutes past midnight (00:05) on the 1st day of every month.
  cron.schedule('5 0 1 * *', async () => {
    console.log('Running scheduled job: Generating monthly reports for all users...');
    try {
      // Get the year and month for the previous month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const year = lastMonth.getFullYear();
      const month = lastMonth.getMonth();

      // Find all users to generate reports for them
      const users = await User.find({}, '_id');

      for (const user of users) {
        console.log(`Generating report for user: ${user._id}`);
        // Calling the API function directly 
        await generateMonthlyReport(user._id.toString(), year, month);
      }
      console.log('Finished generating all monthly reports.');
    } catch (error) {
      console.error('Error during scheduled report generation:', error);
    }
  });
};

module.exports = startReportGenerationJob;