const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const {isAuthenticated, hasRole, requireOnboardingComplete} = require("../middleware/auth.middleware");

// Employee routes
router.get("/me", isAuthenticated, requireOnboardingComplete, userController.getMyProfile);
router.patch("/me/email", isAuthenticated, requireOnboardingComplete, userController.changeMyEmail);
router.patch("/me/password", isAuthenticated, userController.changeMyPassword);

// Manager / Supervisor routes
router.get("/team", isAuthenticated, hasRole("manager", "supervisor"), userController.getMyTeam);

// Admin routes
router.get("/", isAuthenticated, hasRole("admin"), userController.getAllUsers);
router.post("/create", isAuthenticated, hasRole("admin"), userController.createEmployee);
router.patch("/:id/block", isAuthenticated, hasRole("admin"), userController.blockUser);
router.patch("/:id/unblock", isAuthenticated, hasRole("admin"), userController.unblockUser);

module.exports = router;
