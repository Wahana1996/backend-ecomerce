const express = require("express");
const {
  createCategory,
  updateCategory,
  showAllCategory,
  showOneCategory,
  deleteCategory,
} = require("../controller/categoryController");
const {
  authMiddleware,
  permissionUser,
} = require("../middleware/userMiddleware");

const router = express.Router();

router.get("/showall", showAllCategory);
router.get("/showone/:id", showOneCategory);
router.post("/create", authMiddleware, permissionUser("Admin"), createCategory);
router.put(
  "/update/:id",
  authMiddleware,
  permissionUser("Admin"),
  updateCategory
);
router.delete("/:id", authMiddleware, permissionUser("Admin"), deleteCategory);

module.exports = router;
