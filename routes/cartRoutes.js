const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.route("/").get(getCart).post(addToCart).delete(clearCart);
router.route("/:productId").patch(updateCartItem).delete(removeCartItem);

module.exports = router;
