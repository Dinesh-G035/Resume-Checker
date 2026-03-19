// DOCX text extraction wrapper using mammoth
import mammoth from 'mammoth';

/**
 * Extract text from a DOCX file
 * @param {File} file - DOCX file object
 * @returns {Promise<string>} extracted text
 */
export const parseDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parse warnings:', result.messages);
    }

    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. Please ensure the file is a valid Word document.');
  }
};

/**
 * Extract styled HTML from a DOCX file (preserves formatting)
 * @param {File} file - DOCX file object
 * @returns {Promise<string>} extracted HTML
 */
export const parseDocxToHtml = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX HTML conversion error:', error);
    throw new Error('Failed to convert DOCX file to HTML.');
  }
};

export default parseDocx;
