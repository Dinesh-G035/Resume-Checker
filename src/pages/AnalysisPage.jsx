import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useAnalysis } from '../context/AnalysisContext';
import useATSScore from '../hooks/useATSScore';
import UnifiedScoreCard from '../components/analysis/UnifiedScoreCard';
import FeedbackPanel from '../components/analysis/FeedbackPanel';
import SuggestionsList from '../components/analysis/SuggestionsList';
import SkillGapChart from '../components/charts/SkillGapChart';
import KeywordCoverageChart from '../components/charts/KeywordCoverageChart';

const AnalysisPage = () => {
  const { parsedText } = useResume();
  const { hasAnalyzed, isAnalyzing, jobDescription, jobMatch } = useAnalysis();
  const { analyzeResume } = useATSScore();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!parsedText) {
      navigate('/');
      return;
    }
    if (!hasAnalyzed && !isAnalyzing) {
      analyzeResume(parsedText, jobDescription);
    }
  }, [parsedText, hasAnalyzed, isAnalyzing]);

  if (!parsedText) return null;

  if (isAnalyzing) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
          <h2 className="text-xl font-display font-bold text-white mb-2">Analyzing Your Resume</h2>
          <p className="text-surface-400 text-sm">Evaluating formatting, keywords, ATS compatibility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-surface-400">Comprehensive breakdown of your resume's strengths and areas for improvement</p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          
          <button
            onClick={() => navigate('/job-match')}
            className="px-5 py-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-sm font-medium hover:bg-accent-500/20 transition-all"
          >
            🎯 Match with Job
          </button>
          <button
            onClick={() => { analyzeResume(parsedText, jobDescription); }}
            className="px-5 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-300 text-sm font-medium hover:bg-surface-700 transition-all"
          >
            🔄 Re-analyze
          </button>
        </div>

        {/* Job Match Result Banner */}
        {jobMatch && jobMatch.hasJobDescription && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                  jobMatch.matchScore >= 70 ? 'bg-accent-500 text-white' :
                  jobMatch.matchScore >= 50 ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {jobMatch.matchScore}%
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">Job Match Score</h3>
                  <p className="text-surface-400 text-sm">
                    {jobMatch.matchedKeywords.length} keywords matched, {jobMatch.missingKeywords.length} missing
                  </p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-surface-400 text-xs mb-2">Matched Keywords</p>
                <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                  {jobMatch.matchedKeywords.slice(0, 5).map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300 text-xs">
                      {k.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {jobMatch.missingKeywords.length > 0 && (
              <div className="mt-4 pt-4 border-t border-surface-700">
                <p className="text-surface-400 text-xs mb-2">Missing Keywords - Add these to improve your match:</p>
                <div className="flex flex-wrap gap-2">
                  {jobMatch.missingKeywords.slice(0, 8).map((k, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs">
                      + {k.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UnifiedScoreCard />
          <FeedbackPanel />
          <SuggestionsList />
        </div>

        {/* Charts */}
        <div className="mt-8">
          <h2 className="text-xl font-display font-bold text-white mb-6">Visual Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <SkillGapChart />
            <KeywordCoverageChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
