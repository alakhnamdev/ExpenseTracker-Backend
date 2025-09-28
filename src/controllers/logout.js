const Logout = (req, res) => {
  console.log("Logout request received. Clearing token cookie.");

  // To log out, we clear the 'token' cookie by setting its expiration date to the past.
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // Match secure flag from login
  });

  res.status(200).json({ message: "Logout successful." });
};

module.exports = Logout;