const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.status(200).json({
    status: "success",
    message: "Categories fetched successfully",
    data: categories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category fetched successfully",
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  if (req.body.name !== undefined) category.name = req.body.name;
  if (req.body.description !== undefined)
    category.description = req.body.description;
  await category.save();

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: category,
  });
});
