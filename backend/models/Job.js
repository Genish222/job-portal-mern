const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'],
    required: true
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' }
  },
  skills: [{ type: String }],
  experience: {
    type: String,
    enum: ['Entry Level', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
    required: true
  },
  education: {
    type: String,
    enum: ['High School', "Associate's", "Bachelor's", "Master's", 'PhD', 'Any']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Technology', 'Marketing', 'Design', 'Finance', 'Healthcare',
      'Education', 'Engineering', 'Sales', 'HR', 'Operations', 'Other'
    ]
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
JobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
