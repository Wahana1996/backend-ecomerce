const express = require("express");
const {
  register,
  login,
  logout,
  getMyUser,
} = require("../controller/userController");
const { authMiddleware } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMyUser);

module.exports = router;
