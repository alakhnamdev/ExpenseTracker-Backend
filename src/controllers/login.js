const User = require("../models/user");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      name: user.name,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    // Sign the token with the secret key and set an expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // The cookie is not accessible via client-side script
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds, should match token expiry
    };

    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        user: { name: user.name, email: user.email },
        token: token,
      });
  } catch (error) {
    // Server error
    res.status(500).json({
      message: "Server error during login.",
      error: error.message,
    });
  }
};

module.exports = Login;
