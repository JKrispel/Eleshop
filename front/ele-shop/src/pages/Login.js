import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const saveTokenAndUser = (token, user) => {
    // Save token to localStorage (or any secure storage)
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user.uid);
    localStorage.setItem('userEmail', user.email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      console.log('Login successful. Response data:', response.data);
  
      // Extract token and user from the nested structure in response data
      const { user } = response.data;
      const token = user?.token; // Get the token from the user object
  
      if (!token) {
        throw new Error('Token is missing in the response');
      }
  
      saveTokenAndUser(token, user);
  
      // Navigate to user account
      navigate('/account');
    } catch (error) {
      console.error('Login failed. Error details:', error.response?.data || error.message);
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', { email, password });
      console.log('Registration successful. Response data:', response.data);
  
      const { user } = response.data;
      const token = user.token; // Get the token from the response
  
      if (!token) {
        throw new Error('Token is missing in the response');
      }
  
      saveTokenAndUser(token, user);
  
      // Navigate to user account
      navigate('/account');
    } catch (error) {
      console.error('Registration failed. Error details:', error.response?.data || error.message);
    }
  };
  

  // Helper function to log in after registration
  const handleLoginAfterRegister = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      return response.data.token; // Return token from login
    } catch (error) {
      console.error('Auto-login after registration failed:', error.message);
      throw error;
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
