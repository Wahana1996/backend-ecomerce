const express = require("express");
const { authMiddleware } = require("../middleware/userMiddleware");
const { createOrder } = require("../controller/orderController");

const router = express.Router();

router.post("/createorder", authMiddleware, createOrder);

module.exports = router;
