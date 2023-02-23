const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    // authController.protect,
    // authController.restrictTo("admin", "moderator"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    // authController.protect,
    // authController.restrictTo("admin", "moderator"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    productController.deleteProduct
  );

module.exports = router;
