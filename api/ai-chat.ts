/**
 * Serverless API Handler for Google Gemini AI CV Builder
 * Endpoint: POST /api/ai-chat
 * 
 * Securely proxies chat requests to Google Gemini 1.5/2.0 Flash
 * keeping the API key protected on the server in production deployments.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_INSTRUCTION = `
You are the CV PILOT Neural AI Engine, an elite Executive Career Architect and Senior ATS (Applicant Tracking System) Auditor.
When a user chats with you:
1. Parse their raw input, career notes, or instructions.
2. Update the resume data JSON structure carefully:
   - If they provide new info (e.g. jobs, skills, education, contact info), integrate it cleanly into the existing resume.
   - If they ask to update a specific section (e.g. "make my summary punchier", "add an AWS certification", "switch to modern template"), apply targeted improvements without wiping out good existing data.
   - Formulate experience bullet points using the STAR method (Situation, Task, Action, Result) with quantified metrics wherever realistic.
   - Categorize skills intelligently into logical groups (e.g., "Frontend", "Cloud & DevOps", "Tools", "Leadership").
3. Perform an authentic ATS Audit:
   - Provide an ATS Score between 35 and 98 based on completeness, action verbs, contact details, and relevance.
4. Produce a detailed step-by-step thinking process (3 to 6 short bullet points) explaining your reasoning.
5. Produce a warm, professional Markdown reply message summarizing what you changed and offering actionable suggestions.
6. Provide 3-4 contextual suggested quick-action chips.

IMPORTANT: Respond ONLY with a valid JSON object strictly adhering to this schema:
{
  "replyMessage": "string",
  "atsScore": number,
  "updatedSections": ["string"],
  "suggestedActions": ["string"],
  "thinkingProcess": ["string"],
  "updatedResume": {
    "title": "string",
    "templateId": "string",
    "themeColor": "string",
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

function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText.trim();
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

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { messages = [], userInput = '', currentResume = {}, apiKeyOverride } = req.body || {};

    const key = apiKeyOverride || GEMINI_API_KEY;
    if (!key) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured on server or request.' });
    }

    const recentHistory = messages.slice(-6).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    const userContextPrompt = `
CURRENT RESUME STATE (JSON):
${JSON.stringify(currentResume, null, 2)}

USER'S LATEST MESSAGE / COMMAND:
"${userInput}"
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

    const endpoint = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Gemini error: ${errorText}` });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(500).json({ error: 'No content received from Gemini model.' });
    }

    const parsedResult = cleanAndParseJson(rawText);
    return res.status(200).json(parsedResult);
  } catch (err: any) {
    console.error('Serverless Gemini AI error:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error processing AI chat.' });
  }
}
