const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    body("name").notEmpty().withMessage("Product name is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number greater than or equal to 0"),
    body("category").notEmpty().withMessage("Product category is required"),
    validate,
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
