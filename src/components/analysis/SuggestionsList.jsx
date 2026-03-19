import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useAnalysis } from '../../context/AnalysisContext';
import { getAISuggestions } from '../../services/aiService';

const SuggestionsList = () => {
  const { parsedText } = useResume();
  const { suggestions, hasAnalyzed, jobDescription } = useAnalysis();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchAISuggestions = async () => {
    if (!parsedText) return;
    setLoadingAI(true);
    try {
      const result = await getAISuggestions(parsedText, jobDescription);
      setAiSuggestions(result);
    } catch (err) {
      console.error('Failed to get AI suggestions:', err);
    }
    setLoadingAI(false);
  };

  if (!hasAnalyzed) return null;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-white">Improvement Suggestions</h3>
        <button
          onClick={fetchAISuggestions}
          disabled={loadingAI || !parsedText}
          className="px-4 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 transition-all duration-200 disabled:opacity-40 flex items-center gap-1.5"
        >
          {loadingAI ? (
            <><span className="animate-spin">⟳</span> Generating...</>
          ) : (
            <><span>🤖</span> Get AI Suggestions</>
          )}
        </button>
      </div>

      {/* Rule-based suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2 mb-6">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/30 hover:border-surface-600/50 transition-colors">
              <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-xs">💡</span>
              </span>
              <div>
                <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">{s.category}</span>
                <p className="text-sm text-surface-300 mt-0.5">{s.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Suggestions */}
      {aiSuggestions && (
        <div className="border-t border-surface-700/50 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">🤖</span>
            <h4 className="text-sm font-semibold text-purple-400">AI-Powered Suggestions</h4>
          </div>

          {aiSuggestions.overallAdvice && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/15">
              <p className="text-sm text-surface-300">{aiSuggestions.overallAdvice}</p>
            </div>
          )}

          {aiSuggestions.wordingImprovements?.length > 0 && (
            <div className="space-y-2">
              {aiSuggestions.wordingImprovements.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-800/30">
                  <span className="text-purple-400 text-xs mt-1">→</span>
                  <div>
                    <span className="text-xs font-medium text-purple-400">{imp.section}</span>
                    <p className="text-sm text-surface-300 mt-0.5">{imp.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {aiSuggestions.summary && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10">
              <span className="text-xs font-medium text-purple-400">Suggested Professional Summary</span>
              <p className="text-sm text-surface-300 mt-1">{aiSuggestions.summary}</p>
            </div>
          )}
        </div>
      )}

      {suggestions.length === 0 && !aiSuggestions && (
        <p className="text-surface-500 text-sm text-center py-4">No specific suggestions at this time. Your resume looks good!</p>
      )}
    </div>
  );
};

export default SuggestionsList;
