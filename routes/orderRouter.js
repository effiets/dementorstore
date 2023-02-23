const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.getAllOrders
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getMyOrder)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.changeOrderStatus
  )
  .delete(authController.protect, orderController.deleteMyOrder);

module.exports = router;
