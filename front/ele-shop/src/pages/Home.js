import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";
import axios from "axios";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]); // Dynamiczna lista produktów
  const [loading, setLoading] = useState(true); // Indikator ładowania
  const [error, setError] = useState(null);

  // Pobranie tokena z localStorage
  const token = localStorage.getItem("authToken");

  // Funkcja pobierająca produkty z backendu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu produktów:", err.message);
        setError("Nie udało się pobrać produktów. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Funkcja pobierająca koszyk użytkownika (opcjonalnie, jeśli potrzebujesz koszyka w Home)
  const fetchCart = async () => {
    try {
      if (!token) {
        console.error("Brak tokenu. Użytkownik niezalogowany.");
        return;
      }
      const response = await axios.get("http://localhost:4000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Koszyk użytkownika:", response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu koszyka:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!token) {
        alert("Zaloguj się, aby dodać produkty do koszyka.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:4000/api/cart", // No userId in the path
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token for authentication
          },
        }
      );
      console.log("Produkt dodany do koszyka:", response.data);
      alert("Produkt dodano do koszyka!");
    } catch (error) {
      console.error("Błąd przy dodawaniu produktu do koszyka:", error.response?.data || error.message);
      alert("Nie udało się dodać produktu do koszyka.");
    }
  };
  


  // Grupowanie produktów polecanych według kategorii
  const recommendedProducts = products.reduce((acc, product) => {
    if (!acc.find((item) => item.category === product.category)) {
      acc.push(product);
    }
    return acc;
  }, []);

  // Filtrowanie produktów na podstawie wyszukiwania i kategorii
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Obsługa ładowania i błędów
  if (loading) {
    return <div>Ładowanie produktów...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  // Renderowanie strony głównej
  return (
    <div className="home-page">
      <div className="main-content">
        <div className="search-container">
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
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
              />
              <p className="product-name">{product.name}</p>
              <p className="product-price">{product.price} PLN</p>
              <div className="product-actions">
                <Link to={`/product/${product.id}`}>
                  <button className="product-button">View Details</button>
                </Link>
                <button
                  className="product-button"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="recommended-section">
        <h2>Recommended</h2>
        {recommendedProducts.map((product) => (
          <div key={product.id} className="recommended-card">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="recommended-image"
            />
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
