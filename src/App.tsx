import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { About } from './components/About';
import { NotificationProvider } from './components/NotificationProvider';
import { LoadingScreen } from './components/LoadingScreen';
import { SignInModal } from './components/SignInModal';
import { api } from './utils/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // Check if we're on the auth success page
        if (window.location.pathname === '/auth/success') {
          const urlParams = new URLSearchParams(window.location.search);
          const email = urlParams.get('email');
          
          if (email) {
            // User just signed in successfully
            setUserEmail(email);
            setIsAuthenticated(true);
            setShowSignInModal(false);
            setAuthError('');
            localStorage.setItem('userEmail', email);
            // Clean up URL
            window.history.replaceState({}, document.title, '/');
            return;
          }
        }

        // Check if we're on the auth error page
        if (window.location.pathname === '/auth/error') {
          const urlParams = new URLSearchParams(window.location.search);
          const reason = urlParams.get('reason');
          
          let errorMessage = 'Authentication failed. Please try again.';
          if (reason === 'access_denied') {
            errorMessage = 'Access denied. Please make sure you\'re added as a test user in Google Cloud Console.';
          } else if (reason === 'no_code') {
            errorMessage = 'Authorization code not received. Please try signing in again.';
          } else if (reason) {
            errorMessage = `Authentication error: ${reason}`;
          }
          
          setAuthError(errorMessage);
          setShowSignInModal(true);
          // Clean up URL
          window.history.replaceState({}, document.title, '/');
          setIsLoading(false);
          return;
        }

        // Check if user is already authenticated
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          try {
            const authStatus = await api.checkAuth(storedEmail);
            if (authStatus.authenticated) {
              setUserEmail(storedEmail);
              setIsAuthenticated(true);
              setShowSignInModal(false);
              setAuthError('');
            } else {
              localStorage.removeItem('userEmail');
              setShowSignInModal(true);
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('userEmail');
            setShowSignInModal(true);
          }
        } else {
          setShowSignInModal(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setShowSignInModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setShowBadge(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setShowSignInModal(false);
    setAuthError('');
    localStorage.setItem('userEmail', email);
  };

  const handleSignOut = () => {
    setUserEmail('');
    setIsAuthenticated(false);
    setShowAbout(false);
    setAuthError('');
    localStorage.removeItem('userEmail');
    setShowSignInModal(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {isAuthenticated ? (
          showAbout ? (
            <About onBack={() => setShowAbout(false)} />
          ) : (
            <Dashboard 
              userEmail={userEmail} 
              onShowAbout={() => setShowAbout(true)}
              onSignOut={handleSignOut}
            />
          )
        ) : (
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="max-w-4xl w-full">
              {/* Main Landing */}
              <div className="text-center mb-12">
                <img 
                  src="/mailed-logo.svg" 
                  alt="Mailed Logo"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Mailed</h1>
                <p className="text-white/60 text-lg mb-8">AI-powered email tracking and analytics</p>
                
                {/* Extension Download Section */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-white">Gmail Extension</h3>
                        <p className="text-white/60 text-sm">Auto-inject tracking pixels into your Gmail messages</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/mailed-extension.zip';
                          link.download = 'mailed-extension.zip';
                          link.click();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        Download Extension
                      </button>
                      <button
                        onClick={() => window.open('/extension-guide.html', '_blank')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 text-sm"
                      >
                        Install Guide
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/60">Please sign in to continue</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sign In Modal */}
        <SignInModal 
          isOpen={showSignInModal} 
          onSignIn={handleSignIn}
          error={authError}
        />
        
        {/* Made with Bolt.new Badge - Only shows when scrolling */}
        <div className={`
          fixed bottom-4 right-4 z-50 transition-all duration-500 transform
          ${showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}>
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/60 transition-colors duration-300 text-xs"
          >
            Made with Bolt.new
          </a>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;