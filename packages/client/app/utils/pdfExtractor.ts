import getTextFromPDF from 'react-pdftotext';

export async function extractTextFromPDF(file: File): Promise<string> {
   try {
      const text = await getTextFromPDF(file);

      if (!text || text.trim().length === 0) {
         throw new Error('No text found in PDF');
      }

      return text.trim();
   } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(
         'Failed to extract text from PDF. Please ensure the PDF contains readable text.'
      );
   }
}
