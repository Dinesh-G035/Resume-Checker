import React, { useState } from 'react';
import useResumeParser from '../../hooks/useResumeParser';

const TextPasteInput = () => {
  const [text, setText] = useState('');
  const { parseText } = useResumeParser();

  const handleSubmit = () => {
    if (text.trim().length < 50) return;
    parseText(text);
  };

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          id="text-paste-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={10}
          className="w-full rounded-xl bg-surface-900/50 border border-surface-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-white placeholder-surface-500 p-4 text-sm leading-relaxed resize-none transition-all duration-200 outline-none"
        />

        {/* Character & word count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-surface-500">
          <span>{wordCount} words</span>
          <span className="text-surface-700">|</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-surface-500 text-xs">
          {charCount < 50 ? 'Minimum 50 characters required' : '✓ Ready to analyze'}
        </p>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 50}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow hover:shadow-lg"
        >
          Analyze Text
        </button>
      </div>
    </div>
  );
};

export default TextPasteInput;
