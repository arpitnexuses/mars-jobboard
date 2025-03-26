'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';
import { Job } from '@/types';
import { LogOut, ArrowLeft } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (job: Job) => {
    try {
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

      // After successful submission, redirect to the job details page
      router.push(`/jobs/${data._id}`);
    } catch (error: any) {
      console.error('Error posting job:', error);
      alert(error.message || 'Failed to post job');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
        <JobPostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 