const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const cartController = require('./../controllers/cartController')

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch("/updateMe", authController.protect, userController.updateMe);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    userController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    userController.findUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    userController.deleteUser
  );



module.exports = router;
