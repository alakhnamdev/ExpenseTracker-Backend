const config = {
    app_name: "Expense Tracker Backend",
    app_description: "A robust and scalable backend service. Created By - Alakh Namdev",
    debug: process.env.NODE_ENV !== 'production',
    allowed_origins: ["http://localhost:3000"] // Allow specific origin for CORS
};

module.exports = config;