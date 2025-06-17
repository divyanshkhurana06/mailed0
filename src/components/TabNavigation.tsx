import React from 'react';
import { Inbox, Send, FolderOpen } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'inbox' | 'sent' | 'folders';
  onTabChange: (tab: 'inbox' | 'sent' | 'folders') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: 12 },
    { id: 'sent' as const, label: 'Sent', icon: Send, count: 8 },
    { id: 'folders' as const, label: 'Folders', icon: FolderOpen, count: 5 },
  ];

  return (
    <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative group
              ${isActive 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {/* Animated background for active state */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-20 animate-pulse" />
            )}
            
            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
            <span className="relative z-10">{tab.label}</span>
            
            {/* Count badge */}
            <div className={`
              relative z-10 px-2 py-1 rounded-full text-xs font-bold transition-all duration-300
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
              }
            `}>
              {tab.count}
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
          </button>
        );
      })}
    </div>
  );
};