import mongoose from 'mongoose';
import { Job as JobType } from '@/types';

const jobSchema = new mongoose.Schema<JobType>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyUrl: { type: String, required: true },
  companyLogo: { type: String, required: true },
  industry: { type: String, required: true },
  type: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  qualifications: [{ type: String }],
  education: { type: String, required: true },
  experience: { type: String, required: true },
  datePosted: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  expiryDate: { 
    type: Date, 
    required: true
  },
  schema: { type: Object }
}, {
  timestamps: true
});

// Create indexes for better query performance
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ industry: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ 'location.city': 1 });

const Job = mongoose.models.Job || mongoose.model<JobType>('Job', jobSchema);

export default Job; 