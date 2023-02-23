const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");
const orderController = require('./../controllers/orderController')

const router = express.Router();

router
  .route("/")
  .get(
    // authController.protect,
    // authController.restrictTo("admin", "moderator"),
    cartController.getAllCarts
  )
  .post(authController.protect, cartController.createNewCart);

router
  .route("/mycart")
  .get(authController.protect, cartController.getMyCart)
  .delete(authController.protect, cartController.deleteCart);

router
  .route("/mycart/:productId")
  .patch(authController.protect, cartController.addProductToCart)
  .delete(authController.protect, cartController.removeFromCart);

router.route('/mycart/checkout').post(authController.protect, orderController.createOrder)

module.exports = router;
