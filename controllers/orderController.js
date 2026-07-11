const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const makeOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new AppError("shippingAddress is required", 400));
  }

  const cart = await Cart.findOne().populate("items.product");
  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product) {
      return next(new AppError("A product in the cart no longer exists", 404));
    }
    if (item.quantity > product.stock) {
      return next(
        new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          400
        )
      );
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    orderNumber: makeOrderNumber(),
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    product.stock -= item.quantity;
    await product.save();
  }

  cart.items = [];
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort("-createdAt");
  res.status(200).json({
    status: "success",
    message: "Orders fetched successfully",
    results: orders.length,
    data: orders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name images"
  );
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Order fetched successfully",
    data: order,
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !ORDER_STATUSES.includes(status)) {
    return next(
      new AppError(
        `Invalid status. Allowed values: ${ORDER_STATUSES.join(", ")}`,
        400
      )
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});
