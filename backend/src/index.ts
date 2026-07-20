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

// Catch-all route to handle single-page app routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
