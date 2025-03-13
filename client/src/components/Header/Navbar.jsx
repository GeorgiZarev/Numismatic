import React, { useState } from 'react';
import '../../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Logo Here
      </Link>

      <nav className={isMobile ? "navbar-mobile" : "navbar"}>
        <Link to="/" onClick={() => setIsMobile(false)}>Home</Link>
        <Link to="/about" onClick={() => setIsMobile(false)}>About</Link>
        <Link to="/products" onClick={() => setIsMobile(false)}>Products</Link>
        <Link to="/contact" onClick={() => setIsMobile(false)}>Contact</Link>
      </nav>


      <div className="header-right">
        <Link to="/orders" className="cart-icon">
          <FaShoppingCart />
        </Link>
        <button className="mobile-menu-icon" onClick={handleToggle}>
          {isMobile ? '✖' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
