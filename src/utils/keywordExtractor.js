// Keyword extraction utilities
import { ALL_KEYWORDS, TECH_KEYWORDS, SOFT_SKILLS, CERTIFICATIONS } from '../constants/keywords';

/**
 * Extract all matching keywords from text
 * @param {string} text - Resume text
 * @returns {Object} categorized keywords found
 */
export const extractKeywords = (text) => {
  if (!text) return { technical: [], soft: [], certifications: [], all: [] };

  const lowerText = text.toLowerCase();
  const found = {
    technical: [],
    soft: [],
    certifications: [],
    all: [],
  };

  // Check tech keywords
  Object.entries(TECH_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        const entry = { keyword, category };
        found.technical.push(entry);
        found.all.push(entry);
      }
    });
  });

  // Check soft skills
  SOFT_SKILLS.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      const entry = { keyword: skill, category: 'softSkills' };
      found.soft.push(entry);
      found.all.push(entry);
    }
  });

  // Check certifications
  CERTIFICATIONS.forEach((cert) => {
    if (lowerText.includes(cert.toLowerCase())) {
      const entry = { keyword: cert, category: 'certifications' };
      found.certifications.push(entry);
      found.all.push(entry);
    }
  });

  return found;
};

/**
 * Extract keywords from a job description and compare with resume
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Object} matching, missing, and extra keywords
 */
export const compareKeywords = (resumeText, jobDescription) => {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);

  const resumeSet = new Set(resumeKeywords.all.map((k) => k.keyword.toLowerCase()));
  const jobSet = new Set(jobKeywords.all.map((k) => k.keyword.toLowerCase()));

  const matching = [...jobSet].filter((k) => resumeSet.has(k));
  const missing = [...jobSet].filter((k) => !resumeSet.has(k));
  const extra = [...resumeSet].filter((k) => !jobSet.has(k));

  return {
    matching,
    missing,
    extra,
    matchPercentage: jobSet.size > 0 ? Math.round((matching.length / jobSet.size) * 100) : 0,
    totalJobKeywords: jobSet.size,
    totalResumeKeywords: resumeSet.size,
  };
};

/**
 * Extract custom keywords from a job description text (beyond dictionary)
 * @param {string} text
 * @returns {string[]} extracted keywords & phrases
 */
export const extractCustomKeywords = (text) => {
  if (!text) return [];

  // Extract multi-word phrases (2-3 word combos that appear significant)
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'we', 'you',
    'they', 'he', 'she', 'it', 'this', 'that', 'these', 'those', 'our',
    'your', 'their', 'its', 'from', 'as', 'not', 'if', 'so', 'than',
  ]);

  const significantWords = words.filter(
    (w) => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w)
  );

  // Count frequency
  const freq = {};
  significantWords.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Return words that appear 2+ times, sorted by frequency
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
};

export default extractKeywords;
