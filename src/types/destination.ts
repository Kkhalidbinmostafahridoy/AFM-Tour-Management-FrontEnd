export interface Division {
  _id: string;
  name: string;
}

export interface Destination {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  division?: Division;
  slug?: string;
  isActive?: boolean;
  tourCount?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DestinationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DestinationApiResponse {
  data: Destination[];
  pagination?: DestinationPagination;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DestinationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  division?: string;
  sort?: string;
}

export interface City {
  _id: string;
  name: string;
  country?: string;
  isActive?: boolean;
  image?: string;
  description?: string;
  createdAt?: string;
}

export interface CityApiResponse {
  data: City[];
}
