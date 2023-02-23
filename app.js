const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRouter");

const app = express();
app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.all(`*`, (req, res, next) => {
  next(new AppError(`can find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
