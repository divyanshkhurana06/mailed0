import React from 'react';
import { X, Clock, User, Paperclip, Tag, Mail, Calendar, Eye, Users, MapPin, Monitor, TrendingUp } from 'lucide-react';
import { SentEmail } from '../types/email';

interface SentEmailDetailModalProps {
  email: SentEmail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SentEmailDetailModal: React.FC<SentEmailDetailModalProps> = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const sanitizeEmailBody = (html: string): string => {
    if (!html) return '';
    const pixelRegex = /<img[^>]+src="[^"]+\/api\/open\?id=[^"]+"[^>]*>/g;
    return html.replace(pixelRegex, '');
  };

  // Function to extract text content from HTML
  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Function to check if content is HTML
  const isHTML = (content: string): boolean => {
    return content.trim().startsWith('<html') || content.includes('<body') || content.includes('<div');
  };

  // Get clean content for display
  const getDisplayContent = (content: string): string => {
    if (isHTML(content)) {
      return extractTextFromHTML(content);
    }
    return content;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Sent Email Details</h2>
              <p className="text-white/60 text-sm">View email content and analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-6">
          {/* Subject and Metadata */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-4 leading-tight">{email.subject}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white/60 text-sm">To</p>
                  <p className="text-white font-medium">{email.to}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white/60 text-sm">Sent</p>
                  <p className="text-white font-medium">{formatDate(email.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {email.tags && email.tags.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Categories</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {email.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium text-purple-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Analytics</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  <span className="text-white/60 text-sm">Total Opens</span>
                </div>
                <p className="text-white text-2xl font-bold">{email.analytics.opens}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white/60 text-sm">Last Opened</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatLastOpened(email.analytics.lastOpened)}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60 text-sm">Devices</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {email.analytics.devices.length} types
                </p>
              </div>
            </div>

            {/* Device & Location Breakdown */}
            {(email.analytics.devices.length > 0 || email.analytics.locations.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Devices */}
                {email.analytics.devices.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      Devices
                    </h4>
                    <div className="space-y-2">
                      {email.analytics.devices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/80 text-sm capitalize">{device.type}</span>
                          <span className="text-blue-400 text-sm font-medium">{device.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {email.analytics.locations.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      Locations
                    </h4>
                    <div className="space-y-2">
                      {email.analytics.locations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/80 text-sm">{location.location}</span>
                          <span className="text-green-400 text-sm font-medium">{location.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Open History */}
            {email.analytics.openHistory.length > 0 && (
              <div className="mt-6 bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Open History
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {email.analytics.openHistory.map((open, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">{open.device}</span>
                      </div>
                      <span className="text-white/50 text-xs">
                        {new Date(open.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-white/60" />
              Email Content
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {email.body ? (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeEmailBody(email.body) }} 
                />
              ) : email.snippet ? (
                <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                  {getDisplayContent(email.snippet)}
                </div>
              ) : (
                <p className="text-white/60 italic">
                  Email content not available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 