# 🛒 E-Commerce API & Frontend — DECI L4 Project

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-v4.x-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea15f.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361dafb)](https://react.dev/)

A comprehensive Full-Stack E-Commerce application. The backend is a robust REST API built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose** following the architectural **MVC pattern**. The frontend is powered by **React.js (Vite)** to deliver a smooth user experience for browsing products, managing shopping carts, and processing checkouts.

---

## 🚀 Features

### 📂 Categories API
- **Full CRUD Operations:** Seamlessly manage product categories.
- **Data Integrity:** Enforces unique names and automatically generates URL-friendly slugs.

### 📦 Products API
- **Full CRUD Operations:** Easily manage inventory items.
- **Advanced Filtering & Search:** Filter by category, price range (`minPrice` / `maxPrice`), and availability status (`inStock=true`), alongside textual name search.

### 🛒 Cart API
- **Stock Validation:** Validates inventory before adding items.
- **Smart Recalculation:** Server-side calculation of quantities and `totalPrice` ensures data consistency.
- **Flexible Management:** Features to add, update quantities, remove single items, or clear the entire cart.

### 💳 Orders API
- **Secure Checkout Flow:** Double-checks stock levels and computes final prices on the server right before placement.
- **Data Snapshotting:** Saves a persistent snapshot of product names and prices at the exact moment of purchase.
- **Inventory & State Management:** Automatically reduces item stock and clears the cart upon successful checkout.
- **Order Tracking:** Managed via strictly validated Enums.

### 🛡️ Security & Architecture
- **NoSQL Injection Protection:** Sanitizes inputs using `express-mongo-sanitize`.
- **Request Validation:** Strict body and parameter checking via `express-validator`.
- **Robust Error Handling:** Centralized error-handling middleware utilizing a custom `AppError` class and an automated `asyncHandler`.
- **Database Seeding:** Includes an automated seed script to populate sample categories and products instantly.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js |
| **Backend Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Frontend Framework** | React.js (Vite) |
| **API Testing** | Postman |

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** v18.x or newer
- **MongoDB** running locally or a valid **MongoDB Atlas** connection string

---

## ⚙️ Installation & Setup

### 1. Clone & Core Setup
```bash
# Clone the repository
git clone [https://github.com/mariamwael6629-cmyk/DECI-L4-Project.git](https://github.com/mariamwael6629-cmyk/DECI-L4-Project.git)
cd DECI-L4-Project

# Install backend dependencies
npm install

```

### 2. Environment Configuration

Create your environment file:

```bash
cp .env.example .env

```

Open the `.env` file and adjust your connection string or port configuration if necessary.

### 3. Seed & Run Backend

```bash
# Seed the database with sample data
npm run seed

# Start the backend development server
npm run dev

```

The API will be accessible at: `http://localhost:5000`

### 4. Setup & Run Frontend

In a new terminal window, navigate to the frontend directory:

```bash
cd client
npm install
npm run dev

```

The frontend application will spin up at: `http://localhost:3000` (Configured to proxy `/api` requests automatically to the backend).

---

## 🌐 Environment Variables

| Variable | Description | Example Value |
| --- | --- | --- |
| `PORT` | The port the Express server listens on | `5000` |
| `NODE_ENV` | Current runtime application environment | `development` |
| `MONGO_URI` | MongoDB connection URI string | `mongodb://127.0.0.1:27017/ecommerce` |

---

## 📦 NPM Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm start` | `node app.js` | Runs the server in production mode |
| `npm run dev` | `nodemon app.js` | Runs the server with auto-reload enabled (Development) |
| `npm run seed` | `node seed.js` | Resets the database and seeds fresh mock data |

---

## 🛣️ API Endpoints

### Standard Response Format

All responses from the server strictly adhere to this standardized JSON structure:

```json
{
  "status": "success",
  "message": "Action completed successfully",
  "data": { }
}

```

### 📂 Categories Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/categories` | Retrieve all categories |
| **GET** | `/api/categories/:id` | Fetch details of a single category |
| **POST** | `/api/categories` | Create a new category |
| **PATCH** | `/api/categories/:id` | Modify an existing category |
| **DELETE** | `/api/categories/:id` | Remove a category |

### 📦 Products Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/products` | Get all products *(Supports filters: `category`, `minPrice`, `maxPrice`, `inStock=true`, `search`)* |
| **GET** | `/api/products/:id` | Fetch a single product (with its parent category fully populated) |
| **POST** | `/api/products` | Create a new product *(Fails with 404 if category ID is invalid)* |
| **PATCH** | `/api/products/:id` | Update product details |
| **DELETE** | `/api/products/:id` | Delete a product |

### 🛒 Cart Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/cart` | Retrieve the active cart with populated product data |
| **POST** | `/api/cart` | Add item to cart payload: `{ productId, quantity }` *(Validates stock; increments if already existing)* |
| **PATCH** | `/api/cart/:productId` | Modify specific item quantity in the cart |
| **DELETE** | `/api/cart/:productId` | Remove an item entirely from the cart |
| **DELETE** | `/api/cart` | Clear all items from the cart |

### 💳 Orders Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/api/orders` | Checkout — Transforms cart to an order via payload: `{ shippingAddress }` |
| **GET** | `/api/orders` | Fetch a history of all placed orders |
| **GET** | `/api/orders/:id` | Retrieve specific order tracking details |
| **PATCH** | `/api/orders/:id/status` | Update order status *(Valid values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`)* |

---

## 📮 Postman Testing

To test the APIs, import both files located inside the `/postman` directory:

1. `E-Commerce-API.postman_collection.json` — Pre-configured collections categorized into folders.
2. `E-Commerce-API-Dev.postman_environment.json` — Environment variables managing global states such as `baseUrl`, `categoryId`, `productId`, and `orderId`.

---

## 📁 Project Structure

```text
ecommerce-api/
├── models/            # Mongoose schemas (Category, Product, Cart, Order)
├── controllers/       # Business logic / Request handlers
├── routes/            # Express router endpoint definitions
├── middleware/        # Error handlers, 404 routes, and validation schemas
├── utils/             # AppError wrapper and asyncHandler utility
├── config/            # Centralized application environment configurations
├── db/                # Database connection setup (connectDB)
├── postman/           # Postman collection & environment configuration files
├── client/            # React frontend client app (Vite setup)
│   └── src/
│       ├── pages/     # Products, Cart, and Orders views
│       ├── App.jsx    # Application shell & routing
│       └── api.js     # Axios/Fetch API core service configurations
├── app.js             # Express application root entry point
├── seed.js            # Mock data database seed script
├── .env.example       # Example template for environment variables
└── package.json       # Project dependencies and script declarations

```
