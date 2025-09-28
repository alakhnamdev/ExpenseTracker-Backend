const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from the httpOnly cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Examples of errors: TokenExpiredError, JsonWebTokenError
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    // The decoded payload is attached to the request object
    // so it can be used in subsequent route handlers.
    req.user = decoded;
    next();
  });
};

module.exports = auth;
