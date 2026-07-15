import { HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { SKIP_LOADER } from '../../core/interceptors/skip-loader.context';
import { CollegeService } from './college.service';
import { CourseService } from './course.service';
import { ExamService } from './exam.service';

export type SearchSuggestMode = 'colleges' | 'courses' | 'exams';

export interface SearchSuggestion {
  id: string;
  label: string;
  subtitle?: string;
  path: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class SearchSuggestService {
  private readonly collegeService = inject(CollegeService);
  private readonly courseService = inject(CourseService);
  private readonly examService = inject(ExamService);

  private readonly skipLoaderContext = new HttpContext().set(SKIP_LOADER, true);

  private static readonly MIN_QUERY_LENGTH = 2;
  private static readonly SUGGESTION_LIMIT = 5;

  suggest(mode: SearchSuggestMode, query: string): Observable<SearchSuggestion[]> {
    const trimmed = query.trim();
    if (trimmed.length < SearchSuggestService.MIN_QUERY_LENGTH) {
      return of([]);
    }

    switch (mode) {
      case 'colleges':
        return this.collegeService
          .getColleges({ search: trimmed, limit: SearchSuggestService.SUGGESTION_LIMIT }, this.skipLoaderContext)
          .pipe(
            map((res) =>
              res.data.map((college) => ({
                id: college._id,
                label: college.shortName || college.name,
                subtitle: `${college.location.city}, ${college.location.state}`,
                path: `/colleges/${college.slug}`,
                icon: 'school',
              })),
            ),
          );
      case 'courses':
        return this.courseService
          .getCourses({ search: trimmed, limit: SearchSuggestService.SUGGESTION_LIMIT }, this.skipLoaderContext)
          .pipe(
            map((res) =>
              res.data.map((course) => ({
                id: course._id,
                label: course.title,
                subtitle: course.category,
                path: `/courses/${course.slug}`,
                icon: 'menu_book',
              })),
            ),
          );
      case 'exams':
        return this.examService
          .getExams({ search: trimmed, limit: SearchSuggestService.SUGGESTION_LIMIT }, this.skipLoaderContext)
          .pipe(
            map((res) =>
              res.data.map((exam) => ({
                id: exam._id,
                label: exam.name,
                subtitle: exam.category.replace('_', ' '),
                path: `/exams?search=${encodeURIComponent(exam.name)}`,
                icon: 'edit_note',
              })),
            ),
          );
    }
  }
}
