import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, CollegeService, ExamService, LeadCaptureService } from '../../shared/services';
import { Category, College, Exam } from '../../shared/models';
import {
  AcademicCard,
  CategoryCard,
  SectionHeader,
  FaqAccordion,
  Skeleton,
} from '../../shared/components';
import type { FaqItem } from '../../shared/components';
import { ToastrService } from 'ngx-toastr';
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
export class Home implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly collegeService = inject(CollegeService);
  private readonly examService = inject(ExamService);
  private readonly compareStore = inject(CompareStore);
  private readonly router = inject(Router);
  private readonly leadCapture = inject(LeadCaptureService);
  private readonly toastr = inject(ToastrService);

  private typewriterTimer: ReturnType<typeof setTimeout> | null = null;

  private static readonly TYPE_DELAY_MS = 60;
  private static readonly PAUSE_MS = 2000;
  private static readonly ERASE_DELAY_MS = 40;

  protected readonly heroLine1Text = 'Find Your Perfect';
  protected readonly heroLine2Text = 'Academic Future';
  protected readonly heroLine1 = signal('');
  protected readonly heroLine2 = signal('');

  protected readonly categories = signal<Category[]>([]);
  protected readonly featuredColleges = signal<College[]>([]);
  protected readonly upcomingExams = signal<Exam[]>([]);
  protected readonly loadingCategories = signal(true);
  protected readonly loadingFeatured = signal(true);
  protected readonly loadingExams = signal(true);

  protected searchQuery = '';
  protected searchLocation = '';
  protected readonly heroImageUrl = 'assets/images/hero-students-library.png';

  protected readonly popularTags = ['IIT Bombay', 'MBA Admissions', 'NEET 2026', 'JEE Main'];

  protected readonly scholarships = [
    { name: 'Merit Scholarship', amount: 'Up to ₹1.75 Lakhs', verify: true },
    { name: 'National Talent Search', amount: 'Up to ₹80,000/yr', verify: true },
    { name: 'State Engineering Grant', amount: 'Up to ₹50,000/yr', verify: false },
  ];

  protected readonly globalHubs = [
    { country: 'USA', universities: 4500, image: 'assets/images/study-abroad/usa.jpg' },
    { country: 'UK', universities: 160, image: 'assets/images/study-abroad/uk.jpg' },
    { country: 'Canada', universities: 220, image: 'assets/images/study-abroad/canada.jpg' },
    { country: 'Australia', universities: 180, image: 'assets/images/study-abroad/australia.jpg' },
  ];

  protected readonly testimonials = [
    {
      name: 'Priya Sharma',
      role: 'B.Tech, IIT Delhi',
      photo: 'assets/images/testimonials/priya.jpg',
      text: 'CollegeChuniye helped me compare colleges and find the perfect fit. The detailed fee and placement data made my decision easy.',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'MBA, IIM Ahmedabad',
      photo: 'assets/images/testimonials/arjun.jpg',
      text: 'The exam tracker kept me on schedule for CAT preparation. Highly recommend for anyone planning higher education.',
      rating: 5,
    },
  ];

  protected readonly faqItems: FaqItem[] = [
    {
      question: 'How does CollegeChuniye help in college selection?',
      answer: 'CollegeChuniye provides comprehensive data on colleges including NIRF rankings, fees, placements, and reviews to help you make informed decisions.',
    },
    {
      question: 'Is the information on CollegeChuniye verified?',
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
    this.startTypewriter();

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

  ngOnDestroy(): void {
    this.clearTypewriterTimer();
  }

  private startTypewriter(): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.heroLine1.set(this.heroLine1Text);
      this.heroLine2.set(this.heroLine2Text);
      return;
    }

    this.heroLine1.set('');
    this.heroLine2.set('');
    this.scheduleTypewriter('typing1', Home.TYPE_DELAY_MS);
  }

  private scheduleTypewriter(
    phase: 'typing1' | 'typing2' | 'pause' | 'erasing2' | 'erasing1',
    delayMs: number,
  ): void {
    this.clearTypewriterTimer();
    this.typewriterTimer = setTimeout(() => this.runTypewriterPhase(phase), delayMs);
  }

  private runTypewriterPhase(phase: 'typing1' | 'typing2' | 'pause' | 'erasing2' | 'erasing1'): void {
    switch (phase) {
      case 'typing1': {
        const current = this.heroLine1();
        if (current.length < this.heroLine1Text.length) {
          this.heroLine1.set(this.heroLine1Text.slice(0, current.length + 1));
          this.scheduleTypewriter('typing1', Home.TYPE_DELAY_MS);
        } else {
          this.scheduleTypewriter('typing2', Home.TYPE_DELAY_MS);
        }
        break;
      }
      case 'typing2': {
        const current = this.heroLine2();
        if (current.length < this.heroLine2Text.length) {
          this.heroLine2.set(this.heroLine2Text.slice(0, current.length + 1));
          this.scheduleTypewriter('typing2', Home.TYPE_DELAY_MS);
        } else {
          this.scheduleTypewriter('pause', Home.PAUSE_MS);
        }
        break;
      }
      case 'pause':
        this.scheduleTypewriter('erasing2', Home.ERASE_DELAY_MS);
        break;
      case 'erasing2': {
        const current = this.heroLine2();
        if (current.length > 0) {
          this.heroLine2.set(current.slice(0, -1));
          this.scheduleTypewriter('erasing2', Home.ERASE_DELAY_MS);
        } else {
          this.scheduleTypewriter('erasing1', Home.ERASE_DELAY_MS);
        }
        break;
      }
      case 'erasing1': {
        const current = this.heroLine1();
        if (current.length > 0) {
          this.heroLine1.set(current.slice(0, -1));
          this.scheduleTypewriter('erasing1', Home.ERASE_DELAY_MS);
        } else {
          this.scheduleTypewriter('typing1', Home.TYPE_DELAY_MS);
        }
        break;
      }
    }
  }

  private clearTypewriterTimer(): void {
    if (this.typewriterTimer !== null) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  protected onHeroSearch(): void {
    this.router.navigate(['/colleges'], {
      queryParams: {
        search: this.searchQuery || undefined,
        location: this.searchLocation || undefined,
      },
    });
  }

  protected onGetExpertGuidance(): void {
    this.leadCapture.open({ source: 'inquiry_form' });
  }

  protected onStudyAbroadHubClick(): void {
    this.toastr.info('Coming soon...');
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
