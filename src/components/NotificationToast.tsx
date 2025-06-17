import React, { useEffect, useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'success' | 'error' | 'info';
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'email':
        return <Mail className="w-5 h-5 text-purple-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'email':
        return 'from-purple-500/20 to-pink-500/20 border-purple-400/30';
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'error':
        return 'from-red-500/20 to-red-600/20 border-red-400/30';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className={`
        relative bg-gradient-to-r ${getColors()} backdrop-blur-xl border rounded-2xl p-4 max-w-sm
        shadow-lg hover:shadow-xl transition-shadow duration-300
      `}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl" />
        
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">
              {notification.title}
            </h4>
            <p className="text-white/70 text-xs mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-white/60 hover:text-white" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 animate-progress" />
        </div>
      </div>
    </div>
  );
};