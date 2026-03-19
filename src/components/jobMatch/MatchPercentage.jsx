import React from 'react';

const MatchPercentage = ({ matchData }) => {
  if (!matchData) return null;

  const { overallMatch, matchPercentage, totalJobKeywords, totalResumeKeywords, matching, missing } = matchData;

  const getColor = (pct) => {
    if (pct >= 70) return { text: 'text-accent-400', bg: 'bg-accent-500', gradient: 'from-accent-500 to-accent-400' };
    if (pct >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-400' };
    return { text: 'text-red-400', bg: 'bg-red-500', gradient: 'from-red-500 to-red-400' };
  };

  const color = getColor(overallMatch);

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-6">Match Percentage</h3>

      <div className="flex flex-col items-center mb-6">
        {/* Large percentage circle */}
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-800" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              className={color.text}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallMatch / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-display font-bold ${color.text}`}>{overallMatch}%</span>
            <span className="text-xs text-surface-400 mt-1">Match</span>
          </div>
        </div>

        <p className={`text-sm font-medium ${color.text}`}>
          {overallMatch >= 70 ? 'Strong Match! 🎉' : overallMatch >= 50 ? 'Moderate Match ⚡' : 'Weak Match — Needs Work 🔧'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-xl bg-surface-800/50">
          <p className="text-xl font-bold text-accent-400">{matching?.length || 0}</p>
          <p className="text-xs text-surface-400 mt-1">Matched</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-surface-800/50">
          <p className="text-xl font-bold text-red-400">{missing?.length || 0}</p>
          <p className="text-xs text-surface-400 mt-1">Missing</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-surface-800/50">
          <p className="text-xl font-bold text-primary-400">{totalJobKeywords || 0}</p>
          <p className="text-xs text-surface-400 mt-1">JD Keywords</p>
        </div>
      </div>
    </div>
  );
};

export default MatchPercentage;
