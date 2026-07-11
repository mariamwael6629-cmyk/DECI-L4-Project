// in dev, vite proxies /api to the backend (see vite.config.js)
const BASE_URL = import.meta.env.VITE_API_URL || "";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || "Request failed");
  }
  return body;
};

// Categories
export const getCategories = () => request("/api/categories");

// Products
export const getProducts = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return request(`/api/products${query ? `?${query}` : ""}`);
};

// Cart
export const getCart = () => request("/api/cart");
export const addToCart = (productId, quantity = 1) =>
  request("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
export const updateCartItem = (productId, quantity) =>
  request(`/api/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
export const removeCartItem = (productId) =>
  request(`/api/cart/${productId}`, { method: "DELETE" });
export const clearCart = () => request("/api/cart", { method: "DELETE" });

// Orders
export const createOrder = (shippingAddress) =>
  request("/api/orders", {
    method: "POST",
    body: JSON.stringify({ shippingAddress }),
  });
export const getOrders = () => request("/api/orders");
