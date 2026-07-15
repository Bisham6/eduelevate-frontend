export interface CollegeMedia {
  logo?: string;
  hero?: string;
  thumbnail?: string;
  gallery?: string[];
}

export interface CollegeLocation {
  city: string;
  state: string;
  country: string;
  address?: string;
}

export interface CollegeStats {
  avgFeesMin: number;
  avgFeesMax: number;
  avgPackage: number;
  highestPackage?: number;
  campusSize?: string;
  studentCount?: number;
  facultyCount?: number;
}

export interface College {
  _id: string;
  name: string;
  slug: string;
  shortName?: string;
  type?: string;
  established?: number;
  location: CollegeLocation;
  category: string;
  categorySlug?: string;
  nirfRank?: number;
  rating?: { average: number; count: number };
  media: CollegeMedia;
  stats: CollegeStats;
  infrastructure?: string[];
  about?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface CollegeFilters {
  search?: string;
  location?: string[];
  feesRange?: string;
  nirfRanking?: string[];
  specialization?: string[];
  category?: string;
  page?: number;
  limit?: number;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio';
  options: FilterOption[];
}
