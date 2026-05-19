import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    experience: user?.experience || '',
    education: user?.education || '',
    company: user?.company || '',
    companyDescription: user?.companyDescription || '',
    website: user?.website || ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setForm(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put('/api/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800 }}>
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h1>
          <p style={{ color: '#64748b' }}>{user?.email}</p>
          <span className={`badge ${user?.role === 'recruiter' ? 'badge-blue' : 'badge-green'}`} style={{ marginTop: '0.25rem' }}>
            {user?.role === 'recruiter' ? '🏢 Recruiter' : '🧑‍💼 Job Seeker'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" className="form-control" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-control" placeholder="City, Country" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Bio / About Me</label>
            <textarea name="bio" className="form-control" rows="3" placeholder="Tell recruiters about yourself..." value={form.bio} onChange={handleChange} style={{ resize: 'vertical' }} />
          </div>
        </div>

        {user?.role === 'jobseeker' && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Professional Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select name="experience" className="form-control" value={form.experience} onChange={handleChange}>
                    <option value="">Select...</option>
                    {['Entry Level', '1-2 years', '2-5 years', '5-10 years', '10+ years'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Education</label>
                  <select name="education" className="form-control" value={form.education} onChange={handleChange}>
                    <option value="">Select...</option>
                    {['High School', "Associate's", "Bachelor's", "Master's", 'PhD'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <input type="text" className="form-control" placeholder="Add a skill..."
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
              </div>
              <div className="skills-list">
                {form.skills.map(s => (
                  <span key={s} className="badge badge-purple" style={{ padding: '0.4rem 0.9rem', cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                    {s} ×
                  </span>
                ))}
                {form.skills.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills added yet</span>}
              </div>
            </div>
          </>
        )}

        {user?.role === 'recruiter' && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Company Details</h3>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" name="company" className="form-control" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input type="url" name="website" className="form-control" placeholder="https://yourcompany.com" value={form.website} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Company Description</label>
              <textarea name="companyDescription" className="form-control" rows="4" placeholder="Tell applicants about your company..." value={form.companyDescription} onChange={handleChange} style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
