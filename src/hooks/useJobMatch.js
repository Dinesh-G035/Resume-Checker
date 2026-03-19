// Custom hook: Job Description matching
import { useCallback } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { compareKeywords, extractCustomKeywords } from '../utils/keywordExtractor';

const useJobMatch = () => {
  const { setJobDescription, setJobMatch } = useAnalysis();

  const matchJob = useCallback((resumeText, jobDescription) => {
    if (!resumeText || !jobDescription) return null;

    setJobDescription(jobDescription);

    const comparison = compareKeywords(resumeText, jobDescription);
    const customKeywords = extractCustomKeywords(jobDescription);

    // Check which custom keywords are in the resume
    const lowerResume = resumeText.toLowerCase();
    const customMatching = customKeywords.filter((k) => lowerResume.includes(k));
    const customMissing = customKeywords.filter((k) => !lowerResume.includes(k));

    const result = {
      ...comparison,
      customKeywords,
      customMatching,
      customMissing,
      overallMatch: Math.round(
        (comparison.matchPercentage * 0.7) +
        (customKeywords.length > 0 ? (customMatching.length / customKeywords.length) * 100 * 0.3 : comparison.matchPercentage * 0.3)
      ),
    };

    setJobMatch(result);
    return result;
  }, [setJobDescription, setJobMatch]);

  return { matchJob };
};

export default useJobMatch;
