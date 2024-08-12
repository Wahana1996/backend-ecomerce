const express = require("express");
const { authMiddleware } = require("../middleware/userMiddleware");
const { createOrUpdateReview } = require("../controller/reviewController");

const router = express.Router();

router.post("/:productId", authMiddleware, createOrUpdateReview);

module.exports = router;
