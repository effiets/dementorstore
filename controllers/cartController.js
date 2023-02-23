const Cart = require("./../model/cartModel");
const Product = require("./../model/productModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await Cart.find().populate("product").populate("user");

  res.status(200).json({
    status: "success",
    results: carts.length,
    data: {
      carts,
    },
  });
});

exports.createNewCart = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findOne({ user: req.user._id });

  if (myCart) {
    return next(new AppError("You have already a cart made", 401));
  }

  // const newCart = await Cart.create({
  //   user: req.user.id,
  //   product: req.body.product,
  //   totalPrice: getCartTotalPrice(req.body.product),
  // });

  res.status(201).json({
    status: "success",
    data: {
      cart: newCart,
    },
  });
});

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cartUser = req.user.id.toString();
  const myCart = await Cart.find({ user: cartUser });

  res.status(200).json({
    status: "success",
    data: myCart,
  });
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const cartUser = req.user.id.toString();
  const cartFound = await Cart.findOne({ user: cartUser });
  const productFound = await Product.findOne({ _id: req.params.productId });

  let updatedCart;

  if (cartFound) {
    cartFound.product.push(productFound);
    const newCart = {
      user: req.user._id,
      product: cartFound.product,
      totalQnt: cartFound.totalQnt + 1,
      totalPrice: cartFound.totalPrice + productFound.price,
    };
    updatedCart = await Cart.findOneAndUpdate(cartUser, newCart, {
      new: true,
      runValidators: true,
    });
  }

  if (!cartFound) {
    updatedCart = await Cart.create({
      user: req.user.id,
      product: req.body.product,
      totalPrice: req.params.productId.price,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedCart,
    },
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const cartUser = req.user.id.toString();
  const cartFound = await Cart.findOne({ user: cartUser });
  const productFound = await Product.findOne({ _id: req.params.productId });

  const index = cartFound.product.findIndex(
    (item) => item.id == req.params.productId
  );

  if (index == -1) {
    return next(new AppError("That item is not in your cart", 401));
  }

  cartFound.product.splice(index, 1);

  const newCart = {
    user: req.user._id,
    product: cartFound.product,
    totalQnt: cartFound.totalQnt - 1,
  };

  const updatedCart = await Cart.findOneAndUpdate(cartUser, newCart, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: updatedCart,
    },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cartUser = req.user.id.toString();
  const cartToDelete = await Cart.findOneAndDelete({ user: cartUser });

  res.status(204).json({
    status: "success",
  });
});
