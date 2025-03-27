'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, AlertCircle, ChevronRight, MapPin, Briefcase, Calendar, Building2 } from 'lucide-react';
import Image from 'next/image';
import { Job } from '@/types';

export default function PostedJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchJobs();
    }
  }, [router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch jobs');
      }
      
      setJobs(data);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/dashboard/post-job?edit=${jobId}`);
  };

  const confirmDeleteJob = (jobId: string) => {
    setDeleteJobId(jobId);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setDeleteJobId(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to delete job');
      }

      // Remove the deleted job from the state
      setJobs(jobs.filter(job => job._id !== deleteJobId));
      setShowDeleteConfirm(false);
      setDeleteJobId(null);
    } catch (error: any) {
      console.error('Error deleting job:', error);
      setError(error.message || 'Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Posted Jobs</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h2>
          <p className="text-gray-600 mb-6">
            Start by posting your first job offering!
          </p>
          <button
            onClick={() => router.push('/dashboard/post-job')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div 
              key={job._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={job.companyLogo} 
                      alt={job.company}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-600 mt-1 font-medium">{job.company}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-5 w-5 mr-2 text-red-400" />
                        <span>{job.location.city}, {job.location.state}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Briefcase className="h-5 w-5 mr-2 text-red-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-5 w-5 mr-2 text-red-400" />
                        <span>Posted {formatDate(job.datePosted)}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Building2 className="h-5 w-5 mr-2 text-red-400" />
                        <span>{job.industry}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditJob(job._id!)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit Job"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDeleteJob(job._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Job</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 