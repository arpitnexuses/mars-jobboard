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
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Image - Full Width */}
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px]">
          <Image
            src="https://i0.wp.com/getreturnship.com/wp-content/uploads/2024/12/footerimg-2.png?w=1798&ssl=1"
            alt="Career Opportunities"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient - stronger gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8 tracking-tight drop-shadow-lg text-center leading-tight">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium mb-4 sm:mb-6 md:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md text-center px-2">
              Discover jobs that match your skills and aspirations. Join thousands of professionals finding their dream careers.
            </p>
            
            {/* Search section */}
            <div className="w-full max-w-[75%] sm:max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl p-0.5 sm:p-2">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs"
                    className="w-full px-2.5 sm:px-6 py-2 sm:py-4 rounded-md sm:rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 placeholder-gray-400 text-[13px] sm:text-base shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-8 py-2 sm:py-4 rounded-md sm:rounded-xl text-[13px] sm:text-base font-medium sm:font-semibold text-white bg-[#A9282B] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm sm:shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2" />
              <p className="text-sm sm:text-base text-red-700">{error}</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery ? "Try adjusting your search terms" : "Be the first to post a job!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 active:bg-gray-50 group relative overflow-hidden"
                onClick={() => handleJobClick(job)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50/0 to-red-50/0 group-hover:from-red-50/50 group-hover:via-red-50/30 group-hover:to-red-50/50 transition-all duration-300"></div>
                <div className="p-4 sm:p-6 relative">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-red-50 to-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-red-100/50">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company}
                        className="w-full h-full object-contain p-1.5 sm:p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">{job.title}</h2>
                      <p className="text-base sm:text-base text-gray-600 mt-1 font-medium line-clamp-1 group-hover:text-gray-900 transition-colors">{job.company}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                        <div className="flex items-center text-sm sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-red-400 shrink-0" />
                          <span className="truncate">{job.location.city}, {job.location.state}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-red-400 shrink-0" />
                          <span className="truncate">{job.type}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-red-400 shrink-0" />
                          <span className="truncate">Posted {formatDate(job.datePosted)}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-red-400 shrink-0" />
                          <span className="truncate">{job.industry}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-red-500 transition-colors hidden sm:block shrink-0" />
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