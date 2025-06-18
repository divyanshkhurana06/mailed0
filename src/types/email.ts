export type EmailCategory = 'work' | 'finance' | 'events' | 'marketing' | 'account' | 'personal' | 'general';

export interface Email {
  id: string;
  subject: string;
  from: string;
  title: string;
  tags: EmailCategory[];
  preview: string;
  snippet?: string;
  body?: string;
  date: string;
  aiSummary?: string | null; // AI-generated summary (null if not generated yet)
  isRead?: boolean;
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