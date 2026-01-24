const authService = require("../services/auth.service");
const response = require("../utils/response.util");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await authService.registerUser(email, password);
    response.success(res, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    // JWT must be generated AFTER successful login
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    response.success(res, "Login successful", {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login
};
