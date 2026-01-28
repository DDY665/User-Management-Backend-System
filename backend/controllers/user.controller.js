const userService = require("../services/user.service");
const response = require("../utils/response.util");
const { logAction } = require("../utils/audit.util");


// GET /users/me
const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    let department = null;
    if (user.department_id) {
      department = await userService.getDepartmentById(user.department_id);
    }

    await logAction(req.user.id, "VIEW_PROFILE", req.user.id);

    response.success(res, "Profile fetched", {
      ...user,
      department
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/users/create (Admin / HR)
const createEmployee = async (req, res, next) => {
  try {
    const { email, role, departmentId } = req.body;
    
    const employee = await userService.createEmployee({
      email,
      role,
      departmentId
    });
    
    await logAction(req.user.id, "CREATE_EMPLOYEE", employee.id);
    
    response.success(res, "Employee created successfully", {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      tempPassword: employee.tempPassword,          // ✅ shown ONCE
      must_change_password: employee.must_change_password,
      onboarding_status: employee.onboarding_status
    });
  } catch (error) {
    next(error);
  }
};


// GET /users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    
    await logAction(req.user.id, "VIEW_ALL_USERS", null);

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
    await logAction(req.user.id, "BLOCK_USER", id);

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
    await logAction(req.user.id, "UNBLOCK_USER", id);
    
    response.success(res, "User unblocked");
  } catch (err) {
    next(err);
  }
};


// PATCH /users/me
const changeMyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      throw error;
    }

    await userService.updateUserEmail(req.user.id, email);
    await logAction(req.user.id, "CHANGE_EMAIL", req.user.id);

    response.success(res, "Email updated successfully");
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

    await logAction(req.user.id, "CHANGE_PASSWORD", req.user.id);

    response.success(res, "Password changed successfully",{
      onboardingCompleted: true
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/team
const getMyTeam = async (req, res, next) => {
  try {
    // ✅ Fetch department via DB, not JWT
    const user = await userService.getUserById(req.user.id);

    if (!user || !user.department_id) {
      const error = new Error("Department not assigned");
      error.status = 400;
      throw error;
    }

    const team = await userService.getTeamMembers(user.department_id);
    await logAction(req.user.id, "VIEW_TEAM", user.department_id);

    response.success(res, "Team members fetched", team);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getMyProfile,
  changeMyEmail,
  changeMyPassword,
  getMyTeam,
  getAllUsers,
  createEmployee,
  blockUser,
  unblockUser
};
