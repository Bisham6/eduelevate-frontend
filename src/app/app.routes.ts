import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { adminGuestGuard } from './core/guards/admin-guest.guard';

const SEO = {
  home: {
    title: 'Find Your Perfect Academic Future',
    description:
      'Discover 10,000+ colleges, compare institutions, track entrance exams, and plan your education journey with CollegeChuniye.',
    keywords: 'colleges, engineering, medical, MBA, entrance exams, NIRF ranking, India',
  },
  colleges: {
    title: 'Top Colleges in India',
    description:
      'Browse and filter top colleges by location, fees, NIRF ranking, and specialization on CollegeChuniye.',
    keywords: 'college listing, engineering colleges, NIRF, fees, placements',
  },
  collegeDetail: {
    title: 'College Details',
    description: 'View college details, fees, placements, infrastructure, and apply on CollegeChuniye.',
  },
  compare: {
    title: 'Compare Colleges',
    description: 'Compare up to 3 colleges side-by-side on fees, NIRF rank, packages, and infrastructure.',
  },
  exams: {
    title: 'Entrance Exams',
    description: 'Track JEE, NEET, CAT, CLAT and other entrance exam dates, registration deadlines, and prep tips.',
    keywords: 'JEE, NEET, CAT, entrance exams, registration dates',
  },
  courses: {
    title: 'Explore Trending Courses',
    description: 'Browse UG, PG, and professional courses across Engineering, Medical, MBA, Law, and Design on CollegeChuniye.',
    keywords: 'courses, B.Tech, MBBS, MBA, career paths, salary',
  },
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'CollegeChuniye — Find Your Perfect Academic Future',
        data: { seo: SEO.home },
      },
      {
        path: 'colleges',
        loadComponent: () =>
          import('./features/colleges/college-listing/college-listing').then((m) => m.CollegeListing),
        title: 'Top Colleges — CollegeChuniye',
        data: { seo: SEO.colleges },
      },
      {
        path: 'colleges/:slug',
        loadComponent: () =>
          import('./features/colleges/college-detail/college-detail').then((m) => m.CollegeDetail),
        title: 'College Details — CollegeChuniye',
        data: { seo: SEO.collegeDetail },
      },
      {
        path: 'compare',
        loadComponent: () =>
          import('./features/colleges/compare-colleges/compare-colleges').then((m) => m.CompareColleges),
        title: 'Compare Colleges — CollegeChuniye',
        data: { seo: SEO.compare },
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/exams/exams').then((m) => m.Exams),
        title: 'Entrance Exams — CollegeChuniye',
        data: { seo: SEO.exams },
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/courses/course-listing/course-listing').then((m) => m.CourseListing),
        title: 'Courses — CollegeChuniye',
        data: { seo: SEO.courses },
      },
      {
        path: 'courses/:slug',
        loadComponent: () =>
          import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
        title: 'Course Details — CollegeChuniye',
        data: { seo: { title: 'Course Details', description: 'View course details, career paths, and eligibility on CollegeChuniye.' } },
      },
      {
        path: 'study-abroad',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Study Abroad — CollegeChuniye',
        data: {
          seo: {
            title: 'Study Abroad',
            description: 'Explore universities in USA, UK, Canada, Australia and plan your global education.',
          },
        },
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Dashboard — CollegeChuniye',
        data: { seo: { title: 'Student Dashboard', description: 'Manage your applications and profile.' } },
      },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [adminGuestGuard],
    loadComponent: () =>
      import('./features/auth/admin-login/admin-login').then((m) => m.AdminLogin),
    title: 'Admin Sign In — CollegeChuniye',
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
        title: 'Admin — CollegeChuniye',
        data: { seo: { title: 'Admin', description: 'CollegeChuniye content management.' } },
      },
      {
        path: 'colleges',
        loadComponent: () =>
          import('./features/admin/college-admin-list/college-admin-list').then((m) => m.CollegeAdminList),
        title: 'Manage Colleges — Admin',
      },
      {
        path: 'colleges/new',
        loadComponent: () =>
          import('./features/admin/college-admin-form/college-admin-form').then((m) => m.CollegeAdminForm),
        title: 'Add College — Admin',
      },
      {
        path: 'colleges/:id/edit',
        loadComponent: () =>
          import('./features/admin/college-admin-form/college-admin-form').then((m) => m.CollegeAdminForm),
        title: 'Edit College — CollegeChuniye',
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./features/admin/lead-admin-list/lead-admin-list').then((m) => m.LeadAdminList),
        title: 'Manage Leads — Admin',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
