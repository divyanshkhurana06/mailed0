export type EmailCategory = 'work' | 'finance' | 'events' | 'marketing' | 'personal';

export interface Email {
  id: string;
  subject: string;
  from: string;
  title: string;
  tags: EmailCategory[];
  preview: string;
  snippet?: string;
  date: string;
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