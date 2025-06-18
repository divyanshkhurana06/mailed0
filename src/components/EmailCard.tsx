import React, { useState } from 'react';
import { Star, Paperclip, Clock, Eye } from 'lucide-react';
import { Email, EmailCategory } from '../types/email';
import { createConfetti } from '../utils/confetti';

interface EmailCardProps {
  email: Email;
  onClick: () => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    onClick();
    
    // Create confetti effect
    createConfetti(e.currentTarget as HTMLElement);
    
    // Add read tracking animation
    if (!email.isRead) {
      e.currentTarget.classList.add('animate-pulse');
      setTimeout(() => {
        e.currentTarget.classList.remove('animate-pulse');
      }, 500);
    }
  };

  const getCategoryColor = (category: EmailCategory) => {
    const colors = {
      work: 'from-blue-500 to-cyan-500',
      finance: 'from-green-500 to-emerald-500',
      events: 'from-purple-500 to-pink-500',
      marketing: 'from-orange-500 to-red-500',
      personal: 'from-indigo-500 to-purple-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`
        group relative cursor-pointer transition-all duration-300 transform
        ${isHovered ? 'scale-105 -translate-y-1' : ''}
        ${!email.isRead ? 'animate-glow' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Background glow */}
      <div className={`
        absolute inset-0 bg-gradient-to-r ${getCategoryColor(email.tags[0])} 
        rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300
        ${!email.isRead ? 'opacity-10' : ''}
      `} />
      
      {/* Card content */}
      <div className={`
        relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6
        group-hover:border-white/30 group-hover:bg-white/15 text-white transition-all duration-300
        ${!email.isRead ? 'border-purple-400/30 bg-white/15' : ''}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Category badges */}
            <div className="flex gap-2">
              {email.tags.map((tag, index) => (
                <div
                  key={tag}
                  className={`
                    px-3 py-1 bg-gradient-to-r ${getCategoryColor(tag)} 
                    rounded-full text-xs font-semibold text-white shadow-lg
                  `}
                >
                  {tag}
                </div>
              ))}
            </div>
            
            {/* Read status */}
            {!email.isRead && (
              <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatDate(email.date)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`
              font-bold text-lg transition-colors duration-300
              ${!email.isRead ? 'text-white' : 'text-white/80'}
            `}>
              {email.from} – {email.title}
            </h3>
            
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star className="w-5 h-5 text-white/60 hover:text-yellow-400 transition-colors duration-200" />
            </button>
          </div>
          
          <p className="text-white/60 line-clamp-2 leading-relaxed">
            {email.preview}
          </p>
        </div>

        {/* Hover effects */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Bottom glow line */}
        <div className={`
          absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r ${getCategoryColor(email.tags[0])} 
          opacity-0 group-hover:opacity-50 transition-opacity duration-300
        `} />
      </div>
    </div>
  );
};