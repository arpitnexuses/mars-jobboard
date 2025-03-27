import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Remove any ID-related fields from the request data
    const { _id, id, ...jobData } = body;
    
    // Convert date strings to Date objects
    const jobToUpdate = {
      ...jobData,
      datePosted: jobData.datePosted ? new Date(jobData.datePosted) : new Date(),
      expiryDate: jobData.expiryDate ? new Date(jobData.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const updatedJob = await Job.findByIdAndUpdate(
      params.id, 
      jobToUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedJob);
  } catch (error: any) {
    console.error('Error updating job:', error);
    
    // Handle validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update job', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const job = await Job.findByIdAndDelete(params.id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 