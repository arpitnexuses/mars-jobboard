"use client"

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Briefcase, User, FileText, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#1B1B3A] to-[#2B2B5A] shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="flex flex-col h-full">
          <Link href="/dashboard" className="p-6 flex flex-col items-center border-b border-white/10">
            <div className="relative w-32 h-32 mb-1">
              <Image
                src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS-white-1.webp"
                alt="Mars Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-white/60 tracking-wider uppercase">Job Portal</span>
            </div>
          </Link>
          
          <nav className="flex-1 p-6">
            <Link
              href="/dashboard"
              className={`flex items-center px-5 py-4 text-white/90 rounded-xl transition-all duration-200 group ${pathname === '/dashboard' ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3 text-purple-400 group-hover:text-purple-300" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              href="/dashboard/post-job"
              className={`flex items-center mt-3 px-5 py-4 text-white/90 rounded-xl transition-all duration-200 group ${pathname.includes('/dashboard/post-job') ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <Briefcase className="h-5 w-5 mr-3 text-red-400 group-hover:text-red-300" />
              <span className="font-medium">Post a Job</span>
            </Link>
            
            <Link
              href="/dashboard/posted-jobs"
              className={`flex items-center mt-3 px-5 py-4 text-white/90 rounded-xl transition-all duration-200 group ${pathname.includes('/dashboard/posted-jobs') ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <Briefcase className="h-5 w-5 mr-3 text-blue-400 group-hover:text-blue-300" />
              <span className="font-medium">Posted Jobs</span>
            </Link>
            
            <Link
              href="/dashboard/applications"
              className={`flex items-center mt-3 px-5 py-4 text-white/90 rounded-xl transition-all duration-200 group ${pathname.includes('/dashboard/applications') ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <FileText className="h-5 w-5 mr-3 text-green-400 group-hover:text-green-300" />
              <span className="font-medium whitespace-nowrap">Application Submitted</span>
            </Link>

            <Link
              href="/dashboard/resumes"
              className={`flex items-center mt-3 px-5 py-4 text-white/90 rounded-xl transition-all duration-200 group ${pathname.includes('/dashboard/resumes') ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <FileText className="h-5 w-5 mr-3 text-purple-400 group-hover:text-purple-300" />
              <span className="font-medium">Uploaded Resumes</span>
            </Link>
          </nav>
          
          <div className="p-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-5 py-4 text-white/80 hover:bg-white/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 mr-3 group-hover:text-red-400" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72">
        <div className="min-h-screen bg-white">
          <div className="py-10 px-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 