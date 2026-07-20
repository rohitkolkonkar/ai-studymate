import React, { useState } from 'react';
import { CheckSquare, Loader2, PlayCircle, RotateCcw } from 'lucide-react';
import { generateQuiz } from '../api';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const QuizTab: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz Taking State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError('');
    setQuiz(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const response = await generateQuiz(topic);
      if (Array.isArray(response.quiz) && response.quiz.length > 0) {
        setQuiz(response.quiz);
      } else {
        throw new Error("Invalid format received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate quiz. Please check the backend connection and API response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIdx < quiz.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="text-primary" /> Quiz Generator
        </h2>
        <p className="text-gray-500 text-sm mt-1">Enter a topic or paste notes to generate an interactive quiz.</p>
      </div>

      {!quiz ? (
        <div className="card max-w-2xl mx-auto w-full mt-10">
          <label className="font-medium mb-2 block text-foreground">What do you want to be tested on?</label>
          <textarea
            className="input-field h-32 resize-none mb-4"
            placeholder="e.g., Photosynthesis, World War II, Newton's Laws..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
            {isLoading ? 'Generating Questions...' : 'Generate Quiz'}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      ) : showResults ? (
        <div className="card text-center max-w-2xl mx-auto w-full mt-10 p-10">
          <h3 className="text-3xl font-bold text-foreground mb-4">Quiz Complete!</h3>
          <p className="text-xl mb-8">
            You scored <span className="font-bold text-primary">{calculateScore()}</span> out of {quiz.length}
          </p>
          
          <div className="space-y-6 text-left mb-8">
            {quiz.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctAnswerIndex;
              return (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-border">
                  <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                  <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {q.options[selectedAnswers[idx]]} {isCorrect ? '✓' : '✗'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-green-600">Correct: {q.options[q.correctAnswerIndex]}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 italic">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={resetQuiz} className="btn-primary flex items-center gap-2">
              <RotateCcw size={18} /> Retake
            </button>
            <button onClick={() => setQuiz(null)} className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50">
              New Topic
            </button>
          </div>
        </div>
      ) : (
        <div className="card max-w-2xl mx-auto w-full mt-10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestionIdx + 1} of {quiz.length}
            </span>
            <div className="w-1/2 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all" 
                style={{ width: `${((currentQuestionIdx + 1) / quiz.length) * 100}%` }}
              />
            </div>
          </div>
          
          <h3 className="text-xl font-medium mb-6">{quiz[currentQuestionIdx].question}</h3>
          
          <div className="space-y-3 mb-8">
            {quiz[currentQuestionIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAnswers[currentQuestionIdx] === idx
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/30 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIdx] === undefined}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIdx === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
