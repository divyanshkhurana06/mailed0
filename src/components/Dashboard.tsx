import React, { useState, useEffect } from 'react';
import { TabNavigation } from './TabNavigation';
import { EmailList } from './EmailList';
import { SentAnalytics } from './SentAnalytics';
import { FolderSystem } from './FolderSystem';
import { SearchBar } from './SearchBar';
import { EmailCategory } from '../types/email';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'folders'>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
              </div>
            </div>
            
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
            />
          )}
          
          {activeTab === 'sent' && (
            <SentAnalytics searchQuery={searchQuery} />
          )}
          
          {activeTab === 'folders' && (
            <FolderSystem 
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          )}
        </main>
      </div>
    </div>
  );
};