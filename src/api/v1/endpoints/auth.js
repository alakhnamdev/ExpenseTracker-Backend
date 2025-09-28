const express = require("express");

const LoginController = require("../../../controllers/login");
const LogoutController = require("../../../controllers/logout");
const SignupController = require("../../../controllers/signup");
const VerifyAuthController = require("../../../controllers/verifyAuth");
const UserDetailsController = require("../../../controllers/userDetails");
const authMiddleware = require("../../../middleware/auth");

const router = express.Router();

// POST /login route for user authentication
router.post("/login", LoginController);

// POST /logout route to clear the authentication cookie
router.post("/logout", LogoutController);

//  POST /signup route for user registration
router.post("/signup", SignupController);

// POST /verify-auth route to verify JWT token and return user data
router.post("/verify-auth", VerifyAuthController);

// GET /user-details route to get authenticated user's details
router.get("/user-details", authMiddleware, UserDetailsController);

// Export the router to be used in other files
module.exports = router;