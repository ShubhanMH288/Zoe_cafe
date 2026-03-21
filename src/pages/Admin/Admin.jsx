import React, { useEffect, useRef, useState } from "react";
import "./Admin.css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const Admin = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState("orders");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("Out of Stock");

  const menuRef = collection(db, "menuItems");
  const firstLoad = useRef(true);
  const previousOrderCount = useRef(0);

  const fetchItems = async () => {
    try {
      const data = await getDocs(menuRef);
      const list = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    } catch (error) {
      console.log("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (firstLoad.current) {
          firstLoad.current = false;
          previousOrderCount.current = liveOrders.length;
        } else {
          if (liveOrders.length > previousOrderCount.current) {
            const audio = new Audio("/notification.mp3");
            audio.play().catch((err) => {
              console.log("Notification sound blocked:", err);
            });
          }
          previousOrderCount.current = liveOrders.length;
        }

        setOrders(liveOrders);
      },
      (error) => {
        console.log("Error loading orders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        const itemDoc = doc(db, "menuItems", editingId);
        await updateDoc(itemDoc, {
          name,
          price,
          image,
          category,
        });
        alert("Item updated successfully");
        setEditingId(null);
      } else {
        await addDoc(menuRef, {
          name,
          price,
          image,
          category,
        });
        alert("Item added successfully");
      }

      setName("");
      setPrice("");
      setImage("");
      setCategory("");
      fetchItems();
      setActiveSection("edit");
    } catch (error) {
      console.log("Error saving item:", error);
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "menuItems", id));
      fetchItems();
    } catch (error) {
      console.log("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setImage(item.image);
    setCategory(item.category);
    setEditingId(item.id);
    setActiveSection("add");
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        status: newStatus,
      });
    } catch (error) {
      console.log("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("Out of Stock");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("Out of Stock");
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason");
      return;
    }

    try {
      const orderDoc = doc(db, "orders", selectedOrderId);
      await updateDoc(orderDoc, {
        status: "Canceled",
        cancelReason: cancelReason.trim(),
        canceledBy: "Admin",
      });

      closeCancelModal();
    } catch (error) {
      console.log("Cancel error:", error);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>

        <button
          className={activeSection === "orders" ? "active-tab" : ""}
          onClick={() => setActiveSection("orders")}
        >
          Orders
        </button>

        <button
          className={activeSection === "delivery" ? "active-tab" : ""}
          onClick={() => setActiveSection("delivery")}
        >
          Delivery Items
        </button>

        <button
          className={activeSection === "add" ? "active-tab" : ""}
          onClick={() => setActiveSection("add")}
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>

        <button
          className={activeSection === "edit" ? "active-tab" : ""}
          onClick={() => setActiveSection("edit")}
        >
          Edit Items
        </button>

        <button
          className={activeSection === "reference" ? "active-tab" : ""}
          onClick={() => setActiveSection("reference")}
        >
          Menu Reference
        </button>
      </aside>

      <section className="admin-content">
        {activeSection === "orders" && (
          <div className="section-box">
            <h1>Live Orders</h1>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Customer:</strong> {order.userEmail || "No email"}</p>
                    <p><strong>Order Type:</strong> {order.orderType || "Take Away"}</p>
                    <p><strong>Total:</strong> ₹{order.total}</p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {order.status === "Canceled"
                        ? "❌ Canceled"
                        : order.status === "Preparing"
                        ? "👨‍🍳 Preparing"
                        : order.status || "Placed"}
                    </p>

                    {order.status === "Canceled" && (
                      <div className="cancel-reason-box">
                        <p><strong>Canceled By:</strong> {order.canceledBy || "Unknown"}</p>
                        <p><strong>Reason:</strong> {order.cancelReason || "No reason given"}</p>
                      </div>
                    )}

                    <div className="order-items">
                      <strong>Items:</strong>
                      <ul>
                        {order.items?.map((item, index) => (
                          <li key={index}>
                            {item.name} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="admin-actions">
                      {order.status !== "Canceled" && order.status !== "Delivered" && (
                        <>
                          <button onClick={() => updateOrderStatus(order.id, "Preparing")}>
                            Preparing
                          </button>

                          <button onClick={() => updateOrderStatus(order.id, "Ready")}>
                            Ready
                          </button>

                          <button onClick={() => updateOrderStatus(order.id, "Delivered")}>
                            Delivered
                          </button>
                        </>
                      )}

                      {order.status === "Placed" && (
                        <button onClick={() => openCancelModal(order.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "delivery" && (
          <div className="section-box">
            <h1>Delivery Items</h1>
            <p>These are the items currently available for delivery.</p>

            <div className="admin-grid">
              {items.map((item) => (
                <div className="admin-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <small>{item.category}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "add" && (
          <div className="section-box">
            <h1>{editingId ? "Update Item" : "Add New Item"}</h1>

            <form className="admin-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <button type="submit">
                {editingId ? "Update Item" : "Add Item"}
              </button>
            </form>
          </div>
        )}

        {activeSection === "edit" && (
          <div className="section-box">
            <h1>Edit Items</h1>

            <div className="admin-grid">
              {items.map((item) => (
                <div className="admin-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <small>{item.category}</small>

                  <div className="admin-actions">
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "reference" && (
          <div className="section-box">
            <h1>Menu Reference</h1>
            <p>Reference preview of uploaded menu cards.</p>

            <div className="admin-grid">
              {items.map((item) => (
                <div className="admin-card reference-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <h2>Cancel Order</h2>
            <p>Select or enter cancellation reason</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="cancel-select"
            >
              <option value="Out of Stock">Out of Stock</option>
              <option value="Kitchen Closed">Kitchen Closed</option>
              <option value="Item Not Available">Item Not Available</option>
              <option value="Delayed Service">Delayed Service</option>
            </select>

            <textarea
              className="cancel-textarea"
              placeholder="Custom reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn cancel-no" onClick={closeCancelModal}>
                Close
              </button>
              <button className="modal-btn cancel-yes" onClick={confirmCancelOrder}>
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;