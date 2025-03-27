'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Building2, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';
import { Job } from '@/types';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${job.location.city}, ${job.location.state}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
      router.push(`/jobs/${data._id}`);
    } catch (error: any) {
      console.error('Error posting job:', error);
      setError(error.message || 'Failed to post job');
    }
  };

  const handlePostJobClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      router.push('/dashboard/post-job');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50">
      {/* Hero Section with Search */}
      <div className="relative text-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Image - Full Width */}
        <div className="relative w-full h-[500px]">
          <Image
            src="https://i0.wp.com/getreturnship.com/wp-content/uploads/2024/12/footerimg-2.png?w=1798&ssl=1"
            alt="Career Opportunities"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient - stronger gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-2xl text-white font-medium mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Discover jobs that match your skills and aspirations. Join thousands of professionals finding their dream careers.
            </p>
            
            {/* Search section */}
            <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, company, or keyword"
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#A9282B] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h2>
            <p className="text-gray-600">
              {searchQuery ? "Try adjusting your search terms" : "Be the first to post a job!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                onClick={() => handleJobClick(job)}
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
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-red-600 transition-colors">{job.title}</h2>
                      <p className="text-gray-600 mt-1 font-medium">{job.company}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}