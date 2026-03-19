import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source - use a specific version that works
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const PDFPreview = ({ file, onTextExtracted }) => {
  const [pdfPages, setPdfPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    const renderPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        const pages = [];
        const textParts = [];

        // Limit to first 2 pages for preview
        const maxPages = Math.min(pdf.numPages, 2);

        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          
          // Get text content
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          textParts.push(pageText);

          // Render page as image
          const scale = 1.0;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          pages.push(canvas.toDataURL('image/png'));
        }

        setPdfPages(pages);
        
        // Pass extracted text to parent
        if (onTextExtracted) {
          const fullText = textParts.join('\n\n');
          onTextExtracted(fullText);
        }
      } catch (err) {
        console.error('PDF rendering error:', err);
        setError('Could not render PDF preview. The file may be encrypted or corrupted.');
      } finally {
        setIsLoading(false);
      }
    };

    renderPDF();
  }, [file, onTextExtracted]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <span className="ml-3 text-surface-400 text-sm">Loading PDF preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-400 text-xs">{error}</p>
      </div>
    );
  }

  if (pdfPages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {pdfPages.map((pageData, index) => (
        <div key={index} className="relative rounded-lg overflow-hidden border border-surface-700 bg-surface-800">
          <img 
            src={pageData} 
            alt={`Page ${index + 1}`}
            className="w-full h-auto"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
            Page {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDFPreview;

