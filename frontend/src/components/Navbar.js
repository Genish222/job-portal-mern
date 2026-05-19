import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          💼 JobPortal
        </Link>

        <div className="navbar-links">
          <Link to="/jobs">Find Jobs</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-nav">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              {user.role === 'recruiter' && (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/post-job">Post Job</Link>
                </>
              )}
              {user.role === 'jobseeker' && (
                <Link to="/my-applications">My Applications</Link>
              )}
              <Link to="/profile">{user.name?.split(' ')[0]}</Link>
              <button onClick={handleLogout} className="btn-nav" style={{ background: '#64748b' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
