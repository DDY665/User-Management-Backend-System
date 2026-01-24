const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const {
  isAuthenticated,
  isAdmin
} = require("../middleware/auth.middleware");

// user: own profile
router.get("/me", isAuthenticated, userController.getMyProfile);
router.patch("/me", isAuthenticated, userController.updateMyProfile);
router.patch('/me/password',isAuthenticated,userController.changeMyPassword);

// admin: user management
router.get("/", isAuthenticated, isAdmin, userController.getAllUsers);
router.patch("/:id/block", isAuthenticated, isAdmin, userController.blockUser);
router.patch("/:id/unblock", isAuthenticated, isAdmin, userController.unblockUser);

module.exports = router;

