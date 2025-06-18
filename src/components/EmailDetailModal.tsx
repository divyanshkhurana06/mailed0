import React, { useState, useEffect } from 'react';
import { X, Clock, User, Paperclip, Tag, Mail, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { Email } from '../types/email';
import { api } from '../utils/api';
import { useNotifications } from './NotificationProvider';

interface EmailDetailModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({ email, isOpen, onClose, userEmail }) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Reset AI summary when email changes
  useEffect(() => {
    if (email) {
      setAiSummary(email.aiSummary || null);
    }
  }, [email?.id, email?.aiSummary]);

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

  // Handle AI summarization
  const handleSummarize = async () => {
    if (isSummarizing) return;
    
    setIsSummarizing(true);
    try {
      const result = await api.summarizeEmail(email.id, userEmail);
      setAiSummary(result.summary);
      addNotification({
        title: 'Success',
        message: 'Email summarized successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Summarization error:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to summarize email. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Details</h2>
              <p className="text-white/60 text-sm">View complete email content</p>
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
                  <p className="text-white/60 text-sm">From</p>
                  <p className="text-white font-medium">{email.from}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white/60 text-sm">Date</p>
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

          {/* AI Summary Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">AI</span>
                </div>
                <span className="text-white font-semibold">AI Summary</span>
              </div>
              
              {!aiSummary && (
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200 disabled:opacity-50"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Summarize with AI
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
              {aiSummary ? (
                <div className="max-h-48 overflow-y-auto">
                  <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {aiSummary}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <p className="text-white/60 mb-3">No AI summary yet</p>
                  <p className="text-white/40 text-sm">Click "Summarize with AI" to generate a smart summary of this email</p>
                </div>
              )}
            </div>
          </div>

          {/* Full Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-white/60" />
              Full Email Content
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              {email.body ? (
                <div className="text-white/90 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                  {getDisplayContent(email.body)}
                </div>
              ) : email.snippet ? (
                <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                  {getDisplayContent(email.snippet)}
                </div>
              ) : (
                <p className="text-white/60 italic">
                  Full email content not available. This is a preview only.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 