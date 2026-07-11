const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === "true") filter.inStock = true;
  if (search) filter.name = { $regex: search, $options: "i" };

  const products = await Product.find(filter)
    .populate("category", "name description")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    results: products.length,
    data: products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 404));
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError("Category not found", 404));
    }
  }

  const allowed = ["name", "description", "price", "stock", "category", "images"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
  await product.save();

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: product,
  });
});
