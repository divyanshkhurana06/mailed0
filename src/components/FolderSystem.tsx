import React, { useState } from 'react';
import { Folder, Filter, Zap, TrendingUp, Users, ShoppingBag, Calendar, Briefcase, Send } from 'lucide-react';
import { EmailCategory } from '../types/email';

interface FolderSystemProps {
  onCategorySelect: (category: EmailCategory | 'all' | 'sent') => void;
  selectedCategory: EmailCategory | 'all';
  sentCount: number;
}

export const FolderSystem: React.FC<FolderSystemProps> = ({
  onCategorySelect,
  selectedCategory,
  sentCount,
}) => {
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  const folders = [
    {
      id: 'sent',
      name: 'Sent',
      icon: Send,
      count: sentCount,
      color: 'from-blue-500 to-purple-500',
      description: 'All sent emails',
    },
    {
      id: 'work',
      name: 'Work & Business',
      icon: Briefcase,
      count: 24,
      color: 'from-blue-500 to-cyan-500',
      description: 'Professional emails, meetings, and business communications',
    },
    {
      id: 'finance',
      name: 'Finance & Banking',
      icon: TrendingUp,
      count: 12,
      color: 'from-green-500 to-emerald-500',
      description: 'Bank statements, invoices, and financial updates',
    },
    {
      id: 'events',
      name: 'Events & Calendar',
      icon: Calendar,
      count: 8,
      color: 'from-purple-500 to-pink-500',
      description: 'Meeting invitations, event reminders, and calendar updates',
    },
    {
      id: 'marketing',
      name: 'Marketing & Promotions',
      icon: Zap,
      count: 18,
      color: 'from-orange-500 to-red-500',
      description: 'Newsletters, promotions, and marketing campaigns',
    },
    {
      id: 'personal',
      name: 'Personal & Social',
      icon: Users,
      count: 15,
      color: 'from-indigo-500 to-purple-500',
      description: 'Personal conversations and social updates',
    },
    {
      id: 'shopping',
      name: 'Shopping & Orders',
      icon: ShoppingBag,
      count: 9,
      color: 'from-pink-500 to-rose-500',
      description: 'Order confirmations, shipping updates, and receipts',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Smart Folders</h2>
          <p className="text-white/60">AI-powered email categorization and organization</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
          <Filter className="w-4 h-4 text-purple-400" />
          <span className="text-white/80 text-sm font-medium">Auto-sorted</span>
        </div>
      </div>

      {/* All Emails Option */}
      <div
        className={`
          group relative cursor-pointer transition-all duration-300 transform
          ${selectedCategory === 'all' ? 'scale-105' : 'hover:scale-105'}
        `}
        onClick={() => onCategorySelect('all')}
      >
        <div className={`
          absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 rounded-2xl blur opacity-0 
          ${selectedCategory === 'all' ? 'opacity-30' : 'group-hover:opacity-20'}
          transition-opacity duration-300
        `} />
        
        <div className={`
          relative bg-white/10 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300
          ${selectedCategory === 'all' 
            ? 'border-white/40 bg-white/20' 
            : 'border-white/20 group-hover:border-white/30 group-hover:bg-white/15'
          }
        `}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-white/20 to-white/20 rounded-xl flex items-center justify-center">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">All Emails</h3>
              <p className="text-white/60 text-sm">View all your emails in one place</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">96</div>
              <div className="text-white/60 text-xs">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder, index) => {
          const Icon = folder.icon;
          const isSelected = selectedCategory === folder.id;
          const isHovered = hoveredFolder === folder.id;
          const handleClick = () => {
            if (folder.id === 'sent') {
              onCategorySelect('sent');
            } else {
              onCategorySelect(folder.id as EmailCategory);
            }
          };
          
          return (
            <div
              key={folder.id}
              className={`
                group relative cursor-pointer transition-all duration-500 transform
                ${isSelected ? 'scale-105 -translate-y-2' : 'hover:scale-105 hover:-translate-y-1'}
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards',
              }}
              onClick={handleClick}
              onMouseEnter={() => setHoveredFolder(folder.id)}
              onMouseLeave={() => setHoveredFolder(null)}
            >
              {/* Background glow */}
              <div className={`
                absolute inset-0 bg-gradient-to-r ${folder.color} rounded-2xl blur opacity-0 
                ${isSelected ? 'opacity-30' : 'group-hover:opacity-20'}
                transition-opacity duration-300
              `} />
              
              {/* Card content */}
              <div className={`
                relative bg-white/10 backdrop-blur-xl border rounded-2xl p-6 h-full transition-all duration-300
                ${isSelected 
                  ? 'border-white/40 bg-white/20' 
                  : 'border-white/20 group-hover:border-white/30 group-hover:bg-white/15'
                }
              `}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-12 h-12 bg-gradient-to-r ${folder.color} rounded-xl flex items-center justify-center
                    shadow-lg transition-transform duration-300
                    ${isHovered ? 'scale-110 rotate-3' : ''}
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{folder.count}</div>
                    <div className="text-white/60 text-xs">emails</div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {folder.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {folder.description}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>Activity</span>
                    <span>+{Math.floor(Math.random() * 5) + 1} today</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div
                      className={`bg-gradient-to-r ${folder.color} h-1 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.random() * 60 + 20}%` }}
                    />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};