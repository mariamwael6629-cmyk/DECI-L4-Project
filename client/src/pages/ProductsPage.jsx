import { useEffect, useState } from "react";
import { getProducts, getCategories, addToCart } from "../api.js";

export default function ProductsPage({ onCartChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProducts = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const res = await getProducts(activeFilters);
      setProducts(res.data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
    loadProducts();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      setMessage(`"${product.name}" added to cart ✅`);
      onCartChange();
    } catch (err) {
      setMessage(err.message);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <section>
      <h2>Products</h2>

      <form className="filters" onSubmit={applyFilters}>
        <input
          name="search"
          placeholder="Search products…"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          name="minPrice"
          type="number"
          min="0"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          name="maxPrice"
          type="number"
          min="0"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <select
          name="inStock"
          value={filters.inStock}
          onChange={handleFilterChange}
        >
          <option value="">All stock</option>
          <option value="true">In stock only</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products found. Try running <code>npm run seed</code> in the backend.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <article key={p._id} className="card">
              <img
                src={p.images[0] || "https://placehold.co/600x400?text=Product"}
                alt={p.name}
              />
              <div className="card-body">
                <h3>{p.name}</h3>
                <p className="category">{p.category?.name}</p>
                <p className="description">{p.description}</p>
                <div className="card-footer">
                  <span className="price">${p.price.toFixed(2)}</span>
                  <span className={p.inStock ? "stock in" : "stock out"}>
                    {p.inStock ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <button
                  disabled={!p.inStock}
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
