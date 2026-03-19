export const TECH_KEYWORDS = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'ruby', 'go', 'golang',
    'rust', 'swift', 'kotlin', 'php', 'scala', 'perl', 'r', 'matlab', 'dart', 'lua',
  ],
  frontend: [
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'html', 'css', 'sass',
    'tailwind', 'bootstrap', 'webpack', 'vite', 'redux', 'graphql', 'rest api',
    'responsive design', 'accessibility', 'web components', 'pwa',
  ],
  backend: [
    'node.js', 'express', 'django', 'flask', 'spring boot', 'asp.net', 'fastapi',
    'rails', 'laravel', 'nestjs', 'microservices', 'serverless', 'api design',
  ],
  database: [
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
    'cassandra', 'firebase', 'supabase', 'oracle', 'sqlite', 'neo4j',
  ],
  devops: [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform',
    'ansible', 'linux', 'nginx', 'github actions', 'gitlab ci', 'monitoring',
    'logging', 'prometheus', 'grafana',
  ],
  data: [
    'machine learning', 'deep learning', 'data science', 'pandas', 'numpy',
    'tensorflow', 'pytorch', 'scikit-learn', 'natural language processing',
    'computer vision', 'big data', 'spark', 'hadoop', 'data pipeline',
    'etl', 'data visualization', 'tableau', 'power bi',
  ],
  mobile: [
    'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin',
    'xamarin', 'mobile development', 'app store', 'play store',
  ],
};

export const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
  'project management', 'time management', 'collaboration', 'adaptability',
  'creativity', 'attention to detail', 'analytical', 'strategic planning',
  'decision making', 'conflict resolution', 'mentoring', 'presentation',
  'negotiation', 'stakeholder management', 'agile', 'scrum', 'kanban',
];

export const BUSINESS_KEYWORDS = [
  'revenue', 'growth', 'strategy', 'roi', 'kpi', 'stakeholder', 'budget',
  'forecast', 'market analysis', 'competitive analysis', 'business development',
  'customer success', 'product management', 'user research', 'a/b testing',
  'analytics', 'metrics', 'conversion', 'retention', 'engagement',
];

export const CERTIFICATIONS = [
  'aws certified', 'azure certified', 'google cloud certified', 'pmp',
  'scrum master', 'cissp', 'comptia', 'ccna', 'cka', 'ckad',
  'itil', 'six sigma', 'togaf', 'salesforce certified',
];

export const ALL_KEYWORDS = {
  ...TECH_KEYWORDS,
  softSkills: SOFT_SKILLS,
  business: BUSINESS_KEYWORDS,
  certifications: CERTIFICATIONS,
};

export default ALL_KEYWORDS;
