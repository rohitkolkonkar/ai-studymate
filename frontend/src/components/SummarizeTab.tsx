import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { summarizeNotes } from '../api';

const SummarizeTab: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await summarizeNotes(text);
      setSummary(response.summary);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate summary. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="text-primary" /> Summarize Notes
        </h2>
        <p className="text-gray-500 text-sm mt-1">Paste your long notes or articles to get a concise summary.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <label className="font-medium mb-2 text-foreground">Original Text</label>
          <textarea
            className="input-field flex-1 resize-none font-mono text-sm"
            placeholder="Paste your notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !text.trim()}
            className="btn-primary mt-4 py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            {isLoading ? 'Summarizing...' : 'Summarize Now'}
          </button>
        </div>

        <div className="flex flex-col h-full">
          <label className="font-medium mb-2 text-foreground">Summary</label>
          <div className="card flex-1 overflow-y-auto relative">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : summary ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Your summary will appear here.
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center text-primary">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <span className="font-medium">AI is reading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizeTab;
