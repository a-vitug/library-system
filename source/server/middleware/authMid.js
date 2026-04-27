const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send("Authentication invalid");
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

// Checks role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Authentication invalid");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied");
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };