import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    const filePath = join(uploadsDir, params.id);

    // Delete the file
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
} 