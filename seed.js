require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./db/connectDB");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Order = require("./models/Order");

async function seed() {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Old data cleared");

    const categories = await Category.create([
      { name: "Electronics", description: "Phones, laptops, and smart devices" },
      { name: "Furniture", description: "Home and office furniture" },
      { name: "Accessories", description: "Bags, watches, and everyday accessories" },
    ]);

    const [electronics, furniture, accessories] = categories;

    const products = await Product.create([
      {
        name: "Laptop Pro 15",
        description: "15-inch laptop with 16GB RAM and 512GB SSD",
        price: 1299.99,
        stock: 10,
        category: electronics._id,
        images: ["https://placehold.co/600x400?text=Laptop+Pro+15"],
      },
      {
        name: "Smartphone X",
        description: "6.1-inch smartphone with dual camera",
        price: 799.5,
        stock: 25,
        category: electronics._id,
        images: ["https://placehold.co/600x400?text=Smartphone+X"],
      },
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones",
        price: 199.99,
        stock: 40,
        category: electronics._id,
        images: ["https://placehold.co/600x400?text=Headphones"],
      },
      {
        name: "Ergonomic Office Chair",
        description: "Adjustable chair with lumbar support",
        price: 249.0,
        stock: 15,
        category: furniture._id,
        images: ["https://placehold.co/600x400?text=Office+Chair"],
      },
      {
        name: "Wooden Desk",
        description: "Solid oak desk with cable management",
        price: 399.0,
        stock: 8,
        category: furniture._id,
        images: ["https://placehold.co/600x400?text=Wooden+Desk"],
      },
      {
        name: "Leather Backpack",
        description: "Water-resistant leather backpack for laptops",
        price: 89.99,
        stock: 30,
        category: accessories._id,
        images: ["https://placehold.co/600x400?text=Backpack"],
      },
    ]);

    console.log(`Added ${categories.length} categories and ${products.length} products`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
