import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

const useExport = () => {
  const exportAsPDF = useCallback((text, fileName = 'resume-optimized.pdf') => {
    if (!text) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = margin;

    // Set font
    doc.setFont('helvetica');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, maxLineWidth);

    lines.forEach((line) => {
      if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save(fileName);
  }, []);

  const exportAsText = useCallback((text, fileName = 'resume-optimized.txt') => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
  }, []);

  const exportAsDocx = useCallback((text, fileName = 'resume-optimized.docx') => {
    // Basic plain-text-to-docx export (simplified)
    if (!text) return;
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, fileName);
  }, []);

  return { exportAsPDF, exportAsText, exportAsDocx };
};

export default useExport;
