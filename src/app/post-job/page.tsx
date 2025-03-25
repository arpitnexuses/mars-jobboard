'use client';

import { useRouter } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';
import { Job } from '@/types';

export default function PostJobPage() {
  const router = useRouter();

  const handleSubmit = async (job: Job) => {
    // After successful submission, redirect to the job details page
    router.push(`/jobs/${job._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <JobPostForm
            isOpen={true}
            onClose={() => router.push('/')}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
} 