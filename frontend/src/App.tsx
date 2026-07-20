import { useState } from 'react';
import Sidebar, { type TabType } from './components/Sidebar';
import ChatTab from './components/ChatTab';
import SummarizeTab from './components/SummarizeTab';
import QuizTab from './components/QuizTab';
import FlashcardsTab from './components/FlashcardsTab';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab />;
      case 'summarize':
        return <SummarizeTab />;
      case 'quiz':
        return <QuizTab />;
      case 'flashcards':
        return <FlashcardsTab />;
      default:
        return <ChatTab />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
        {renderTab()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
