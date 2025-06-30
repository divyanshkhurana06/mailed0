import React, { useState } from 'react';
import { Mail, Shield, Zap, Sparkles } from 'lucide-react';
import { api } from '../utils/api';

interface SignInModalProps {
  isOpen: boolean;
  onSignIn: (email: string) => void;
  error?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onSignIn, error: propError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLocalError('');
      
      const authUrl = await api.getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Sign in error:', error);
      setLocalError('Failed to start sign-in process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use prop error if provided, otherwise use local error
  const displayError = propError || localError;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <img 
            src="/mailed-logo.svg" 
            alt="Mailed Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Mailed</h1>
          <p className="text-white/60">Your Smart Email Assistant</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-white/80">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>AI-powered email summarization</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>Real-time Gmail integration</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Secure & private</span>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`
            w-full bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700 
            text-white font-semibold py-4 px-6 rounded-2xl 
            transition-all duration-300 transform hover:scale-105 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-3
          `}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Error Message */}
        {displayError && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {displayError}
          </div>
        )}

        {/* Privacy Notice */}
        <p className="text-white/40 text-xs mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}; 