// load environment variables
const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors'); // Middleware for enabling CORS
const connectDB = require('./config/db'); // MongoDB connection function
const config = require('./config/config'); // Load the configuration file for app settings
const startReportGenerationJob = require('./cronjob/reportGenerator');

// Import the main v1 API router
const apiRoutes = require('./api/v1/routes');

// Connect to the MongoDB database 
connectDB();

const app = express();

// Set up server details from config
app.locals.app_name = config.app_name;
app.locals.app_description = config.app_description;
app.locals.debug = config.debug;

// CORS middleware: This allows all origins, methods, and headers, and supports credentials.
app.use(cors({
    origin: config.allowed_origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the main v1 router with a base path,
app.use("/api/v1", apiRoutes);

// --- Initialize Scheduled Jobs ---
// This will start all the cron jobs defined in separate modules.
startReportGenerationJob();

// Server configuration
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
    console.log(`\nServer running on http://${HOST}:${PORT}`);
    console.log(`Application: ${app.locals.app_name}`);
    console.log(`Description: ${app.locals.app_description}`);
    console.log(`Debug Mode: ${app.locals.debug}\n`);
});

module.exports = app;