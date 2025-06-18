import { Email } from '../types/email';

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
      throw new Error('Failed to fetch emails');
    }
    return response.json();
  },

  // Email tracking
  getTrackingPixelUrl: (emailId: string): string => {
    return `${API_BASE_URL}/open?id=${emailId}`;
  }
}; 