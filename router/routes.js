const express = require("express");
const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const profileRouter = require("./profileRouter");
const reviewRouter = require("./reviewRouter");
const router = express.Router();

router.use("/users", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/profile", profileRouter);
router.use("/review", reviewRouter);
module.exports = router;
