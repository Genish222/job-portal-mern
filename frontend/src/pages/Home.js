import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { name: 'Technology', icon: '💻' },
  { name: 'Design', icon: '🎨' },
  { name: 'Marketing', icon: '📣' },
  { name: 'Finance', icon: '💰' },
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Engineering', icon: '⚙️' },
  { name: 'Education', icon: '📚' },
  { name: 'Sales', icon: '📈' },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/jobs?limit=6').then(({ data }) => setRecentJobs(data.jobs || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Find Your Dream Job<br />Today 🚀</h1>
        <p>Explore thousands of job opportunities from top companies across all industries.</p>
        <form onSubmit={handleSearch} className="hero-search">
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="hero-stats">
          <div className="hero-stat"><div className="number">10K+</div><div className="label">Active Jobs</div></div>
          <div className="hero-stat"><div className="number">5K+</div><div className="label">Companies</div></div>
          <div className="hero-stat"><div className="number">50K+</div><div className="label">Job Seekers</div></div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse by Category</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem' }}>Find the perfect role in your field</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/jobs?category=${cat.name}`}
                style={{ textDecoration: 'none', textAlign: 'center', padding: '1.5rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'all 0.2s', color: '#1e293b' }}
                onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Latest Jobs</h2>
              <p style={{ color: '#64748b' }}>Recently posted opportunities</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary">View All Jobs →</Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No jobs posted yet</h3>
              <p>Be the first to post a job or check back later.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {recentJobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="card job-card">
                  <div className="job-card-header">
                    <div>
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company}</div>
                    </div>
                    <span className="badge badge-blue">{job.jobType}</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>📍 {job.location}</div>
                  <div className="job-meta">
                    <span className="badge badge-gray">🏷️ {job.category}</span>
                    <span className="badge badge-green">{job.experience}</span>
                    {job.salary?.min && <span className="badge badge-yellow">💵 {job.salary.min}–{job.salary.max}k</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to get started?</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>Join thousands of professionals already using JobPortal</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: '#1d4ed8' }}>Find a Job</Link>
          <Link to="/register" className="btn btn-lg btn-secondary" style={{ borderColor: 'white', color: 'white' }}>Post a Job</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
