'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Building2, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import JobDetails from '@/components/JobDetails';
import JobPostForm from '@/components/JobPostForm';
import { Job } from '@/types';

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsPanelOpen(true);
  };

  const handlePostJob = async (job: Job) => {
    try {
      setError(null);
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to post job');
      }

      setJobs([data, ...jobs]);
      setIsPostFormOpen(false);
    } catch (error: any) {
      console.error('Error posting job:', error);
      setError(error.message || 'Failed to post job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <button 
              onClick={() => setIsPostFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post a Job
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
            <p className="mt-2 text-sm text-gray-500">Be the first to post a job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleJobClick(job)}
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{job.location.city}, {job.location.state}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Briefcase className="h-5 w-5 mr-2" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Posted {formatDate(job.datePosted)}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Building2 className="h-5 w-5 mr-2" />
                        <span>{job.industry}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Details Side Panel */}
      <JobDetails 
        job={selectedJob}
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
      />

      {/* Job Post Form */}
      <JobPostForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
}