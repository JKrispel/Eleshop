import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Cart.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = "ExampleUser"; // Zastąp tym faktycznym ID użytkownika

  // Pobierz produkty z koszyka po załadowaniu komponentu
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/cart/${userId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Błąd przy pobieraniu danych koszyka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Aktualizacja ilości produktu
  const updateQuantity = async (id, delta) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/cart/${userId}/update`,
        { productId: id, delta } // Backend aktualizuje ilość
      );
      setProducts(response.data); // Aktualizujemy stan z nowymi danymi
    } catch (error) {
      console.error("Błąd przy aktualizacji ilości produktu:", error);
    }
  };

  // Usuwanie produktu z koszyka
  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/cart/${userId}/remove/${id}`
      );
      setProducts(response.data); // Aktualizujemy stan po usunięciu
    } catch (error) {
      console.error("Błąd przy usuwaniu produktu:", error);
    }
  };

  if (loading) return <h2>Ładowanie koszyka...</h2>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Twój Koszyk</h1>
      <div className="cart-products">
        {products.map((product) => (
          <div key={product.id} className="cart-product">
            <img
              src={product.imageUrl || "https://via.placeholder.com/150"}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price} PLN</p>
            </div>
            <div className="quantity-controls">
              <button
                className="quantity-button"
                onClick={() => updateQuantity(product.id, -1)}
              >
                -
              </button>
              <span className="product-quantity">{product.quantity}</span>
              <button
                className="quantity-button"
                onClick={() => updateQuantity(product.id, 1)}
              >
                +
              </button>
            </div>
            <button
              className="trash-button"
              onClick={() => removeProduct(product.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <div className="cart-form">
        <h2>Szczegóły dostawy</h2>
        <form>
          <input type="text" placeholder="Imię i nazwisko" className="form-input" required />
          <input type="email" placeholder="Adres e-mail" className="form-input" required />
          <input type="text" placeholder="Numer telefonu" className="form-input" required />
          <input type="text" placeholder="Adres" className="form-input" required />
          <input type="text" placeholder="Miasto" className="form-input" required />
          <input type="text" placeholder="Kod pocztowy" className="form-input" required />
          <div className="form-buttons">
            <button type="submit" className="cart-button">
              Złóż zamówienie
            </button>
            <button
              type="button"
              className="return-button"
              onClick={() => navigate("/")}
            >
              Powrót do strony głównej
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;
