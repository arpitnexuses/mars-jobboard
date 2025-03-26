import React from 'react';
import Link from 'next/link';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#383838] text-white py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="flex flex-col max-w-xs mx-auto md:mx-0">
            <div className="mb-8">
              <img 
                src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS-white-1.webp"
                alt="Mars Logo"
                className="h-32 object-contain mb-6"
              />
              <h3 className="text-2xl font-bold mb-3">Mars Job Board</h3>
              <p className="text-gray-400 text-lg">
                Empowering careers through innovative job matching technology.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Awards Section */}
          <div className="flex flex-col items-center justify-start col-span-1 mx-auto md:mx-0">
            <h3 className="text-2xl font-bold mb-10 text-center">Our Awards</h3>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="bg-white p-1.5 rounded flex items-center justify-center">
                <img 
                  src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/DISABILITY.png" 
                  alt="Disability Award" 
                  className="h-16 object-contain"
                />
              </div>
              <div className="bg-white p-1.5 rounded flex items-center justify-center">
                <img 
                  src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/NMSDC.png" 
                  alt="NMSDC Award" 
                  className="h-16 object-contain"
                />
              </div>
              <div className="bg-white p-1.5 rounded flex items-center justify-center">
                <img 
                  src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/BizTimesMedia-1.png" 
                  alt="BizTimes Media Award" 
                  className="h-16 object-contain"
                />
              </div>
              <div className="bg-white p-1.5 rounded flex items-center justify-center">
                <img 
                  src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/WBENC-1.png" 
                  alt="WBENC Award" 
                  className="h-16 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-end mx-auto md:mx-0">
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <ul className="space-y-3 text-right">
              <li className="text-gray-400 text-lg">123 Business Street</li>
              <li className="text-gray-400 text-lg">New York, NY 10001</li>
              <li className="text-gray-400 text-lg">contact@marsjobboard.com</li>
              <li className="text-gray-400 text-lg">(555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        {/* <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mars Job Board. All rights reserved.</p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer; 