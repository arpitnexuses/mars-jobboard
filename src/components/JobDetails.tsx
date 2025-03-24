'use client';

import { X, MapPin, Calendar, Building2, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { useState } from 'react';
import JobApplicationForm from './JobApplicationForm';

interface JobDetailsProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, isOpen, onClose }) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  if (!job) return null;

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Job Details</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Company and Title Section */}
          <div className="flex items-start gap-5 pb-6 border-b border-gray-200">
            <div className="flex-shrink-0">
              <img 
                src={job.companyLogo} 
                alt={job.company}
                className="w-16 h-16 object-contain p-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{job.title}</h2>
              <a 
                href={job.companyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
              >
                {job.company}
                <span className="text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="grid grid-cols-2 gap-y-4 py-6 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">{job.location.city}, {job.location.state}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">{job.type}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">Posted {job.datePosted instanceof Date ? job.datePosted.toLocaleDateString() : job.datePosted}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">{job.industry}</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 py-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-sm leading-relaxed text-gray-600">{job.description}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h3>
              <ul className="space-y-3">
                {job.responsibilities?.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-sm leading-relaxed text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
              <ul className="space-y-3">
                {job.qualifications?.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-sm leading-relaxed text-gray-600">{qualification}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Education</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{job.education}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{job.experience}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-200">
          <button 
            onClick={() => setIsApplicationFormOpen(true)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>

      <JobApplicationForm
        jobId={job._id || ''}
        jobTitle={job.title}
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />
    </>
  );
};

export default JobDetails;