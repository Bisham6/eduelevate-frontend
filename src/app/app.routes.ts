import { Routes } from '@angular/router';

const SEO = {
  home: {
    title: 'Find Your Perfect Academic Future',
    description:
      'Discover 10,000+ colleges, compare institutions, track entrance exams, and plan your education journey with EduElevate.',
    keywords: 'colleges, engineering, medical, MBA, entrance exams, NIRF ranking, India',
  },
  colleges: {
    title: 'Top Colleges in India',
    description:
      'Browse and filter top colleges by location, fees, NIRF ranking, and specialization on EduElevate.',
    keywords: 'college listing, engineering colleges, NIRF, fees, placements',
  },
  collegeDetail: {
    title: 'College Details',
    description: 'View college details, fees, placements, infrastructure, and apply on EduElevate.',
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
    description: 'Browse UG, PG, and professional courses across Engineering, Medical, MBA, Law, and Design on EduElevate.',
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
        title: 'EduElevate — Find Your Perfect Academic Future',
        data: { seo: SEO.home },
      },
      {
        path: 'colleges',
        loadComponent: () =>
          import('./features/colleges/college-listing/college-listing').then((m) => m.CollegeListing),
        title: 'Top Colleges — EduElevate',
        data: { seo: SEO.colleges },
      },
      {
        path: 'colleges/:slug',
        loadComponent: () =>
          import('./features/colleges/college-detail/college-detail').then((m) => m.CollegeDetail),
        title: 'College Details — EduElevate',
        data: { seo: SEO.collegeDetail },
      },
      {
        path: 'compare',
        loadComponent: () =>
          import('./features/colleges/compare-colleges/compare-colleges').then((m) => m.CompareColleges),
        title: 'Compare Colleges — EduElevate',
        data: { seo: SEO.compare },
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/exams/exams').then((m) => m.Exams),
        title: 'Entrance Exams — EduElevate',
        data: { seo: SEO.exams },
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/courses/course-listing/course-listing').then((m) => m.CourseListing),
        title: 'Courses — EduElevate',
        data: { seo: SEO.courses },
      },
      {
        path: 'courses/:slug',
        loadComponent: () =>
          import('./features/courses/course-detail/course-detail').then((m) => m.CourseDetail),
        title: 'Course Details — EduElevate',
        data: { seo: { title: 'Course Details', description: 'View course details, career paths, and eligibility on EduElevate.' } },
      },
      {
        path: 'study-abroad',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Study Abroad — EduElevate',
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
        title: 'Dashboard — EduElevate',
        data: { seo: { title: 'Student Dashboard', description: 'Manage your applications and profile.' } },
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
        title: 'Admin — EduElevate',
        data: { seo: { title: 'Admin', description: 'EduElevate content management.' } },
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
        title: 'Edit College — EduElevate',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
