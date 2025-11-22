import {
   GoogleGenerativeAI,
   type ModelParams,
   HarmCategory,
   HarmBlockThreshold,
} from '@google/generative-ai';
import type { Resume } from '../../types/resume.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Handles AI-related errors and throws specific, user-friendly messages.
 * @param error The error object caught.
 * @param context A string describing the context of the error (e.g., 'processing resume').
 */
function handleAIError(error: any, context: string): never {
   console.error(`Error ${context} with AI:`, error);
   if (error.message?.includes('API key')) {
      throw new Error(
         'Invalid or missing Gemini API key. Please check your configuration.'
      );
   }
   if (error.message?.includes('404')) {
      throw new Error(
         'Gemini API model not found. Please update the SDK or use a different model.'
      );
   }
   if (error.message?.includes('quota')) {
      throw new Error(
         'API quota exceeded. Please try again later or upgrade your plan.'
      );
   }
   throw new Error(error.message || `Failed to ${context}. Please try again.`);
}

/**
 * A centralized function to interact with the Gemini AI.
 * @param modelParams Parameters for the generative model.
 * @param prompt The prompt to send to the AI.
 * @returns The cleaned text response from the AI.
 */
async function generateContentWithAI(
   modelParams: ModelParams,
   prompt: string
): Promise<string> {
   if (!GEMINI_API_KEY) {
      throw new Error(
         'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file'
      );
   }

   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
   const model = genAI.getGenerativeModel(modelParams);

   const result = await model.generateContent(prompt);
   const response = result.response;
   let text = response.text();

   console.log('Raw AI response:', text);

   // Clean up the response - remove markdown code blocks if present
   text = text.trim();
   text = text.replace(/```json\s*/g, '');
   text = text.replace(/```\s*/g, '');
   text = text.trim();

   return text;
}

export async function processResumeWithAI(
   pdfText: string,
   resumeTitle: string
): Promise<Partial<Resume>> {
   try {
      const modelParams: ModelParams = {
         model: 'gemini-2.5-pro',
         generationConfig: {
            temperature: 0.1, // Lower temperature for more consistent output
            maxOutputTokens: 8192,
         },
      };

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

      let text = await generateContentWithAI(modelParams, prompt);

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
      handleAIError(error, 'processing resume');
   }
}
export async function enhanceProfessionalSummary(
   currentSummary: string
): Promise<string> {
   try {
      const safetySettings = [
         {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
      ];
      const modelParams: ModelParams = {
         model: 'gemini-2.5-flash', // Using flash for faster response
         generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096, // Increased token limit
         },
         safetySettings,
      };

      const prompt = `
You are a professional resume writer. Enhance and improve the following professional summary from a resume. Make it more compelling, concise, and impactful while retaining the original meaning.

Current Professional Summary:
"${currentSummary}"

Provide only the enhanced professional summary as a raw string, without any markdown, headings, or introductory text.
`;

      const enhancedSummary = await generateContentWithAI(modelParams, prompt);

      if (!enhancedSummary) {
         throw new Error('AI returned an empty response. Please try again.');
      }

      return enhancedSummary;
   } catch (error: any) {
      handleAIError(error, 'enhancing professional summary');
   }
}

export async function enhanceJobDescription(
   description: string
): Promise<string> {
   try {
      const safetySettings = [
         {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
         {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
         },
      ];
      const modelParams: ModelParams = {
         model: 'gemini-2.5-flash',
         generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
         },
         safetySettings,
      };

      const prompt = `
You are a professional resume writer. Enhance the following job description, focusing on achievements and impact. Use action verbs and quantify results where possible.

Current Job Description:
"${description}"

Provide only the enhanced job description as a raw string, without any markdown, headings, or introductory text.
`;

      const enhancedDescription = await generateContentWithAI(
         modelParams,
         prompt
      );

      if (!enhancedDescription) {
         throw new Error('AI returned an empty response. Please try again.');
      }

      return enhancedDescription;
   } catch (error: any) {
      handleAIError(error, 'enhancing job description');
   }
}

export async function captureResumeFromLinkedIn(
   profileContent: string
): Promise<Partial<Resume>> {
   try {
      const modelParams: ModelParams = {
         model: 'gemini-2.5-pro',
         generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
         },
      };

      const prompt = `
You are a LinkedIn profile analyzer. You will receive the pasted text content from a LinkedIn profile page. Extract professional information and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON).

Important LinkedIn Section Mapping:
- Full Name: Extract from the name section at the top of the profile
- Location: This appears BEFORE the "Contact info" section, usually right under the name
- Profession/Headline: The headline/title that appears directly under the person's name
- Email, Phone, Website: These are found under the "Contact info" link/section
- Professional Summary: Extract from the "About" section
- Experience: List all positions from the "Experience" section with company, role, dates, and descriptions
- Education: Extract from the "Education" section
- Projects: Look for project mentions in experience descriptions or dedicated projects section
- Skills: Extract from the "Skills" section

Return a JSON object with this exact structure:
{
  "personal_info": {
    "full_name": "Extract the person's full name from the top of the profile",
    "email": "Extract from Contact info section or empty",
    "phone": "Extract from Contact info section or empty",
    "location": "Extract location (appears before Contact info, under name) or empty",
    "profession": "Extract the headline/title under the person's name or empty",
    "linkedin": "empty",
    "github": "Extract GitHub URL from Contact info if present or empty",
    "website": "Extract website URL from Contact info if present or empty"
  },
  "professional_summary": "Extract the complete text from the About section or empty",
  "experience": [
    {
      "position": "Job title/position",
      "company": "Company name",
      "start_date": "YYYY-MM format (e.g., 2020-01)",
      "end_date": "YYYY-MM format or empty if current",
      "is_current": true or false,
      "description": "Complete job description with all bullet points and details"
    }
  ],
  "education": [
    {
      "degree": "Degree type (e.g., Bachelor's, Master's)",
      "field": "Field of study",
      "institution": "School/University name",
      "gpa": "GPA if mentioned or empty",
      "graduation_date": "YYYY-MM format",
      "achievements": ["List of achievements, honors, or activities if mentioned"]
    }
  ],
  "project": [
    {
      "name": "Project name",
      "type": "Determine if Personal, Professional, or Academic based on context",
      "description": "Project description"
    }
  ],
  "skills": ["Extract each individual skill as a separate string from the Skills section"]
}

CRITICAL RULES:
1. Return ONLY the JSON object, absolutely no additional text, no code blocks, no markdown
2. Use empty strings ("") for any missing text fields
3. Use empty arrays ([]) for missing array fields
4. Extract ALL information accurately from the profile content below
5. For current positions, set is_current to true and end_date to ""
6. For dates, convert to YYYY-MM format (e.g., "Jan 2020" becomes "2020-01")
7. Be thorough - extract complete descriptions, not summaries
8. Match the person's actual information exactly - do not make up or infer data
9. If you see location information, it typically appears right under the person's name and BEFORE the Contact Info
10. The profession/headline is the text that describes what they do, appearing under their name

LinkedIn Profile Content:
${profileContent}
`;

      let text = await generateContentWithAI(modelParams, prompt);

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
         title: parsedData.personal_info?.full_name
            ? `${parsedData.personal_info.full_name} Resume-LinkedIn`
            : 'Resume-LinkedIn',
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
         template: 'classic',
         accent_color: '#3b82f6',
         public: false,
      };

      console.log('Processed LinkedIn resume object:', resume);

      return resume;
   } catch (error: any) {
      handleAIError(error, 'capturing resume from LinkedIn');
   }
}

/**
 * Removes the background from an uploaded image using AI.
 * @param imageFile The image file to process
 * @returns A Blob containing the image with transparent background
 */
export async function removeImageBackground(imageFile: File): Promise<Blob> {
   try {
      // Dynamically import the background removal library
      const { removeBackground } = await import('@imgly/background-removal');

      console.log('Starting background removal for:', imageFile.name);

      // Process the image
      const blob = await removeBackground(imageFile, {
         progress: (key, current, total) => {
            console.log(
               `Background removal progress: ${key} - ${current}/${total}`
            );
         },
      });

      console.log('Background removal completed successfully');
      return blob;
   } catch (error: any) {
      console.error('Error removing background:', error);
      throw new Error(
         error.message || 'Failed to remove background. Please try again.'
      );
   }
}
