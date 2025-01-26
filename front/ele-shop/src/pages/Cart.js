  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import "./styles/Cart.css";

  const Cart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");
    
    useEffect(() => {
      const fetchCart = async () => {
        if (!token) {
          console.error("Brak tokenu. Przekierowanie na stronę logowania.");
          navigate("/login");
          return;
        }

        try {
          const response = await axios.get(
            `http://localhost:4000/api/cart`, // No userId
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Cart API response:", response.data);
          if (Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.error("Błąd przy pobieraniu danych koszyka:", error);
          alert("Nie udało się załadować koszyka. Spróbuj ponownie później.");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCart();
    }, [token, navigate]);

    const updateQuantity = async (id, delta) => {
      try {
        const response = await axios.put(
          "http://localhost:4000/api/cart/update", // No userId
          { productId: id, delta },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Updated cart:", response.data);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Błąd przy aktualizacji ilości produktu:", error.response?.data || error.message);
        alert("Nie udało się zaktualizować ilości produktu.");
      }
    };

    const removeProduct = async (id) => {
      try {
        await axios.delete(
          `http://localhost:4000/api/cart/${id}`, // No userId
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

    if (loading) return <h2>Ładowanie koszyka...</h2>;

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
