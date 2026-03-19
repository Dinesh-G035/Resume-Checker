import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useAnalysis } from '../context/AnalysisContext';
import ResumeEditor from '../components/editor/ResumeEditor';
import ScoreCard from '../components/analysis/ScoreCard';

const EditorPage = () => {
  const { parsedText } = useResume();
  const { hasAnalyzed, overallScore, categories } = useAnalysis();
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
          <h1 className="text-3xl font-display font-bold text-white mb-2">Resume Editor</h1>
          <p className="text-surface-400">Edit your resume in real-time and see your score update instantly</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Editor — takes 2/3 */}
          <div className="xl:col-span-2">
            <ResumeEditor />
          </div>

          {/* Sidebar — live score */}
          <div className="space-y-6">
            {hasAnalyzed && <ScoreCard />}

            {/* Tips panel */}
            <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-display font-bold text-white mb-4">✍️ Editing Tips</h3>
              <div className="space-y-3 text-xs text-surface-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Use <strong className="text-surface-300">action verbs</strong> to start each bullet point (Led, Developed, Improved)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Add <strong className="text-surface-300">quantified metrics</strong> to demonstrate impact (increased revenue by 25%)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Include <strong className="text-surface-300">relevant keywords</strong> from the target job description</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Keep resume between <strong className="text-surface-300">400-1200 words</strong> for optimal ATS scoring</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Avoid <strong className="text-surface-300">personal pronouns</strong> like "I", "me", "my"</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  <p>Switch to <strong className="text-surface-300">Preview mode</strong> to see highlighted keywords</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            {hasAnalyzed && categories && (
              <div className="rounded-2xl bg-surface-900/80 border border-surface-700/50 p-6 backdrop-blur-sm">
                <h3 className="text-sm font-display font-bold text-white mb-4">📈 Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(categories).map(([key, cat]) => (
                    <div key={key} className="text-center p-3 rounded-xl bg-surface-800/50">
                      <p className={`text-lg font-bold ${cat.score >= 70 ? 'text-accent-400' : cat.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {cat.score}%
                      </p>
                      <p className="text-[10px] text-surface-500 mt-0.5 leading-tight">{cat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
