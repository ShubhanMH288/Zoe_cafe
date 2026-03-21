import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "admins"));
        const adminEmails = snapshot.docs.map((doc) => doc.data().email);
        setIsAdmin(adminEmails.includes(user.email));
      } catch (error) {
        console.log("Admin check error:", error);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Checking access...</h2>;
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;