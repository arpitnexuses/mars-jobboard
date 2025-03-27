import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

// GET: Return the count of all jobs
export async function GET() {
  try {
    await connectDB();
    const count = await Job.countDocuments();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting job count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job count' },
      { status: 500 }
    );
  }
} 