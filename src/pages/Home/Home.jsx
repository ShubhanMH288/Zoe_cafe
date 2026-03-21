import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero">
        <h1>Welcome to Zoe Cafe</h1>
      </div>

      <div className="menu-btn-container">
        <button className="menu-btn" onClick={() => navigate("/menu")}>
          Go to Menu
        </button>
      </div>

      <footer className="footer">
        <p>© 2026 Zoe Cafe</p>
      </footer>
    </>
  );
};

export default Home;