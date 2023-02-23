const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "a User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "You must enter a correct email..."],
  },
  password: {
    type: String,
    required: [true, "you must enter a password"],
    minlength: [8, "it must be at least 8 digits"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },

  name: {
    type: String,
    required: [true, "you must provide a name"],
    minlength: [5, "name must be at least 5 characters"],
    maxlength: [50, "A name must have less than 50 characters"],
  },

  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
  photo: String
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};



//virtual populate
userSchema.virtual('cart', {
  ref: 'cart',
  foreignField:'user',
  localField: '_id'

})



const User = mongoose.model("user", userSchema);

module.exports = User;
