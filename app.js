require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const config = require("./config/config");
const connectDB = require("./db/connectDB");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "E-Commerce API is running",
    data: null,
  });
});

app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
  });
});

module.exports = app;
