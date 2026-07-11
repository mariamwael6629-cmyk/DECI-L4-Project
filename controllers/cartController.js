const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const getOrCreateCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ items: [] });
  }
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  await cart.populate("items.product", "name price images inStock");
  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    data: cart,
  });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError("productId is required", 400));
  }
  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const cart = await getOrCreateCart();
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  if (newQuantity > product.stock) {
    return next(
      new AppError(
        `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        400
      )
    );
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  await cart.populate("items.product", "name price images inStock");

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: cart,
  });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity === undefined || quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (quantity > product.stock) {
    return next(
      new AppError(
        `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        400
      )
    );
  }

  item.quantity = quantity;
  item.price = product.price;
  await cart.save();
  await cart.populate("items.product", "name price images inStock");

  res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart();

  const exists = cart.items.some((i) => i.product.toString() === productId);
  if (!exists) {
    return next(new AppError("Item not found in cart", 404));
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  await cart.populate("items.product", "name price images inStock");

  res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});
