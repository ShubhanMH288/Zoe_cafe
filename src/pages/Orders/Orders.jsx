import React, { useEffect, useState } from "react";
import "./Orders.css";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("Changed my mind");

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  const getStepIndex = (status) => {
    switch (status) {
      case "Placed":
        return 1;
      case "Preparing":
        return 2;
      case "Ready":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("Changed my mind");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("Changed my mind");
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason");
      return;
    }

    try {
      await updateDoc(doc(db, "orders", selectedOrderId), {
        status: "Canceled",
        cancelReason: cancelReason.trim(),
        canceledBy: "Customer",
      });

      closeCancelModal();
    } catch (error) {
      console.log("Cancel order error:", error);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);

            return (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <span>Order #{order.id.slice(0, 6)}</span>
                  <span className={`status ${order.status}`}>
                    {order.status === "Preparing"
                      ? "👨‍🍳 Preparing..."
                      : order.status === "Canceled"
                      ? "❌ Canceled"
                      : order.status || "Placed"}
                  </span>
                </div>

                <p><strong>Service:</strong> {order.orderType}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>

                {order.status !== "Canceled" && (
                  <div className="order-tracker">
                    <div className={`tracker-step ${currentStep >= 1 ? "active" : ""}`}>
                      <div className="tracker-circle">1</div>
                      <span>Placed</span>
                    </div>

                    <div className={`tracker-line ${currentStep >= 2 ? "active" : ""}`}></div>

                    <div className={`tracker-step ${currentStep >= 2 ? "active" : ""}`}>
                      <div className="tracker-circle">2</div>
                      <span>Preparing</span>
                    </div>

                    <div className={`tracker-line ${currentStep >= 3 ? "active" : ""}`}></div>

                    <div className={`tracker-step ${currentStep >= 3 ? "active" : ""}`}>
                      <div className="tracker-circle">3</div>
                      <span>Ready</span>
                    </div>

                    <div className={`tracker-line ${currentStep >= 4 ? "active" : ""}`}></div>

                    <div className={`tracker-step ${currentStep >= 4 ? "active" : ""}`}>
                      <div className="tracker-circle">4</div>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}

                <div className="order-items">
                  {order.items?.map((item, index) => (
                    <div key={index}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </div>

                {order.status === "Placed" && (
                  <button
                    className="cancel-btn"
                    onClick={() => openCancelModal(order.id)}
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === "Canceled" && (
                  <div className="cancel-reason-box">
                    <p><strong>Canceled By:</strong> {order.canceledBy || "Unknown"}</p>
                    <p><strong>Reason:</strong> {order.cancelReason || "No reason given"}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <h2>Cancel Order</h2>
            <p>Select or enter your cancellation reason</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="cancel-select"
            >
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Too late now">Too late now</option>
              <option value="Want to reorder">Want to reorder</option>
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

export default Orders;