import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StudyNotes {
  summary: string;
  keyPoints: string[];
  examQuestions: string[];
}

export async function generateStudyNotes(notes: string): Promise<StudyNotes> {
  const model = "gemini-3.1-pro-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze the following lecture notes and provide:
1) A short, concise summary.
2) 5 key points to remember.
3) 5 exam questions based on the notes.

Lecture Notes:
${notes}` }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A concise summary of the lecture notes.",
          },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 key points to remember from the lecture.",
          },
          examQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 exam questions based on the lecture notes.",
          },
        },
        required: ["summary", "keyPoints", "examQuestions"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as StudyNotes;
}
