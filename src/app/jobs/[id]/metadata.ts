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
        images: [
          {
            url: job.companyLogo,
            width: 800,
            height: 600,
            alt: `${job.company} logo`
          }
        ],
        locale: 'en_US',
        siteName: 'Mars Job Board'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.title} at ${job.company}`,
        description: job.description,
        images: [job.companyLogo],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${params.id}`
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Job Details',
      description: 'View job details and apply'
    };
  }
} 