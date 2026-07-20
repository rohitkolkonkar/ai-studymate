import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithTutor } from '../api';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: any;
  userId?: string;
}

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!currentUser) return;

    // Listen for real-time updates from Firestore for this specific user
    const q = query(
      collection(db, 'chats'), 
      where('userId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          role: data.role,
          content: data.content,
          createdAt: data.createdAt,
          userId: data.userId,
        });
      });
      
      // Sort client-side to avoid needing a Firestore composite index
      loadedMessages.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeA - timeB;
      });

      // Add welcome message if chat is empty
      if (loadedMessages.length === 0) {
        setMessages([{ role: 'assistant', content: `Hello! I'm your StudyMate AI tutor (powered by Grok). How can I help you with your studies today, ${currentUser.displayName || 'Student'}?` }]);
      } else {
        setMessages(loadedMessages);
      }
    }, (error) => {
      console.error("Error fetching messages:", error);
      // Fallback if index is missing
      setMessages([{ role: 'assistant', content: "Hello! I'm your StudyMate AI tutor. I had trouble loading your history, but I'm ready to chat!" }]);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentUser) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to Firestore
      await addDoc(collection(db, 'chats'), {
        role: 'user',
        content: userText,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });

      const conversationHistory = [...messages, { role: 'user' as const, content: userText }].map(m => ({
        role: m.role,
        content: m.content
      }));
      
      // 2. Call backend Grok API
      const response = await chatWithTutor(conversationHistory);

      // 3. Save AI response to Firestore
      await addDoc(collection(db, 'chats'), {
        role: 'assistant',
        content: response.reply,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold text-foreground">Chat with Tutor</h2>
        <p className="text-gray-500 text-sm mt-1">Ask questions and get step-by-step explanations.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-border text-foreground rounded-tl-none'}`}>
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-200 text-gray-700">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-border text-foreground rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-background">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="input-field pr-12 rounded-full"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
