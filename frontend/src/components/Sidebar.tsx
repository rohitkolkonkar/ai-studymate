import React from 'react';
import { MessageSquare, FileText, CheckSquare, Layers } from 'lucide-react';

export type TabType = 'chat' | 'summarize' | 'quiz' | 'flashcards';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User as UserIcon } from 'lucide-react';

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  
  const tabs = [
    { id: 'chat', label: 'Chat Tutor', icon: MessageSquare },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz Generator', icon: CheckSquare },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
  ] as const;

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          StudyMate AI
        </h1>
        <p className="text-sm text-gray-500 mt-1">Your personal AI tutor</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        {currentUser && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserIcon size={16} />
            </div>
            <div className="text-sm truncate">
              <div className="font-medium text-foreground truncate">
                {currentUser.displayName || 'Student'}
              </div>
              <div className="text-gray-500 text-xs truncate">
                {currentUser.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
