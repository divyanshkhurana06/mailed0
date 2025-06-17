import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { NotificationProvider } from './components/NotificationProvider';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      setShowBadge(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Dashboard />
        
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