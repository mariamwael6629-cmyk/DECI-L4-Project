import { useEffect, useState } from "react";
import { getOrders } from "../api.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders…</p>;
  if (error) return <p className="message">{error}</p>;

  return (
    <section>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <article key={order._id} className="order">
            <header className="order-header">
              <strong>{order.orderNumber}</strong>
              <span className={`badge ${order.status}`}>{order.status}</span>
            </header>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — $
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <footer className="order-footer">
              <span>
                Ship to: {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </span>
              <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
            </footer>
          </article>
        ))
      )}
    </section>
  );
}
