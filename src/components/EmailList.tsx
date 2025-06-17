import React, { useState, useEffect } from 'react';
import { EmailCard } from './EmailCard';
import { useNotifications } from './NotificationProvider';
import { EmailCategory, Email } from '../types/email';
import { mockEmails } from '../data/mockEmails';

interface EmailListProps {
  category: EmailCategory | 'all';
  searchQuery: string;
}

export const EmailList: React.FC<EmailListProps> = ({ category, searchQuery }) => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [visibleEmails, setVisibleEmails] = useState<Email[]>([]);
  const { addNotification } = useNotifications();

  // Filter emails based on category and search
  useEffect(() => {
    let filtered = emails;
    
    if (category !== 'all') {
      filtered = filtered.filter(email => email.category === category);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email => 
        email.title.toLowerCase().includes(query) ||
        email.sender.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }
    
    setVisibleEmails(filtered);
  }, [emails, category, searchQuery]);

  // Simulate new emails arriving
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        const newEmail: Email = {
          id: Date.now().toString(),
          sender: ['Sarah Chen', 'Alex Rivera', 'Maya Patel', 'David Kim'][Math.floor(Math.random() * 4)],
          title: ['Meeting Reminder', 'Project Update', 'Invoice Ready', 'New Opportunity'][Math.floor(Math.random() * 4)],
          preview: 'This is a preview of the new email content...',
          time: 'now',
          isRead: false,
          category: ['work', 'finance', 'events', 'marketing'][Math.floor(Math.random() * 4)] as EmailCategory,
          priority: Math.random() > 0.7 ? 'high' : 'normal',
          hasAttachment: Math.random() > 0.8,
        };
        
        setEmails(prev => [newEmail, ...prev]);
        addNotification({
          id: newEmail.id,
          title: `${newEmail.sender} – ${newEmail.title}`,
          message: newEmail.preview,
          type: 'email',
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const handleEmailRead = (emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      )
    );
  };

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