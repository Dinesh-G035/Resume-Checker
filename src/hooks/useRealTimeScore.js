// Custom hook: Real-time scoring as text changes
import { useCallback, useRef, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { calculateOverallScore } from '../utils/scoreCalculator';

const useRealTimeScore = () => {
  const { updateScore } = useAnalysis();
  const debounceTimer = useRef(null);

  const scoreText = useCallback((text) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (!text || text.trim().length < 50) return;
      const results = calculateOverallScore(text);
      updateScore({
        overallScore: results.overallScore,
        categories: results.categories,
        atsScore: results.atsScore,
      });
    }, 500);
  }, [updateScore]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return { scoreText };
};

export default useRealTimeScore;
