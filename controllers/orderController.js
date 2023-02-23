const Order = require("./../model/orderModel");
const Cart = require("./../model/cartModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  if (orders.length == 0) {
    return next(new AppError("There are no orders yet!!", 401));
  }

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getMyOrder = catchAsync(async (req, res, next) => {
  const myOrder = await Order.findById(req.params.id).populate('cart').populate('user')
 

  res.status(200).json({
    status: "success",
    data: {
      myOrder,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const myCart = await Cart.findOne({ user: req.user.id });

  const newOrder = await Order.create({
    user: req.user.id,
    cart: myCart,
  });

  res.status(201).json({
    status: "success",
    data: {
      newOrder,
    },
  });
});

exports.deleteMyOrder = catchAsync(async (req, res, next) => {
  const myOrder = await Order.findByIdAndDelete(req.params.id);

  if (!myOrder) {
    return next(new AppError("No Order found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
  const orderFound = await Order.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!orderFound) {
    return next(new AppError("No Order found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: orderFound
    },
  });
});
