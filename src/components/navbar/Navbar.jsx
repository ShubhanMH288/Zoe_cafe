import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import { FaUser, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa"

const Navbar = () => {
  return (
    <nav className='navbar'>

      {/* 🔹 Text Logo (Left) */}
      <NavLink to="/" className='brand-name'>
        <span>Zoe</span> Cafe
      </NavLink>

      {/* 🔹 Links (Right) */}
      <div className="nav-links">
        <FaMapMarkerAlt id ='icons' style={{ fontSize: "25px" }} />
        <FaPhoneAlt id ='icons' style={{ fontSize: "25px" }} /> 
        <FaUser id ='icons' style={{ fontSize: "25px" }} />
      </div>

    </nav>
  )
}

export default Navbar