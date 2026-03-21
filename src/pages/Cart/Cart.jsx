import React, { useEffect, useState } from "react";
import "./Cart.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleOrderNow = async () => {
    const orderType = localStorage.getItem("orderType") || "Take Away";

    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email || "",
        total: totalPrice,
        status: "Placed",
        orderType: orderType,
        cancelReason: "",
        canceledBy: "",
        createdAt: serverTimestamp(),
        items: cart.map((item) => ({
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image || "",
        })),
      });

      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.log("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">No items in cart</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>

                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h2>Total: ₹{totalPrice}</h2>
            <p>
              <strong>Service Type:</strong>{" "}
              {localStorage.getItem("orderType") || "Take Away"}
            </p>

            <button className="order-btn" onClick={handleOrderNow}>
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;