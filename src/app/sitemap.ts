import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Job from '@/models/Job'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()
  
  // Get all jobs
  const jobs = await Job.find({}, '_id updatedAt').lean()
  
  const jobsUrls = jobs.map((job) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${job._id}`,
    lastModified: job.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...jobsUrls,
  ]
} 