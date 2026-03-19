// Custom hook: Calculate ATS score
import { useCallback } from 'react';
import { useResume } from '../context/ResumeContext';
import { useAnalysis } from '../context/AnalysisContext';
import { calculateATSScore } from '../utils/atsScorer';
import { calculateOverallScore } from '../utils/scoreCalculator';

const useATSScore = () => {
  const { parsedText } = useResume();
  const { setResults, setAnalyzing, setJobDescription } = useAnalysis();

  const analyzeResume = useCallback((text = parsedText, jobDescription = '') => {
    if (!text) return null;

    setAnalyzing(true);
    
    // Save job description for later use
    if (jobDescription) {
      setJobDescription(jobDescription);
    }

    // Simulate slight delay for UX
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = calculateOverallScore(text, jobDescription);
        setResults(results);
        resolve(results);
      }, 800);
    });
  }, [parsedText, setResults, setAnalyzing, setJobDescription]);

  const getATSScore = useCallback((text = parsedText, jobDescription = '') => {
    if (!text) return null;
    return calculateATSScore(text, jobDescription);
  }, [parsedText]);

  return { analyzeResume, getATSScore };
};

export default useATSScore;
