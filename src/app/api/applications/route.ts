import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { sendJobApplicationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // Handle file upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    await writeFile(join(uploadDir, filename), buffer);
    const resumeUrl = `/uploads/resumes/${filename}`;
    
    // Convert FormData to a plain object
    const applicationData = {
      jobId: formData.get('jobId'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      experience: formData.get('experience'),
      education: formData.get('education'),
      coverLetter: formData.get('coverLetter'),
      resume: resumeUrl,
      appliedAt: new Date(),
    };

    // Validate required fields
    if (!applicationData.jobId || !applicationData.firstName || !applicationData.lastName || 
        !applicationData.email || !applicationData.phone || !applicationData.experience || 
        !applicationData.education || !applicationData.coverLetter || !applicationData.resume) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();
    
    // Get the mongoose model for applications
    const Application = (await import('@/models/Application')).default;
    
    // Create and save the application
    const application = new Application(applicationData);
    const result = await application.save();

    // Get job details for email
    const Job = (await import('@/models/Job')).default;
    const job = await Job.findById(applicationData.jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    // Send email notification
    await sendJobApplicationEmail({
      jobTitle: job.title,
      firstName: applicationData.firstName as string,
      lastName: applicationData.lastName as string,
      email: applicationData.email as string,
      phone: applicationData.phone as string,
      experience: applicationData.experience as string,
      education: applicationData.education as string,
      coverLetter: applicationData.coverLetter as string,
      resumeUrl: applicationData.resume as string,
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', id: result._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit application' },
      { status: 500 }
    );
  }
} 