const jwt = require("jsonwebtoken");

// JWT-based authentication
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error("Authorization token missing");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("Invalid authorization format");
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    err.status = 401;
    err.message = "Invalid or expired token";
    next(err);
  }
};

// Role-based authorization
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    const error = new Error("Access denied");
    error.status = 403;
    return next(error);
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin
};
