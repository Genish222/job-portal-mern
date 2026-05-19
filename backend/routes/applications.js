const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/applications/:jobId
// @desc    Apply to a job
// @access  Private (Job Seeker only)
router.post('/:jobId', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (!job.isActive) return res.status(400).json({ success: false, message: 'This job is no longer active' });

    // Check duplicate application
    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already applied for this job' });

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume
    });

    // Add to job's applicants array
    job.applicants.push(application._id);
    await job.save();

    await application.populate('job', 'title company location');
    res.status(201).json({ success: true, message: 'Application submitted successfully!', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get all applications by the logged-in job seeker
// @access  Private (Job Seeker)
router.get('/my/all', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job (recruiter)
// @access  Private (Recruiter)
router.get('/job/:jobId', protect, authorize('recruiter'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience education location phone bio')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (recruiter)
// @access  Private (Recruiter)
router.put('/:id/status', protect, authorize('recruiter'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = req.body.status;
    application.notes = req.body.notes || application.notes;
    await application.save();

    res.json({ success: true, message: 'Application status updated!', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw an application (job seeker)
// @access  Private (Job Seeker)
router.delete('/:id', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ success: true, message: 'Application withdrawn successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
