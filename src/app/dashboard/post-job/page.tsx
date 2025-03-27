'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Building2, MapPin, Calendar, GraduationCap, Clock, FileText, Globe, Image } from 'lucide-react';
import { Job } from '@/types';

function PostJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editJobId = searchParams.get('edit');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Check if we're editing an existing job
    if (editJobId) {
      setIsEditing(true);
      fetchJobDetails(editJobId);
    }
  }, [router, editJobId]);

  const fetchJobDetails = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const jobData = await response.json();
      
      // Format dates properly
      if (jobData.datePosted) {
        jobData.datePosted = new Date(jobData.datePosted);
      }
      if (jobData.expiryDate) {
        jobData.expiryDate = new Date(jobData.expiryDate);
      }
      
      setFormData(jobData);
    } catch (error) {
      console.error('Error fetching job details:', error);
      alert('Failed to load job details for editing');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const endpoint = isEditing ? `/api/jobs/${editJobId}` : '/api/jobs';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || `Failed to ${isEditing ? 'update' : 'post'} job`);
      }

      // After successful submission, redirect to the job details page
      router.push(`/jobs/${data._id || editJobId}`);
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'posting'} job:`, error);
      alert(error.message || `Failed to ${isEditing ? 'update' : 'post'} job`);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-5 mb-10">
        <div className="h-14 w-14 rounded-xl bg-red-50/80 flex items-center justify-center shadow-sm">
          <Briefcase className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            {isEditing ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
          <p className="text-gray-500">
            {isEditing ? 'Update the details of your job listing' : 'Fill in the details to post your job listing'}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-1">Job Details</h2>
        <p className="text-sm text-gray-500">All fields are required unless marked as optional</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
            <div className="p-2 bg-blue-50/50 rounded-lg shadow-sm">
              <Building2 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
          </div>
          
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Tech Company Inc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Website</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.companyUrl || ''}
                  onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Logo URL</label>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.companyLogo || ''}
                  onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  placeholder="https://company.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Job Type</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 appearance-none"
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
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
            <div className="p-2 bg-green-50/50 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Location Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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

        {/* Job Description */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
            <div className="p-2 bg-purple-50/50 rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Job Description</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
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
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                value={formData.qualifications?.join('\n') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  qualifications: e.target.value.split('\n').filter(line => line.trim()) 
                })}
                placeholder="Enter each qualification on a new line..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.education || ''}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g., Bachelor's Degree"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5+ years"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
          >
            Post Job
          </button>
      </div>
      </form>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <PostJobForm />
    </Suspense>
  );
} 