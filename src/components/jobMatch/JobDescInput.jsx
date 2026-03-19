import React, { useState } from 'react';

const JobDescInput = ({ onMatch, resumeText }) => {
  const [jobDesc, setJobDesc] = useState('');

  const handleMatch = () => {
    if (!jobDesc.trim() || !resumeText) return;
    onMatch(resumeText, jobDesc);
  };

  const wordCount = jobDesc.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
          <span className="text-lg">🎯</span>
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-white">Job Description</h3>
          <p className="text-surface-500 text-xs">Paste the target job description to compare against your resume</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="job-desc-input"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer with experience in React, Node.js, and cloud technologies..."
          rows={8}
          className="w-full rounded-xl bg-surface-800/50 border border-surface-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-white placeholder-surface-600 p-4 text-sm leading-relaxed resize-none transition-all duration-200 outline-none"
        />
        <div className="absolute bottom-3 right-3 text-xs text-surface-500">
          {wordCount} words
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-surface-500 text-xs">
          {!resumeText ? '⚠️ Upload a resume first' : jobDesc.trim().length < 20 ? 'Paste at least 20 characters' : '✓ Ready to compare'}
        </p>
        <button
          onClick={handleMatch}
          disabled={!resumeText || jobDesc.trim().length < 20}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow hover:shadow-lg"
        >
          Compare & Match
        </button>
      </div>
    </div>
  );
};

export default JobDescInput;
