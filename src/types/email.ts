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
  subject: string;
  to: string;
  date: string;
  title: string;
  preview: string;
  body?: string;
  snippet?: string;
  tags: EmailCategory[];
  analytics: {
    opens: number;
    lastOpened: string | null;
    devices: Array<{
      type: string;
      count: number;
    }>;
    locations: Array<{
      location: string;
      count: number;
    }>;
    openHistory: Array<{
      timestamp: string;
      device: string;
      browser: string;
      os: string;
      location: string;
    }>;
  };
}