import { ATS_RULES, SECTION_NAMES } from '../constants/atsRules';
import { countWords } from './textCleaner';
import { extractKeywords } from './keywordExtractor';

const evaluateRule = (rule, text, lowerText, jobDescription = '') => {
  const result = { id: rule.id, label: rule.label, description: rule.description, passed: false, score: 0, maxScore: rule.score, feedback: '' };

  switch (rule.id) {
    case 'has-sections': {
      const foundSections = rule.requiredSections.filter((section) => {
        const names = SECTION_NAMES[section];
        if (!names) return false;
        return names.some((name) => {
          // Use simple includes for reliability, plus word boundary check
          if (lowerText.includes(name.toLowerCase())) return true;
          // Also try regex for multi-word names
          try {
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerText);
          } catch { return false; }
        });
      });

      const ratio = foundSections.length / rule.requiredSections.length;
      result.score = Math.round(rule.score * ratio);
      result.passed = ratio >= 0.67;

      const missing = rule.requiredSections.filter((s) => !foundSections.includes(s));
      result.feedback = result.passed
        ? `Found ${foundSections.length}/${rule.requiredSections.length} required sections (${foundSections.join(', ')})`
        : `Missing sections: ${missing.join(', ')} (found: ${foundSections.join(', ') || 'none'})`;

      break;
    }
    case 'no-tables': {
      // Only flag actual table-like structures (3+ pipes on same line pattern)
      let penalty = 0;
      const lines = text.split('\n');
      let tableLineCount = 0;
      lines.forEach((line) => {
        const pipeCount = (line.match(/\|/g) || []).length;
        if (pipeCount >= 3) tableLineCount++;
      });
      // Also check for Unicode box drawing characters
      const boxChars = text.match(/[┌┐└┘─│┬┤├┴┼]/g);
      if (tableLineCount >= 2) penalty += tableLineCount * rule.penaltyPerMatch;
      if (boxChars) penalty += boxChars.length * rule.penaltyPerMatch;
      
      penalty = Math.min(penalty, rule.maxPenalty);
      result.score = Math.max(0, rule.score - penalty);
      result.passed = penalty === 0;
      result.feedback = result.passed ? 'No complex tables detected' : `Complex formatting detected (${tableLineCount} table-like rows found)`;
      break;
    }
    case 'proper-headings': {
      const matched = rule.headingPatterns.filter((pat) => pat.test(text)).length;
      const ratio = matched / rule.headingPatterns.length;
      result.score = Math.round(rule.score * ratio);
      result.passed = ratio >= 0.5;
      result.feedback = `Detected ${matched}/${rule.headingPatterns.length} standard section headings`;
      break;
    }
    case 'reasonable-length': {
      const wordCount = countWords(text);
      if (wordCount >= rule.minWords && wordCount <= rule.maxWords) {
        result.score = rule.score;
        result.passed = true;
        result.feedback = `Resume length (${wordCount} words) is appropriate`;
      } else if (wordCount < rule.minWords) {
        result.score = Math.round(rule.score * (wordCount / rule.minWords));
        result.feedback = `Resume is too short (${wordCount} words). Aim for at least ${rule.minWords} words`;
      } else {
        result.score = Math.round(rule.score * (rule.maxWords / wordCount));
        result.feedback = `Resume is too long (${wordCount} words). Consider trimming to under ${rule.maxWords} words`;
      }
      break;
    }
    case 'has-contact-info': {
      let matched = 0;
      const total = Object.keys(rule.patterns).length;
      
      // Normalize text for contact detection: remove extra spaces that PDF extraction may add
      const normalizedText = text.replace(/\s+/g, ' ');
      // Also create a version with no spaces for catching broken-up emails/phones
      const noSpaceText = text.replace(/\s/g, '');
      
      Object.entries(rule.patterns).forEach(([key, pattern]) => {
        // Test against original text, normalized text, and no-space text
        const hasMatch = pattern.test(text) || pattern.test(normalizedText) || pattern.test(noSpaceText);
        if (hasMatch) matched++;
      });
      result.score = Math.round(rule.score * (matched / total));
      result.passed = matched >= 2;
      result.feedback = matched >= 2 ? `Contact information found (${matched}/${total} types detected)` : `Missing some contact information (found ${matched}/${total} - need email, phone, or LinkedIn)`;
      break;
    }
    case 'quantified-achievements': {
      let totalMatches = 0;
      rule.patterns.forEach((pat) => {
        // Reset lastIndex for global patterns
        pat.lastIndex = 0;
        const matches = text.match(pat);
        if (matches) totalMatches += matches.length;
      });
      const ratio = Math.min(totalMatches / rule.minMatches, 1);

      result.score = Math.round(rule.score * ratio);
      result.passed = totalMatches >= rule.minMatches;
      result.feedback = result.passed
        ? `Found ${totalMatches} quantified achievements`
        : `Only ${totalMatches} quantified achievements found. Add more numbers and metrics`;
      break;
    }
    case 'action-verbs': {
      // Use simple includes() for reliable word matching, then verify with word boundary
      const foundVerbs = rule.verbs.filter((verb) => {
        if (!lowerText.includes(verb.toLowerCase())) return false;
        // Verify it's a whole word match
        try {
          const escaped = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerText);
        } catch {
          return true; // Fall back to includes match
        }
      });

      const ratio = Math.min(foundVerbs.length / rule.minMatches, 1);
      result.score = Math.round(rule.score * ratio);
      result.passed = foundVerbs.length >= rule.minMatches;

      result.feedback = result.passed
        ? `Found ${foundVerbs.length} action verbs (${foundVerbs.slice(0,5).join(', ')})`
        : `Only ${foundVerbs.length} action verbs found. Try using: ${rule.verbs.slice(0,5).join(', ')}`;

      break;
    }
    case 'no-personal-pronouns': {
      let totalMatches = 0;
      rule.patterns.forEach((pat) => {
        pat.lastIndex = 0;
        const matches = text.match(pat);
        if (matches) totalMatches += matches.length;
      });
      result.passed = totalMatches <= rule.maxMatches;
      result.score = result.passed ? rule.score : Math.max(0, rule.score - totalMatches * 5);
      result.feedback = result.passed
        ? 'Professional tone maintained'
        : `Found ${totalMatches} personal pronouns. Remove "I", "me", "my" for professional tone`;
      break;
    }
    case 'industry-keywords': {
      const keywords = extractKeywords(text);
      let baseScore = 0;
      let feedback = `Found ${keywords.all.length} industry keywords`;
      
      // Job-specific keyword matching
      if (jobDescription && jobDescription.trim()) {
        const jobKeywords = extractKeywords(jobDescription);
        const jobLower = jobDescription.toLowerCase();
        const resumeLower = text.toLowerCase();
        
        // Count job keywords found in resume
        let matchedJobKeywords = 0;
        const allJobKeywords = [...jobKeywords.technical, ...jobKeywords.soft, ...jobKeywords.all];
        
        allJobKeywords.forEach(keyword => {
          const kw = typeof keyword === 'string' ? keyword : keyword.keyword;
          if (kw && kw.length > 2 && jobLower.includes(kw.toLowerCase())) {
            if (resumeLower.includes(kw.toLowerCase())) {
              matchedJobKeywords++;
            }
          }
        });
        
        // Boost score based on job keyword match (up to 50% bonus)
        const matchRatio = allJobKeywords.length > 0 ? matchedJobKeywords / Math.min(allJobKeywords.length, 15) : 0;
        const jobBonus = Math.round(matchRatio * (rule.score * 0.5));
        
        // Base score
        const density = countWords(text) > 0 ? keywords.all.length / countWords(text) : 0;
        const inRange = density >= rule.minKeywordDensity && density <= rule.maxKeywordDensity;
        baseScore = inRange ? rule.score : Math.round(rule.score * Math.min(density / rule.minKeywordDensity, 1));
        
        result.score = Math.min(rule.score, baseScore + jobBonus);
        result.passed = matchedJobKeywords >= Math.min(allJobKeywords.length, 10) * 0.6;
        result.feedback = `${keywords.all.length} keywords found, ${matchedJobKeywords}/${Math.min(allJobKeywords.length, 15)} job-specific keywords matched`;
      } else {
        const density = countWords(text) > 0 ? keywords.all.length / countWords(text) : 0;
        const inRange = density >= rule.minKeywordDensity && density <= rule.maxKeywordDensity;
        result.score = inRange ? rule.score : Math.round(rule.score * Math.min(density / rule.minKeywordDensity, 1));
        result.passed = keywords.all.length >= 5;
        result.feedback = feedback;
      }
      break;
    }
    case 'skill-keywords': {
      const keywords = extractKeywords(text);
      let skillCount = keywords.technical.length + keywords.soft.length;
      let feedback = `${skillCount} skills identified (${keywords.technical.length} technical, ${keywords.soft.length} soft)`;
      
      // Job-specific skill matching
      if (jobDescription && jobDescription.trim()) {
        const jobKeywords = extractKeywords(jobDescription);
        const jobLower = jobDescription.toLowerCase();
        const resumeLower = text.toLowerCase();
        
        // Count job skills found in resume
        let matchedJobSkills = 0;
        const allJobSkills = [...jobKeywords.technical, ...jobKeywords.soft];
        
        allJobSkills.forEach(skill => {
          const s = typeof skill === 'string' ? skill : skill.keyword;
          if (s && s.length > 2 && jobLower.includes(s.toLowerCase())) {
            if (resumeLower.includes(s.toLowerCase())) {
              matchedJobSkills++;
            }
          }
        });
        
        // Add matched job skills to count
        skillCount += matchedJobSkills;
        
        const ratio = Math.min(skillCount / rule.minSkills, 1);
        result.score = Math.round(rule.score * ratio);
        result.passed = skillCount >= rule.minSkills;
        result.feedback = `${skillCount} skills (${keywords.technical.length} technical, ${keywords.soft.length} soft, ${matchedJobSkills} job-matched)`;
      } else {
        const ratio = Math.min(skillCount / rule.minSkills, 1);
        result.score = Math.round(rule.score * ratio);
        result.passed = skillCount >= rule.minSkills;
        result.feedback = feedback;
      }
      break;
    }
    case 'date-consistency': {
      let totalMatches = 0;
      rule.patterns.forEach((pat) => {
        pat.lastIndex = 0;
        const matches = text.match(pat);
        if (matches) totalMatches += matches.length;
      });
      result.passed = totalMatches >= 2;
      result.score = result.passed ? rule.score : Math.round(rule.score * 0.5);
      result.feedback = result.passed ? `${totalMatches} date entries found with consistent formatting` : 'Few or no dates detected. Add employment dates';
      break;
    }
    case 'no-gaps': {
      // Simplified — just checks if dates are present
      const datePattern = /\d{4}/g;
      const years = text.match(datePattern);
      result.passed = years && years.length >= 2;
      result.score = result.passed ? rule.score : Math.round(rule.score * 0.5);
      result.feedback = result.passed ? 'Employment timeline appears continuous' : 'Consider adding clear dates for all positions';
      break;
    }
    default:
      result.score = 0;
      result.feedback = 'Rule not implemented';
  }

  return result;
};


export const calculateATSScore = (text, jobDescription = '') => {
  if (!text || text.trim().length === 0) {
    return { totalScore: 0, categories: {}, ruleResults: [], passed: false };
  }

  const lowerText = text.toLowerCase();
  const categories = {};
  const allResults = [];

  Object.entries(ATS_RULES).forEach(([category, config]) => {
    const results = config.rules.map((rule) => evaluateRule(rule, text, lowerText, jobDescription));
    const maxPossible = config.rules.reduce((sum, r) => sum + r.score, 0);
    const earned = results.reduce((sum, r) => sum + r.score, 0);
    const categoryScore = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;

    categories[category] = {
      score: categoryScore,
      weight: config.weight,
      weightedScore: Math.round(categoryScore * config.weight),
      results,
      passedCount: results.filter((r) => r.passed).length,
      totalRules: results.length,
    };

    allResults.push(...results);
  });

  const totalScore = Object.values(categories).reduce((sum, cat) => sum + cat.weightedScore, 0);

  return {
    totalScore: Math.min(100, totalScore),
    categories,
    ruleResults: allResults,
    passed: totalScore >= 60,
    passedRules: allResults.filter((r) => r.passed).length,
    totalRules: allResults.length,
  };
};

export default calculateATSScore;
