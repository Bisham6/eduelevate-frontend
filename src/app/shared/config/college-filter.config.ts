import { FilterSection } from '../models';

export const COLLEGE_CATEGORY_OPTIONS = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Medical', value: 'medical' },
  { label: 'MBA', value: 'management' },
  { label: 'Law', value: 'law' },
  { label: 'Design', value: 'design' },
  { label: 'Science', value: 'science' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  COLLEGE_CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
);

const SPECIALIZATIONS_BY_CATEGORY: Record<string, { label: string; value: string }[]> = {
  engineering: [
    { label: 'Computer Science', value: 'computer_science' },
    { label: 'Mechanical', value: 'mechanical' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Civil', value: 'civil' },
  ],
  medical: [
    { label: 'MBBS', value: 'mbbs' },
    { label: 'BDS', value: 'bds' },
    { label: 'Nursing', value: 'nursing' },
    { label: 'AYUSH', value: 'ayush' },
    { label: 'Pharmacy', value: 'pharmacy' },
  ],
  management: [
    { label: 'Finance', value: 'finance' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Operations', value: 'operations' },
  ],
};

const COMMON_FILTER_SECTIONS: FilterSection[] = [
  {
    id: 'location',
    title: 'Location',
    type: 'checkbox',
    options: [
      { label: 'Delhi NCR', value: 'New Delhi' },
      { label: 'Bangalore', value: 'Bangalore' },
      { label: 'Mumbai', value: 'Mumbai' },
      { label: 'Pune', value: 'Pune' },
      { label: 'Chennai', value: 'Chennai' },
      { label: 'Hyderabad', value: 'Hyderabad' },
      { label: 'Dehradun', value: 'Dehradun' },
      { label: 'Rishikesh', value: 'Rishikesh' },
      { label: 'Haldwani', value: 'Haldwani' },
      { label: 'Kolkata', value: 'Kolkata' },
      { label: 'Jaipur', value: 'Jaipur' },
      { label: 'Lucknow', value: 'Lucknow' },
      { label: 'Chandigarh', value: 'Chandigarh' },
      { label: 'Kozhikode', value: 'Kozhikode' },
      { label: 'Guwahati', value: 'Guwahati' },
      { label: 'Bhopal', value: 'Bhopal' },
      { label: 'Patna', value: 'Patna' },
      { label: 'Vellore', value: 'Vellore' },
      { label: 'Puducherry', value: 'Puducherry' },
    ],
  },
  {
    id: 'feesRange',
    title: 'Annual Fees',
    type: 'radio',
    options: [
      { label: 'Under ₹2 Lakhs', value: 'under-2' },
      { label: '₹2 - 5 Lakhs', value: '2-5' },
      { label: '₹5 - 10 Lakhs', value: '5-10' },
      { label: '₹10 - 20 Lakhs', value: '10-20' },
      { label: 'Above ₹20 Lakhs', value: 'above-20' },
    ],
  },
  {
    id: 'nirfRanking',
    title: 'NIRF Ranking',
    type: 'checkbox',
    options: [
      { label: 'Top 10', value: 'top10' },
      { label: 'Top 50', value: 'top50' },
      { label: 'Top 100', value: 'top100' },
    ],
  },
];

export function buildCollegeFilterSections(categorySlug?: string): FilterSection[] {
  const categorySection: FilterSection = {
    id: 'category',
    title: 'Category',
    type: 'radio',
    options: COLLEGE_CATEGORY_OPTIONS,
  };

  const sections: FilterSection[] = [categorySection, ...COMMON_FILTER_SECTIONS];

  const specOptions = categorySlug ? SPECIALIZATIONS_BY_CATEGORY[categorySlug] : undefined;
  if (specOptions?.length) {
    sections.push({
      id: 'specialization',
      title: 'Specialization',
      type: 'checkbox',
      options: specOptions,
    });
  }

  return sections;
}

export function getCategoryPageTitle(categorySlug?: string): string {
  if (!categorySlug) return 'Top Colleges in India';
  const label = CATEGORY_LABELS[categorySlug] ?? categorySlug;
  return `Top ${label} Colleges in India`;
}
