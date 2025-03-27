'use client';

import { Plus, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-32 h-32 mr-6 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS/MARS-1%20(1).png"
                  alt="Mars Logo"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A9282B] via-[#A9282B] to-[#A9282B] bg-clip-text text-transparent tracking-tight">
                Job Board
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard"
                  className="group inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A9282B]/0 via-[#A9282B]/20 to-[#A9282B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="h-5 w-5 mr-2 relative" />
                  <span className="relative text-white">Dashboard</span>
                </Link>
                {/* <button
                  onClick={handleLogout}
                  className="group inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:border-red-200 hover:shadow-md"
                >
                  <LogOut className="h-5 w-5 mr-2 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                  <span className="group-hover:text-red-600 transition-colors duration-300">Logout</span>
                </button> */}
              </>
            ) : (
              <Link 
                href="/login"
                className="group inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="h-5 w-5 mr-2 relative" />
                <span className="relative">Post a Job</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 