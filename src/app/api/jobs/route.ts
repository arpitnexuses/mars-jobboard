import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { Job as JobType } from '@/types';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Convert date strings to Date objects
    const jobData: Partial<JobType> = {
      ...body,
      datePosted: body.datePosted ? new Date(body.datePosted) : new Date(),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // Create new job
    const job = await Job.create(jobData);

    // Add the job schema to the page for Google indexing
    const script = `
      <script type="application/ld+json">
        ${JSON.stringify(jobData.schema)}
      </script>
    `;

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
    const jobs = await Job.find({}).sort({ datePosted: -1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
} 