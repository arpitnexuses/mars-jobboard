import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    const filePath = join(uploadsDir, params.filename);

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Get the original filename (remove UUID prefix)
    const originalName = params.filename.split('-').slice(1).join('-');

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${originalName}"`,
      },
    });
  } catch (error: any) {
    console.error('Error downloading resume:', error);
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
} 