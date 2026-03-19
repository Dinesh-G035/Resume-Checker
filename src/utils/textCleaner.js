export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\S\n]+/g, ' ')    // collapse multiple spaces (not newlines)
    .replace(/\n{3,}/g, '\n\n')    // collapse 3+ newlines to 2
    .trim();
};

export const getLines = (text) =>
  cleanText(text).split('\n').filter((line) => line.trim().length > 0);

export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};


export const getSentences = (text) => {
  if (!text) return [];
  return text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
};


export const removeSpecialChars = (text) =>
  text.replace(/[^a-zA-Z0-9\s.,;:!?'"-]/g, '');


export const normalizePunctuation = (text) =>
  text.replace(/\s+([.,;:!?])/g, '$1').replace(/([.,;:!?])(\w)/g, '$1 $2');

export default {
  cleanText,
  getLines,
  countWords,
  getSentences,
  removeSpecialChars,
  normalizePunctuation,
};
