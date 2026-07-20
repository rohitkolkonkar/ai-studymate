import React, { useState } from 'react';
import { MessageSquare, FileText, CheckSquare, Layers, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export type TabType = 'chat' | 'summarize' | 'quiz' | 'flashcards';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const tabs = [
    { id: 'chat', label: 'Chat Tutor', icon: MessageSquare },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz Generator', icon: CheckSquare },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
  ] as const;

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">StudyMate AI</h1>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Slide-over) */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border h-full flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">StudyMate AI</h1>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Your personal AI tutor</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
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

      {/* Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30 flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
