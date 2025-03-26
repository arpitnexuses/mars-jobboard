import { useState } from 'react';
import { Building2, Briefcase, MapPin, Calendar, GraduationCap, Clock, FileText, Globe, Image } from 'lucide-react';
import { Job } from '@/types';

interface JobPostFormProps {
  onSubmit: (job: Job) => void;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    type: 'Full Time',
    datePosted: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: {
      country: '',
      state: '',
      city: '',
      street: '',
      zipCode: ''
    }
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
      }
    };

    onSubmit({
      ...formData,
      schema: jobSchema,
      datePosted: formData.datePosted instanceof Date ? formData.datePosted.toISOString() : formData.datePosted,
      expiryDate: formData.expiryDate instanceof Date ? formData.expiryDate.toISOString() : formData.expiryDate
    } as Job);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-10 bg-gradient-to-b from-white to-gray-50">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Post a New Job</h2>
          <p className="mt-2 text-base text-gray-600">Fill in the details below to post your job listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Information */}
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Tech Company Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="url"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    value={formData.companyUrl || ''}
                    onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company Logo URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="url"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    value={formData.companyLogo || ''}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                    placeholder="https://company.com/logo.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <select
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-gray-50"
                    value={formData.type}
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
          </div>

          {/* Location Information */}
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50"
                  value={formData.location?.street || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, street: e.target.value } 
                  })}
                  placeholder="e.g., 123 Main St"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50"
                  value={formData.location?.city || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, city: e.target.value } 
                  })}
                  placeholder="e.g., San Francisco"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50"
                  value={formData.location?.state || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, state: e.target.value } 
                  })}
                  placeholder="e.g., CA"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50"
                  value={formData.location?.zipCode || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, zipCode: e.target.value } 
                  })}
                  placeholder="e.g., 94105"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50"
                  value={formData.location?.country || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location!, country: e.target.value } 
                  })}
                  placeholder="e.g., United States"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Job Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-gray-50"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role and responsibilities..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-gray-50"
                  value={formData.responsibilities?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    responsibilities: e.target.value.split('\n').filter(line => line.trim()) 
                  })}
                  placeholder="Enter each responsibility on a new line..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-gray-50"
                  value={formData.qualifications?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    qualifications: e.target.value.split('\n').filter(line => line.trim()) 
                  })}
                  placeholder="Enter each qualification on a new line..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Education Required</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50"
                    value={formData.education || ''}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g., Bachelor's Degree in Computer Science"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Experience Required</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 5+ years"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="submit"
              className="px-8 py-3 bg-[#A9282B] text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm; 