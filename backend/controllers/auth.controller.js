const authService = require("../services/auth.service");
const response = require("../utils/response.util");
const jwt = require("jsonwebtoken");
const { logAction } = require("../utils/audit.util");

// SIGNUP
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await authService.registerUser(email, password);
    await logAction(null, "SIGNUP", null);

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

    // FORCE PASSWORD CHANGE FLOW
    if (user.forcePasswordChange) {
      await logAction(user.id, "LOGIN_PASSWORD_CHANGE_REQUIRED", null);

      const onboardingToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          must_change_password: true
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return response.success(res, "Password change required", {
        forcePasswordChange: true,
        token: onboardingToken
      });
    }

    // NORMAL LOGIN FLOW
    await logAction(user.id, "LOGIN_SUCCESS", null);

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return response.success(res, "Login successful", {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    // Optional security audit
    await logAction(null, "LOGIN_FAILED", null);
    next(err);
  }
};

module.exports = {
  signup,
  login
};
