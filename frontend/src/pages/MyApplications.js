import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const STATUS_STEPS = ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered'];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get('/api/applications/my/all');
      setApplications(data.applications || []);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application withdrawn');
    } catch {
      toast.error('Failed to withdraw');
    }
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);
  const counts = applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Applications</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Track all your job applications</p>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total', value: applications.length, color: '#2563eb' },
          { label: 'Pending', value: counts.pending || 0, color: '#d97706' },
          { label: 'Shortlisted', value: counts.shortlisted || 0, color: '#16a34a' },
          { label: 'Offered', value: counts.offered || 0, color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['all', 'pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`badge ${filter === s ? 'badge-blue' : 'badge-gray'}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'all' && counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>{filter === 'all' ? "No applications yet" : `No ${filter} applications`}</h3>
          {filter === 'all' && <><p>Start applying to jobs to track them here!</p><Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link></>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(app => (
            <div key={app._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <Link to={`/jobs/${app.job?._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{app.job?.title}</div>
                  </Link>
                  <div style={{ color: '#2563eb', fontWeight: 600 }}>{app.job?.company}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    📍 {app.job?.location} · {app.job?.jobType}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge status-${app.status}`} style={{ padding: '0.4rem 0.9rem', fontWeight: 700 }}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {app.status !== 'rejected' && app.status !== 'withdrawn' && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    {STATUS_STEPS.map((step, i) => {
                      const currentIdx = STATUS_STEPS.indexOf(app.status);
                      const isActive = i <= currentIdx;
                      return (
                        <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', margin: '0 auto 4px', background: isActive ? '#2563eb' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: isActive ? 'white' : '#94a3b8', fontWeight: 700 }}>
                            {isActive ? '✓' : i + 1}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: isActive ? '#2563eb' : '#94a3b8', fontWeight: isActive ? 700 : 400, textTransform: 'capitalize' }}>{step}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, position: 'relative', marginTop: 4 }}>
                    <div style={{ height: '100%', background: '#2563eb', borderRadius: 2, transition: 'width 0.3s', width: `${Math.max(0, ((STATUS_STEPS.indexOf(app.status)) / (STATUS_STEPS.length - 1)) * 100)}%` }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </div>
                {app.status === 'pending' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleWithdraw(app._id)}>
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
