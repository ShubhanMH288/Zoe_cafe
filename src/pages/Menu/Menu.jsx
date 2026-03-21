import React, { useEffect, useState } from "react";
import "./Menu.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    const fetchMenu = async () => {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const getItemQuantity = (id) => {
    const found = cart.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const increaseQty = (item) => {
    addToCart(item);
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="menu-page">
      <div className="menu-layout">
        <aside className="menu-sidebar">
          <h2>Categories</h2>
          <ul>
            {categories.map((cat, index) => (
              <li
                key={index}
                className={selectedCategory === cat ? "active-category" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <section className="menu-content">
          <h1>{selectedCategory} Menu</h1>

          <div className="menu-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);

                return (
                  <div className="menu-card" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="card-body">
                      <h3>{item.name}</h3>
                      <p>₹{item.price}</p>

                      {quantity === 0 ? (
                        <button
                          className="add-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          + Add to Cart
                        </button>
                      ) : (
                        <div className="qty-counter">
                          <button onClick={() => decreaseQty(item.id)}>-</button>
                          <span>{quantity}</span>
                          <button onClick={() => increaseQty(item)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">No food items uploaded.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;