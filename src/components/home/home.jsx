import React from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'
import { FaHamburger } from 'react-icons/fa'
import {FaChevronDown} from 'react-icons/fa'
import home from '../../assets/home.png'
import coffee from '../../assets/coffee.png'
import burger from '../../assets/burger.png'
import desserts from '../../assets/desserts.png'
import ramen from '../../assets/ramen.png'
import pancake from '../../assets/pancake.png'
import wraps from '../../assets/wraps.png'
import { FaInstagram, FaPhone } from "react-icons/fa"
const Home = () => {
  const navigate = useNavigate()

  return (
    <>
    <div className="hero">
      <img src={home} alt="Cafe background" className="hero-img" />

      <div className="overlay"></div>

      <div className="hero-content">
        <h1>Welcome to Zoe Cafe </h1>
        <p>Good Food • Great Ingredients • Best Price</p>

        <button
          className="hero-btn"
          onClick={() => navigate('/menu')}
        >
          <FaChevronDown /> 
        </button>
      </div>
    </div>
    {/* 🍔 FOOD SECTION */}
<div className="food-section">
  <h2>Our Speciality</h2>

  <div className="food-grid">

    <div className="food-card">
      <img src={burger} />
      <h3>Burger</h3>
      <p>Stacked high, packed with flavor!.</p>
    </div>

    <div className="food-card">
      <img src={coffee} />
      <h3>Coffee</h3>
      <p>Your daily dose of happiness in a cup 💯.</p>
    </div>

    <div className="food-card">
      <img src={ramen} />
      <h3>Ramen</h3>
      <p>Slurp into happiness 🍜🔥.</p>
    </div>

    <div className="food-card">
      <img src={desserts} />
      <h3>Desserts</h3>
      <p>Desserts that melt your heart 💯.</p>
    </div>

     <div className="food-card">
      <img src={wraps} />
      <h3>Wraps</h3>
      <p>Everything you love, Wrapped in one delicious bite.</p>
    </div>

     <div className="food-card" >
      <img src={pancake} />
      <h3>Pancake</h3>
      <p>Flip your worries like panckakes and enjoy the moment.</p>
    </div>

    
  </div>
</div>
<div className="menu-btn-container">
  <button 
    className="menu-btn"
    onClick={() => navigate('/menu')}
  >
    <FaHamburger /> Go to Menu
  </button>
</div>
{/* 🔻 FOOTER */}
<footer className="footer">

  <div className="footer-content">

    <div className="footer-item">
      <FaInstagram />
      <span>@zoecafe</span>
    </div>

    <div className="footer-item">
      <FaPhone />
      <span>+91 81233 59761</span>
    </div>

  </div>

  <p className="footer-copy">
    © 2026 Zoe Cafe | Developed by Shubhan (+91 9663269273)
  </p>

</footer>
    </>
  )
}

export default Home