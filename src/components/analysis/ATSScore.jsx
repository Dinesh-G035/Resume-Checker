import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';

const ATSScore = () => {
  const { atsScore, hasAnalyzed } = useAnalysis();

  if (!hasAnalyzed || !atsScore) return null;

  const { totalScore, categories, passedRules, totalRules, passed } = atsScore;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-white">ATS Compatibility</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${passed ? 'bg-accent-500/20 text-accent-400' : 'bg-red-500/20 text-red-400'}`}>
          {passed ? '✓ LIKELY TO PASS' : '✗ NEEDS IMPROVEMENT'}
        </div>
      </div>

      {/* ATS gauge */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="h-4 rounded-full bg-surface-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${totalScore}%`,
                background: totalScore >= 70
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : totalScore >= 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
            />
          </div>
        </div>
        <span className="text-2xl font-display font-bold text-white min-w-[3rem] text-right">{totalScore}</span>
      </div>

      {/* Rules passed */}
      <p className="text-sm text-surface-400 mb-4">
        {passedRules} of {totalRules} rules passed
      </p>

      {/* Category breakdown */}
      <div className="space-y-4">
        {Object.entries(categories || {}).map(([key, cat]) => (
          <div key={key} className="rounded-xl bg-surface-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white capitalize">{key}</span>
              <span className={`text-sm font-bold ${cat.score >= 70 ? 'text-accent-400' : cat.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {cat.score}%
              </span>
            </div>
            <div className="text-xs text-surface-400 mb-2">
              {cat.passedCount}/{cat.totalRules} rules passed
            </div>
            <div className="space-y-1.5">
              {cat.results?.map((rule) => (
                <div key={rule.id} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 ${rule.passed ? 'text-accent-400' : 'text-red-400'}`}>
                    {rule.passed ? '✓' : '✗'}
                  </span>
                  <span className={rule.passed ? 'text-surface-400' : 'text-surface-300'}>
                    {rule.feedback}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSScore;
