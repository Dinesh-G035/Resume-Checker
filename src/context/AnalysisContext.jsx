import React, { createContext, useContext, useReducer } from 'react';

const AnalysisContext = createContext(null);

const initialState = {
  overallScore: null,
  atsScore: null,
  categories: {},
  strengths: [],
  weaknesses: [],
  suggestions: [],
  keywords: { technical: [], soft: [], certifications: [], all: [] },
  jobDescription: '',
  jobMatch: null,
  isAnalyzing: false,
  hasAnalyzed: false,
};

const analysisReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESULTS':
      return { ...state, ...action.payload, isAnalyzing: false, hasAnalyzed: true };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    case 'SET_JOB_MATCH':
      return { ...state, jobMatch: action.payload };
    case 'UPDATE_SCORE':
      return { ...state, overallScore: action.payload.overallScore, categories: action.payload.categories, atsScore: action.payload.atsScore };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const AnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const setResults = (results) => dispatch({ type: 'SET_RESULTS', payload: results });
  const setAnalyzing = (analyzing) => dispatch({ type: 'SET_ANALYZING', payload: analyzing });
  const setJobDescription = (jd) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: jd });
  const setJobMatch = (match) => dispatch({ type: 'SET_JOB_MATCH', payload: match });
  const updateScore = (score) => dispatch({ type: 'UPDATE_SCORE', payload: score });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <AnalysisContext.Provider value={{ ...state, setResults, setAnalyzing, setJobDescription, setJobMatch, updateScore, reset }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
};

export default AnalysisContext;
