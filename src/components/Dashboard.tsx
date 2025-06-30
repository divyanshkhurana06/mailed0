import React, { useState, useEffect } from 'react';
import { TabNavigation } from './TabNavigation';
import { EmailList } from './EmailList';
import { SentAnalytics } from './SentAnalytics';
import { FolderSystem } from './FolderSystem';
import { SearchBar } from './SearchBar';
import { EmailCategory, SentEmail } from '../types/email';
import { api } from '../utils/api';
import { Info, LogOut } from 'lucide-react';

interface DashboardProps {
  userEmail: string;
  onShowAbout: () => void;
  onSignOut: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail, onShowAbout, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'folders'>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sentCount, setSentCount] = useState(0);

  const handleCategorySelect = (category: EmailCategory | 'all' | 'sent') => {
    if (category === 'sent') {
      setActiveTab('sent');
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onSignOut();
    }
  };

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const sentEmails: SentEmail[] = await api.getSentEmails(userEmail);
        setSentCount(sentEmails.length);
      } catch (e) {
        setSentCount(0);
      }
    };
    fetchSentEmails();
  }, [userEmail]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mailed</span>
                </h1>
                <p className="text-white/60">AI-powered email transformation</p>
                <p className="text-white/40 text-sm">Signed in as {userEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              {/* About Button */}
              <button
                onClick={onShowAbout}
                className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/80 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                title="About"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </button>
              
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="group flex items-center gap-2 px-4 py-2 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
          
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </header>

        {/* Main Content */}
        <main className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl -z-10" />
          
          {activeTab === 'inbox' && (
            <EmailList 
              category={selectedCategory} 
              searchQuery={searchQuery}
              userEmail={userEmail}
            />
          )}
          
          {activeTab === 'sent' && (
            <SentAnalytics searchQuery={searchQuery} userEmail={userEmail} />
          )}
          
          {activeTab === 'folders' && (
            <FolderSystem 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
              sentCount={sentCount}
            />
          )}
        </main>

        {/* Extension Download Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Gmail Extension</h3>
                <p className="text-white/60 text-sm">Auto-inject tracking pixels into your Gmail messages</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Create a zip file download
                  const link = document.createElement('a');
                  link.href = '/mailed-extension.zip';
                  link.download = 'mailed-extension.zip';
                  link.click();
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Download Extension
              </button>
              <button
                onClick={() => window.open('/extension-guide.html', '_blank')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 text-sm"
              >
                Install Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};