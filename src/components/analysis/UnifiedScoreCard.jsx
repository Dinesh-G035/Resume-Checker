import React, { useMemo, useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { getScoreLevel } from '../../constants/scoringWeights';

const UnifiedScoreCard = () => {
  const { overallScore, categories, atsScore, hasAnalyzed } = useAnalysis();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const level = useMemo(() => getScoreLevel(overallScore || 0), [overallScore]);

  if (!hasAnalyzed) return null;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - ((overallScore || 0) / 100) * circumference;

  const toggleCategory = (key) => {
    setExpandedCategory(expandedCategory === key ? null : key);
  };

  // Map category keys to ATS rule categories for detailed breakdown
  const atsCategories = atsScore?.categories || {};

  return (
    <div className="lg:col-span-2 rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 md:p-8 backdrop-blur-sm animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Resume Score</h3>
          <p className="text-surface-500 text-sm mt-1">Comprehensive ATS compatibility & content analysis</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
          overallScore >= 70 ? 'bg-accent-500/20 text-accent-400' :
          overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {overallScore >= 70 ? '✓ ATS READY' : overallScore >= 50 ? '⚠ NEEDS WORK' : '✗ NOT READY'}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Score Circle */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" className="text-surface-800" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={level.color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold" style={{ color: level.color }}>
                {overallScore || 0}
              </span>
              <span className="text-xs text-surface-400 mt-1 font-medium">{level.label}</span>
            </div>
          </div>
          {/* Status message */}
          <div className="px-4 py-2.5 rounded-xl text-center max-w-[200px]" style={{ backgroundColor: `${level.color}10`, borderLeft: `3px solid ${level.color}` }}>
            <p className="text-xs leading-relaxed" style={{ color: level.color }}>
              {level.description}
            </p>
          </div>
        </div>

        {/* Category Breakdown with Expandable Details */}
        <div className="flex-1 w-full space-y-3">
          {Object.entries(categories).map(([key, cat]) => {
            const atsCategory = atsCategories[key];
            const isExpanded = expandedCategory === key;
            const hasDetails = atsCategory && atsCategory.results && atsCategory.results.length > 0;

            return (
              <div key={key} className="rounded-xl overflow-hidden">
                {/* Category Bar */}
                <button
                  onClick={() => hasDetails && toggleCategory(key)}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                    hasDetails ? 'cursor-pointer hover:bg-surface-800/60' : 'cursor-default'
                  } ${isExpanded ? 'bg-surface-800/60' : 'bg-surface-800/30'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-surface-300 font-medium">{cat.label}</span>
                      {hasDetails && (
                        <svg className={`w-3.5 h-3.5 text-surface-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${
                      cat.score >= 70 ? 'text-accent-400' : cat.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{cat.score}%</span>
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
                </button>

                {/* Expanded Rule Details */}
                {isExpanded && hasDetails && (
                  <div className="px-4 py-3 bg-surface-800/20 border-t border-surface-700/30 space-y-1.5 animate-fade-in">
                    <div className="text-xs text-surface-500 mb-2">
                      {atsCategory.passedCount}/{atsCategory.totalRules} rules passed
                    </div>
                    {atsCategory.results.map((rule) => (
                      <div key={rule.id} className="flex items-start gap-2 text-xs py-1">
                        <span className={`mt-0.5 flex-shrink-0 ${rule.passed ? 'text-accent-400' : 'text-red-400'}`}>
                          {rule.passed ? '✓' : '✗'}
                        </span>
                        <span className={rule.passed ? 'text-surface-400' : 'text-surface-300'}>
                          {rule.feedback}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UnifiedScoreCard;
