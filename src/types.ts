export interface Job {
  _id?: string; // MongoDB's _id
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
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  education: string;
  experience: string;
  datePosted: Date | string;
  expiryDate: Date | string;
  schema?: any;
  createdAt?: Date;
  updatedAt?: Date;
}