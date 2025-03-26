import React, { useState } from 'react';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, Building2, ChevronRight, Plus } from 'lucide-react';
import JobDetails from './components/JobDetails';
import { Job } from './types';

const initialJob: Job = {
  title: "Electronic Engineering Technician",
  company: "MARS Solutions Group",
  companyUrl: "https://getreturnship.com/",
  companyLogo: "https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS/MARS-1%20(1).png",
  industry: "Business Consulting and services",
  type: "Full Time",
  location: {
    country: "United States",
    state: "Wisconsin",
    city: "Milwaukee",
    street: "1433 North Water Street, Suite 400",
    zipCode: "53202"
  },
  datePosted: "March 7, 2025",
  expiryDate: "March 30, 2025",
  description: "MARS Solutions group is seeking a skilled Electronic engineering technician to join our team to performs diverse and complex assignments in support of product development and manufacturing...",
  responsibilities: [
    "Testing and troubleshooting component at systems and subsystem level.",
    "From detailed instructions, set up or modify equipment, calibrate and operate equipment",
    "Tune equipment as per detailed instructions.",
    "Works with team lead, engineers, supervisors, and managers to improve quality"
  ],
  qualifications: [
    "Associates degree in Manufacturing, Engineering or Technology related fields",
    "High School diploma and 2 years experience",
    "Proficiency to logically troubleshoot at subsystem and system level",
    "Ability to draw accurate conclusions from test data"
  ],
  education: "Associates degree in a Manufacturing, Engineering or Technology related fields",
  experience: "2 years"
};

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus className="h-5 w-5 mr-2" />
              Post a Job
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Job Card */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleJobClick(initialJob)}
          >
            <div className="flex items-start gap-4">
              <img 
                src={initialJob.companyLogo} 
                alt={initialJob.company}
                className="w-16 h-16 object-contain"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{initialJob.title}</h2>
                <p className="text-gray-600 mt-1">{initialJob.company}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{initialJob.location.city}, {initialJob.location.state}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{initialJob.type}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Posted {String(initialJob.datePosted)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>{initialJob.industry}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </main>

      {/* Job Details Side Panel */}
      <JobDetails 
        job={selectedJob}
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
      />
    </div>
  );
}

export default App;