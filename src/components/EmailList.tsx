import React, { useState, useEffect } from 'react';
import { EmailCard } from './EmailCard';
import { useNotifications } from './NotificationProvider';
import { EmailCategory, Email } from '../types/email';
import { api } from '../utils/api';

interface EmailListProps {
  category: EmailCategory | 'all';
  searchQuery: string;
  userEmail: string;
}

export const EmailList: React.FC<EmailListProps> = ({ category, searchQuery, userEmail }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [visibleEmails, setVisibleEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await api.getEmails(userEmail);
        setEmails(fetchedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        addNotification({
          id: 'error',
          title: 'Error',
          message: 'Failed to fetch emails. Please try again.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userEmail, addNotification]);

  // Filter emails based on category and search
  useEffect(() => {
    let filtered = emails;
    
    if (category !== 'all') {
      filtered = filtered.filter(email => email.tags.includes(category));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.title.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }
    
    setVisibleEmails(filtered);
  }, [emails, category, searchQuery]);

  const handleEmailRead = (emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      )
    );
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
          <h2 className="text-2xl font-bold text-white">
            {category === 'all' ? 'All Emails' : category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>
        
        <div className="text-white/60 text-sm">
          {visibleEmails.length} emails
        </div>
      </div>

      {/* Email Grid */}
      <div className="grid gap-4">
        {visibleEmails.map((email, index) => (
          <div
            key={email.id}
            className="transform transition-all duration-500"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'slideInUp 0.6s ease-out forwards',
            }}
          >
            <EmailCard 
              email={email} 
              onClick={() => handleEmailRead(email.id)}
            />
          </div>
        ))}
      </div>

      {visibleEmails.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h3 className="text-white/60 text-lg mb-2">No emails found</h3>
          <p className="text-white/40">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};