import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const chatWithTutor = async (messages: {role: string, content: string}[]) => {
  const response = await api.post('/chat', { messages });
  return response.data;
};

export const summarizeNotes = async (text: string) => {
  const response = await api.post('/summarize', { text });
  return response.data;
};

export const generateQuiz = async (topic: string) => {
  const response = await api.post('/quiz', { topic });
  return response.data;
};

export const generateFlashcards = async (topic: string) => {
  const response = await api.post('/flashcards', { topic });
  return response.data;
};
