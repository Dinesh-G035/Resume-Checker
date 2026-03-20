import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import JobMatchPage from './pages/JobMatchPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'analysis', element: <AnalysisPage /> },
        { path: 'job-match', element: <JobMatchPage /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;