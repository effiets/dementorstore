const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    totalQnt: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", async function () {
  this.totalQnt = this.product.length;
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: ["name", "price"],
  }).populate({
    path: "user",
    select: ["name", "email"],
  });
  next();
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
