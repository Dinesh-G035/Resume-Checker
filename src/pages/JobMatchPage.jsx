import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useAnalysis } from '../context/AnalysisContext';
import useJobMatch from '../hooks/useJobMatch';
import JobDescInput from '../components/jobMatch/JobDescInput';
import MatchPercentage from '../components/jobMatch/MatchPercentage';
import KeywordGapList from '../components/jobMatch/KeywordGapList';

const JobMatchPage = () => {
  const { parsedText } = useResume();
  const { jobMatch } = useAnalysis();
  const { matchJob } = useJobMatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!parsedText) {
      navigate('/');
    }
  }, [parsedText, navigate]);

  if (!parsedText) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Job Match Analysis</h1>
          <p className="text-surface-400">Compare your resume against a specific job description to identify gaps and optimize keywords</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-6">
            <JobDescInput onMatch={matchJob} resumeText={parsedText} />

            {/* Resume preview card */}
            <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Your Resume</h3>
                  <p className="text-surface-500 text-xs">
                    {parsedText.trim().split(/\s+/).length} words loaded
                  </p>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto rounded-lg bg-surface-800/50 p-3">
                <p className="text-xs text-surface-400 leading-relaxed whitespace-pre-wrap">
                  {parsedText.slice(0, 600)}{parsedText.length > 600 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {jobMatch ? (
              <>
                <MatchPercentage matchData={jobMatch} />
                <KeywordGapList matchData={jobMatch} />
              </>
            ) : (
              <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-12 text-center backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-800 flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Compare</h3>
                <p className="text-surface-400 text-sm max-w-sm mx-auto">
                  Paste a job description on the left and click "Compare & Match" to see how well your resume aligns.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchPage;
