const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    body("name").notEmpty().withMessage("Category name is required"),
    validate,
    createCategory
  );

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
