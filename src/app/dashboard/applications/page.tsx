'use client';

import { useEffect, useState } from 'react';
import { Trash2, RefreshCw, Download, Eye, Calendar, Mail, Phone, User, Clock, Briefcase, Award, FileText, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Application {
  _id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  resume: string;
  appliedAt: string;
  status: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.applications);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }
    
    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/applications?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete application');
      }
      
      // Remove the deleted application from the state
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleApplicationDetails = (id: string) => {
    setExpandedApplicationId(expandedApplicationId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const formatExperienceLabel = (experience: string) => {
    // Add "years experience" if it's just a number
    if (/^\d+$/.test(experience.trim())) {
      return `${experience} Years Experience`;
    }
    return experience;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-WHITE">
      <div className="flex flex-col w-full px-0 py-0">
        <div className="mb-6 px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 black-text">Applications Dashboard</h1>
          <p className="text-gray-600 text-lg">Review and manage all submitted job applications</p>
        </div>

        <div className="bg-white overflow-hidden border-t border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-base font-medium text-gray-800 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-indigo-600" />
              All Applications
            </h2>
            <button 
              onClick={fetchApplications}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200 text-sm font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-16">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button 
                onClick={fetchApplications}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 action-button font-medium shadow-lg shadow-indigo-100"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center mb-6 shadow-inner">
                <Briefcase className="h-14 w-14 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Applications Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                When candidates apply for your posted jobs, their applications will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-4">
              {applications.map((application) => (
                <div key={application._id} className="application-card-container">
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="avatar-gradient" style={{ background: '#26264E' }}>
                            <span>{getInitials(application.firstName, application.lastName)}</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.firstName} {application.lastName}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(application.appliedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="ml-auto">
                            <div className="super-badge" style={{ background: '#26264E', color: 'white' }}>
                              {formatExperienceLabel(application.experience)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className="contact-info ">
                            <Mail style={{ background: 'white', color: '#26264E' }} />
                            <span className="text-sm truncate">{application.email}</span>
                          </div>
                          <div className="contact-info">
                            <Phone style={{ background: 'white', color: '#26264E' }} />
                            <span className="text-sm">{application.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-2 justify-end mt-3 md:mt-0">
                        <button
                          onClick={() => toggleApplicationDetails(application._id)}
                          className="modern-button bg-indigo-50"
                          title="View Application Details"
                          aria-label="View application details"
                        >
                          <Eye />
                        </button>
                        
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modern-button bg-green-50"
                          title="View Resume"
                          aria-label="View candidate resume"
                        >
                          <FileText />
                        </a>
                        
                        <button
                          onClick={() => handleDelete(application._id)}
                          disabled={deleteLoading === application._id}
                          className="modern-button bg-red-50"
                          title="Delete Application"
                          aria-label="Delete this application"
                        >
                          {deleteLoading === application._id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedApplicationId === application._id && (
                      <div className="mt-4 animate-fadeIn bg-indigo-50/30 p-5 mx-[-20px] border-t border-b border-indigo-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 max-w-5xl mx-auto">
                          <div className="detail-card">
                            <div className="detail-header">
                              <Award className="h-4 w-4 text-indigo-500" />
                              <h4 className="text-sm">Education</h4>
                            </div>
                            <div className="detail-content text-sm">
                              {application.education}
                            </div>
                          </div>
                          
                          <div className="detail-card">
                            <div className="detail-header">
                              <Briefcase className="h-4 w-4 text-indigo-500" />
                              <h4 className="text-sm">Experience</h4>
                            </div>
                            <div className="detail-content text-sm">
                              {application.experience}
                            </div>
                          </div>
                        </div>
                        
                        <div className="detail-card mb-4 max-w-5xl mx-auto">
                          <div className="detail-header">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <h4 className="text-sm">Cover Letter</h4>
                          </div>
                          <div className="detail-content text-sm whitespace-pre-line">
                            {application.coverLetter}
                          </div>
                        </div>
                        
                        <div className="flex justify-end max-w-5xl mx-auto">
                          <a
                            href={application.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-resume-button"
                            title="View Resume File"
                            aria-label="View resume file"
                          >
                            <FileText className="mr-2" />
                            <span>View Resume</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 