import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products = [
    { id: 1, name: 'Laptop', category: 'Laptop', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Smartphone', category: 'Smartphone', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Tablet', category: 'Tablet', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Smartwatch', category: 'Wearables', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Headphones', category: 'Accessories', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Pralka', category: 'Appliances', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Mikrofalówka', category: 'Appliances', image: 'https://via.placeholder.com/150' },
  ];

  // Polecane produkty - wybieramy po jednym z każdej kategorii
  const recommendedProducts = products.reduce((acc, product) => {
    if (!acc.find((item) => item.category === product.category)) {
      acc.push(product);
    }
    return acc;
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Laptop', 'Smartphone', 'Tablet', 'Wearables', 'Accessories', 'Appliances'];

  return (
    <div className="home-page">
      <div className="main-content">
        <div className='search-container'>
                  <h1 className="home-title">Welcome to the EleShop</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="SearchButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="search-icon"
            >
              <path d="M10 2a8 8 0 105.293 13.707l4.828 4.829a1 1 0 101.415-1.415l-4.829-4.828A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
          </button>
        </div>
        </div>


        <div className="category-filter">
          <label htmlFor="category-select">Filter by category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <p className="product-name">{product.name}</p>
              <Link to={`/product/${product.id}`}>
                <button className="product-button">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <aside className="recommended-section">
        <h2>Recommended</h2>
        {recommendedProducts.map((product) => (
          <div key={product.id} className="recommended-card">
            <img src={product.image} alt={product.name} className="recommended-image" />
            <div className="recommended-info">
              <p className="recommended-name">{product.name}</p>
              <p className="recommended-category">{product.category}</p>
              <Link to={`/product/${product.id}`}>
                <button className="recommended-button">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default Home;
