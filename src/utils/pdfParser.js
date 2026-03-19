import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const textParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => item.str)
        .join(' ');
      textParts.push(pageText);
    }

    return textParts.join('\n\n');
  } catch (error) {
    console.error('PDF parsing error:', error);
    console.error('Detailed PDF parsing error:', error);
    if (error.name === 'PasswordException') {
      throw new Error('PDF is password protected. Please remove password and try again.');
    } else if (error.name === 'MissingPDFException') {
      throw new Error('Invalid PDF file. Please check the file.');
    } else if (error.name === 'UnexpectedError') {
      throw new Error('PDF parsing failed. The file may be corrupted or encrypted.');
    }
    throw new Error(`Failed to parse PDF: ${error.message}. Please try a different file.`);
  }
};

export default parsePDF;
