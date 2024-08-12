const express = require("express");
const {
  createOrUpdateProfile,
  uploadImageData,
} = require("../controller/profileController");
const { authMiddleware } = require("../middleware/userMiddleware");
const { uploadOption } = require("../utils/fileUpload");

const router = express.Router();

router.post("/createorupdate", authMiddleware, createOrUpdateProfile);

router.post(
  "/upload",
  authMiddleware,
  uploadOption.single("image"),
  uploadImageData
);

module.exports = router;
