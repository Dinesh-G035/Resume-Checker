import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResumeProvider>
      <AnalysisProvider>
        <RouterProvider router={router} />
      </AnalysisProvider>
    </ResumeProvider>
  </React.StrictMode>
);
