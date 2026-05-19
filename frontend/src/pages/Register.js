import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'jobseeker', company: '' });
  const [loading, setLoading] = useState(false);

  if (user) { navigate('/'); return null; }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const data = await register({
        name: form.name, email: form.email,
        password: form.password, role: form.role, company: form.company
      });
      toast.success('Account created successfully!');
      navigate(data.user.role === 'recruiter' ? '/dashboard' : '/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account 🎉</h1>
        <p className="auth-subtitle">Join thousands of professionals today</p>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button type="button" className={`role-btn ${form.role === 'jobseeker' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'jobseeker' })}>
            🧑‍💼 Job Seeker
          </button>
          <button type="button" className={`role-btn ${form.role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'recruiter' })}>
            🏢 Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control"
              placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          {form.role === 'recruiter' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" name="company" className="form-control"
                placeholder="Your company" value={form.company} onChange={handleChange} required />
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control"
                placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-control"
                placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
