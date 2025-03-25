'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Building2, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Job } from '@/types';
import JobApplicationForm from '@/components/JobApplicationForm';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/jobs/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to fetch job details');
        }
        
        setJob(data);
      } catch (error: any) {
        console.error('Error fetching job:', error);
        setError(error.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Job not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Company and Title Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={job.companyLogo} 
                  alt={job.company}
                  className="w-20 h-20 object-contain p-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <a 
                  href={job.companyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                >
                  {job.company}
                  <span className="text-sm">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span>{job.location.city}, {job.location.state}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>Posted {job.datePosted instanceof Date ? job.datePosted.toLocaleDateString() : job.datePosted}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <span>{job.industry}</span>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-600 leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.qualifications && job.qualifications.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
                <ul className="space-y-3">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-600 leading-relaxed">{qualification}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-600">{job.education}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-600">{job.experience}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Apply Button */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <button 
              onClick={() => setIsApplicationFormOpen(true)}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </main>

      <JobApplicationForm
        jobId={job._id || ''}
        jobTitle={job.title}
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />
    </div>
  );
} 