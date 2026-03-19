import React from 'react';

const KeywordGapList = ({ matchData }) => {
  if (!matchData) return null;

  const { matching, missing, extra, customMatching, customMissing } = matchData;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-6">Keyword Gap Analysis</h3>

      {/* Matching keywords */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-accent-500"></span>
          <h4 className="text-sm font-semibold text-accent-400">Matching Keywords ({matching?.length || 0})</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {matching?.length > 0 ? matching.map((k) => (
            <span key={k} className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20">
              ✓ {k}
            </span>
          )) : (
            <p className="text-surface-500 text-xs italic">No matching keywords found</p>
          )}
        </div>
      </div>

      {/* Missing keywords */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <h4 className="text-sm font-semibold text-red-400">Missing Keywords ({missing?.length || 0})</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing?.length > 0 ? missing.map((k) => (
            <span key={k} className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              ✗ {k}
            </span>
          )) : (
            <p className="text-surface-500 text-xs italic">No missing keywords — excellent coverage!</p>
          )}
        </div>
      </div>

      {/* Extra keywords (in resume but not in JD) */}
      {extra && extra.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            <h4 className="text-sm font-semibold text-primary-400">Extra Keywords in Resume ({extra.length})</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {extra.slice(0, 20).map((k) => (
              <span key={k} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom JD keywords */}
      {customMissing && customMissing.length > 0 && (
        <div className="pt-4 border-t border-surface-700/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <h4 className="text-sm font-semibold text-yellow-400">Frequently Used in JD (Missing in Resume)</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {customMissing.slice(0, 15).map((k) => (
              <span key={k} className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordGapList;
