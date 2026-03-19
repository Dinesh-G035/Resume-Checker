import React, { useMemo } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { getScoreLevel } from '../../constants/scoringWeights';

const ScoreCard = () => {
  const { overallScore, categories, hasAnalyzed } = useAnalysis();

  const level = useMemo(() => getScoreLevel(overallScore || 0), [overallScore]);

  if (!hasAnalyzed) return null;

  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - ((overallScore || 0) / 100) * circumference;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-6">Overall Resume Score</h3>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-800" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={level.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{ '--score-offset': offset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold" style={{ color: level.color }}>
              {overallScore || 0}
            </span>
            <span className="text-xs text-surface-400 mt-1">{level.label}</span>
          </div>
        </div>

        {/* Category bars */}
        <div className="flex-1 w-full space-y-3">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-surface-300">{cat.label}</span>
                <span className="text-sm font-semibold text-white">{cat.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${cat.score}%`,
                    background: cat.score >= 70 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                                cat.score >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status message */}
      <div className="mt-6 px-4 py-3 rounded-xl" style={{ backgroundColor: `${level.color}10`, borderLeft: `3px solid ${level.color}` }}>
        <p className="text-sm" style={{ color: level.color }}>
          {level.description}
        </p>
      </div>
    </div>
  );
};

export default ScoreCard;
