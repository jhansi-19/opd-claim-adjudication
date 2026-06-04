import Tesseract from 'tesseract.js';
import pdf from 'pdf-parse';
import fs from 'fs';

export const extractTextFromFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('File path is required');
    }

    const ext = filePath.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      return await extractTextFromPDF(filePath);
    } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return await extractTextFromImage(filePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};

const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, 'eng');
    const text = result.data.text;
    return text || '';
  } catch (error) {
    console.error('Image OCR error:', error.message);
    throw error;
  }
};

const extractTextFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF text extraction error:', error.message);
    throw error;
  }
};

export default {
  extractTextFromFile
};
