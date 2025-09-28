const User = require("../models/user");

const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`\nSignup request received: \nName: ${name} \nEmail: ${email}\n`);

  // Basic validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409) // 409 Conflict is more specific for an existing resource
        .json({ message: "User with this email already exists." });
    }

    // Create a new user instance
    const newUser = new User({ name, email, password });

    // The 'pre-save' hook in the model will hash the password before saving
    await newUser.save();

    // Respond without sending the password
    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
    console.log(`User created successfully: ${newUser.email}`);
  } catch (error) {
    // Handle Mongoose validation errors (e.g., invalid email, short password)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }

    // Generic server error
    res.status(500).json({
      message: "Server error during user creation.",
      error: error.message,
    });
  }
};

module.exports = Signup;