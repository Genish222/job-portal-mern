import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
    <div style={{ fontSize: '5rem' }}>🔍</div>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', margin: '1rem 0 0.5rem' }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary btn-lg">← Go Home</Link>
  </div>
);

export default NotFound;
