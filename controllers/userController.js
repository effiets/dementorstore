const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req,res,next) => {
  if(req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates.', 400)
    )
  }

const filteredBody = filterObj(req.body, 'name', 'email', 'address')

const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
  new:true,
  runValidators: true
})

res.status(200).json({
  status: "success",
  data: {
    user:updatedUser
  }
})
})

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    },
  });
};


exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('cart')

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});



  exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!this.updateUser) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
