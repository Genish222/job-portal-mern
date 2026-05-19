import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'];
const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'HR', 'Operations', 'Other'];
const EXPERIENCE_LEVELS = ['Entry Level', '1-2 years', '2-5 years', '5-10 years', '10+ years'];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: '',
    experience: '',
    location: '',
    page: 1
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await axios.get(`/api/jobs?${params}`);
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', jobType: '', experience: '', location: '', page: 1 });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Find Your Next Job</h1>
          <p>Browse {total} available positions</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input type="text" className="form-control" style={{ maxWidth: 400 }}
              placeholder="Search by title, skill, or company..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)} />
            <input type="text" className="form-control" style={{ maxWidth: 200 }}
              placeholder="Location..."
              value={filters.location}
              onChange={e => handleFilter('location', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="jobs-page">
        <div className="jobs-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>Filters</h3>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Clear All</button>
            </div>

            <div className="filter-section">
              <h3>Job Type</h3>
              {JOB_TYPES.map(type => (
                <label key={type} className="filter-option">
                  <input type="radio" name="jobType" value={type} checked={filters.jobType === type}
                    onChange={e => handleFilter('jobType', e.target.value)} />
                  {type}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h3>Category</h3>
              {CATEGORIES.map(cat => (
                <label key={cat} className="filter-option">
                  <input type="radio" name="category" value={cat} checked={filters.category === cat}
                    onChange={e => handleFilter('category', e.target.value)} />
                  {cat}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h3>Experience</h3>
              {EXPERIENCE_LEVELS.map(exp => (
                <label key={exp} className="filter-option">
                  <input type="radio" name="experience" value={exp} checked={filters.experience === exp}
                    onChange={e => handleFilter('experience', e.target.value)} />
                  {exp}
                </label>
              ))}
            </div>
          </aside>

          {/* Jobs List */}
          <div>
            <div className="jobs-header">
              <span className="jobs-count">{total} jobs found</span>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="jobs-list">
                  {jobs.map(job => (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="card job-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="job-card-header">
                        <div>
                          <div className="job-title">{job.title}</div>
                          <div className="job-company">{job.company}</div>
                        </div>
                        <span className="badge badge-blue">{job.jobType}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>📍 {job.location}</div>
                      <p style={{ color: '#475569', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description}
                      </p>
                      <div className="job-meta">
                        <span className="badge badge-gray">🏷️ {job.category}</span>
                        <span className="badge badge-green">{job.experience}</span>
                        {job.salary?.min && <span className="badge badge-yellow">💵 ${job.salary.min}k–${job.salary.max}k</span>}
                        {job.skills?.slice(0, 3).map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        Posted {new Date(job.createdAt).toLocaleDateString()} · {job.views} views
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button disabled={filters.page === 1} onClick={() => handleFilter('page', filters.page - 1)}>← Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i + 1} className={filters.page === i + 1 ? 'active' : ''}
                        onClick={() => handleFilter('page', i + 1)}>{i + 1}</button>
                    ))}
                    <button disabled={filters.page === totalPages} onClick={() => handleFilter('page', filters.page + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
