import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useResumeParser from '../../hooks/useResumeParser';
import { useResume } from '../../context/ResumeContext';

const DropZone = () => {
  const { parseFile } = useResumeParser();
  const { isLoading, error } = useResume();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      await parseFile(acceptedFiles[0]);
    }
  }, [parseFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center
          ${isDragActive && !isDragReject
            ? 'border-primary-400 bg-primary-500/10 shadow-glow scale-[1.02]'
            : isDragReject
            ? 'border-red-400 bg-red-500/10'
            : 'border-surface-600 hover:border-primary-500/50 bg-surface-900/50 hover:bg-surface-800/50'
          }`}
      >
        <input {...getInputProps()} id="resume-upload" />

        {/* Floating orbs decoration */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors duration-500" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/10 transition-colors duration-500" />
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
              <p className="text-surface-300 font-medium">Parsing your resume...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isDragActive
                  ? 'bg-primary-500/20 scale-110'
                  : 'bg-surface-800 group-hover:bg-primary-500/10 group-hover:scale-105'
                }`}>
                <svg className={`w-8 h-8 transition-colors ${isDragActive ? 'text-primary-400' : 'text-surface-400 group-hover:text-primary-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
              </h3>
              <p className="text-surface-400 text-sm mb-4">
                Drag & drop or <span className="text-primary-400 underline underline-offset-2">browse files</span>
              </p>

              <div className="flex items-center justify-center gap-3 text-xs text-surface-500">
                <span className="px-2 py-1 rounded-full bg-surface-800/80">PDF</span>
                <span className="px-2 py-1 rounded-full bg-surface-800/80">DOCX</span>
                <span className="px-2 py-1 rounded-full bg-surface-800/80">TXT</span>
                <span className="text-surface-600">•</span>
                <span>Max 10MB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-up">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default DropZone;
