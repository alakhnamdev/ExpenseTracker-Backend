const jwt = require("jsonwebtoken");

const VerifyAuth = (req, res) => {
  console.log("VerifyAuth request received");
  const token = req.body.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Examples of errors: TokenExpiredError, JsonWebTokenError
      return res.status(401).json({ message: "Unauthorized: Invalid token."+ err.message, token : token });
    }

    // The decoded payload is attached to the request object
    res.status(200).json({ message: "Token is valid.", user: decoded });
  });
};

module.exports = VerifyAuth;