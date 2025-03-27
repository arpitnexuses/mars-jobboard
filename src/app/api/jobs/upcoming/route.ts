import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

// GET: Return jobs with upcoming deadlines
export async function GET() {
  try {
    await connectDB();
    
    // Get current date
    const now = new Date();
    
    // Find jobs with expiry date in the future, sorted by closest expiry date first
    const jobs = await Job.find({ 
      expiryDate: { $gte: now } 
    })
    .sort({ expiryDate: 1 })
    .limit(5)
    .select('title expiryDate')
    .lean();
    
    // Calculate days left for each job
    const jobsWithDaysLeft = jobs.map((job: any) => {
      const expiryDate = new Date(job.expiryDate);
      const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        id: job._id.toString(),
        title: job.title,
        daysLeft: diffDays
      };
    });
    
    return NextResponse.json({ jobs: jobsWithDaysLeft });
  } catch (error) {
    console.error('Error getting upcoming jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming jobs' },
      { status: 500 }
    );
  }
} 