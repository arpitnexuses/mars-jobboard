'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Trash2, AlertCircle, Search, Eye } from 'lucide-react';

interface Resume {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  size: number;
}

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchResumes();
    }
  }, [router]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/resumes');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resumes');
      }
      
      setResumes(data);
      setFilteredResumes(data);
    } catch (error: any) {
      console.error('Error fetching resumes:', error);
      setError(error.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumes.length > 0) {
      const filtered = resumes.filter(resume => 
        resume.originalName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResumes(filtered);
    }
  }, [searchQuery, resumes]);

  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/resumes/download/${filename}`);
      if (!response.ok) throw new Error('Failed to download resume');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      setError(error.message || 'Failed to download resume');
    }
  };

  const handleView = (filename: string) => {
    // Open resume in new tab
    window.open(`/uploads/resumes/${filename}`, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      setResumes(resumes.filter(resume => resume.id !== id));
      setFilteredResumes(filteredResumes.filter(resume => resume.id !== id));
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      setError(error.message || 'Failed to delete resume');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Uploaded Resumes</h1>
          <p className="text-gray-500">Manage and review submitted resumes</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Resumes Found</h2>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search' : 'No resumes have been uploaded yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{resume.originalName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(resume.size)} • Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(resume.filename)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title="View Resume"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(resume.filename)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title="Download Resume"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title="Delete Resume"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 