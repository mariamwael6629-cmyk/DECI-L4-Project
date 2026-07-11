const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order item product is required"],
    },
    name: {
      type: String,
      required: [true, "Order item name is required"],
    },
    price: {
      type: Number,
      required: [true, "Order item price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Order item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: [true, "Order total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Shipping full name is required"],
      },
      street: {
        type: String,
        required: [true, "Shipping street is required"],
      },
      city: {
        type: String,
        required: [true, "Shipping city is required"],
      },
      country: {
        type: String,
        required: [true, "Shipping country is required"],
      },
      phone: {
        type: String,
        required: [true, "Shipping phone is required"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
