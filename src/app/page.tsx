'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Building2, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';
import { Job } from '@/types';

export default function Home() {
  const router = useRouter();
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
    router.push(`/jobs/${job._id}`);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h2>
            <p className="text-gray-600">Be the first to post a job!</p>
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

      {/* Job Post Form */}
      <JobPostForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onSubmit={handlePostJob}
      />
    </div>
  );
}