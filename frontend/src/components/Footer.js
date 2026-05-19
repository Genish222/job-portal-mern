import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div>
        <div className="footer-brand">💼 JobPortal</div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
          Connecting talented professionals with the right opportunities. Your dream job is just a click away.
        </p>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '1rem' }}>For Job Seekers</h4>
        <ul className="footer-links">
          <li><Link to="/jobs">Browse Jobs</Link></li>
          <li><Link to="/register">Create Account</Link></li>
          <li><Link to="/my-applications">My Applications</Link></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '1rem' }}>For Recruiters</h4>
        <ul className="footer-links">
          <li><Link to="/post-job">Post a Job</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/register">Register Company</Link></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Categories</h4>
        <ul className="footer-links">
          <li><a href="/jobs?category=Technology">Technology</a></li>
          <li><a href="/jobs?category=Design">Design</a></li>
          <li><a href="/jobs?category=Marketing">Marketing</a></li>
          <li><a href="/jobs?category=Finance">Finance</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 JobPortal — Built with MERN Stack | Developed as part of Ethnus Consultancy Services assignment</p>
    </div>
  </footer>
);

export default Footer;
