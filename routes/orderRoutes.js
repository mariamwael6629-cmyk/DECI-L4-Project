const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder);
router.route("/:id/status").patch(updateOrderStatus);

module.exports = router;
