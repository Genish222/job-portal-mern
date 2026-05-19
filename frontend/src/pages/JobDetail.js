import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`/api/jobs/${id}`);
      setJob(data.job);
    } catch (err) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await axios.post(`/api/applications/${id}`, { coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!job) return null;

  return (
    <div className="job-detail-page">
      <Link to="/jobs" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>← Back to Jobs</Link>

      <div className="job-detail-layout" style={{ marginTop: '1.5rem' }}>
        {/* Main Content */}
        <div className="job-detail-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="job-detail-title">{job.title}</h1>
              <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.1rem' }}>{job.company}</div>
              <div style={{ color: '#64748b', marginTop: '0.5rem' }}>📍 {job.location}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{job.jobType}</span>
              <span className="badge badge-gray">{job.category}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div><div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Experience</div><div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{job.experience}</div></div>
            {job.salary?.min && <div><div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Salary</div><div style={{ fontWeight: 600, marginTop: '0.25rem' }}>${job.salary.min}k – ${job.salary.max}k / {job.salary.period}</div></div>}
            {job.education && <div><div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Education</div><div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{job.education}</div></div>}
            {job.deadline && <div><div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Deadline</div><div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{new Date(job.deadline).toLocaleDateString()}</div></div>}
          </div>

          <div className="job-section">
            <h2>Job Description</h2>
            <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#475569' }}>{job.description}</p>
          </div>

          {job.skills?.length > 0 && (
            <div className="job-section">
              <h2>Required Skills</h2>
              <div className="skills-list">
                {job.skills.map(skill => <span key={skill} className="badge badge-purple" style={{ padding: '0.4rem 0.9rem' }}>{skill}</span>)}
              </div>
            </div>
          )}

          {job.postedBy && (
            <div className="job-section">
              <h2>About the Company</h2>
              <p style={{ color: '#475569', lineHeight: 1.7 }}>{job.postedBy.companyDescription || `${job.company} is hiring talented professionals.`}</p>
              {job.postedBy.website && <a href={job.postedBy.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Visit Website →</a>}
            </div>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <div className="job-section">
              <h2>Submit Your Application</h2>
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label className="form-label">Cover Letter (Optional)</label>
                  <textarea className="form-control" rows="6"
                    placeholder="Tell the recruiter why you're the perfect candidate..."
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                    style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={applying}>{applying ? 'Submitting...' : '🚀 Submit Application'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="job-detail-sidebar">
          <div className="card">
            {applied ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h3 style={{ color: '#15803d', margin: '0.5rem 0' }}>Applied!</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track your application in My Applications</p>
                <Link to="/my-applications" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>View Applications</Link>
              </div>
            ) : user?.role === 'jobseeker' ? (
              !showApplyForm ? (
                <button className="btn btn-primary btn-block" onClick={() => setShowApplyForm(true)}>
                  🚀 Apply Now
                </button>
              ) : null
            ) : user?.role === 'recruiter' ? (
              <div className="alert alert-info" style={{ margin: 0 }}>You're viewing as a recruiter.</div>
            ) : (
              <div>
                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>Sign in to apply for this job</p>
                <Link to="/login" className="btn btn-primary btn-block">Login to Apply</Link>
                <Link to="/register" className="btn btn-secondary btn-block" style={{ marginTop: '0.75rem' }}>Create Account</Link>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Job Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Posted</span>
                <span style={{ fontWeight: 600 }}>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Applicants</span>
                <span style={{ fontWeight: 600 }}>{job.applicants?.length || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Views</span>
                <span style={{ fontWeight: 600 }}>{job.views}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
