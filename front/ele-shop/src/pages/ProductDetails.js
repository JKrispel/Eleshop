import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/ProductDetails.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu danych produktu:", err.message);
        setError("Nie udało się pobrać danych produktu. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCart = async () => {
    try {
      if (!token) {
        alert("Zaloguj się, aby dodać produkty do koszyka.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/cart",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  if (loading) return <div>Ładowanie danych produktu...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="product-details-container">
      <img src={product.imageUrl} alt={product.name} className="product-details-image" />
      <h1 className="product-details-title">{product.name}</h1>
      <p className="product-details-description">{product.description}</p>
      <p className="product-details-price">{product.price} PLN</p>
      <p className="product-details-category">Category: {product.category}</p>
      <div className="product-details-buttons">
        <button className="product-button" onClick={addToCart}>Add to Cart</button>
        <Link to="/cart">
          <button className="product-button">Go to Cart</button>
        </Link>
      </div>
      <div className="expandable-description">
        <p className="expand-label" onClick={() => setShowMore(!showMore)}>
          {showMore ? "▲ Description ▲" : "▼ Description ▼"}
        </p>
        {showMore && (
          <div className="additional-description" style={{ marginLeft: '20px' }}>
            <p><strong>Product Features:</strong></p>
            <ul>
              <li>High-quality materials</li>
              <li>Advanced technology</li>
              <li>Durable and long-lasting</li>
              <li>Energy efficient</li>
              <li>Modern design</li>
            </ul>
            <p><strong>Specifications:</strong></p>
            <ul>
              <li>Weight: 1.5 kg</li>
              <li>Dimensions: 30 x 20 x 10 cm</li>
              <li>Battery life: 10 hours</li>
              <li>Warranty: 2 years</li>
              <li>Color: Black</li>
            </ul>
            <p><strong>Benefits:</strong></p>
            <ul>
              <li>Improves productivity</li>
              <li>Enhances user experience</li>
              <li>Reduces energy consumption</li>
              <li>Easy to use and maintain</li>
              <li>Cost-effective</li>
            </ul>
            <p className="description-box">Bluetooth to technologia bezprzewodowej komunikacji, która umożliwia wymianę danych pomiędzy urządzeniami na krótkim dystansie, zwykle do 10 metrów. Działa na zasadzie fal radiowych w paśmie ISM (2,4 GHz), co pozwala na stabilne połączenie przy niskim zużyciu energii. Dzięki niemu urządzenia mogą szybko i bez potrzeby użycia kabli nawiązać połączenie, tworząc tzw. sieci typu piconet, które obsługują jednocześnie wiele urządzeń.

Proces działania Bluetooth opiera się na parowaniu urządzeń, które w pierwszej kolejności muszą się wzajemnie "rozpoznać". Po nawiązaniu połączenia dane są przesyłane w sposób bezpieczny dzięki mechanizmom szyfrowania. Technologia ta jest wykorzystywana w wielu zastosowaniach, takich jak przesyłanie plików, strumieniowanie dźwięku, połączenia głosowe czy sterowanie urządzeniami IoT.

Bluetooth charakteryzuje się elastycznością i kompatybilnością z różnymi systemami. Współczesne wersje oferują szybki transfer danych, niski pobór mocy i automatyczne rekonfigurowanie połączenia w razie zakłóceń, co sprawia, że jest to rozwiązanie praktyczne i uniwersalne w codziennym użytkowaniu.</p>
            <img src="https://e-katalog.pl/posts/files/2261/wide_pic.jpg" alt="Lorem" className="description-image" style={{ width: '50%' }} />
            <p className="description-box">Przejściówka to niewielkie, praktyczne akcesorium, które umożliwia łączenie urządzeń o różnych standardach złącz. Jej głównym zadaniem jest konwersja sygnałów pomiędzy różnymi typami portów, co pozwala na ich kompatybilność bez konieczności użycia skomplikowanych rozwiązań technologicznych. Przejściówki są szczególnie przydatne w sytuacjach, gdy starsze urządzenia wymagają podłączenia do nowoczesnych technologii lub odwrotnie.

Dzięki kompaktowym wymiarom przejściówka jest wygodna w transporcie i może być łatwo przechowywana w torbie czy kieszeni. Wykonana z trwałych materiałów, zapewnia długotrwałe użytkowanie oraz stabilne działanie w różnych warunkach. Niezależnie od tego, czy służy do przesyłania danych, zasilania czy sygnału audio-wideo, jest niezwykle wszechstronna i praktyczna.

**Dołączam tę przejściówkę do zestawu, aby zapewnić Ci jeszcze większą wygodę i możliwości użytkowania!**</p>
            <img src="https://image.ceneostatic.pl/data/products/147424012/i-adapter-przejsciowka-usb-c-hdmi-4k-60hz-mac-usb-c.jpg" alt="Lorem" className="description-image" style={{ width: '50%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
