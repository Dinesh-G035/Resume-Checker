import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useAnalysis } from '../context/AnalysisContext';
import useATSScore from '../hooks/useATSScore';
import DropZone from '../components/upload/DropZone';
import TextPasteInput from '../components/upload/TextPasteInput';
import FilePreview from '../components/upload/FilePreview';

const HomePage = () => {
  const [inputMode, setInputMode] = useState('upload');
  const [jobDescription, setJobDescription] = useState('');
  const { parsedText } = useResume();
  const { setJobDescription: setJD } = useAnalysis();
  const { analyzeResume } = useATSScore();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!parsedText) return;
    if (jobDescription.trim()) {
      setJD(jobDescription.trim());
    }
    await analyzeResume(parsedText, jobDescription.trim());
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/[0.07] rounded-full blur-[120px] animate-float" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-accent-500/[0.05] rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-900/20 rounded-full blur-[120px]" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-[0.03]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 text-center mb-16 pt-6">
        <div className="relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-soft"></span>
              AI-Powered Resume Analysis
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-white via-surface-200 to-surface-400 bg-clip-text text-transparent">
                Make Your Resume
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                ATS-Ready
              </span>
            </h1>

            <p className="text-surface-400 text-lg max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed">
              Upload your resume and get instant analysis, ATS compatibility scoring,
              keyword optimization, and actionable suggestions to land more interviews.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {[
            { value: '10K+', label: 'Resumes Analyzed', icon: '📄' },
            { value: '85%', label: 'Avg Score Improvement', icon: '📈' },
            { value: '12+', label: 'ATS Rules Checked', icon: '✅' },
            { value: 'Free', label: 'No Sign-up Required', icon: '🆓' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-surface-800/80 border border-surface-700/50 flex items-center justify-center text-lg group-hover:border-primary-500/30 group-hover:bg-primary-500/10 transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg font-display">{stat.value}</div>
                <div className="text-surface-500 text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT SIDE — Upload */}
          <div>
            {/* Tab switcher */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setInputMode('upload')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${inputMode === 'upload'
                  ? 'bg-primary-500/20 text-primary-300 shadow-glow'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📁 Upload File
              </button>

              <button
                onClick={() => setInputMode('paste')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${inputMode === 'paste'
                  ? 'bg-primary-500/20 text-primary-300 shadow-glow'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
                }`}
              >
                📋 Paste Text
              </button>
            </div>

            {/* Upload Area */}
            <div className="glass-card-dark p-6">
              {inputMode === 'upload' ? <DropZone /> : <TextPasteInput />}
            </div>

            {/* Job Description — always visible */}
            <div className="mt-6 glass-card-dark p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎯</span>
                <h3 className="text-sm font-semibold text-white">Job Description <span className="text-surface-500 font-normal">(optional)</span></h3>
              </div>
              <textarea
                id="job-description-input"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description to get job-specific keyword matching and tailored suggestions..."
                rows={4}
                className="w-full rounded-xl bg-surface-900/50 border border-surface-700 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 text-white placeholder-surface-500 p-4 text-sm leading-relaxed resize-none transition-all duration-200 outline-none"
              />
              {jobDescription.trim() && (
                <p className="text-accent-400 text-xs mt-2 flex items-center gap-1">
                  <span>✓</span> Job description will be used for targeted analysis
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — Preview or Feature Cards */}
          {parsedText ? (
            <div className="glass-card-dark p-6">
              <FilePreview onAnalyze={handleAnalyze} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* What You'll Get */}
              <div className="glass-card-dark p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs">✨</span>
                  What You'll Get
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '📊', title: 'ATS Score', desc: 'Overall compatibility rating with 12+ rule checks', color: 'primary' },
                    { icon: '🔍', title: 'Keyword Analysis', desc: 'Technical & soft skill keyword detection', color: 'accent' },
                    { icon: '💡', title: 'Smart Suggestions', desc: 'Actionable improvements for each section', color: 'primary' },
                    { icon: '📈', title: 'Visual Analytics', desc: 'Charts showing strengths & gaps at a glance', color: 'accent' },
                    { icon: '🎯', title: 'Job Matching', desc: 'Compare your resume against job descriptions', color: 'primary' },
                    { icon: '✏️', title: 'Inline Editor', desc: 'Edit and see your score update in real-time', color: 'accent' },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-800/30 border border-surface-700/30 hover:border-primary-500/20 hover:bg-surface-800/60 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-800 group-hover:bg-primary-500/10 flex items-center justify-center text-base flex-shrink-0 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                        <p className="text-xs text-surface-500">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-3">How It Works</h2>
          <p className="text-surface-500 text-sm max-w-lg mx-auto">Three simple steps to optimize your resume for Applicant Tracking Systems</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Upload Resume',
              desc: 'Upload your PDF, DOCX, or paste text directly. We parse and extract all content instantly.',
              icon: '📤',
              gradient: 'from-primary-500/10 to-primary-500/5',
              borderHover: 'hover:border-primary-500/30',
            },
            {
              step: '02',
              title: 'Get Analysis',
              desc: 'Receive ATS score, keyword analysis, formatting feedback, and improvement suggestions.',
              icon: '📊',
              gradient: 'from-accent-500/10 to-accent-500/5',
              borderHover: 'hover:border-accent-500/30',
            },
            {
              step: '03',
              title: 'Optimize & Export',
              desc: 'Edit inline with real-time scoring, compare with job descriptions, and download your refined resume.',
              icon: '✨',
              gradient: 'from-primary-500/10 to-accent-500/5',
              borderHover: 'hover:border-primary-400/30',
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`group relative rounded-2xl bg-gradient-to-b ${item.gradient} border border-surface-700/50 ${item.borderHover} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/5`}
            >
              <div className="absolute -top-3 -left-2 text-5xl font-display font-extrabold text-surface-800/50 group-hover:text-primary-500/15 transition-colors duration-300">
                {item.step}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-surface-800/80 group-hover:bg-primary-500/10 flex items-center justify-center text-2xl mb-4 transition-all duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Formats */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 mt-24 mb-8">
        <div className="glass-card-dark p-8 text-center">
          <h3 className="text-lg font-display font-bold text-white mb-6">Supported Formats & Features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '📄', label: 'PDF Files', sub: '.pdf' },
              { icon: '📝', label: 'Word Docs', sub: '.docx' },
              { icon: '📋', label: 'Text Files', sub: '.txt' },
              { icon: '✂️', label: 'Paste Text', sub: 'clipboard' },
            ].map((fmt) => (
              <div key={fmt.label} className="group px-4 py-5 rounded-xl bg-surface-800/30 border border-surface-700/30 hover:border-primary-500/20 transition-all duration-300 hover:-translate-y-0.5">
                <div className="text-2xl mb-2">{fmt.icon}</div>
                <div className="text-sm font-medium text-white">{fmt.label}</div>
                <div className="text-xs text-surface-500 mt-1">{fmt.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
