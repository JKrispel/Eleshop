import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with email:', email, 'and password:', password);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      console.log('Login successful. Response data:', response.data);

      // Simulate saving a token or user data for further use (e.g., in localStorage)
      console.log('Navigating to /account');
      navigate('/account');
    } catch (error) {
      console.error('Login failed. Error details:', error.response?.data || error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Attempting to register with email:', email, 'and password:', password);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', { email, password });
      console.log('Registration successful. Response data:', response.data);

      // Simulate saving a token or user data for further use (e.g., in localStorage)
      console.log('Navigating to /account');
      navigate('/account');
    } catch (error) {
      console.error('Registration failed. Error details:', error.response?.data || error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login or Register</h1>
      <form className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} className="login-button">Login</button>
        <button onClick={handleRegister} className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Login;
