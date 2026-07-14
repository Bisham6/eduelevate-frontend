import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, CollegeService, ExamService } from '../../shared/services';
import { Category, College, Exam } from '../../shared/models';
import {
  AcademicCard,
  CategoryCard,
  SectionHeader,
  FaqAccordion,
  Skeleton,
} from '../../shared/components';
import type { FaqItem } from '../../shared/components';
import { CompareStore } from '../../shared/stores/compare.store';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule,
    AcademicCard,
    CategoryCard,
    SectionHeader,
    FaqAccordion,
    Skeleton,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly collegeService = inject(CollegeService);
  private readonly examService = inject(ExamService);
  private readonly compareStore = inject(CompareStore);
  private readonly router = inject(Router);

  protected readonly categories = signal<Category[]>([]);
  protected readonly featuredColleges = signal<College[]>([]);
  protected readonly upcomingExams = signal<Exam[]>([]);
  protected readonly loadingCategories = signal(true);
  protected readonly loadingFeatured = signal(true);
  protected readonly loadingExams = signal(true);

  protected searchQuery = '';
  protected searchLocation = '';

  protected readonly popularTags = ['IIT Bombay', 'MBA Admissions', 'NEET 2026', 'JEE Main'];

  protected readonly scholarships = [
    { name: 'Merit Scholarship', amount: 'Up to ₹1.75 Lakhs', verify: true },
    { name: 'National Talent Search', amount: 'Up to ₹80,000/yr', verify: true },
    { name: 'State Engineering Grant', amount: 'Up to ₹50,000/yr', verify: false },
  ];

  protected readonly globalHubs = [
    { country: 'USA', universities: 4500, image: 'https://images.unsplash.com/photo-1485738422979-f2995cc9fd98?w=600&h=900&fit=crop' },
    { country: 'UK', universities: 160, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=900&fit=crop' },
    { country: 'Canada', universities: 220, image: 'https://images.unsplash.com/photo-1517935708355-2067221dddeb?w=600&h=900&fit=crop' },
    { country: 'Australia', universities: 180, image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=900&fit=crop' },
  ];

  protected readonly testimonials = [
    {
      name: 'Priya Sharma',
      role: 'B.Tech, IIT Delhi',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'EduElevate helped me compare colleges and find the perfect fit. The detailed fee and placement data made my decision easy.',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'MBA, IIM Ahmedabad',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'The exam tracker kept me on schedule for CAT preparation. Highly recommend for anyone planning higher education.',
      rating: 5,
    },
  ];

  protected readonly faqItems: FaqItem[] = [
    {
      question: 'How does EduElevate help in college selection?',
      answer: 'EduElevate provides comprehensive data on colleges including NIRF rankings, fees, placements, and reviews to help you make informed decisions.',
    },
    {
      question: 'Is the information on EduElevate verified?',
      answer: 'Yes, our content is AI-verified and regularly updated from official college websites and government sources.',
    },
    {
      question: 'Can I compare multiple colleges at once?',
      answer: 'You can compare up to 3 colleges side-by-side on metrics like fees, packages, NIRF rank, and infrastructure.',
    },
    {
      question: 'How do I track entrance exam dates?',
      answer: 'Visit our Exams section to see registration deadlines, exam dates, and prep tips for all major competitive exams.',
    },
  ];

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });

    this.collegeService.getFeatured(3).subscribe({
      next: (data) => {
        this.featuredColleges.set(data);
        this.loadingFeatured.set(false);
      },
      error: () => this.loadingFeatured.set(false),
    });

    this.examService.getUpcoming(4).subscribe({
      next: (data) => {
        this.upcomingExams.set(data);
        this.loadingExams.set(false);
      },
      error: () => this.loadingExams.set(false),
    });
  }

  protected onHeroSearch(): void {
    this.router.navigate(['/colleges'], {
      queryParams: {
        search: this.searchQuery || undefined,
        location: this.searchLocation || undefined,
      },
    });
  }

  protected onCompare(college: College): void {
    if (this.compareStore.add(college._id)) {
      this.router.navigate(['/compare']);
    }
  }

  protected formatExamDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}
