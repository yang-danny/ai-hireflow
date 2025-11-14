import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Resume } from '../../types/resume.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function processResumeWithAI(
   pdfText: string,
   resumeTitle: string
): Promise<Partial<Resume>> {
   if (!GEMINI_API_KEY) {
      throw new Error(
         'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file'
      );
   }

   try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

      // Use gemini-1.5-flash (faster) or gemini-1.5-pro (better quality)
      const model = genAI.getGenerativeModel({
         model: 'gemini-2.5-pro',
         generationConfig: {
            temperature: 0.1, // Lower temperature for more consistent output
            maxOutputTokens: 8192,
         },
      });

      const prompt = `
You are a resume parser. Extract the following information from the resume text and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON).

Resume Text:
${pdfText}

Extract and return a JSON object with this exact structure:
{
  "personal_info": {
    "full_name": "string or empty",
    "email": "string or empty",
    "phone": "string or empty",
    "location": "string or empty",
    "profession": "string or empty",
    "linkedin": "string or empty",
    "github": "string or empty",
    "website": "string or empty"
  },
  "professional_summary": "string or empty",
  "experience": [
    {
      "position": "string",
      "company": "string",
      "start_date": "YYYY-MM format",
      "end_date": "YYYY-MM format or empty if current",
      "is_current": boolean,
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "gpa": "string or empty",
      "graduation_date": "YYYY-MM format",
      "achievements": ["string array or empty"]
    }
  ],
  "project": [
    {
      "name": "string",
      "type": "string (e.g., 'Personal', 'Professional', 'Academic')",
      "description": "string"
    }
  ],
  "skills": ["array of skill strings"]
}

Important rules:
1. Return ONLY the JSON object, no additional text
2. Use empty strings ("") for missing text fields
3. Use empty arrays ([]) for missing arrays
4. Use false for missing booleans
5. Extract all relevant information from the resume
6. For dates, use YYYY-MM format (e.g., "2023-01")
7. If a job is current, set is_current to true and end_date to ""
8. Split skills into individual items
9. Extract all work experience, education, and projects
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      console.log('Raw AI response:', text);

      // Clean up the response - remove markdown code blocks if present
      text = text.trim();

      // Remove markdown code blocks
      text = text.replace(/```json\s*/g, '');
      text = text.replace(/```\s*/g, '');

      // Remove any leading/trailing whitespace
      text = text.trim();

      // If text doesn't start with {, try to find the JSON object
      if (!text.startsWith('{')) {
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            text = jsonMatch[0];
         }
      }

      console.log('Cleaned text:', text);

      // Parse the JSON
      let parsedData;
      try {
         parsedData = JSON.parse(text);
      } catch (parseError) {
         console.error('JSON parse error:', parseError);
         console.error('Failed to parse text:', text);
         throw new Error('AI returned invalid JSON. Please try again.');
      }

      // Validate and ensure all required fields exist
      const resume: Partial<Resume> = {
         title: resumeTitle,
         personal_info: {
            full_name: parsedData.personal_info?.full_name || '',
            email: parsedData.personal_info?.email || '',
            phone: parsedData.personal_info?.phone || '',
            location: parsedData.personal_info?.location || '',
            profession: parsedData.personal_info?.profession || '',
            linkedin: parsedData.personal_info?.linkedin || '',
            github: parsedData.personal_info?.github || '',
            website: parsedData.personal_info?.website || '',
         },
         professional_summary: parsedData.professional_summary || '',
         experience: Array.isArray(parsedData.experience)
            ? parsedData.experience
            : [],
         education: Array.isArray(parsedData.education)
            ? parsedData.education
            : [],
         project: Array.isArray(parsedData.project) ? parsedData.project : [],
         skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
         template: 'default',
         accent_color: '#00c4cc',
         public: false,
      };

      console.log('Processed resume object:', resume);

      return resume;
   } catch (error: any) {
      console.error('Error processing resume with AI:', error);

      // Provide more specific error messages
      if (error.message?.includes('API key')) {
         throw new Error(
            'Invalid or missing Gemini API key. Please check your configuration.'
         );
      } else if (error.message?.includes('404')) {
         throw new Error(
            'Gemini API model not found. Please update the SDK or use a different model.'
         );
      } else if (error.message?.includes('quota')) {
         throw new Error(
            'API quota exceeded. Please try again later or upgrade your plan.'
         );
      } else {
         throw new Error(
            error.message ||
               'Failed to process resume with AI. Please try again.'
         );
      }
   }
}
export async function enhanceProfessionalSummary(
   currentSummary: string
): Promise<string> {
   if (!GEMINI_API_KEY) {
      throw new Error(
         'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file'
      );
   }

   try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const safetySettings = [
         {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
         },
      ];
      const model = genAI.getGenerativeModel({
         model: 'gemini-2.5-flash', // Using flash for faster response
         generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096, // Increased token limit
         },
         safetySettings,
      });

      const prompt = `
You are a professional resume writer. Enhance and improve the following professional summary from a resume. Make it more compelling, concise, and impactful while retaining the original meaning.

Current Professional Summary:
"${currentSummary}"

Provide only the enhanced professional summary as a raw string, without any markdown, headings, or introductory text.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const enhancedSummary = response.text().trim();

      if (!enhancedSummary) {
         console.error('AI response was empty.', response);
         throw new Error('AI returned an empty response. Please try again.');
      }

      return enhancedSummary;
   } catch (error: any) {
      console.error('Error enhancing professional summary with AI:', error);
      // Re-throw the error to be caught by the calling component
      throw error;
   }
}

export async function enhanceJobDescription(
   description: string
): Promise<string> {
   if (!GEMINI_API_KEY) {
      throw new Error(
         'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file'
      );
   }

   try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const safetySettings = [
         {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
         },
         {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
         },
      ];
      const model = genAI.getGenerativeModel({
         model: 'gemini-2.5-flash',
         generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
         },
         safetySettings,
      });

      const prompt = `
You are a professional resume writer. Enhance the following job description, focusing on achievements and impact. Use action verbs and quantify results where possible.

Current Job Description:
"${description}"

Provide only the enhanced job description as a raw string, without any markdown, headings, or introductory text.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const enhancedDescription = response.text().trim();

      if (!enhancedDescription) {
         console.error('AI response was empty.', response);
         throw new Error('AI returned an empty response. Please try again.');
      }

      return enhancedDescription;
   } catch (error: any) {
      console.error('Error enhancing job description with AI:', error);
      throw error;
   }
}
