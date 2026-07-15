import { PaginatedResponse } from './api.model';

export type CourseCategorySlug = 'engineering' | 'medical' | 'management' | 'law' | 'design';
export type CourseDemandStatus = 'high_demand' | 'professional' | 'rising_star';
export type CourseMode = 'online' | 'offline' | 'hybrid';

export interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: CourseCategorySlug;
  duration: string;
  avgSalary: string;
  avgSalaryMin: number;
  demandStatus: CourseDemandStatus;
  description: string;
  about?: string;
  careerPaths: string[];
  mode: CourseMode;
  budgetRange?: string;
  popularityRank?: number;
  locations: string[];
  icon: string;
  eligibility?: string;
  admissionProcess?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface CourseFilters {
  search?: string;
  category?: string[];
  location?: string[];
  budgetRange?: string;
  ranking?: string[];
  mode?: string[];
  page?: number;
  limit?: number;
}

export type CoursePaginatedResponse = PaginatedResponse<Course>;
