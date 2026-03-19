import React, { createContext, useContext, useReducer } from 'react';

const ResumeContext = createContext(null);

const initialState = {
  file: null,
  fileName: '',
  fileType: '',
  rawText: '',
  parsedText: '',
  isLoading: false,
  error: null,
};

const resumeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload.file, fileName: action.payload.name, fileType: action.payload.type, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TEXT':
      return { ...state, rawText: action.payload, parsedText: action.payload, isLoading: false, error: null };
    case 'UPDATE_TEXT':
      return { ...state, parsedText: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const setFile = (file) => dispatch({ type: 'SET_FILE', payload: { file, name: file.name, type: file.type } });
  const setLoading = (loading) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setText = (text) => dispatch({ type: 'SET_TEXT', payload: text });
  const updateText = (text) => dispatch({ type: 'UPDATE_TEXT', payload: text });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <ResumeContext.Provider value={{ ...state, setFile, setLoading, setText, updateText, setError, reset }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};

export default ResumeContext;
