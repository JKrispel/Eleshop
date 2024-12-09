import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <nav id="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/cart" className="navbar-link">Cart</Link>
        <Link to="/account" className="navbar-link">My Account</Link>
      </div>
    </nav>
  );
};

export default Navbar;
