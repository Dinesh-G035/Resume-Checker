import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">RC</span>
              </div>
              <span className="font-display font-bold text-lg text-white">ResumeChecker</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed">
              AI-powered resume analysis and ATS optimization. Get real-time feedback to land your dream job.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-surface-400 hover:text-primary-400 text-sm transition-colors">Upload Resume</Link>
              <Link to="/analysis" className="block text-surface-400 hover:text-primary-400 text-sm transition-colors">Analysis Dashboard</Link>
              <Link to="/editor" className="block text-surface-400 hover:text-primary-400 text-sm transition-colors">Resume Editor</Link>
              <Link to="/job-match" className="block text-surface-400 hover:text-primary-400 text-sm transition-colors">Job Match</Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-3">Features</h3>
            <div className="space-y-2 text-surface-400 text-sm">
              <p>📄 PDF, DOCX & TXT Support</p>
              <p>🎯 ATS Compatibility Scoring</p>
              <p>📊 Visual Analytics</p>
              <p>⚡ Real-time Feedback</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-surface-500 text-sm">
          © {new Date().getFullYear()} ResumeChecker. Built for job seekers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
