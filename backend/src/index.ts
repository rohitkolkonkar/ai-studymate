import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { chatWithTutor, summarizeNotes, generateQuiz, generateFlashcards } from './controllers/aiController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/chat', chatWithTutor);
app.post('/api/summarize', summarizeNotes);
app.post('/api/quiz', generateQuiz);
app.post('/api/flashcards', generateFlashcards);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Serve frontend static assets in production
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Fallback middleware to handle single-page app routing (Express 5 compatible)
app.use((req: Request, res: Response) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
