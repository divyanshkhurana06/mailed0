import React, { useState, useEffect } from 'react';
import { SentEmailCard } from './SentEmailCard';
import { SentEmailDetailModal } from './SentEmailDetailModal';
import { SentEmail } from '../types/email';
import { api } from '../utils/api';
import { useNotifications } from './NotificationProvider';

interface SentAnalyticsProps {
  searchQuery: string;
  userEmail: string;
}

export const SentAnalytics: React.FC<SentAnalyticsProps> = ({ searchQuery, userEmail }) => {
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<SentEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const { addNotification } = useNotifications();

  // Fetch sent emails from Gmail
  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const fetchedEmails = await api.getSentEmails();
        setSentEmails(fetchedEmails);
      } catch (error) {
        addNotification({
          title: 'Error',
          message: 'Failed to fetch sent emails',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchSentEmails();
      const interval = setInterval(fetchSentEmails, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userEmail, addNotification]);

  // Filter emails based on search
  useEffect(() => {
    let filtered = sentEmails;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.title.toLowerCase().includes(query) ||
        email.to.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }
    setFilteredEmails(filtered);
  }, [sentEmails, searchQuery]);

  const handleEmailClick = (email: SentEmail) => {
    setSelectedEmail(email);
    setShowEmailDetail(true);
  };

  const handleCloseEmailDetail = () => {
    setShowEmailDetail(false);
    setSelectedEmail(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Sent Emails</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Live Tracking</span>
          </div>
        </div>
        <div className="text-white/60 text-sm">
          {filteredEmails.length} emails
        </div>
      </div>

      {/* Analytics Overview */}
      {sentEmails.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 text-lg">📧</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Sent</p>
                <p className="text-white text-xl font-bold">{sentEmails.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-green-400 text-lg">👁️</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Opens</p>
                <p className="text-white text-xl font-bold">
                  {sentEmails.reduce((total, email) => total + email.analytics.opens, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-purple-400 text-lg">📊</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Avg Opens</p>
                <p className="text-white text-xl font-bold">
                  {sentEmails.length > 0 
                    ? Math.round(sentEmails.reduce((total, email) => total + email.analytics.opens, 0) / sentEmails.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Grid */}
      <div className="grid gap-4">
        {filteredEmails.map((email, index) => (
          <div
            key={email.id}
            className="transform transition-all duration-500"
            style={{
              animationName: 'slideInUp',
              animationDuration: '0.6s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: `${index * 50}ms`,
            }}
          >
            <SentEmailCard 
              email={email} 
              onClick={() => handleEmailClick(email)}
            />
          </div>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📤</span>
          </div>
          <h3 className="text-white/60 text-lg mb-2">No sent emails found</h3>
          <p className="text-white/40">
            {searchQuery ? 'Try adjusting your search' : 'Send some emails from Gmail to see tracking analytics'}
          </p>
        </div>
      )}

      {/* Sent Email Detail Modal */}
      <SentEmailDetailModal
        email={selectedEmail}
        isOpen={showEmailDetail}
        onClose={handleCloseEmailDetail}
      />
    </div>
  );
};