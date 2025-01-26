import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles/Summary.css";

const Summary = () => {
  const [shipping, setShipping] = useState("");
  const [payment, setPayment] = useState("");
  const [blikCode, setBlikCode] = useState(["", "", "", "", "", ""]);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
  });
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCost } = location.state || { totalCost: 0 };

  const token = localStorage.getItem("authToken");
  const blikRefs = useRef([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        console.error("Brak tokenu. Przekierowanie na stronę logowania.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (Array.isArray(response.data)) {
          setCart(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Błąd przy pobieraniu danych koszyka:", error);
        alert("Nie udało się załadować koszyka. Spróbuj ponownie później.");
      }
    };

    fetchCart();
  }, [token, navigate]);

  const handleBlikChange = (index, value) => {
    if (/^\d$/.test(value)) {
      const newBlikCode = [...blikCode];
      newBlikCode[index] = value;
      setBlikCode(newBlikCode);
      if (index < 5) {
        blikRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Display form data in the console
    console.log("Shipping:", shipping, "Payment:", payment, "Address:", address, "Cart:", cart, "Blik Code:", blikCode.join(""));
    navigate("/");
  };

  return (
    <div className="summary-container">
      <h1 className="summary-title">Order Summary</h1>
      <form className="summary-form" onSubmit={handleSubmit}>
        {/* Shipping Method Section */}
        <div className="section-frame">
          <h2 className="section-title">Shipping Method</h2>
          <div className="form-group">
            <div>
              <label className={shipping === "courier" ? "selected" : ""}>
                <input
                  type="radio"
                  name="shipping"
                  value="courier"
                  checked={shipping === "courier"}
                  onChange={(e) => setShipping(e.target.value)}
                  required
                />
                Courier
              </label>
              <label className={shipping === "pickup" ? "selected" : ""}>
                <input
                  type="radio"
                  name="shipping"
                  value="pickup"
                  checked={shipping === "pickup"}
                  onChange={(e) => setShipping(e.target.value)}
                  required
                />
                Pickup
              </label>
              <label className={shipping === "postal" ? "selected" : ""}>
                <input
                  type="radio"
                  name="shipping"
                  value="postal"
                  checked={shipping === "postal"}
                  onChange={(e) => setShipping(e.target.value)}
                  required
                />
                Postal Service
              </label>
            </div>
          </div>
        </div>
  
        {/* Payment Method Section */}
        <div className="section-frame">
          <h2 className="section-title">Payment Method</h2>
          <div className="form-group">
            <div>
              <label className={payment === "transfer" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={payment === "transfer"}
                  onChange={(e) => setPayment(e.target.value)}
                  required
                />
                Bank Transfer
              </label>
              <label className={payment === "blik" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="blik"
                  checked={payment === "blik"}
                  onChange={(e) => setPayment(e.target.value)}
                  required
                />
                Blik
              </label>
              <label className={payment === "cod" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={(e) => setPayment(e.target.value)}
                  required
                />
                Cash on Delivery
              </label>
              
            </div>
          </div>
        </div>
  
        {payment === "blik" && (
          <div className="form-group">
            <label>Blik Code</label>
            <div className="blik-code-inputs">
              {blikCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleBlikChange(index, e.target.value)}
                  ref={(el) => (blikRefs.current[index] = el)}
                  required
                />
              ))}
            </div>
          </div>
        )}
        {payment === "transfer" && (
          <div className="form-group">
            <a href="https://www.mbank.pl" target="_blank" rel="noopener noreferrer" className="bank-link">
              Go to mBank
            </a>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            required
          />
        </div>
        <div className="total-cost-summary">
          <p>Total Cost: <strong>{totalCost} PLN</strong></p>
        </div>
        <button type="submit" className="submit-button">
          Confirm Order
        </button>
      </form>
    </div>
  );};

export default Summary;
