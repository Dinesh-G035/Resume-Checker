// Scoring weights for resume evaluation categories

export const SCORING_WEIGHTS = {
  formatting: {
    weight: 0.15,
    label: 'Formatting & Structure',
    description: 'Resume layout, headings, and overall structure',
  },
  content: {
    weight: 0.25,
    label: 'Content Quality',
    description: 'Action verbs, quantified achievements, and professional tone',
  },
  keywords: {
    weight: 0.25,
    label: 'Keyword Optimization',
    description: 'Relevant industry and skill keywords',
  },
  atsCompatibility: {
    weight: 0.20,
    label: 'ATS Compatibility',
    description: 'Ability to pass Applicant Tracking Systems',
  },
  experience: {
    weight: 0.15,
    label: 'Experience & Education',
    description: 'Work history clarity and educational qualifications',
  },
};

export const SCORE_THRESHOLDS = {
  excellent: { min: 85, label: 'Excellent', color: '#10b981', description: 'Your resume is highly optimized' },
  good: { min: 70, label: 'Good', color: '#6366f1', description: 'Your resume is well-structured with minor improvements needed' },
  fair: { min: 50, label: 'Fair', color: '#f59e0b', description: 'Several areas need improvement' },
  poor: { min: 0, label: 'Needs Work', color: '#ef4444', description: 'Significant improvements recommended' },
};

export const getScoreLevel = (score) => {
  if (score >= SCORE_THRESHOLDS.excellent.min) return SCORE_THRESHOLDS.excellent;
  if (score >= SCORE_THRESHOLDS.good.min) return SCORE_THRESHOLDS.good;
  if (score >= SCORE_THRESHOLDS.fair.min) return SCORE_THRESHOLDS.fair;
  return SCORE_THRESHOLDS.poor;
};

export default SCORING_WEIGHTS;
