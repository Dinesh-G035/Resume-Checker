import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { countWords } from '../../utils/textCleaner';
import PDFPreview from './PDFPreview';

const FilePreview = ({ showAnalyzeButton = true, onAnalyze }) => {
  const { file, fileName, fileType, parsedText, rawText, reset, updateText } = useResume();

  if (!parsedText) return null;

  const wordCount = countWords(parsedText);
  const lineCount = parsedText.split('\n').length;
  const fileSize = rawText ? (new Blob([rawText]).size / 1024).toFixed(1) : '—';

  const isPDF = fileType === 'application/pdf' || (fileName && fileName.toLowerCase().endsWith('.pdf'));

  return (
    <div className="w-full animate-slide-up">
      <div className="rounded-xl bg-surface-900/80 border border-surface-700/50 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-surface-800/50 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
              <span className="text-primary-400 text-sm">📄</span>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">{fileName || 'Pasted Text'}</h4>
              <p className="text-surface-500 text-xs">{wordCount} words • {lineCount} lines • {fileSize} KB</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            Remove
          </button>
        </div>

        {/* Preview - Show PDF image for PDF files, text for others */}
        <div className="p-5">
          {isPDF && file ? (
            <PDFPreview 
              file={file} 
              onTextExtracted={(text) => {
                // Update parsed text with extracted text if not already set
                if (!parsedText) {
                  updateText(text);
                }
              }} 
            />
          ) : (
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              <pre className="text-surface-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {parsedText.length > 1500 ? parsedText.slice(0, 1500) + '\n\n... [Preview truncated]' : parsedText}
              </pre>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-surface-800/30 border-t border-surface-700/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-accent-500"></span>
            <span className="text-surface-400">File parsed successfully</span>
          </div>
          
          {/* Show Analyze button immediately - no scroll needed */}
          {showAnalyzeButton && onAnalyze && (
            <button
              onClick={onAnalyze}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              🚀 Analyze Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

