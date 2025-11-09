import { GoogleGenAI, Type } from "@google/genai";
import { ClassLevel, Question } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const extractTextFromFile = async (fileBase64: string, mimeType: string): Promise<string> => {
    const filePart = fileToGenerativePart(fileBase64, mimeType);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [filePart, { text: "Extract all the text from this file. If the file does not contain text, respond with 'NO_TEXT_FOUND'." }] },
    });
    const text = response.text.trim();
    if (text === 'NO_TEXT_FOUND') {
        throw new Error('No text could be found in the provided file.');
    }
    return text;
};

const mcqSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            questionText: { type: Type.STRING },
            options: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN },
                    }
                }
            },
            answer: { type: Type.STRING, description: "The text of the correct option." }
        }
    }
};

const textQuestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            questionText: { type: Type.STRING },
            answer: { type: Type.STRING, description: "A detailed model answer or key points for the question." }
        }
    }
};


export const generateMCQs = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Based on the text below, generate 25 Multiple Choice Questions (MCQs) for a Class ${classLevel} student, testing comprehension, vocabulary, and literary devices. For each question, provide exactly 4 options, with one being correct. Ensure IDs are unique (e.g., mcq1, mcq2). Output ONLY a valid JSON array that conforms to the provided schema. \n\nText:\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mcqSchema,
        }
    });
    return JSON.parse(response.text) as Question[];
};

export const generateSAQs = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Based on the text below, generate 25 Short Answer Questions (SAQs) for a Class ${classLevel} student, requiring brief, precise answers (1-2 sentences). Ensure IDs are unique (e.g., saq1, saq2). Output ONLY a valid JSON array. \n\nText:\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: textQuestionSchema,
        }
    });
    return JSON.parse(response.text) as Question[];
};

export const generateMCQsForSem1And3 = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Based on the text below, generate at least 100 Multiple Choice Questions (MCQs) for a Class ${classLevel} student. The questions should cover comprehension, vocabulary, literary devices, and include textual grammar questions also in MCQ format. For each question, provide exactly 4 options, with one being correct. Ensure IDs are unique (e.g., mcq1, mcq2). A good question format is: "The phrase 'my last Duchess' implies that the Duchess is: A. His most recent wife. B. His previous, now deceased, wife. C. The final Duchess he intends to marry. D. His favorite Duchess.". Output ONLY a valid JSON array. \n\nText:\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mcqSchema,
        }
    });
    return JSON.parse(response.text) as Question[];
};

export const generateSAQsForSem2And4 = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Based on the text below, generate at least 80 Short Answer Questions (SAQs) for a Class ${classLevel} student. These should require concise, thoughtful answers (2-3 sentences). Ensure IDs are unique (e.g., saq1, saq2). Output ONLY a valid JSON array. \n\nText:\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: textQuestionSchema,
        }
    });
    return JSON.parse(response.text) as Question[];
};

export const generateBroadsForSem2And4 = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Based on the text below, generate at least 50 insightful, broad, analytical questions for a Class ${classLevel} student. These questions should require detailed, multi-paragraph answers exploring themes, character development, author's intent, and critical analysis. Ensure IDs are unique (e.g., broad1, broad2). Output ONLY a valid JSON array. \n\nText:\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: textQuestionSchema,
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return JSON.parse(response.text) as Question[];
};

export const generateGrammarForSem2And4 = async (classLevel: ClassLevel, content: string): Promise<Question[]> => {
    const prompt = `Generate at least 50 non-textual grammar questions suitable for a Class ${classLevel} student. These should cover topics like transformation of sentences, joining sentences, voice change, narration, clauses, phrases, and tense. The questions should not be based on the provided text, but be general grammar exercises. Provide a clear model answer for each. Ensure IDs are unique (e.g., grammar1, grammar2). Output ONLY a valid JSON array. \n\nReference Text (for context of complexity, not content):\n${content}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: textQuestionSchema,
        }
    });
    return JSON.parse(response.text) as Question[];
};
