# StudyMate AI

An AI-powered Study Assistant web app that provides a patient chat tutor, notes summarizer, interactive quiz generator, and flashcard generator.

## Prerequisites

- Node.js (v18+)
- Anthropic API Key (`claude-3-5-sonnet-20241022`)

## Quick Start

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Anthropic API Key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your actual API key:
   ```
   ANTHROPIC_API_KEY=your-key-here
   PORT=3001
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open another terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:5173`.

## Features

- **Chat Tutor**: Ask questions and get step-by-step, encouraging explanations.
- **Summarize Notes**: Paste large chunks of text and get a clean, formatted summary.
- **Quiz Generator**: Enter a topic to generate an interactive multiple-choice quiz and test your knowledge.
- **Flashcards**: Generate and flip through flashcards to master new concepts.
