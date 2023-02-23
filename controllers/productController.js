const Product = require("./../model/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


exports.getAllProducts = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  if(req.query.sort) {
    query = query.sort(req.query.sort)
  }

  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: req.body,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('cart')

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const productFound = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!productFound) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: productFound,
    },
  });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productToDelete = await Product.findByIdAndDelete(req.params.id);

  if (!productToDelete) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(204).json({
    status: "success",
  });
});
