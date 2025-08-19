export interface ITourPackage {
  _id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  startDate: string;
  endDate: string;
  included: string[];
  excluded: string[];
  amenities: string[];
  tourPlan: string[];
  division: string;
  tourType: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}
