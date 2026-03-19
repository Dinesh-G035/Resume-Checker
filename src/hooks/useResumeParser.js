// Custom hook: Parse uploaded resume files to text
import { useCallback } from 'react';
import { useResume } from '../context/ResumeContext';
import { parsePDF } from '../utils/pdfParser';
import { parseDocx } from '../utils/docxParser';
import { cleanText } from '../utils/textCleaner';

const useResumeParser = () => {
  const { setFile, setLoading, setText, setError } = useResume();

  const parseFile = useCallback(async (file) => {
    setFile(file);
    setLoading(true);

    try {
      let rawText = '';
      const fileType = file.type || file.name.split('.').pop().toLowerCase();

      if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
        rawText = await parsePDF(file);
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        rawText = await parseDocx(file);
      } else if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
        rawText = await file.text();
      } else {
        throw new Error(`Unsupported file type: ${fileType}. Please upload PDF, DOCX, or TXT.`);
      }

      const cleaned = cleanText(rawText);
      if (!cleaned || cleaned.length < 50) {
        throw new Error('Could not extract meaningful text from the file. Please try a different file.');
      }

      setText(cleaned);
      return cleaned;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setFile, setLoading, setText, setError]);

  const parseText = useCallback((text) => {
    const cleaned = cleanText(text);
    setText(cleaned);
    return cleaned;
  }, [setText]);

  return { parseFile, parseText };
};

export default useResumeParser;
