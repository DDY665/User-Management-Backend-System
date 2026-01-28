const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// GET USER BY ID
const getUserById = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, email, role, is_active,
            must_change_password, onboarding_status,
            department_id, created_at
     FROM users
     WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// GET ALL USERS (ADMIN)
const getAllUsers = async () => {
  const [rows] = await db.execute(
    `SELECT id, email, role, is_active,
            onboarding_status, department_id, created_at
     FROM users`
  );
  return rows;
};

// BLOCK USER
const blockUser = async (id) => {
  const [result] = await db.execute(
    "UPDATE users SET is_active = FALSE WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

// UNBLOCK USER
const unblockUser = async (id) => {
  const [result] = await db.execute(
    "UPDATE users SET is_active = TRUE WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

// UPDATE EMAIL
const updateUserEmail = async (id, email) => {
  // prevent duplicate email
  const [existing] = await db.execute(
    "SELECT id FROM users WHERE email = ? AND id != ?",
    [email, id]
  );

  if (existing.length > 0) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const [result] = await db.execute(
    "UPDATE users SET email = ? WHERE id = ?",
    [email, id]
  );

  if (result.affectedRows === 0) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

// CHANGE PASSWORD (ENDS ONBOARDING)
const changePassword = async (userId, oldPassword, newPassword) => {
  const [rows] = await db.execute(
    "SELECT password FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) return false;

  const currentHash = rows[0].password;

  const isMatch = await bcrypt.compare(oldPassword, currentHash);
  if (!isMatch) return false;

  // prevent password reuse
  const isSame = await bcrypt.compare(newPassword, currentHash);
  if (isSame) {
    const error = new Error("New password must be different from old password");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.execute(
    `UPDATE users
     SET password = ?,
         must_change_password = FALSE,
         onboarding_status = 'ACTIVE'
     WHERE id = ?`,
    [hashedPassword, userId]
  );

  return true;
};

// GET DEPARTMENT BY ID
const getDepartmentById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, name FROM departments WHERE id = ?",
    [id]
  );
  return rows[0];
};

// CREATE EMPLOYEE (ADMIN)
const createEmployee = async ({ email, role, departmentId }) => {
  // Check email uniqueness
  const [existing] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    const error = new Error("Email already exists");
    error.status = 409;
    throw error;
  }

  // ✅ Validate department
  const department = await getDepartmentById(departmentId);
  if (!department) {
    const error = new Error("Invalid department");
    error.status = 400;
    throw error;
  }

  const tempPassword = crypto.randomBytes(6).toString("hex");
  const hashed = await bcrypt.hash(tempPassword, 10);

  const [result] = await db.execute(
    `INSERT INTO users
     (email, password, role, department_id, must_change_password, onboarding_status)
     VALUES (?, ?, ?, ?, TRUE, 'PENDING')`,
    [email, hashed, role, departmentId]
  );

  return {
    id: result.insertId,
    email,
    role,
    department: department.name,
    tempPassword,
    must_change_password: true,
    onboarding_status: "PENDING"
  };
};


// GET TEAM MEMBERS (MANAGER)
const getTeamMembers = async (departmentId) => {
  const [rows] = await db.execute(
    `SELECT id, email, role
     FROM users
     WHERE department_id = ?`,
    [departmentId]
  );
  return rows;
};


module.exports = {
  getUserById,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserEmail,
  changePassword,
  createEmployee,
  getTeamMembers,
  getDepartmentById
};
