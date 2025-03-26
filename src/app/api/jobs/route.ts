import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { Job as JobType } from '@/types';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Remove any ID-related fields from the request data
    const { _id, id, ...jobData } = body;

    // Convert date strings to Date objects
    const jobToCreate = {
      ...jobData,
      datePosted: jobData.datePosted ? new Date(jobData.datePosted) : new Date(),
      expiryDate: jobData.expiryDate ? new Date(jobData.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // Create new job using insertOne to have more control
    const result = await Job.collection.insertOne(jobToCreate);
    
    // Fetch the created job
    const job = await Job.findById(result.insertedId);

    if (!job) {
      throw new Error('Failed to create job');
    }

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    console.error('Error creating job:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A job with this ID already exists' },
        { status: 409 }
      );
    }

    // Handle validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const jobs = await Job.find({})
      .sort({ datePosted: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 