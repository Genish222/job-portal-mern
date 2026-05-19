import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'HR', 'Operations', 'Other'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'];
const EXPERIENCE_LEVELS = ['Entry Level', '1-2 years', '2-5 years', '5-10 years', '10+ years'];
const EDUCATION_LEVELS = ['High School', "Associate's", "Bachelor's", "Master's", 'PhD', 'Any'];

const PostJob = ({ isEdit }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', location: '', jobType: 'Full-time', category: 'Technology',
    experience: 'Entry Level', education: "Bachelor's", skills: [],
    salary: { min: '', max: '', currency: 'USD', period: 'yearly' },
    deadline: '', isActive: true
  });

  useEffect(() => {
    if (isEdit && id) {
      axios.get(`/api/jobs/${id}`).then(({ data }) => {
        const j = data.job;
        setForm({
          title: j.title, description: j.description, location: j.location,
          jobType: j.jobType, category: j.category, experience: j.experience,
          education: j.education || "Bachelor's", skills: j.skills || [],
          salary: j.salary || { min: '', max: '', currency: 'USD', period: 'yearly' },
          deadline: j.deadline ? j.deadline.slice(0, 10) : '',
          isActive: j.isActive
        });
      }).catch(() => navigate('/dashboard'));
    }
  }, [isEdit, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('salary.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, salary: { ...prev.salary, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, company: user.company || user.name };
      if (isEdit) {
        await axios.put(`/api/jobs/${id}`, payload);
        toast.success('Job updated successfully!');
      } else {
        await axios.post('/api/jobs', payload);
        toast.success('Job posted successfully! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        {isEdit ? '✏️ Edit Job' : '📝 Post a New Job'}
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Fill in the details to {isEdit ? 'update your' : 'post a new'} job listing</p>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input type="text" name="title" className="form-control" placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Type *</label>
              <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input type="text" name="location" className="form-control" placeholder="City, Country or Remote" value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level *</label>
              <select name="experience" className="form-control" value={form.experience} onChange={handleChange}>
                {EXPERIENCE_LEVELS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Education</label>
              <select name="education" className="form-control" value={form.education} onChange={handleChange}>
                {EDUCATION_LEVELS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input type="date" name="deadline" className="form-control" value={form.deadline} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Salary Range</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Min Salary (in thousands)</label>
              <input type="number" name="salary.min" className="form-control" placeholder="e.g. 50" value={form.salary.min} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Salary (in thousands)</label>
              <input type="number" name="salary.max" className="form-control" placeholder="e.g. 80" value={form.salary.max} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Period</label>
              <select name="salary.period" className="form-control" value={form.salary.period} onChange={handleChange}>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Skills Required</h3>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input type="text" className="form-control" placeholder="Add a skill (e.g. React, Python)"
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
          </div>
          <div className="skills-list">
            {form.skills.map(skill => (
              <span key={skill} className="badge badge-purple" style={{ padding: '0.4rem 0.9rem', cursor: 'pointer' }}
                onClick={() => removeSkill(skill)}>{skill} ×</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Job Description *</h3>
          <textarea name="description" className="form-control" rows="10"
            placeholder="Describe the role, responsibilities, requirements, and what you offer..."
            value={form.description} onChange={handleChange} required style={{ resize: 'vertical' }} />
        </div>

        {isEdit && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <label className="filter-option">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              <span style={{ fontWeight: 600 }}>Job is Active</span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? '💾 Update Job' : '🚀 Post Job'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
