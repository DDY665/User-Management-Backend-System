const userService = require("../services/user.service");
const response = require("../utils/response.util");

// GET /users/me
const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    response.success(res, "Profile fetched", user);
  } catch (err) {
    next(err);
  }
};

// GET /users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    response.success(res, "Users fetched", users);
  } catch (err) {
    next(err);
  }
};

// PATCH /users/:id/block
const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await userService.blockUser(id);
    response.success(res, "User blocked");
  } catch (err) {
    next(err);
  }
};

// PATCH /users/:id/unblock
const unblockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await userService.unblockUser(id);
    response.success(res, "User unblocked");
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me
const updateMyProfile = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userService.getUserById(req.user.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await userService.updateUserEmail(req.user.id, email);
    response.success(res, "Profile updated");
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/password
const changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const success = await userService.changePassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    if (!success) {
      const error = new Error("Old password is incorrect");
      error.status = 400;
      throw error;
    }

    response.success(res, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getMyProfile,
  blockUser,
  unblockUser,
  updateMyProfile,
  changeMyPassword
};
