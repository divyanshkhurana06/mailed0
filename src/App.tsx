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
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Mailed</h1>
              <p className="text-white/60">Please sign in to continue</p>
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