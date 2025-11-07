
import { GoogleGenAI, Type } from "@google/genai";
import { MCQ } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const mcqSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The multiple choice question."
    },
    options: {
      type: Type.ARRAY,
      description: "An array of 4 possible answers.",
      items: { type: Type.STRING }
    },
    answer: {
      type: Type.INTEGER,
      description: "The 0-based index of the correct answer in the options array."
    }
  },
  required: ["question", "options", "answer"]
};

export const generateMCQs = async (subjectName: string): Promise<MCQ[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 10 high-school level multiple choice questions about the subject: ${subjectName}. Ensure the questions are relevant to the Bangladesh curriculum.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: mcqSchema
        },
      },
    });

    const jsonText = response.text.trim();
    const generatedQuestions = JSON.parse(jsonText);
    
    // Basic validation
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("API returned an invalid format for questions.");
    }

    return generatedQuestions as MCQ[];
  } catch (error) {
    console.error("Error generating MCQs with Gemini:", error);
    throw new Error("Failed to generate questions. The API may be unavailable or the API key might be invalid.");
  }
};
