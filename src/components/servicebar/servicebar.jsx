import React from 'react'
import './servicebar.css'
import { FaShoppingCart } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const ServiceBar = () => {
  const navigate = useNavigate()

  return (
    <div className="service-bar">

      {/* Service Dropdown */}
      <div className="service-box">
        <label htmlFor="service">Service</label>
        <select id="service">
          <option>Dine In</option>
          <option>Take Away</option>
          <option>Delivery</option>
        </select>
      </div>

      {/* Location Dropdown */}
      <div className="service-box">
        <label htmlFor="location">Nearest Cafe</label>
        <select id="location">
          <option>Choose Location</option>
          <option>Gruhalaxmi Layout</option>
          <option>Near Christ University</option>
        </select>
      </div>

      {/* 🛒 Cart Icon */}
      <div className="cart-icon" onClick={() => navigate('/cart')}>
        <FaShoppingCart />
      </div>

    </div>
  )
}

export default ServiceBar