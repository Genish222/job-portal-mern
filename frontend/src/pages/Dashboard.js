import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => { fetchMyJobs(); }, []);

  const fetchMyJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs/recruiter/myjobs');
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    setLoadingApps(true);
    try {
      const { data } = await axios.get(`/api/applications/job/${jobId}`);
      setApplications(data.applications || []);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    fetchApplications(job._id);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success('Job deleted!');
      setJobs(prev => prev.filter(j => j._id !== jobId));
      if (selectedJob?._id === jobId) { setSelectedJob(null); setApplications([]); }
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await axios.put(`/api/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
  const activeJobs = jobs.filter(j => j.isActive).length;

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruiter Dashboard</h1>
          <p style={{ color: '#64748b' }}>Welcome back, {user?.name}! 👋</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Jobs Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalApplicants}</div>
          <div className="stat-label">Total Applicants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{applications.length}</div>
          <div className="stat-label">Applications Viewing</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* Jobs List */}
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Your Job Listings</h2>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>No jobs posted yet</h3>
              <p>Start by posting your first job!</p>
              <Link to="/post-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post a Job</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.map(job => (
                <div key={job._id} className="card" style={{ border: selectedJob?._id === job._id ? '2px solid #2563eb' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{job.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {job.location} · {job.jobType} · {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>👥 {job.applicants?.length || 0} applicants</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleViewApplications(job)}>
                        📋 Applications
                      </button>
                      <Link to={`/edit-job/${job._id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteJob(job._id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applications Panel */}
        {selectedJob && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700 }}>Applications for "{selectedJob.title}"</h2>
              <button onClick={() => { setSelectedJob(null); setApplications([]); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
            </div>
            {loadingApps ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : applications.length === 0 ? (
              <div className="empty-state"><div className="icon">📭</div><h3>No applications yet</h3></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map(app => (
                  <div key={app._id} className="card">
                    <div style={{ fontWeight: 700 }}>{app.applicant?.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{app.applicant?.email}</div>
                    {app.applicant?.skills?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {app.applicant.skills.map(s => <span key={s} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{s}</span>)}
                      </div>
                    )}
                    {app.coverLetter && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {app.coverLetter}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      <select value={app.status} onChange={e => handleStatusChange(app._id, e.target.value)}
                        className={`badge status-${app.status}`} style={{ border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                        {['pending','reviewed','shortlisted','interviewed','offered','rejected'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
