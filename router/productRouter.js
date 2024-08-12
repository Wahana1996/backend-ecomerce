const express = require("express");
const {
  addProductController,
  readProducts,
  detailProducts,
  updateProducts,
  destroyProduct,
} = require("../controller/productController");
const { uploadOption } = require("../utils/fileUpload");

const router = express.Router();

router.post("/addproduct", uploadOption.single("image"), addProductController);
router.get("/showallproduct", readProducts);
router.get("/showoneproduct/:id", detailProducts);
router.put("/update-product/:id", uploadOption.single("image"), updateProducts);
router.delete("/delete-product/:id", destroyProduct);

module.exports = router;
