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
    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Attach user to request
    req.user = decoded; // { id, role, must_change_password, iat, exp }

    next();
  } catch (err) {
    err.status = 401;
    err.message = "Invalid or expired token";
    next(err);
  }
};


const requireOnboardingComplete = (req, res, next) => {
if (!req.user || req.user.must_change_password) {
    const error = new Error("Complete onboarding first");
    error.status = 403;
    return next(error);
  }
  next();
};


// Flexible role-based authorization
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error("Access denied");
      error.status = 403;
      return next(error);
    }
    next();
  };
};

// Simple admin-only middleware (optional legacy)
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
  hasRole,
  isAdmin,
  requireOnboardingComplete
};

