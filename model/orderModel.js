const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    payment: {
      type: String,
      enum: ["Paypal", "CreditCard", "ApplePay"],
      default: "Paypal",
    },
    paid: {
      type: Boolean,
      default: true,
    },
    status: {
      type:String,
      enum: ['Pending', 'Completed', "Deleted"],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

orderSchema.pre("/^find/", function (next) {
  this.populate("cart").populate("user");
  next();
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
