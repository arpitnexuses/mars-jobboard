import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // This will store the file path or URL
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending',
  },
});

// Create indexes for better query performance
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ appliedAt: -1 });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application; 