import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Account.css';

const Account = () => {
  return (
    <div className="account-container">
      <h1 className="account-title">My Account</h1>
      <p className="account-message">Manage your profile and orders.</p>
      <Link to="/login">
        <button className="account-button">Załóż konto lub się zaloguj</button>
      </Link>
    </div>
  );
};

export default Account;
