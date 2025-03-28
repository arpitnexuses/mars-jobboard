'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Calendar,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Define types for our dashboard data
interface Activity {
  type: 'application' | 'job';
  title: string;
  description: string;
  time: string;
}

interface UpcomingJob {
  id: string;
  title: string;
  daysLeft: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [uploadedResumeCount, setUploadedResumeCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingJobs, setUpcomingJobs] = useState<UpcomingJob[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs count
      const jobsResponse = await fetch('/api/jobs/count');
      const jobsData = await jobsResponse.json();
      
      // Fetch applications count
      const applicationsResponse = await fetch('/api/applications/count');
      const applicationsData = await applicationsResponse.json();
      
      // Fetch uploaded resumes count
      const resumesResponse = await fetch('/api/resumes');
      const resumesData = await resumesResponse.json();
      
      // Fetch upcoming deadlines (jobs expiring soon)
      const upcomingResponse = await fetch('/api/jobs/upcoming');
      const upcomingData = await upcomingResponse.json();
      
      // Fetch recent activity
      const activityResponse = await fetch('/api/activity/recent');
      const activityData = await activityResponse.json();
      
      setJobCount(jobsData.count || 0);
      setApplicationCount(applicationsData.count || 0);
      setUploadedResumeCount(resumesData.length || 0);
      setUpcomingJobs(upcomingData.jobs || []);
      setRecentActivity(activityData.activities || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to minimal data if API fails
      setJobCount(0);
      setApplicationCount(0);
      setUploadedResumeCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-center pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your job board overview</p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs Posted Metric */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Jobs Posted</h2>
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{jobCount}</p>
              )}
            </div>
          </div>
          <Link 
            href="/dashboard/posted-jobs" 
            className="block py-3 px-6 bg-gray-50 border-t border-gray-100 text-sm font-medium text-indigo-600 hover:bg-gray-100"
          >
            <div className="flex items-center justify-between">
              <span>View all jobs</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Applications Received Metric */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Applications Received</h2>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{applicationCount}</p>
              )}
            </div>
          </div>
          <Link 
            href="/dashboard/applications" 
            className="block py-3 px-6 bg-gray-50 border-t border-gray-100 text-sm font-medium text-green-600 hover:bg-gray-100"
          >
            <div className="flex items-center justify-between">
              <span>View all applications</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Uploaded Resumes Metric */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Uploaded Resumes</h2>
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{uploadedResumeCount}</p>
              )}
            </div>
          </div>
          <Link 
            href="/dashboard/resumes" 
            className="block py-3 px-6 bg-gray-50 border-t border-gray-100 text-sm font-medium text-purple-600 hover:bg-gray-100"
          >
            <div className="flex items-center justify-between">
              <span>View all resumes</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/dashboard/post-job"
            className="relative group p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-900">Post a New Job</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new job listing</p>
          </Link>
          
          <Link 
            href="/dashboard/applications"
            className="relative group p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Review Applications</h3>
            <p className="text-sm text-gray-500 mt-1">Manage candidate submissions</p>
          </Link>
          
          <Link 
            href="/dashboard/posted-jobs"
            className="relative group p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Manage Jobs</h3>
            <p className="text-sm text-gray-500 mt-1">Edit or update existing jobs</p>
          </Link>

          <Link 
            href="/dashboard/resumes"
            className="relative group p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">View Resumes</h3>
            <p className="text-sm text-gray-500 mt-1">Check uploaded resumes</p>
          </Link>
        </div>
      </div>
      
      {/* Activity & Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <div className={`h-10 w-10 rounded-full ${activity.type === 'application' ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center mr-4 flex-shrink-0`}>
                    {activity.type === 'application' ? (
                      <FileText className="h-5 w-5 text-green-600" />
                    ) : (
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Your recent job postings and application activities will appear here.
              </p>
            </div>
          )}
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              <Calendar className="h-4 w-4 inline mr-1" />
              <span>Calendar</span>
            </button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : upcomingJobs.length > 0 ? (
            <div className="space-y-4">
              {upcomingJobs.map((job, index) => {
                // Determine color based on urgency
                let colorClasses = "border-green-100 bg-green-50 hover:bg-green-100/50";
                if (job.daysLeft <= 3) {
                  colorClasses = "border-red-100 bg-red-50 hover:bg-red-100/50";
                } else if (job.daysLeft <= 7) {
                  colorClasses = "border-amber-100 bg-amber-50 hover:bg-amber-100/50";
                }
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${colorClasses} transition-colors duration-150`}>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                        <Clock className={`h-4 w-4 ${job.daysLeft <= 3 ? 'text-red-600' : job.daysLeft <= 7 ? 'text-amber-600' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {job.daysLeft <= 0 
                            ? 'Expired' 
                            : job.daysLeft === 1 
                              ? 'Expires tomorrow' 
                              : `Expires in ${job.daysLeft} days`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-1">No upcoming deadlines</h3>
              <p className="text-sm text-gray-500">
                Jobs with upcoming expiry dates will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 