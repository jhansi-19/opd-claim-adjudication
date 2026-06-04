import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles/index.css';
import Home from './pages/Home';
import ClaimUpload from './pages/ClaimUpload';
import ClaimsHistory from './pages/ClaimsHistory';
import ClaimDetails from './pages/ClaimDetails';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav>
      <div className="container">
        <Link to="/" className="logo">
          💳 OPD Claims
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>Home</Link>
          </li>
          <li>
            <Link to="/upload" className={isActive('/upload')}>Upload Claim</Link>
          </li>
          <li>
            <Link to="/history" className={isActive('/history')}>Claims History</Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="layout">
        <Navigation />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<ClaimUpload />} />
            <Route path="/history" element={<ClaimsHistory />} />
            <Route path="/claim/:id" element={<ClaimDetails />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
