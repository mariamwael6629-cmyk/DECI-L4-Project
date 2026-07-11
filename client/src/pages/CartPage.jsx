import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
} from "../api.js";

const emptyAddress = {
  fullName: "",
  street: "",
  city: "",
  country: "",
  phone: "",
};

export default function CartPage({ onCartChange, onOrderPlaced }) {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [message, setMessage] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQuantity = async (productId, quantity) => {
    try {
      const res = await updateCartItem(productId, quantity);
      setCart(res.data);
      onCartChange();
    } catch (err) {
      setMessage(err.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeCartItem(productId);
      setCart(res.data);
      onCartChange();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleClear = async () => {
    try {
      const res = await clearCart();
      setCart(res.data);
      onCartChange();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckingOut(true);
    try {
      const res = await createOrder(address);
      setMessage(`Order ${res.data.orderNumber} placed successfully 🎉`);
      setAddress(emptyAddress);
      await loadCart();
      onCartChange();
      onOrderPlaced();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (!cart) return <p>Loading cart…</p>;

  return (
    <section>
      <h2>Shopping Cart</h2>
      {message && <p className="message">{message}</p>}

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product._id}>
                  <td>{item.product.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        changeQuantity(item.product._id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      onClick={() =>
                        changeQuantity(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="danger"
                      onClick={() => removeItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <strong>Total: ${cart.totalPrice.toFixed(2)}</strong>
            <button className="danger" onClick={handleClear}>
              Clear Cart
            </button>
          </div>

          <h3>Checkout</h3>
          <form className="checkout-form" onSubmit={handleCheckout}>
            {Object.keys(emptyAddress).map((field) => (
              <input
                key={field}
                required
                placeholder={field}
                value={address[field]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
              />
            ))}
            <button type="submit" disabled={checkingOut}>
              {checkingOut ? "Placing order…" : "Place Order"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
