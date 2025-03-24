import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';

export async function uploadFile(file: File, directory: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${originalName}`;

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', directory);
    await writeFile(join(uploadDir, filename), buffer);

    // Return the public URL
    return `/uploads/${directory}/${filename}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function handleFileUpload(request: NextRequest, fieldName: string, directory: string): Promise<string> {
  const formData = await request.formData();
  const file = formData.get(fieldName) as File;

  if (!file) {
    throw new Error(`No file uploaded for field: ${fieldName}`);
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.');
  }

  return uploadFile(file, directory);
} 