import React, { useMemo } from 'react';
import { extractKeywords } from '../../utils/keywordExtractor';

const KeywordHighlighter = ({ text }) => {
  const highlighted = useMemo(() => {
    if (!text) return null;

    const keywords = extractKeywords(text);
    const allKeywords = keywords.all.map((k) => k.keyword.toLowerCase());

    if (allKeywords.length === 0) {
      return text.split('\n').map((line, i) => (
        <div key={i} className="text-surface-300 text-sm leading-relaxed">
          {line || <br />}
        </div>
      ));
    }

    // Build regex from keywords (sorted longest first to prevent partial matches)
    const sorted = [...new Set(allKeywords)].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${sorted.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

    return text.split('\n').map((line, lineIndex) => {
      const parts = [];
      let lastIndex = 0;
      let match;

      const linePattern = new RegExp(pattern.source, 'gi');
      while ((match = linePattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span key={`${lineIndex}-${lastIndex}`} className="text-surface-300">
              {line.slice(lastIndex, match.index)}
            </span>
          );
        }
        parts.push(
          <span
            key={`${lineIndex}-${match.index}`}
            className="bg-primary-500/20 text-primary-300 px-1 py-0.5 rounded font-medium border-b border-primary-500/30"
            title={`Keyword: ${match[0]}`}
          >
            {match[0]}
          </span>
        );
        lastIndex = linePattern.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(
          <span key={`${lineIndex}-end`} className="text-surface-300">
            {line.slice(lastIndex)}
          </span>
        );
      }

      return (
        <div key={lineIndex} className="text-sm leading-relaxed min-h-[1.5em]">
          {parts.length > 0 ? parts : <br />}
        </div>
      );
    });
  }, [text]);

  if (!text) {
    return <p className="text-surface-500 italic text-sm">No text to preview</p>;
  }

  return (
    <div className="space-y-0">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-surface-700/50">
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded text-xs">keyword</span>
          <span className="text-surface-500">= Matched keyword</span>
        </div>
      </div>
      {highlighted}
    </div>
  );
};

export default KeywordHighlighter;
