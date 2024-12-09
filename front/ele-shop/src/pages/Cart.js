import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./styles/Cart.css";

// Sample data for products
const productsData = [
  { id: 1, name: "Laptop", image: "https://via.placeholder.com/150", quantity: 1 },
  { id: 2, name: "Smartphone", image: "https://via.placeholder.com/150", quantity: 2 },
  { id: 3, name: "Tablet", image: "https://via.placeholder.com/150", quantity: 1 },
];

const Cart = () => {
  const [products, setProducts] = useState(productsData);
  const navigate = useNavigate();

  const updateQuantity = (id, delta) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {/* Product List */}
      <div className="cart-products">
        {products.map((product) => (
          <div key={product.id} className="cart-product">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
            </div>
            <div className="quantity-controls">
              <button className="quantity-button" onClick={() => updateQuantity(product.id, -1)}>
                -
              </button>
              <span className="product-quantity">{product.quantity}</span>
              <button className="quantity-button" onClick={() => updateQuantity(product.id, 1)}>
                +
              </button>
            </div>
            <button className="trash-button" onClick={() => removeProduct(product.id)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <div className="cart-form">
        <h2>Delivery Details</h2>
        <form>
          <input type="text" placeholder="Full Name" className="form-input" required />
          <input type="email" placeholder="Email Address" className="form-input" required />
          <input type="text" placeholder="Phone Number" className="form-input" required />
          <input type="text" placeholder="Address" className="form-input" required />
          <input type="text" placeholder="City" className="form-input" required />
          <input type="text" placeholder="Postal Code" className="form-input" required />
          <div className="form-buttons">
            <button type="submit" className="cart-button">Place Order</button>
            <button
              type="button"
              className="return-button"
              onClick={() => navigate("/")}
            >
              Return to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;
