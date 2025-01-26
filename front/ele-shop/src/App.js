import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Account from './pages/Account';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Summary from './pages/Summary';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
