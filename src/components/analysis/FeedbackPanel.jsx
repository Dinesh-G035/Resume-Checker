import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';

const FeedbackPanel = () => {
  const { strengths, weaknesses, hasAnalyzed, keywords } = useAnalysis();

  if (!hasAnalyzed) return null;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <h3 className="text-lg font-display font-bold text-white mb-6">Strengths & Weaknesses</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
              <span className="text-accent-400 text-xs">✓</span>
            </div>
            <h4 className="text-sm font-semibold text-accent-400">Strengths</h4>
          </div>
          {strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-accent-500/5 border border-accent-500/10">
                  <span className="text-accent-400 text-xs mt-0.5">●</span>
                  <span className="text-sm text-surface-300">{s.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm italic">Analyze your resume to see strengths</p>
          )}
        </div>

        {/* Weaknesses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xs">!</span>
            </div>
            <h4 className="text-sm font-semibold text-red-400">Areas to Improve</h4>
          </div>
          {weaknesses.length > 0 ? (
            <div className="space-y-2">
              {weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <span className="text-red-400 text-xs mt-0.5">●</span>
                  <div>
                    <span className="text-sm text-surface-300">{w.message}</span>
                    {w.score !== undefined && (
                      <span className="ml-2 text-xs text-surface-500">({w.score}%)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm italic">No weaknesses detected — great job!</p>
          )}
        </div>
      </div>

      {/* Keywords found */}
      {keywords && keywords.all && keywords.all.length > 0 && (
        <div className="mt-6 pt-6 border-t border-surface-700/50">
          <h4 className="text-sm font-semibold text-white mb-3">Keywords Found ({keywords.all.length})</h4>
          <div className="flex flex-wrap gap-2">
            {[...new Set(keywords.all.map((k) => k.keyword))].slice(0, 30).map((keyword) => (
              <span
                key={keyword}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;
