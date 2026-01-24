const db = require("../config/db");
const bcrypt = require("bcrypt");

const getUserById = async (id) => {
    const [rows] = await db.execute(
        "SELECT id, email, role, is_active, created_at FROM users WHERE id = ?", [id]
    );
    return rows[0];
};

const getAllUsers = async() => {
    const [rows] = await db.execute(
        "SELECT id, email, role, is_active, created_at FROM users"
    );
    return rows;
};

const blockUser = async (id) => {
    await db.execute(
        "UPDATE users SET is_active = FALSE WHERE id = ?", [id]
    );
};

const unblockUser = async (id) => {
    await db.execute(
        "UPDATE users SET is_active = TRUE WHERE id = ?", [id]
    );
};

const updateUserEmail = async(id, email) => {
    await db.execute(
        "UPDATE users SET email = ? WHERE id = ?", [email, id]
    );
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const [rows] = await db.execute(
    "SELECT password FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) return false;

  const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
  if (!isMatch) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.execute(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, userId]
  );

  return true; //  IMPORTANT
};

module.exports ={
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    updateUserEmail,
    changePassword
};