import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { FaUser, FaShoppingCart, FaClipboardList } from "react-icons/fa"
import { auth } from "../../firebase"

const Navbar = () => {
  const navigate = useNavigate()
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className='navbar'>
      <NavLink to="/" className='brand-name'>
        <span>Zoe</span> Cafe
      </NavLink>

      <div className="nav-links">

        {/* Orders Icon */}
        <FaClipboardList
          id='icons'
          style={{ fontSize: "25px", cursor: "pointer" }}
          onClick={() =>
            navigate(auth.currentUser ?"/orders" : "/login")
          }
        />

        {/* Cart */}
        <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
          <FaShoppingCart id='icons' style={{ fontSize: "25px", cursor: "pointer" }} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>

        {/* Profile */}
        <FaUser
          id='icons'
          style={{ fontSize: "25px", cursor: "pointer" }}
          onClick={() =>
            navigate(auth.currentUser ? "/profile" : "/login")
          }
        />
      </div>
    </nav>
  )
}

export default Navbar