export interface Job {
  id: string;
  title: string;
  company: string;
  companyUrl: string;
  companyLogo: string;
  industry: string;
  type: string;
  location: {
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
  };
  datePosted: string;
  expiryDate: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  education: string;
  experience: string;
  salaryMin?: number;
  salaryMax?: number;
} 