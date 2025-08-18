export const INDUSTRY_CATEGORIES = {
  'Real Estate': [
    'Residential Properties',
    'Commercial Properties', 
    'Industrial Properties',
    'Land Development',
    'Property Management',
    'Real Estate Services',
    'Construction',
    'Architecture & Design'
  ],
  'Automotive': [
    'New Vehicles',
    'Used Vehicles',
    'Auto Parts',
    'Auto Services',
    'Fleet Management',
    'Car Rental',
    'Auto Insurance',
    'Auto Financing'
  ],
  'Healthcare': [
    'Medical Equipment',
    'Pharmaceuticals',
    'Medical Services',
    'Diagnostic Services',
    'Therapeutic Services',
    'Medical Supplies',
    'Health Insurance',
    'Telemedicine'
  ],
  'Technology': [
    'Software Solutions',
    'Hardware Products',
    'SaaS Platforms',
    'Mobile Apps',
    'Enterprise Tools',
    'Cloud Services',
    'IT Services',
    'Cybersecurity'
  ],
  'Manufacturing': [
    'Industrial Equipment',
    'Raw Materials',
    'Components',
    'Finished Products',
    'Quality Control',
    'Supply Chain',
    'Automation',
    'Maintenance Services'
  ],
  'Financial Services': [
    'Banking Products',
    'Investment Services',
    'Insurance Products',
    'Loan Services',
    'Financial Planning',
    'Payment Processing',
    'Risk Management',
    'Compliance Services'
  ],
  'Education': [
    'Educational Software',
    'Training Programs',
    'Learning Materials',
    'Online Courses',
    'Certification Programs',
    'Educational Consulting',
    'Student Services',
    'Educational Equipment'
  ],
  'Retail': [
    'Consumer Products',
    'Fashion & Apparel',
    'Electronics',
    'Home & Garden',
    'Sports & Recreation',
    'Beauty & Personal Care',
    'Food & Beverage',
    'Gift Items'
  ],
  'Energy': [
    'Renewable Energy',
    'Oil & Gas',
    'Electrical Equipment',
    'Energy Services',
    'Solar Products',
    'Wind Energy',
    'Energy Storage',
    'Smart Grid Solutions'
  ],
  'Hospitality': [
    'Hotel Services',
    'Restaurant Services',
    'Event Planning',
    'Travel Services',
    'Entertainment',
    'Tourism',
    'Catering',
    'Venue Management'
  ]
};

export const getIndustryCategories = (industry: string): string[] => {
  return INDUSTRY_CATEGORIES[industry as keyof typeof INDUSTRY_CATEGORIES] || [];
};

export const getAllIndustries = (): string[] => {
  return Object.keys(INDUSTRY_CATEGORIES);
};