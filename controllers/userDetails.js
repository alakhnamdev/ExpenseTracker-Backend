const User = require('../models/user');

const getUserDetails = async (req, res) => {
  console.log("Fetching user details for user ID:", req.user.name);
  try {
    // The auth middleware has already verified the token and attached the user payload.
    // We can optionally fetch the latest user details from the database.
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from result
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching user details.', error: error.message });
  }
};

module.exports = getUserDetails;