import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Account.css';

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = {
      uid: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
    };
    if (storedUser.uid) {
      setUser(storedUser);
    }
  }, []);

 
  return (
    <div className="account-container">
      {!user ? (
        <div className="login-message">
          <h2>Please log in to access your account</h2>
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>
      ) : (
        <div className="user-info">
          <h2>Welcome, {user.email}</h2>
          <img src="https://i.pinimg.com/736x/3c/f6/ef/3cf6ef8b32bdb41c8b350f15ee5ac4a5.jpg" alt="User" className="user-image" />
          <p>User ID: {user.uid}</p>
        </div>
      )}
    </div>
  );
};

export default Account;
