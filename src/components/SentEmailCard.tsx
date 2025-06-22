import React from 'react';
import { SentEmail } from '../types/email';
import { Eye, Clock, Users, MapPin, Monitor, Calendar, Tag } from 'lucide-react';

interface SentEmailCardProps {
  email: SentEmail;
  onClick: () => void;
}

export const SentEmailCard: React.FC<SentEmailCardProps> = ({ email, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastOpened = (dateString: string | null) => {
    if (!dateString) return 'Never opened';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Opened just now';
    if (diffInHours < 24) return `Opened ${diffInHours}h ago`;
    if (diffInHours < 48) return 'Opened yesterday';
    return `Opened ${Math.floor(diffInHours / 24)}d ago`;
  };

  const getTopDevice = () => {
    if (!email.analytics.devices.length) return null;
    return email.analytics.devices.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  };

  const getTopLocation = () => {
    if (!email.analytics.locations.length) return null;
    return email.analytics.locations.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
            {email.title}
          </h3>
          <p className="text-white/60 text-sm">To: {email.to}</p>
        </div>
        
        {/* Analytics Badge */}
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full">
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">{email.analytics.opens}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {email.tags && email.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-purple-400" />
          <div className="flex gap-2 flex-wrap">
            {email.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <p className="text-white/70 text-sm mb-4 line-clamp-2">
        {email.preview}
      </p>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Open Status */}
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
          <Clock className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-white/60 text-xs">Last Opened</p>
            <p className="text-white text-sm font-medium">
              {formatLastOpened(email.analytics.lastOpened)}
            </p>
          </div>
        </div>

        {/* Sent Date */}
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
          <Calendar className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-white/60 text-xs">Sent</p>
            <p className="text-white text-sm font-medium">
              {formatDate(email.date)}
            </p>
          </div>
        </div>
      </div>

      {/* Device & Location Stats */}
      {(getTopDevice() || getTopLocation()) && (
        <div className="flex items-center gap-4 text-xs text-white/50">
          {getTopDevice() && (
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>{getTopDevice()?.type} ({getTopDevice()?.count})</span>
            </div>
          )}
          {getTopLocation() && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{getTopLocation()?.location} ({getTopLocation()?.count})</span>
            </div>
          )}
        </div>
      )}

      {/* Open History Preview */}
      {email.analytics.openHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-xs">Recent Opens</span>
          </div>
          <div className="flex gap-2">
            {email.analytics.openHistory.slice(0, 3).map((open, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70">{open.device}</span>
              </div>
            ))}
            {email.analytics.openHistory.length > 3 && (
              <span className="text-white/40 text-xs">+{email.analytics.openHistory.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 