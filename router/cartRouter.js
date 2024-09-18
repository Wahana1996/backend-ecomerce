const express = require("express");
const { authMiddleware } = require("../middleware/userMiddleware");
const {
  addCart,
  addCartItem,
  getShoppingCart,
  getAllShoppingCart,
  updateShoppingCartItemQuantity,
  deleteShoppingCartItem,
} = require("../controller/cartController");

const router = express.Router();

router.post("/addcart", authMiddleware, addCart);
router.post("/addcartitem", authMiddleware, addCartItem);
router.get("/getcartitem/:id", authMiddleware, getShoppingCart);
router.get("/getcartitem", getAllShoppingCart);
router.put(
  "/updatecartitem/:id",
  authMiddleware,
  updateShoppingCartItemQuantity
);
router.delete("/deletecartitem/:id", authMiddleware, deleteShoppingCartItem);
module.exports = router;
