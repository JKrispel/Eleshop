import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Cart.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pobierz userId i token z localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  // Pobierz produkty w koszyku
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !token) {
        console.error("Brak tokenu lub userId. Przekierowanie na stronę logowania.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/api/cart/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Cart API response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Błąd przy pobieraniu danych koszyka:", error);
        alert("Nie udało się załadować koszyka. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token, navigate]);

  // Zaktualizuj ilość produktu
  const updateQuantity = async (id, delta) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/cart/${userId}/update`,
        { productId: id, delta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated cart:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Błąd przy aktualizacji ilości produktu:", error);
      alert("Nie udało się zaktualizować ilości produktu.");
    }
  };

  // Usuń produkt z koszyka
  const removeProduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/cart/${userId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Błąd przy usuwaniu produktu:", error);
      alert("Nie udało się usunąć produktu z koszyka.");
    }
  };

  // Wyświetl komunikat ładowania
  if (loading) return <h2>Ładowanie koszyka...</h2>;

  // Render koszyka
  return (
    <div className="cart-container">
      <h1 className="cart-title">Twój Koszyk</h1>
      <div className="cart-products">
        {products.length === 0 ? (
          <p className="empty-cart">Twój koszyk jest pusty.</p>
        ) : (
          products.map((product) => (
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
                  disabled={product.quantity <= 1}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
