export type EmailCategory = 'work' | 'finance' | 'events' | 'marketing' | 'personal';

export interface Email {
  id: string;
  sender: string;
  title: string;
  preview: string;
  time: string;
  isRead: boolean;
  category: EmailCategory;
  priority: 'normal' | 'high';
  hasAttachment: boolean;
}

export interface SentEmail {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  opens: number;
  analytics: {
    opens: Array<{
      timestamp: string;
      location: string;
      device: string;
    }>;
    devices: Array<{
      type: string;
      count: number;
    }>;
    locations: Array<{
      city: string;
      count: number;
    }>;
  };
}