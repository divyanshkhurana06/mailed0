import React, { useState } from 'react';
import { Star, Paperclip, Clock, Zap, Eye } from 'lucide-react';
import { Email } from '../types/email';
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

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'from-blue-500 to-cyan-500',
      finance: 'from-green-500 to-emerald-500',
      events: 'from-purple-500 to-pink-500',
      marketing: 'from-orange-500 to-red-500',
      personal: 'from-indigo-500 to-purple-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getPriorityIcon = () => {
    if (email.priority === 'high') {
      return <Zap className="w-4 h-4 text-yellow-400" />;
    }
    return null;
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
        absolute inset-0 bg-gradient-to-r ${getCategoryColor(email.category)} 
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
            {/* Category badge */}
            <div className={`
              px-3 py-1 bg-gradient-to-r ${getCategoryColor(email.category)} 
              rounded-full text-xs font-semibold text-white shadow-lg
            `}>
              {email.category}
            </div>
            
            {/* Priority indicator */}
            {getPriorityIcon()}
            
            {/* Attachment indicator */}
            {email.hasAttachment && (
              <Paperclip className="w-4 h-4 text-white/60" />
            )}
            
            {/* Read status */}
            {!email.isRead && (
              <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span>{email.time}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`
              font-bold text-lg transition-colors duration-300
              ${!email.isRead ? 'text-white' : 'text-white/80'}
            `}>
              {email.sender} – {email.title}
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
          absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r ${getCategoryColor(email.category)} 
          opacity-0 group-hover:opacity-50 transition-opacity duration-300
        `} />
      </div>
    </div>
  );
};