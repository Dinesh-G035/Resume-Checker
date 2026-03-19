import React, { useState, useCallback, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useAnalysis } from '../../context/AnalysisContext';
import useRealTimeScore from '../../hooks/useRealTimeScore';
import useExport from '../../hooks/useExport';
import KeywordHighlighter from './KeywordHighlighter';

const ResumeEditor = () => {
  const { parsedText, updateText } = useResume();
  const { overallScore, hasAnalyzed } = useAnalysis();
  const { scoreText } = useRealTimeScore();
  const { exportAsPDF, exportAsText } = useExport();
  const [editMode, setEditMode] = useState('edit'); // 'edit' | 'preview'
  const [localText, setLocalText] = useState(parsedText || '');

  useEffect(() => {
    if (parsedText) setLocalText(parsedText);
  }, [parsedText]);

  const handleChange = useCallback((e) => {
    const newText = e.target.value;
    setLocalText(newText);
    updateText(newText);
    scoreText(newText);
  }, [updateText, scoreText]);

  const wordCount = localText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode('edit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${editMode === 'edit' ? 'bg-primary-500/20 text-primary-300' : 'text-surface-400 hover:text-white hover:bg-white/5'}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setEditMode('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${editMode === 'preview' ? 'bg-primary-500/20 text-primary-300' : 'text-surface-400 hover:text-white hover:bg-white/5'}`}
          >
            👁️ Preview
          </button>

          {hasAnalyzed && overallScore !== null && (
            <div className="ml-3 px-3 py-1.5 rounded-full bg-surface-800 border border-surface-700">
              <span className="text-xs font-medium text-surface-400">Live Score: </span>
              <span className={`text-sm font-bold ${overallScore >= 70 ? 'text-accent-400' : overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {overallScore}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAsPDF(localText)}
            disabled={!localText}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white transition-all duration-200 disabled:opacity-40"
          >
            📥 Export PDF
          </button>
          <button
            onClick={() => exportAsText(localText)}
            disabled={!localText}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white transition-all duration-200 disabled:opacity-40"
          >
            📄 Export TXT
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl bg-surface-900/80 border border-surface-700/50 overflow-hidden">
        {editMode === 'edit' ? (
          <textarea
            id="resume-editor"
            value={localText}
            onChange={handleChange}
            rows={20}
            className="w-full bg-transparent text-white p-5 text-sm leading-relaxed resize-none outline-none focus:ring-0 font-mono"
            placeholder="Start editing your resume here..."
          />
        ) : (
          <div className="p-5 min-h-[480px]">
            <KeywordHighlighter text={localText} />
          </div>
        )}

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-surface-800/30 border-t border-surface-700/50 text-xs text-surface-500">
          <span>{wordCount} words</span>
          <span>{editMode === 'edit' ? 'Editing mode — changes auto-save' : 'Preview mode — keywords highlighted'}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
