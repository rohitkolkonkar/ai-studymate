import React, { useState } from 'react';
import { Layers, Loader2, PlayCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { generateFlashcards } from '../api';

interface Flashcard {
  front: string;
  back: string;
}

const FlashcardsTab: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError('');
    setCards(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const response = await generateFlashcards(topic);
      if (Array.isArray(response.flashcards) && response.flashcards.length > 0) {
        setCards(response.flashcards);
      } else {
        throw new Error("Invalid format received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate flashcards. Please check the backend connection and API response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (cards && currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Layers className="text-primary" /> Flashcards
        </h2>
        <p className="text-gray-500 text-sm mt-1">Master concepts with AI-generated flashcards.</p>
      </div>

      {!cards ? (
        <div className="card max-w-2xl mx-auto w-full mt-10">
          <label className="font-medium mb-2 block text-foreground">Topic for Flashcards</label>
          <textarea
            className="input-field h-32 resize-none mb-4"
            placeholder="e.g., French vocabulary, History dates, Biology terms..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
            {isLoading ? 'Generating Cards...' : 'Generate Flashcards'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 w-full max-w-2xl mx-auto">
          
          <div className="flex justify-between items-center w-full mb-6 px-4">
            <span className="text-sm font-medium text-gray-500">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <button onClick={() => setCards(null)} className="text-sm text-primary hover:underline flex items-center gap-1">
              <RotateCcw size={14} /> New Topic
            </button>
          </div>

          <div 
            className="relative w-full aspect-[3/2] cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className="w-full h-full absolute transition-all duration-500 rounded-2xl shadow-md border border-border flex items-center justify-center p-8 text-center bg-white"
              style={{
                backfaceVisibility: 'hidden',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              }}
            >
              <h3 className="text-2xl font-medium text-foreground">{cards[currentIndex].front}</h3>
              <div className="absolute bottom-4 text-xs text-gray-400">Click to flip</div>
            </div>

            <div 
              className="w-full h-full absolute transition-all duration-500 rounded-2xl shadow-md border border-primary/20 flex items-center justify-center p-8 text-center bg-primary/5"
              style={{
                backfaceVisibility: 'hidden',
                transform: isFlipped ? 'rotateY(0)' : 'rotateY(-180deg)',
              }}
            >
              <p className="text-xl text-foreground">{cards[currentIndex].back}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-8 px-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-surface border border-border shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm text-gray-500">Use arrows to navigate</span>
            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="p-3 rounded-full bg-surface border border-border shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsTab;
