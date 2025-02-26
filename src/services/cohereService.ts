import { questions } from '../data/questions';

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

export interface AnalysisResult {
  learningPersona: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

export async function analyzeResponses(responses: { questionId: number; answer: string }[]): Promise<AnalysisResult> {
  if (!COHERE_API_KEY) {
    throw new Error('Cohere API key is not configured');
  }

  const prompt = createAnalysisPrompt(responses);

  try {
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        prompt,
        model: 'command',
        max_tokens: 1500,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cohere API error details:', errorData);
      throw new Error(
        `Cohere API error: ${response.status} ${response.statusText}${
          errorData.message ? ` - ${errorData.message}` : ''
        }`
      );
    }

    const data = await response.json();
    
    if (!data.generations || !data.generations[0]?.text) {
      console.error('Invalid Cohere response:', data);
      throw new Error('Invalid response format from Cohere API');
    }

    return parseAnalysisResponse(data.generations[0].text);
  } catch (error) {
    console.error('Failed to analyze responses:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze responses');
  }
}

function createAnalysisPrompt(responses: { questionId: number; answer: string }[]): string {
  const personalInfo = responses.slice(0, 3);
  const studyHabits = responses.slice(3);

  const formattedPersonalInfo = personalInfo.map(response => {
    const question = questions.find(q => q.id === response.questionId);
    return `${question?.text}: ${response.answer}`;
  }).join('\n');

  const formattedStudyHabits = studyHabits.map(response => {
    const question = questions.find(q => q.id === response.questionId);
    return `Question: ${question?.text}\nAnswer: ${
      question?.options?.[response.answer as keyof typeof question.options] || response.answer
    }`;
  }).join('\n\n');

  return `As an experienced academic counselor, analyze these student responses and provide a comprehensive, personalized assessment in JSON format. The analysis should be detailed, encouraging, and actionable, taking into account the student's personal academic situation.

Student Personal Information:
${formattedPersonalInfo}

Study Habits and Attitudes:
${formattedStudyHabits}

Based on these responses, create a detailed JSON object with the following structure:
{
  "learningPersona": "A detailed, personalized description of the student's learning style, approach to education, and current academic mindset. This should be 3-4 sentences long, directly address the student, and consider their current CGPA and backlog situation.",
  "strengths": [
    "Detailed strength with specific examples from their responses",
    "Another strength with explanation of its academic impact",
    "Additional strength highlighting positive behaviors",
    "More strengths if identified"
  ],
  "areasForImprovement": [
    "Specific area for improvement with clear context",
    "Another area with explanation of its importance",
    "Additional improvement area with potential impact",
    "More areas if relevant"
  ],
  "recommendations": [
    "Detailed, actionable recommendation with specific steps",
    "Time-management or study technique with implementation details",
    "Specific resource or tool recommendation with usage guidance",
    "Additional practical suggestions for improvement",
    "Long-term strategy for academic success that addresses current CGPA and backlogs"
  ]
}

Ensure each section is detailed and specific to the student's responses, including their academic status (CGPA and backlogs). Include practical examples and clear action items. The tone should be encouraging and supportive while maintaining professionalism.`;
}

function parseAnalysisResponse(response: string): AnalysisResult {
  try {
    const cleanedResponse = response.trim();
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('No JSON found in response:', response);
      throw new Error('No valid JSON found in response');
    }

    const jsonStr = cleanedResponse.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonStr);
    
    if (!parsed.learningPersona || !Array.isArray(parsed.strengths) || 
        !Array.isArray(parsed.areasForImprovement) || !Array.isArray(parsed.recommendations)) {
      console.error('Invalid response format:', parsed);
      throw new Error('Invalid response format');
    }

    return {
      learningPersona: parsed.learningPersona,
      strengths: parsed.strengths,
      areasForImprovement: parsed.areasForImprovement,
      recommendations: parsed.recommendations
    };
  } catch (error) {
    console.error('Failed to parse Cohere response:', error);
    throw new Error('Failed to parse analysis response');
  }
}