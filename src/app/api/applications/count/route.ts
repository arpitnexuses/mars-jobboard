import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Application from '@/models/Application';

// GET: Return the count of all applications
export async function GET() {
  try {
    await connectDB();
    const count = await Application.countDocuments();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting application count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application count' },
      { status: 500 }
    );
  }
} 