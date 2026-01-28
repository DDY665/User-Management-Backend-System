const bcrypt = require("bcrypt");
const db = require("../config/db");

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

// REGISTER USER (Public)
const registerUser = async (email, password) => {
  const [existing] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute(
    `INSERT INTO users (email, password, role, must_change_password, onboarding_status)
     VALUES (?, ?, 'user', FALSE, 'ACTIVE')`,
    [email, hashedPassword]
  );
};

// LOGIN USER
const loginUser = async (email, password) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const user = rows[0];

  // Admin blocked
  if (!user.is_active) {
    const error = new Error("Account is blocked");
    error.status = 403;
    throw error;
  }

  // Temporarily locked
  if (user.lock_until && new Date(user.lock_until) > new Date()) {
    const error = new Error("Account locked due to multiple failed login attempts. Try again later.");
    error.status = 423;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  //  Wrong password
  if (!match) {
    const attempts = user.failed_attempts + 1;

    if (attempts >= MAX_ATTEMPTS) {
      await db.execute(
        `UPDATE users
         SET failed_attempts = ?, 
             lock_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
         WHERE id = ?`,
        [attempts, LOCK_TIME_MINUTES, user.id]
      );

      const error = new Error(
        "Too many failed attempts. Account locked for 15 minutes."
      );
      error.status = 423;
      throw error;
    }

    await db.execute(
      "UPDATE users SET failed_attempts = ? WHERE id = ?",
      [attempts, user.id]
    );

    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  //  Successful login → reset counters
  await db.execute(
    "UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?",
    [user.id]
  );

  //  Onboarding enforcement
  if (user.must_change_password) {
    return {
      forcePasswordChange: true,
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  registerUser,
  loginUser
};
