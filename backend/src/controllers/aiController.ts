import type { Request, Response } from 'express';
import { GoogleGenAI, Type, type Schema } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Helper for sending generic AI messages
export const chatWithTutor = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `You are an AI-powered Study Assistant for students (like a patient, encouraging tutor). 
Explain concepts step by step, ask clarifying questions when a query is ambiguous, and avoid just giving final answers to homework without explanation. 
Keep responses concise and formatted with headers/bullets for readability on a study app.`;

    // Map the messages to the structure expected by the Gemini SDK
    // In our chat array, the user messages are {role: 'user', content: '...'} and assistant are {role: 'assistant', content: '...'}
    // Gemini SDK chat expects {role: 'user' | 'model', parts: [{text: '...'}]}
    // We can also just send the last message and include history in the chat session, 
    // or manually stringify the conversation. The simplest is to map to contents array.
    
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const reply = response.text || '';
    res.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const summarizeNotes = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required to summarize." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Please summarize the following notes:\n\n${text}`,
      config: {
        systemInstruction: "You are a notes summarizer. Given text, provide a clean, concise, bulleted summary of the most important concepts."
      }
    });

    const summary = response.text || '';
    res.json({ summary });
  } catch (error: any) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic/Notes are required to generate a quiz." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate a quiz on this topic:\n\n${topic}`,
      config: {
        systemInstruction: `You are a quiz generator. Generate a multiple-choice quiz based on the user's topic/notes. Generate 3 to 5 questions.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const quiz = JSON.parse(response.text || '[]');
    res.json({ quiz });
  } catch (error: any) {
    console.error("Quiz error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const generateFlashcards = async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic/Notes are required to generate flashcards." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `Generate flashcards on this topic:\n\n${topic}`,
      config: {
        systemInstruction: `You are a flashcard generator. Generate a set of flashcards based on the user's topic/notes. Generate 5 to 10 flashcards. Keep the text concise so it fits on a card.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["front", "back"]
          }
        }
      }
    });

    const flashcards = JSON.parse(response.text || '[]');
    res.json({ flashcards });
  } catch (error: any) {
    console.error("Flashcards error:", error);
    res.status(500).json({ error: error.message });
  }
};
