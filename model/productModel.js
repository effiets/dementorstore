const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "a product must have a code"],
      minLength: [6, "a code must have 6 digits"],
    },
    name: {
      type: String,
      required: [true, "a product must have a name"],
      maxlength: [50, "A product name must have less than 50 characters"],
    },

    description: String,

    category: {
      type: String,
      enum: ["Griffindor", "Hufflepuff", "Ravenclaw", "Slytherin"],
      required: [true, "you must choose a house"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price must be above 0"],
    },

    sales: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) must be below than price",
      },
    },
    images: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("PriceInDollars").get(function () {
  return this.price * 1.07;
});

//virtual populate
productSchema.virtual('cart', {
  ref: 'cart',
  foreignField:'product',
  localField: '_id'

})
const Product = mongoose.model("product", productSchema);

module.exports = Product;
