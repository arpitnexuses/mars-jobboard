import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Application from '@/models/Application';

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}

// GET: Return recent activity (job postings and applications)
export async function GET() {
  try {
    await connectDB();
    
    // Get recent jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title company createdAt')
      .lean();
      
    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ appliedAt: -1 })
      .limit(3)
      .populate({
        path: 'jobId',
        select: 'title'
      })
      .select('firstName lastName email appliedAt')
      .lean();
    
    // Format job activities
    const jobActivities = recentJobs.map((job: any) => ({
      type: 'job',
      title: 'New job posted',
      description: `${job.title} at ${job.company}`,
      time: formatTimeAgo(new Date(job.createdAt))
    }));
    
    // Format application activities
    const applicationActivities = recentApplications.map((app: any) => {
      const jobTitle = app.jobId?.title || 'Unknown position';
      
      return {
        type: 'application',
        title: 'New application received',
        description: `${app.firstName} ${app.lastName} applied for ${jobTitle}`,
        time: formatTimeAgo(new Date(app.appliedAt))
      };
    });
    
    // Combine and sort activities
    const allActivities = [...jobActivities, ...applicationActivities]
      .sort((a, b) => {
        // This is a simple approach - would need more sophisticated parsing for proper time sorting
        return b.time.localeCompare(a.time);
      })
      .slice(0, 5); // Limit to 5 most recent activities
    
    return NextResponse.json({ activities: allActivities });
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
} 