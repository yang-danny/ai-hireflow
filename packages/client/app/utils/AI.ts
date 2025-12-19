import {
   GoogleGenerativeAI,
   type ModelParams,
   HarmCategory,
   HarmBlockThreshold,
} from '@google/generative-ai';
import type { Resume } from '../../types/resume.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.GEMINI_MODEL || 'gemini-2.5-flash';

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
         model: GEMINI_MODEL,
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
         model: GEMINI_MODEL, // Using flash for faster response
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
         model: GEMINI_MODEL,
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
         model: GEMINI_MODEL,
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

      // Process the image
      const blob = await removeBackground(imageFile, {
         progress: (key, current, total) => {
            console.log(
               `Background removal progress: ${key} - ${current}/${total}`
            );
         },
      });
      return blob;
   } catch (error: any) {
      console.error('Error removing background:', error);
      throw new Error(
         error.message || 'Failed to remove background. Please try again.'
      );
   }
}

/**
 * Generates a cover letter based on job details and resume information.
 * @param jobDetails Object containing company, position, location, and job description
 * @param resumeText The resume text or resume object
 * @param tone The tone of the cover letter (conservative, balanced, enthusiastic)
 * @returns The generated cover letter text
 */
export async function generateCoverLetter(
   jobDetails: {
      companyName: string;
      jobTitle: string;
      location?: string;
      jobDescription: string;
   },
   resumeText: string,
   tone: 'conservative' | 'balanced' | 'enthusiastic' = 'balanced'
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
         model: GEMINI_MODEL,
         generationConfig: {
            temperature:
               tone === 'conservative' ? 0.3 : tone === 'balanced' ? 0.5 : 0.7,
            maxOutputTokens: 4096,
         },
         safetySettings,
      };

      const toneGuidelines = {
         conservative:
            'Use professional, formal language. Be respectful and traditional. Avoid overly enthusiastic language.',
         balanced:
            'Use professional yet personable language. Strike a balance between formality and warmth.',
         enthusiastic:
            'Use energetic, passionate language while maintaining professionalism. Show genuine excitement about the opportunity.',
      };

      const prompt = `
You are an expert cover letter writer. Generate a compelling, personalized cover letter based on the following information.

TONE: ${tone.toUpperCase()}
${toneGuidelines[tone]}

JOB DETAILS:
- Company: ${jobDetails.companyName}
- Position: ${jobDetails.jobTitle}
${jobDetails.location ? `- Location: ${jobDetails.location}` : ''}

JOB DESCRIPTION:
${jobDetails.jobDescription}

CANDIDATE'S RESUME:
${resumeText}

INSTRUCTIONS:
1. Create a professional cover letter that is 3-4 paragraphs long
2. Start with a strong opening that expresses interest in the specific position
3. Highlight 2-3 key qualifications from the resume that match the job requirements
4. Show knowledge of the company and explain why you want to work there
5. Include specific examples and achievements from the resume
6. End with a call to action
7. Use the specified tone throughout
8. DO NOT include placeholder text for applicant name, address, or date - start directly with the salutation
9. Use "Dear Hiring Manager," as the salutation
10. End with "Sincerely," followed by a blank line for signature
11. Keep the letter concise and impactful (approximately 250-280 words)

CRITICAL: Return ONLY the cover letter text itself. DO NOT include:
- The candidate's resume
- Any resume sections (Experience, Education, Skills, etc.)
- The job description
- Any metadata or headers
- Any commentary or explanations

Your output should start with "Dear Hiring Manager," and end with "Sincerely," - nothing else.
`;

      const coverLetter = await generateContentWithAI(modelParams, prompt);

      if (!coverLetter) {
         throw new Error('AI returned an empty response. Please try again.');
      }

      // Clean up the response - remove any resume content or metadata
      let cleanedLetter = coverLetter.trim();

      // Remove any markdown code blocks
      cleanedLetter = cleanedLetter.replace(/```[\s\S]*?```/g, '');

      // Remove common resume headers and sections (case insensitive, multiline)
      const resumePatterns = [
         /CANDIDATE'S RESUME:[\s\S]*/gi,
         /RESUME:[\s\S]*/gi,
         /^[\s\S]*?(?=Dear Hiring Manager|Dear [A-Z])/i,
         /EXPERIENCE:[\s\S]*/gi,
         /WORK EXPERIENCE:[\s\S]*/gi,
         /EDUCATION:[\s\S]*/gi,
         /SKILLS:[\s\S]*/gi,
         /PROFESSIONAL SUMMARY:[\s\S]*/gi,
         /OBJECTIVE:[\s\S]*/gi,
         /JOB DESCRIPTION:[\s\S]*/gi,
         /COMPANY:[\s\S]*?(?=Dear)/gi,
      ];

      for (const pattern of resumePatterns) {
         cleanedLetter = cleanedLetter.replace(pattern, '');
      }

      // Split into lines for processing
      const lines = cleanedLetter.split('\n');

      // Find the start of the letter (salutation)
      const letterStart = lines.findIndex((line) => {
         const lowerLine = line.toLowerCase().trim();
         return (
            lowerLine.startsWith('dear ') ||
            lowerLine.startsWith('to whom it may concern') ||
            lowerLine.includes('dear hiring manager')
         );
      });

      // Find the end of the letter (closing)
      let letterEnd = -1;
      for (let i = lines.length - 1; i > letterStart; i--) {
         const lowerLine = lines[i].toLowerCase().trim();
         if (
            lowerLine.startsWith('sincerely') ||
            lowerLine.startsWith('best regards') ||
            lowerLine.startsWith('yours truly') ||
            lowerLine.startsWith('respectfully')
         ) {
            letterEnd = i;
            break;
         }
      }

      // Extract only the letter content
      if (letterStart !== -1 && letterEnd !== -1) {
         // Include from salutation to closing, plus a few blank lines after
         cleanedLetter = lines.slice(letterStart, letterEnd + 4).join('\n');
      } else if (letterStart !== -1) {
         // If no closing found, take from salutation onwards but stop at obvious resume markers
         let endIndex = lines.length;
         for (let i = letterStart + 1; i < lines.length; i++) {
            const line = lines[i].toLowerCase().trim();
            // Stop if we hit resume-like content
            if (
               line.includes('resume:') ||
               line.includes('experience:') ||
               line.includes('education:') ||
               line.includes('skills:') ||
               line.includes('professional summary:') ||
               line.includes('work history:') ||
               line.match(/^\s*---+\s*$/) ||
               line.match(/^\d{4}\s*-\s*\d{4}/) || // Date ranges like "2020 - 2023"
               line.match(/^[A-Z\s]+:$/)
            ) {
               // All caps headers
               endIndex = i;
               break;
            }
         }
         cleanedLetter = lines.slice(letterStart, endIndex).join('\n');
      }

      // Final cleanup pass - remove any trailing resume sections
      cleanedLetter =
         cleanedLetter
            .split('\n\n\n')
            .find(
               (section) =>
                  section.toLowerCase().includes('dear') ||
                  section.toLowerCase().includes('sincerely')
            ) || cleanedLetter;

      // Remove horizontal rules and content after them
      cleanedLetter = cleanedLetter.replace(/\n\s*[-=_]{3,}\s*\n[\s\S]*$/g, '');

      const result = cleanedLetter.trim();

      // Validation: ensure we got something that looks like a letter
      if (!result.toLowerCase().includes('dear') || result.length < 100) {
         console.warn(
            'Cleanup may have been too aggressive, returning original'
         );
         return coverLetter.trim();
      }

      return result;
   } catch (error: any) {
      handleAIError(error, 'generating cover letter');
   }
}

/**
 * Interface for category-specific feedback
 */
export interface CategoryFeedback {
   score: number;
   feedback: string;
}

/**
 * Interface for the complete resume analysis result
 */
export interface AnalysisResult {
   overallScore: number;
   structure: CategoryFeedback;
   toneAndStyle: CategoryFeedback;
   skills: CategoryFeedback;
   content: CategoryFeedback;
   atsScore: number;
   atsSuggestions: string[];
}

/**
 * Analyzes a resume against job requirements and returns detailed feedback.
 * @param jobDetails Object containing company name, job title, location, and job description
 * @param resumeText The resume text content to analyze
 * @returns Comprehensive analysis result with scores and feedback
 */
export async function analyseResume(
   jobDetails: {
      companyName: string;
      jobTitle: string;
      location?: string;
      jobDescription: string;
   },
   resumeText: string
): Promise<AnalysisResult> {
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
         model: GEMINI_MODEL,
         generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent analysis
            maxOutputTokens: 8192,
         },
         safetySettings,
      };

      const prompt = `
You are an expert resume analyzer and career coach. Analyze the following resume against the provided job requirements and return a comprehensive evaluation.

JOB DETAILS:
- Company: ${jobDetails.companyName}
- Position: ${jobDetails.jobTitle}
${jobDetails.location ? `- Location: ${jobDetails.location}` : ''}

JOB DESCRIPTION:
${jobDetails.jobDescription}

RESUME TO ANALYZE:
${resumeText}

Analyze the resume across multiple dimensions and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON) with this exact structure:

{
  "overallScore": number (0-100, weighted average of all categories),
  "structure": {
    "score": number (0-100),
    "feedback": "Detailed feedback about resume structure, formatting, organization, section ordering, readability, white space usage, and visual hierarchy. Include specific suggestions for improvement."
  },
  "toneAndStyle": {
    "score": number (0-100),
    "feedback": "Analysis of language tone, writing style, professionalism, use of action verbs, consistency, and overall presentation. Provide specific examples and improvement suggestions."
  },
  "skills": {
    "score": number (0-100),
    "feedback": "Evaluation of skills alignment with job requirements, technical competencies, soft skills representation, and skill relevancy. Identify missing critical skills and over-represented irrelevant skills."
  },
  "content": {
    "score": number (0-100),
    "feedback": "Assessment of content quality, achievement quantification, impact demonstration, relevance to target role, experience alignment, and overall completeness. Suggest specific improvements."
  },
  "atsScore": number (0-100, focused on ATS compatibility),
  "atsSuggestions": [
    "At least 3-5 specific, actionable suggestions to improve ATS compatibility. Focus on keyword usage, formatting compatibility, section headers, file format, special characters, tables/columns, and other ATS-specific factors."
  ]
}

ANALYSIS CRITERIA:

1. **Structure (${jobDetails.jobTitle} context):**
   - Logical flow and section organization
   - Appropriate length and density
   - Visual hierarchy and readability
   - Professional formatting

2. **Tone & Style:**
   - Professional and appropriate language
   - Strong action verbs and active voice
   - Consistent tense and style
   - Clear and concise communication

3. **Skills Match:**
   - Alignment with required job skills
   - Relevant technical skills for ${jobDetails.jobTitle}
   - Soft skills demonstration
   - Industry-specific competencies

4. **Content Quality:**
   - Quantified achievements and results
   - Relevance to ${jobDetails.companyName} and ${jobDetails.jobTitle}
   - Demonstrated impact and value
   - Appropriate level of detail

5. **ATS Optimization:**
   - Keyword matching from job description
   - ATS-friendly formatting (no tables, columns, headers/footers)
   - Standard section headers
   - Readable fonts and structure
   - Proper file format compatibility

SCORING GUIDELINES:
- 90-100: Excellent, minimal improvements needed
- 80-89: Very good, minor refinements suggested
- 70-79: Good, some improvements recommended
- 60-69: Fair, several improvements needed
- Below 60: Needs significant work

Provide constructive, specific, and actionable feedback. Focus on improvements that will increase the candidate's chances for ${jobDetails.jobTitle} at ${jobDetails.companyName}.

Return ONLY the JSON object, no additional text or formatting.
`;

      let text = await generateContentWithAI(modelParams, prompt);

      // If text doesn't start with {, try to find the JSON object
      if (!text.startsWith('{')) {
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            text = jsonMatch[0];
         }
      }

      // Parse the JSON
      let parsedData: AnalysisResult;
      try {
         parsedData = JSON.parse(text);
      } catch (parseError) {
         console.error('JSON parse error:', parseError);
         console.error('Failed to parse text:', text);
         throw new Error('AI returned invalid JSON. Please try again.');
      }

      // Validate the structure
      if (
         typeof parsedData.overallScore !== 'number' ||
         typeof parsedData.atsScore !== 'number' ||
         !parsedData.structure ||
         !parsedData.toneAndStyle ||
         !parsedData.skills ||
         !parsedData.content ||
         !Array.isArray(parsedData.atsSuggestions)
      ) {
         throw new Error('AI returned incomplete analysis. Please try again.');
      }

      // Ensure scores are within valid range
      const clampScore = (score: number) => Math.max(0, Math.min(100, score));
      parsedData.overallScore = clampScore(parsedData.overallScore);
      parsedData.atsScore = clampScore(parsedData.atsScore);
      parsedData.structure.score = clampScore(parsedData.structure.score);
      parsedData.toneAndStyle.score = clampScore(parsedData.toneAndStyle.score);
      parsedData.skills.score = clampScore(parsedData.skills.score);
      parsedData.content.score = clampScore(parsedData.content.score);

      return parsedData;
   } catch (error: any) {
      handleAIError(error, 'analyzing resume');
   }
}

/**
 * Interface for preparation plan
 */
export interface PreparationPlan {
   timeline: string;
   employerResearch: string;
   technicalResources: Array<{
      name: string;
      description: string;
      url?: string;
   }>;
   skillAlignment: string;
   practiceAndFinalPrep: string;
}

/**
 * Interface for mock questions
 */
export interface MockQuestions {
   technicalQuestions: string[];
   behavioralQuestions: string[];
   questionsToAsk: string[];
}

/**
 * Interface for interview analytics
 */
export interface InterviewAnalytics {
   confidence: number;
   clarity: number;
   logicAndStructure: number;
   toneAndPronunciation: number;
   improvementSuggestions: string[];
}

/**
 * Interface for complete interview preparation result
 */
export interface InterviewPreparationResult {
   preparationPlan: PreparationPlan;
   mockQuestions: MockQuestions;
}

/**
 * Generates comprehensive interview preparation content based on job details and resume.
 * @param jobDetails Object containing company name, job title, location, and job description
 * @param resumeText The resume text content to analyze
 * @returns Complete interview preparation with plan and mock questions
 */
export async function generateInterviewPreparation(
   jobDetails: {
      companyName: string;
      jobTitle: string;
      location?: string;
      jobDescription: string;
   },
   resumeText: string
): Promise<InterviewPreparationResult> {
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
         model: GEMINI_MODEL,
         generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 8192,
         },
         safetySettings,
      };

      const prompt = `
You are an expert career coach and interview preparation specialist. Generate a comprehensive interview preparation guide based on the following information.

JOB DETAILS:
- Company: ${jobDetails.companyName}
- Position: ${jobDetails.jobTitle}
${jobDetails.location ? `- Location: ${jobDetails.location}` : ''}

JOB DESCRIPTION:
${jobDetails.jobDescription}

CANDIDATE'S RESUME:
${resumeText}

Generate a comprehensive interview preparation guide and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON) with this exact structure:

{
  "preparationPlan": {
    "timeline": "A detailed timeline for interview preparation with specific phases and time allocations. Include what to do in each phase (e.g., Week 1: Research company, Week 2: Practice technical skills, etc.)",
    "employerResearch": "Detailed guidance on researching ${jobDetails.companyName}, the interviewer role, company culture, recent news, products/services, competitors, and how to use this information effectively in the interview. Be specific.",
    "technicalResources": [
      {
        "name": "Resource name",
        "description": "Brief description of what this resource provides",
        "url": "Optional URL to the resource (can be empty string if not applicable)"
      }
    ],
    "skillAlignment": "Detailed strategy for aligning the candidate's skills and experiences from their resume with the job requirements. Highlight specific experiences to emphasize and how to present them effectively.",
    "practiceAndFinalPrep": "Comprehensive final preparation checklist including mock interview tips, what to prepare the day before, day-of preparation, common pitfalls to avoid, and confidence-building techniques."
  },
  "mockQuestions": {
    "technicalQuestions": [
      "At least 5 technical questions specific to ${jobDetails.jobTitle} at ${jobDetails.companyName}. Base these on the job description and industry standards."
    ],
    "behavioralQuestions": [
      "At least 5 behavioral questions using STAR method framework. Include questions about teamwork, conflict resolution, leadership, problem-solving, and handling challenges."
    ],
    "questionsToAsk": [
      "At least 3 thoughtful questions the candidate should ask the interviewer. Make them specific to ${jobDetails.companyName} and ${jobDetails.jobTitle}."
    ]
  }
}

IMPORTANT GUIDELINES:

1. **Preparation Plan:**
   - Timeline should be realistic and actionable (e.g., 2-4 weeks)
   - Employer research should be specific to ${jobDetails.companyName}
   - Technical resources must be at least 5-7 objects with name, description, and optional url, relevant to ${jobDetails.jobTitle}
   - Skill alignment should reference specific items from the candidate's resume
   - Practice tips should be comprehensive and actionable

2. **Mock Questions:**
   - Technical questions should match the job level and requirements
   - Include at least 5 technical questions
   - Include at least 5 behavioral questions
   - Include at least 3 questions for the candidate to ask
   - Questions should be realistic and commonly asked in ${jobDetails.jobTitle} interviews

3. **Quality:**
   - Be specific and actionable
   - Personalize content based on the resume and job description
   - Provide concrete examples and resources
   - Focus on practical, useful information

Return ONLY the JSON object, no additional text or formatting.
`;

      let text = await generateContentWithAI(modelParams, prompt);

      // If text doesn't start with {, try to find the JSON object
      if (!text.startsWith('{')) {
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            text = jsonMatch[0];
         }
      }

      // Parse the JSON
      let parsedData: InterviewPreparationResult;
      try {
         parsedData = JSON.parse(text);
      } catch (parseError) {
         console.error('JSON parse error:', parseError);
         console.error('Failed to parse text:', text);
         throw new Error('AI returned invalid JSON. Please try again.');
      }

      // Validate the structure
      if (
         !parsedData.preparationPlan ||
         !parsedData.mockQuestions ||
         typeof parsedData.preparationPlan.timeline !== 'string' ||
         typeof parsedData.preparationPlan.employerResearch !== 'string' ||
         !Array.isArray(parsedData.preparationPlan.technicalResources) ||
         typeof parsedData.preparationPlan.skillAlignment !== 'string' ||
         typeof parsedData.preparationPlan.practiceAndFinalPrep !== 'string' ||
         !Array.isArray(parsedData.mockQuestions.technicalQuestions) ||
         !Array.isArray(parsedData.mockQuestions.behavioralQuestions) ||
         !Array.isArray(parsedData.mockQuestions.questionsToAsk)
      ) {
         throw new Error(
            'AI returned incomplete preparation data. Please try again.'
         );
      }

      // Validate minimum question counts
      if (parsedData.mockQuestions.technicalQuestions.length < 5) {
         throw new Error(
            'Insufficient technical questions generated. Please try again.'
         );
      }
      if (parsedData.mockQuestions.behavioralQuestions.length < 5) {
         throw new Error(
            'Insufficient behavioral questions generated. Please try again.'
         );
      }
      if (parsedData.mockQuestions.questionsToAsk.length < 3) {
         throw new Error(
            'Insufficient questions to ask generated. Please try again.'
         );
      }

      return parsedData;
   } catch (error: any) {
      handleAIError(error, 'generating interview preparation');
   }
}

/**
 * Generates interview analytics based on recorded answers during mock interview.
 * @param questions Array of questions that were asked
 * @param answers Array of answers provided by the candidate
 * @param jobTitle The job title for context
 * @returns Interview analytics with scores and suggestions
 */
export async function generateInterviewAnalytics(
   questions: string[],
   answers: string[],
   jobTitle: string
): Promise<InterviewAnalytics> {
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
         model: GEMINI_MODEL,
         generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
         },
         safetySettings,
      };

      // Format Q&A pairs
      const qaText = questions
         .map(
            (q, i) =>
               `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer provided'}`
         )
         .join('\n\n');

      const prompt = `
You are an expert interview coach. Analyze the following mock interview performance for a ${jobTitle} position and provide detailed analytics.

INTERVIEW TRANSCRIPT:
${qaText}

Analyze the candidate's responses and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON) with this exact structure:

{
  "confidence": number (0-100, evaluate based on answer completeness, assertiveness, and conviction),
  "clarity": number (0-100, evaluate based on how clear and understandable the answers are),
  "logicAndStructure": number (0-100, evaluate based on answer organization, use of frameworks like STAR, logical flow),
  "toneAndPronunciation": number (0-100, evaluate based on professionalism, word choice, grammar, and communication style - note: for text responses, focus on written tone and grammar),
  "improvementSuggestions": [
    "At least 3-5 specific, actionable suggestions for improvement. Be constructive and detailed."
  ]
}

SCORING GUIDELINES:
- 90-100: Excellent, professional-level responses
- 80-89: Very good, minor improvements needed
- 70-79: Good, some areas to work on
- 60-69: Fair, needs improvement
- Below 60: Needs significant work

ANALYSIS CRITERIA:
1. **Confidence**: Does the candidate answer decisively? Are they providing complete responses?
2. **Clarity**: Are the answers easy to understand? Is there unnecessary rambling?
3. **Logic & Structure**: Do answers follow a clear structure (STAR for behavioral)? Is there logical flow?
4. **Tone & Pronunciation**: For text, evaluate: professional language, grammar, word choice, and communication style
5. **Improvement Suggestions**: Provide specific, actionable feedback tailored to ${jobTitle}

Return ONLY the JSON object, no additional text or formatting.
`;

      let text = await generateContentWithAI(modelParams, prompt);

      // If text doesn't start with {, try to find the JSON object
      if (!text.startsWith('{')) {
         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            text = jsonMatch[0];
         }
      }

      // Parse the JSON
      let parsedData: InterviewAnalytics;
      try {
         parsedData = JSON.parse(text);
      } catch (parseError) {
         console.error('JSON parse error:', parseError);
         console.error('Failed to parse text:', text);
         throw new Error('AI returned invalid JSON. Please try again.');
      }

      // Validate the structure
      if (
         typeof parsedData.confidence !== 'number' ||
         typeof parsedData.clarity !== 'number' ||
         typeof parsedData.logicAndStructure !== 'number' ||
         typeof parsedData.toneAndPronunciation !== 'number' ||
         !Array.isArray(parsedData.improvementSuggestions)
      ) {
         throw new Error('AI returned incomplete analytics. Please try again.');
      }

      // Ensure scores are within valid range
      const clampScore = (score: number) => Math.max(0, Math.min(100, score));
      parsedData.confidence = clampScore(parsedData.confidence);
      parsedData.clarity = clampScore(parsedData.clarity);
      parsedData.logicAndStructure = clampScore(parsedData.logicAndStructure);
      parsedData.toneAndPronunciation = clampScore(
         parsedData.toneAndPronunciation
      );

      return parsedData;
   } catch (error: any) {
      handleAIError(error, 'generating interview analytics');
   }
}
