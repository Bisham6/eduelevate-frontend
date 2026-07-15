export type ExamCategory = 'engineering' | 'medical' | 'management' | 'law' | 'civil_services';
export type ExamDifficulty = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type ExamMode = 'online' | 'offline' | 'hybrid';

export interface Exam {
  _id: string;
  name: string;
  slug: string;
  category: ExamCategory;
  registrationStart?: string;
  registrationEnd: string;
  examDate: string;
  resultDate?: string;
  difficulty: ExamDifficulty;
  examMode: ExamMode;
  targetInstitutes?: string;
  prepTip?: string;
  syllabusUrl?: string;
}

export interface ExamFilters {
  search?: string;
  category?: string[];
  difficulty?: string[];
  examMode?: string[];
  page?: number;
  limit?: number;
}
