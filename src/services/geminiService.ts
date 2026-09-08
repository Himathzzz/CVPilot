import type { ResumeData } from '../types/resume';
import type { ChatMessage, ChatProcessingResult } from './aiChatService';

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Clean and parse JSON response from Gemini, handling markdown codeblocks if present
 */
function cleanAndParseJson<T>(rawText: string): T {
  let cleaned = rawText.trim();
  // Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

/**
 * System prompt instructing Gemini to act as an Elite Executive Resume Architect & ATS Engine
 */
const SYSTEM_INSTRUCTION = `
You are the CV PILOT Neural AI Engine, an elite Executive Career Architect and Senior ATS (Applicant Tracking System) Auditor.
Your objective is to help candidates build, improve, and calibrate world-class, hireable resumes that pass automated screening and impress human hiring panels.

When a user chats with you:
1. Parse their raw input, career notes, or instructions.
2. Update the resume data JSON structure carefully:
   - If they provide new info (e.g. jobs, skills, education, contact info), integrate it cleanly into the existing resume.
   - If they ask to update a specific section (e.g. "make my summary punchier", "add an AWS certification", "switch to modern template"), apply targeted improvements without wiping out good existing data.
   - Formulate experience bullet points using the STAR method (Situation, Task, Action, Result) with quantified metrics wherever realistic.
   - Categorize skills intelligently into logical groups (e.g., "Frontend", "Cloud & DevOps", "Tools", "Leadership").
3. Perform an authentic ATS Audit:
   - Provide an ATS Score between 35 and 98 based on completeness, action verbs, contact details, and relevance.
4. Produce a detailed step-by-step thinking process (3 to 6 short bullet points) explaining your reasoning (e.g. parsed entities, keyword extraction, ATS improvements).
5. Produce a warm, professional Markdown reply message summarizing what you changed, highlighting key improvements, and offering actionable suggestions.
6. Provide 3-4 contextual suggested quick-action chips for what the candidate might want to do next.

IMPORTANT: You MUST respond ONLY with a valid JSON object strictly adhering to this structure:
{
  "replyMessage": "string (Markdown format with formatting, emojis, bolding, and tips)",
  "atsScore": number (35 to 98),
  "updatedSections": ["string array listing sections modified, e.g. 'Work Experience', 'Skills', 'Summary'"],
  "suggestedActions": ["string array of 3-4 recommended follow-up prompts"],
  "thinkingProcess": [
    "string step 1 (e.g. '[Entity Extraction] Identified candidate name, email, and 2 roles')",
    "string step 2 (e.g. '[STAR Optimization] Re-engineered bullet points with metrics')",
    "string step 3 (e.g. '[ATS Calibration] Keyword density checked against industry benchmarks')"
  ],
  "updatedResume": {
    "title": "string",
    "templateId": "string (one of: modern, modern-minimal, executive, creative, classic)",
    "themeColor": "string (one of: gold, navy, emerald, crimson, slate)",
    "personalInfo": {
      "fullName": "string",
      "jobTitle": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "website": "string",
      "linkedin": "string",
      "github": "string",
      "summary": "string",
      "photoUrl": "string",
      "showPhoto": boolean
    },
    "experiences": [
      {
        "id": "string",
        "company": "string",
        "role": "string",
        "location": "string",
        "startDate": "string",
        "endDate": "string",
        "isCurrent": boolean,
        "description": "string",
        "bulletPoints": ["string"]
      }
    ],
    "education": [
      {
        "id": "string",
        "institution": "string",
        "degree": "string",
        "fieldOfStudy": "string",
        "startDate": "string",
        "endDate": "string",
        "location": "string",
        "gpa": "string"
      }
    ],
    "skillCategories": [
      {
        "id": "string",
        "categoryName": "string",
        "skills": ["string"]
      }
    ],
    "projects": [
      {
        "id": "string",
        "title": "string",
        "role": "string",
        "link": "string",
        "description": "string",
        "technologies": "string"
      }
    ],
    "certifications": [
      {
        "id": "string",
        "name": "string",
        "issuer": "string",
        "date": "string"
      }
    ]
  }
}
`;

function sanitizeGeminiOutput(parsed: any, currentResume: ResumeData): ChatProcessingResult {
  // Guarantee IDs and structural integrity
  const resume = parsed.updatedResume || currentResume;
  if (!resume.personalInfo) resume.personalInfo = currentResume.personalInfo;
  if (!Array.isArray(resume.experiences)) resume.experiences = [];
  if (!Array.isArray(resume.education)) resume.education = [];
  if (!Array.isArray(resume.skillCategories)) resume.skillCategories = [];
  if (!Array.isArray(resume.projects)) resume.projects = [];
  if (!Array.isArray(resume.certifications)) resume.certifications = [];

  // Assign IDs to any items missing them
  resume.experiences.forEach((exp: any, idx: number) => {
    if (!exp.id) exp.id = `exp_${Date.now()}_${idx}`;
    if (!Array.isArray(exp.bulletPoints)) exp.bulletPoints = [];
  });
  resume.education.forEach((edu: any, idx: number) => {
    if (!edu.id) edu.id = `edu_${Date.now()}_${idx}`;
  });
  resume.skillCategories.forEach((cat: any, idx: number) => {
    if (!cat.id) cat.id = `cat_${Date.now()}_${idx}`;
    if (!Array.isArray(cat.skills)) cat.skills = [];
  });
  resume.projects.forEach((proj: any, idx: number) => {
    if (!proj.id) proj.id = `proj_${Date.now()}_${idx}`;
  });
  resume.certifications.forEach((cert: any, idx: number) => {
    if (!cert.id) cert.id = `cert_${Date.now()}_${idx}`;
  });

  return {
    replyMessage: parsed.replyMessage || 'CV updated successfully with Gemini AI.',
    updatedResume: resume,
    updatedSections: parsed.updatedSections || ['Resume Content Updated'],
    suggestedActions: parsed.suggestedActions || [
      '✨ Polish executive summary',
      '🎯 Tailor for a specific job title',
      '📊 Audit ATS keyword density'
    ],
    thinkingProcess: parsed.thinkingProcess || [
      '[Neural Analysis] Parsed candidate input against industry best practices.',
      '[STAR Impact] Formulated bullet points with quantifiable results.',
      '[Verification] Synchronized resume structure for real-time ATS preview.'
    ],
    atsScore: typeof parsed.atsScore === 'number' ? Math.min(100, Math.max(0, parsed.atsScore)) : 85
  };
}

/**
 * Calls Google Gemini API with smart hybrid strategy (Serverless proxy -> Direct Gemini Client)
 */
export async function generateResumeWithGemini(
  messages: ChatMessage[],
  userInput: string,
  currentResume: ResumeData,
  apiKeyOverride?: string
): Promise<ChatProcessingResult> {
  const apiKey = (apiKeyOverride?.trim()) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();

  // 1. Try serverless API route first (e.g. Vercel deployment)
  try {
    const serverlessRes = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        userInput,
        currentResume,
        apiKeyOverride: apiKeyOverride || undefined
      })
    });

    if (serverlessRes.ok) {
      const parsed = await serverlessRes.json();
      if (parsed && (parsed.updatedResume || parsed.replyMessage)) {
        return sanitizeGeminiOutput(parsed, currentResume);
      }
    }
  } catch {
    // /api/ai-chat not available in current environment (e.g. pure Vite dev server), proceed to direct API
  }

  // 2. Fallback: Direct Google Generative Language API call
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY: Gemini API Key is missing or not configured.');
  }

  // Format recent chat history context (last 6 messages max to conserve tokens)
  const recentHistory = messages.slice(-6).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const userContextPrompt = `
CURRENT RESUME STATE (JSON):
${JSON.stringify(currentResume, null, 2)}

USER'S LATEST MESSAGE / COMMAND:
"${userInput}"

Please synthesize, update, and return the complete updated resume and review based on the instructions.
`;

  const requestBody = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: [
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: userContextPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      responseMimeType: 'application/json'
    }
  };

  const endpoint = `${GEMINI_API_BASE}/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMsg = errorText;
    try {
      const errObj = JSON.parse(errorText);
      parsedMsg = errObj.error?.message || errorText;
    } catch {
      // Keep errorText
    }
    throw new Error(`Gemini API error (${response.status}): ${parsedMsg}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Empty response received from Gemini API.');
  }

  const parsed = cleanAndParseJson<{
    replyMessage: string;
    atsScore: number;
    updatedSections?: string[];
    suggestedActions?: string[];
    thinkingProcess?: string[];
    updatedResume: ResumeData;
  }>(rawText);

  return sanitizeGeminiOutput(parsed, currentResume);
}
