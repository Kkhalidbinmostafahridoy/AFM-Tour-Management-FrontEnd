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
  costFrom: number;
  maxGuest: number;
  departureLocation: string;
  arrivalLocation: string;
  minAge: number;
  price?: number;
  difficulty?: string;
}
