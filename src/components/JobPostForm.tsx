import { useState } from 'react';
import { X, Building2, Briefcase, MapPin, Calendar, GraduationCap, Clock, FileText } from 'lucide-react';
import { Job } from '@/types';

interface JobPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Job) => void;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    type: 'Full Time',
    datePosted: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create Google Job Schema
    const jobSchema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": formData.title,
      "description": formData.description,
      "datePosted": formData.datePosted instanceof Date ? formData.datePosted.toISOString() : formData.datePosted,
      "validThrough": formData.expiryDate instanceof Date ? formData.expiryDate.toISOString() : formData.expiryDate,
      "employmentType": formData.type,
      "hiringOrganization": {
        "@type": "Organization",
        "name": formData.company,
        "sameAs": formData.companyUrl,
        "logo": formData.companyLogo
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": formData.location?.street,
          "addressLocality": formData.location?.city,
          "addressRegion": formData.location?.state,
          "postalCode": formData.location?.zipCode,
          "addressCountry": formData.location?.country
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 0,
          "maxValue": 0,
          "unitText": "YEAR"
        }
      }
    };

    // Submit the job posting
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          schema: jobSchema,
          datePosted: formData.datePosted instanceof Date ? formData.datePosted.toISOString() : formData.datePosted,
          expiryDate: formData.expiryDate instanceof Date ? formData.expiryDate.toISOString() : formData.expiryDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post job');
      }

      const job = await response.json();
      onSubmit(job);
      onClose();
    } catch (error) {
      console.error('Error posting job:', error);
      // Handle error appropriately
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
              <p className="mt-1 text-sm text-gray-500">Fill in the details below to post your job listing</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Tech Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                  <input
                    type="url"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.companyUrl || ''}
                    onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo URL</label>
                  <input
                    type="url"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.companyLogo || ''}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                    placeholder="https://company.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.location?.country || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        country: e.target.value,
                        state: formData.location?.state || '',
                        city: formData.location?.city || '',
                        street: formData.location?.street || '',
                        zipCode: formData.location?.zipCode || ''
                      }
                    })}
                    placeholder="e.g., United States"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.location?.state || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        country: formData.location?.country || '',
                        state: e.target.value,
                        city: formData.location?.city || '',
                        street: formData.location?.street || '',
                        zipCode: formData.location?.zipCode || ''
                      }
                    })}
                    placeholder="e.g., California"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.location?.city || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        country: formData.location?.country || '',
                        state: formData.location?.state || '',
                        city: e.target.value,
                        street: formData.location?.street || '',
                        zipCode: formData.location?.zipCode || ''
                      }
                    })}
                    placeholder="e.g., San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.location?.street || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        country: formData.location?.country || '',
                        state: formData.location?.state || '',
                        city: formData.location?.city || '',
                        street: e.target.value,
                        zipCode: formData.location?.zipCode || ''
                      }
                    })}
                    placeholder="e.g., 123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.location?.zipCode || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {
                        country: formData.location?.country || '',
                        state: formData.location?.state || '',
                        city: formData.location?.city || '',
                        street: formData.location?.street || '',
                        zipCode: e.target.value
                      }
                    })}
                    placeholder="e.g., 94105"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Job Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.responsibilities?.join('\n') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      responsibilities: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Enter each responsibility on a new line..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (one per line)</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.qualifications?.join('\n') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualifications: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Enter each qualification on a new line..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Required</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={formData.education || ''}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., Bachelor's Degree"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g., 5+ years"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm; 