import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size should be less than 5MB' },
        { status: 400 }
      );
    }

    // Create unique filename
    const uniqueId = uuidv4();
    const filename = `${uniqueId}-${file.name}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    await writeFile(join(uploadsDir, filename), buffer);

    // Save resume metadata to database
    // TODO: Implement database storage for resume metadata
    // For now, we'll use a JSON file to store metadata
    const metadata = {
      id: uniqueId,
      filename,
      originalName: file.name,
      uploadDate: new Date().toISOString(),
      size: file.size,
      source: 'drop-resume' // This indicates it was uploaded through the Drop Your Resume feature
    };

    // Save metadata to a JSON file
    const metadataPath = join(uploadsDir, 'metadata.json');
    let existingMetadata = [];
    try {
      const existingData = await readFile(metadataPath, 'utf-8');
      existingMetadata = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
    }

    existingMetadata.push(metadata);
    await writeFile(metadataPath, JSON.stringify(existingMetadata, null, 2));

    return NextResponse.json({
      success: true,
      filename,
      message: 'Resume uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
} 