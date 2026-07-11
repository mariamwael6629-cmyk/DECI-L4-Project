import { useEffect, useState } from "react";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import { getCart } from "./api.js";

export default function App() {
  const [page, setPage] = useState("products");
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await getCart();
      const count = res.data.items.reduce((sum, i) => sum + i.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">🛒 E-Commerce Store</h1>
        <nav className="nav">
          <button
            className={page === "products" ? "active" : ""}
            onClick={() => setPage("products")}
          >
            Products
          </button>
          <button
            className={page === "cart" ? "active" : ""}
            onClick={() => setPage("cart")}
          >
            Cart ({cartCount})
          </button>
          <button
            className={page === "orders" ? "active" : ""}
            onClick={() => setPage("orders")}
          >
            Orders
          </button>
        </nav>
      </header>

      <main className="main">
        {page === "products" && (
          <ProductsPage onCartChange={refreshCartCount} />
        )}
        {page === "cart" && (
          <CartPage
            onCartChange={refreshCartCount}
            onOrderPlaced={() => setPage("orders")}
          />
        )}
        {page === "orders" && <OrdersPage />}
      </main>
    </div>
  );
}
