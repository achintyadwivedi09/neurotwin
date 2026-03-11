import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <span style={{ fontSize: '1.8rem', color: 'var(--accent-color)' }}>⚭</span>
        NeuroTwin
      </div>

      <nav className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/daily-input" 
          className={`nav-link ${location.pathname === '/daily-input' ? 'active' : ''}`}
        >
          Daily Input
        </Link>
      </nav>

      <div className="user-info">
        <div style={{ fontWeight: 600 }}>{user?.name}</div>
        <div className="user-email">{user?.email}</div>
        <button onClick={onLogout} className="logout-btn">
          <span>&rarr;</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
