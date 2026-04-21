const jwt = require('jsonwebtoken');

// 🔐 AUTHENTICATION (checks login)
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send("Not authenticated");
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

// 🛡️ AUTHORIZATION (checks role)
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied");
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };