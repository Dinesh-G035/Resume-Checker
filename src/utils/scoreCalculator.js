// Overall Resume Score Calculator
import { SCORING_WEIGHTS, getScoreLevel } from '../constants/scoringWeights';
import { calculateATSScore } from './atsScorer';
import { extractKeywords } from './keywordExtractor';
import { countWords, getLines } from './textCleaner';
import { SECTION_NAMES } from '../constants/atsRules';

/**
 * Calculate formatting score
 */
const calculateFormattingScore = (text) => {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Check for section headings
  const sectionsFound = Object.values(SECTION_NAMES).filter((names) =>
    names.some((name) => lowerText.includes(name))
  ).length;
  score += Math.min(30, sectionsFound * 10);

  // Check word count (ideal: 400-1200)
  const words = countWords(text);
  if (words >= 400 && words <= 1200) score += 25;
  else if (words >= 200 && words <= 1500) score += 15;
  else score += 5;

  // Check for bullet points
  const lines = getLines(text);
  const bulletLines = lines.filter((l) => /^[\s]*[•\-\*\▪\◦\●]/.test(l)).length;
  if (bulletLines >= 5) score += 25;
  else if (bulletLines >= 2) score += 15;
  else score += 5;

  // Check line variety (not all same length)
  const lineLengths = lines.map((l) => l.length);
  const avgLen = lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length;
  const variance = lineLengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / lineLengths.length;
  if (variance > 100) score += 20;
  else score += 10;

  return Math.min(100, score);
};

/**
 * Calculate content quality score
 */
const calculateContentScore = (text) => {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Action verbs
  const actionVerbs = [
    'achieved', 'managed', 'led', 'developed', 'created', 'implemented',
    'designed', 'built', 'improved', 'increased', 'reduced', 'launched',
    'delivered', 'optimized', 'streamlined', 'executed',
  ];
  const verbCount = actionVerbs.filter((v) => lowerText.includes(v)).length;
  score += Math.min(30, verbCount * 5);

  // Quantified results
  const numberPattern = /\d+[%$]|\$[\d,]+|\d+\s*(years?|months?|projects?|clients?)/gi;
  const numbers = text.match(numberPattern);
  score += Math.min(25, (numbers?.length || 0) * 5);

  // Contact info
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score += 10;
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) score += 10;
  if (/linkedin\.com/i.test(text)) score += 5;

  // No personal pronouns penalty
  const pronouns = text.match(/\b(I|me|my|myself)\b/gi);
  if (!pronouns || pronouns.length <= 2) score += 20;
  else score += Math.max(0, 20 - pronouns.length * 3);

  return Math.min(100, score);
};

/**
 * Calculate keyword score with job-specific matching
 */
const calculateKeywordScore = (text, jobDescription = '') => {
  const keywords = extractKeywords(text);
  let total = keywords.all.length;
  
  // Job-specific keyword matching
  let jobMatchScore = 0;
  if (jobDescription && jobDescription.trim()) {
    const jobKeywords = extractKeywords(jobDescription);
    const jobLower = jobDescription.toLowerCase();
    const resumeLower = text.toLowerCase();
    
    // Count how many job keywords are in resume
    let matchedKeywords = 0;
    const allJobKeywords = [...jobKeywords.technical, ...jobKeywords.soft, ...jobKeywords.all];
    
    allJobKeywords.forEach(kwObj => {
      const kw = typeof kwObj === 'string' ? kwObj : kwObj.keyword;
      if (kw && kw.length > 2 && jobLower.includes(kw.toLowerCase())) {
        if (resumeLower.includes(kw.toLowerCase())) {
          matchedKeywords++;
        }
      }
    });
    
    // Calculate job match percentage (50% of keyword score)
    const matchRatio = allJobKeywords.length > 0 ? matchedKeywords / Math.min(allJobKeywords.length, 20) : 0;
    jobMatchScore = Math.min(50, Math.round(matchRatio * 50));
  }
  
  // Base keyword score (50%)
  let baseScore = 0;
  if (total >= 15) baseScore = 50;
  else if (total >= 10) baseScore = 40;
  else if (total >= 5) baseScore = 30;
  else if (total >= 3) baseScore = 20;
  else baseScore = Math.min(20, total * 10);
  
  return Math.min(100, baseScore + jobMatchScore);
};

/**
 * Calculate experience score
 */
const calculateExperienceScore = (text) => {
  let score = 0;

  // Date patterns
  const datePatterns = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4}\s*[-–]\s*(?:\d{4}|present|current)/gi;
  const dates = text.match(datePatterns);
  score += Math.min(40, (dates?.length || 0) * 10);

  // Education keywords
  const eduKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'diploma', 'b.s.', 'b.a.', 'm.s.', 'm.a.', 'mba'];
  const lowerText = text.toLowerCase();
  const eduFound = eduKeywords.filter((k) => lowerText.includes(k)).length;
  score += Math.min(30, eduFound * 10);

  // Job titles
  const titleKeywords = ['engineer', 'developer', 'manager', 'analyst', 'designer', 'director', 'lead', 'architect', 'consultant', 'specialist', 'coordinator', 'intern'];
  const titleFound = titleKeywords.filter((k) => lowerText.includes(k)).length;
  score += Math.min(30, titleFound * 10);

  return Math.min(100, score);
};

/**
 * Calculate job-specific match score
 */
const calculateJobMatchScore = (text, jobDescription = '') => {
  if (!jobDescription || !jobDescription.trim()) {
    return { matchScore: 0, matchedKeywords: [], missingKeywords: [], hasJobDescription: false };
  }
  
  const resumeKeywords = extractKeywords(text);
  const jobKeywords = extractKeywords(jobDescription);
  
  const jobLower = jobDescription.toLowerCase();
  const resumeLower = text.toLowerCase();
  
  // Get all job keywords — extract string values from keyword objects
  const getKw = (k) => typeof k === 'string' ? k : k.keyword;
  const allJobKeywords = [
    ...jobKeywords.technical.map(k => ({ keyword: getKw(k), type: 'technical' })),
    ...jobKeywords.soft.map(k => ({ keyword: getKw(k), type: 'soft' })),
    ...jobKeywords.certifications.map(k => ({ keyword: getKw(k), type: 'certification' })),
    ...jobKeywords.all.filter(k => getKw(k).length > 2).map(k => ({ keyword: getKw(k), type: 'general' }))
  ];
  
  const matchedKeywords = [];
  const missingKeywords = [];
  
  allJobKeywords.forEach(({ keyword, type }) => {
    if (keyword.length > 2) {
      if (resumeLower.includes(keyword)) {
        matchedKeywords.push({ keyword, type });
      } else {
        missingKeywords.push({ keyword, type });
      }
    }
  });
  
  // Calculate match score
  const totalRequired = Math.min(allJobKeywords.length, 25);
  const matchScore = totalRequired > 0 ? Math.round((matchedKeywords.length / totalRequired) * 100) : 0;
  
  return {
    matchScore,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    hasJobDescription: true
  };
};

/**
 * Calculate the overall resume score with full breakdown
 * @param {string} text - Resume text
 * @param {string} jobDescription - Optional job description for job-specific scoring
 * @returns {Object} complete scoring breakdown
 */
export const calculateOverallScore = (text, jobDescription = '') => {
  if (!text || text.trim().length === 0) {
    return {
      overallScore: 0,
      level: getScoreLevel(0),
      categories: {},
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };
  }

  const atsResult = calculateATSScore(text, jobDescription);
  const jobMatchResult = calculateJobMatchScore(text, jobDescription);

  const categoryScores = {
    formatting: calculateFormattingScore(text),
    content: calculateContentScore(text),
    keywords: calculateKeywordScore(text, jobDescription),
    atsCompatibility: atsResult.totalScore,
    experience: calculateExperienceScore(text),
  };

  // Add job match score to categories if job description provided
  if (jobMatchResult.hasJobDescription) {
    categoryScores.jobMatch = jobMatchResult.matchScore;
  }

  // Calculate weighted overall score
  let overallScore = 0;
  const categories = {};

  Object.entries(SCORING_WEIGHTS).forEach(([key, config]) => {
    const raw = categoryScores[key] || 0;
    const weighted = Math.round(raw * config.weight);
    overallScore += weighted;
    categories[key] = {
      score: raw,
      weighted,
      weight: config.weight,
      label: config.label,
      description: config.description,
    };
  });

  // Add job match weighted score if applicable
  if (jobMatchResult.hasJobDescription) {
    const jobMatchWeighted = Math.round(jobMatchResult.matchScore * 0.20); // 20% weight for job match
    overallScore += jobMatchWeighted;
    categories.jobMatch = {
      score: jobMatchResult.matchScore,
      weighted: jobMatchWeighted,
      weight: 0.20,
      label: 'Job Match',
      description: 'How well your resume matches the target job description',
    };
  }

  overallScore = Math.min(100, overallScore);

  // Generate strengths
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  Object.entries(categories).forEach(([key, cat]) => {
    if (cat.score >= 80) {
      strengths.push({ category: cat.label, message: `Strong ${cat.label.toLowerCase()} — well done!` });
    } else if (cat.score < 50) {
      weaknesses.push({ category: cat.label, message: `${cat.label} needs significant improvement`, score: cat.score });
    }
  });

  // ATS-specific feedback
  atsResult.ruleResults?.forEach((rule) => {
    if (!rule.passed) {
      suggestions.push({ category: 'ATS', message: rule.feedback, ruleId: rule.id });
    }
  });

  // Job-specific suggestions
  if (jobMatchResult.hasJobDescription) {
    if (jobMatchResult.missingKeywords.length > 0) {
      suggestions.push({ 
        category: 'Job Match', 
        message: `Add these missing keywords: ${jobMatchResult.missingKeywords.slice(0, 5).map(k => k.keyword).join(', ')}`,
        missingKeywords: jobMatchResult.missingKeywords.map(k => k.keyword)
      });
    }
  }

  // General suggestions
  if (categoryScores.formatting < 60) {
    suggestions.push({ category: 'Formatting', message: 'Add clear section headings (Experience, Education, Skills)' });
    suggestions.push({ category: 'Formatting', message: 'Use bullet points to list achievements and responsibilities' });
  }
  if (categoryScores.content < 60) {
    suggestions.push({ category: 'Content', message: 'Start bullet points with strong action verbs (led, developed, improved)' });
    suggestions.push({ category: 'Content', message: 'Add quantified achievements (e.g., "increased revenue by 25%")' });
  }
  if (categoryScores.keywords < 60) {
    suggestions.push({ category: 'Keywords', message: 'Add more industry-relevant technical and soft skill keywords' });
  }

  return {
    overallScore,
    level: getScoreLevel(overallScore),
    categories,
    atsScore: atsResult,
    jobMatch: jobMatchResult,
    strengths,
    weaknesses,
    suggestions,
    keywords: extractKeywords(text),
    wordCount: countWords(text),
  };
};

export default calculateOverallScore;
