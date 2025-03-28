import { NextResponse } from 'next/server';
import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';

interface ResumeMetadata {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  size: number;
  source: string;
}

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    
    // Read metadata file
    const metadataPath = join(uploadsDir, 'metadata.json');
    let metadata: ResumeMetadata[] = [];
    try {
      const metadataContent = await readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    } catch (error) {
      // If metadata file doesn't exist or is invalid, return empty array
      return NextResponse.json([]);
    }

    // Filter only resumes uploaded through Drop Your Resume feature
    const dropResumes = metadata.filter((resume: ResumeMetadata) => resume.source === 'drop-resume');

    // Sort by upload date (newest first)
    dropResumes.sort((a: ResumeMetadata, b: ResumeMetadata) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return NextResponse.json(dropResumes);
  } catch (error: any) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
} 