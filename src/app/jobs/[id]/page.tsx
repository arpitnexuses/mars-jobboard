'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Building2, Briefcase, Globe, Bookmark, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Job } from '@/types';
import JobApplicationForm from '@/components/JobApplicationForm';
import { NextPage } from 'next';
import Script from 'next/script';

type TabType = 'description' | 'responsibilities' | 'qualifications';

type PageParams = {
  id: string;
};

export default function JobDetailsPage({ params }: { params: PageParams }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show the header apply button after scrolling down 300px
      setShowHeaderForm(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    try {
      const jobUrl = `${window.location.origin}/jobs/${params.id}`;
      await navigator.clipboard.writeText(jobUrl);
      setShowShareAlert(true);
      setTimeout(() => setShowShareAlert(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
    <>
      <Script
        id="jobPosting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": job.title,
            "description": job.description,
            "datePosted": job.datePosted,
            "validThrough": job.expiryDate,
            "employmentType": job.type,
            "hiringOrganization": {
              "@type": "Organization",
              "name": job.company,
              "sameAs": job.companyUrl,
              "logo": job.companyLogo
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": job.location.street,
                "addressLocality": job.location.city,
                "addressRegion": job.location.state,
                "postalCode": job.location.zipCode,
                "addressCountry": job.location.country
              }
            },
            "industry": job.industry,
            "educationRequirements": job.education,
            "experienceRequirements": job.experience,
            "qualifications": job.qualifications?.join("\n"),
            "responsibilities": job.responsibilities?.join("\n"),
            ...(job.salaryMin || job.salaryMax ? {
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": {
                  "@type": "QuantitativeValue",
                  ...(job.salaryMin && { "minValue": job.salaryMin }),
                  ...(job.salaryMax && { "maxValue": job.salaryMax }),
                  "unitText": "YEAR"
                }
              }
            } : {}),
            "identifier": {
              "@type": "PropertyValue",
              "name": job.company,
              "value": job._id
            }
          })
        }}
      />
      <div className="min-h-screen bg-gray-50">
        {showShareAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            Link copied successfully!
          </div>
        )}

        {/* Fixed Header Apply Button */}
        {showHeaderForm && job && (
          <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-100 transition-all transform translate-y-0 animate-slide-down">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location.city}, {job.location.state}</p>
              </div>
              <button 
                onClick={() => setIsApplicationFormOpen(true)}
                className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to all jobs
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 lg:p-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                    <span className="text-base sm:text-lg text-gray-900">{job.company}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-sm">{job.type}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                      <span>{job.location.city}, {job.location.state}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                      <span>Posted {formatDate(job.datePosted)}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                      <span>Expires {formatDate(job.expiryDate)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button 
                      onClick={() => setIsApplicationFormOpen(true)}
                      className="flex-1 sm:flex-none bg-black text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex-1 sm:flex-none bg-white text-gray-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100">
                  <div className="flex overflow-x-auto border-b border-gray-100">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`px-4 sm:px-8 py-3 sm:py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                        activeTab === 'description' 
                          ? 'text-gray-900 bg-gray-50' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Description
                      {activeTab === 'description' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('responsibilities')}
                      className={`px-8 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === 'responsibilities' 
                          ? 'text-gray-900 bg-gray-50' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Responsibilities
                      {activeTab === 'responsibilities' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('qualifications')}
                      className={`px-8 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === 'qualifications' 
                          ? 'text-gray-900 bg-gray-50' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Qualifications
                      {activeTab === 'qualifications' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                      )}
                    </button>
                  </div>

                  <div className="p-8 bg-gray-50">
                    {activeTab === 'description' && (
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                        
                        <div className="mt-8">
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Education & Experience</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                              <p className="text-gray-600">{job.education}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
                              <p className="text-gray-600">{job.experience}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'responsibilities' && job.responsibilities && (
                      <ul className="space-y-3">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-400"></span>
                            <span className="text-gray-600 leading-relaxed">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === 'qualifications' && job.qualifications && (
                      <ul className="space-y-3">
                        {job.qualifications.map((qualification, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-gray-400"></span>
                            <span className="text-gray-600 leading-relaxed">{qualification}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
                
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.company}</h3>
                    <p className="text-gray-500 text-sm">Business Consulting and services</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <a 
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
                  >
                    <Globe className="h-5 w-5 text-gray-400" />
                    {job.companyUrl.replace('https://', '')}
                  </a>
                  <div className="text-gray-600 flex items-start gap-2 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{job.location.street}</p>
                      <p>{job.location.city}, {job.location.state} {job.location.zipCode}</p>
                      <p>{job.location.country}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.open(job.companyUrl, '_blank')}
                  className="w-full mt-6 text-gray-700 px-6 py-2.5 rounded text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  View Company Profile
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Application Form Modal */}
        {job && (
          <JobApplicationForm 
            jobId={params.id}
            jobTitle={job.title}
            isOpen={isApplicationFormOpen}
            onClose={() => setIsApplicationFormOpen(false)}
          />
        )}
      </div>
    </>
  );
} 