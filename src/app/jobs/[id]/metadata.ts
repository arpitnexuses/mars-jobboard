import { Metadata } from 'next';

type PageParams = {
  id: string;
};

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`);
    const job = await response.json();

    if (!job) {
      return {
        title: 'Job Not Found',
        description: 'The requested job posting could not be found.'
      };
    }

    return {
      title: `${job.title} at ${job.company}`,
      description: job.description,
      openGraph: {
        title: `${job.title} at ${job.company}`,
        description: job.description,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Job Details',
      description: 'View job details and apply'
    };
  }
} 