import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/navbar/Navbar";
import ServiceBar from "./components/servicebar/servicebar";
import Home from "./components/home/home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";
import AdminRoute from "./components/AdminRoute";
import Orders from "./pages/Orders/Orders";  
const App = () => {
  const location = useLocation();

  const hideServiceBar =
    location.pathname.includes("/menu") ||
    location.pathname.includes("/admin") ||
    location.pathname.includes("/login") ||
    location.pathname.includes("/cart") ||
    location.pathname.includes("/profile");

  return (
    <>
      <Navbar />
      {!hideServiceBar && <ServiceBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;