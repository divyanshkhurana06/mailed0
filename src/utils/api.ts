import { Email, SentEmail } from '../types/email';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // Google OAuth
  getGoogleAuthUrl: async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/google`);
    const data = await response.json();
    return data.url;
  },

  // Check authentication status
  checkAuth: async (email: string): Promise<{ authenticated: boolean; email?: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/check?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error('Failed to check authentication');
    }
    return response.json();
  },

  // Email fetching
  getEmails: async (email: string): Promise<Email[]> => {
    const response = await fetch(`${API_BASE_URL}/emails?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // Sent emails with analytics
  getSentEmails: async (email: string): Promise<SentEmail[]> => {
    const response = await fetch(`${API_BASE_URL}/emails/sent?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // On-demand email summarization
  summarizeEmail: async (emailId: string, userEmail: string): Promise<{ summary: string; tags: string[] }> => {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Email tracking
  getTrackingPixelUrl: (emailId: string): string => {
    return `${API_BASE_URL}/open?id=${emailId}`;
  },

  // Send email with tracking
  sendEmail: async (userEmail: string, to: string, subject: string, body: string): Promise<{ success: boolean; messageId: string; trackingId: string }> => {
    const response = await fetch(`${API_BASE_URL}/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        to,
        subject,
        body
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
}; 