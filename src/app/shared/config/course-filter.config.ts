import { FilterSection } from '../models';

export const COURSE_FILTER_SECTIONS: FilterSection[] = [
  {
    id: 'category',
    title: 'Stream',
    type: 'checkbox',
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Medical', value: 'medical' },
      { label: 'MBA', value: 'management' },
      { label: 'Law', value: 'law' },
      { label: 'Design', value: 'design' },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    type: 'checkbox',
    options: [
      { label: 'Pan India', value: 'Pan India' },
      { label: 'Metro Cities', value: 'Metro Cities' },
      { label: 'Delhi NCR', value: 'New Delhi' },
      { label: 'Mumbai', value: 'Mumbai' },
      { label: 'Bangalore', value: 'Bangalore' },
      { label: 'Hyderabad', value: 'Hyderabad' },
      { label: 'Chennai', value: 'Chennai' },
      { label: 'Pune', value: 'Pune' },
    ],
  },
  {
    id: 'budgetRange',
    title: 'Budget',
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
    id: 'ranking',
    title: 'Ranking',
    type: 'checkbox',
    options: [
      { label: 'Top 10', value: 'top10' },
      { label: 'Top 50', value: 'top50' },
      { label: 'Top 100', value: 'top100' },
    ],
  },
  {
    id: 'mode',
    title: 'Mode',
    type: 'checkbox',
    options: [
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
      { label: 'Hybrid', value: 'hybrid' },
    ],
  },
];

export const COURSE_FILTER_ICONS: Record<string, string> = {
  category: 'school',
  location: 'location_on',
  budgetRange: 'payments',
  ranking: 'leaderboard',
  mode: 'devices',
};
