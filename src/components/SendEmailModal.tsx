import React, { useState } from 'react';
import { X, Send, User, FileText, Mail } from 'lucide-react';
import { api } from '../utils/api';
import { useNotifications } from './NotificationProvider';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, userEmail }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!to || !subject || !body) {
      addNotification({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await api.sendEmail(userEmail, to, subject, body);
      
      addNotification({
        title: 'Success',
        message: 'Email sent successfully with tracking!',
        type: 'success',
      });

      // Reset form
      setTo('');
      setSubject('');
      setBody('');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to send email. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setTo('');
      setSubject('');
      setBody('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Email</h2>
              <p className="text-white/60 text-sm">Send with tracking enabled</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* To Field */}
          <div>
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
              disabled={isSending}
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
              disabled={isSending}
            />
          </div>

          {/* Body Field */}
          <div>
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
              <FileText className="w-4 h-4" />
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              disabled={isSending}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSending || !to || !subject || !body}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Email with Tracking
              </>
            )}
          </button>

          {/* Info */}
          <div className="text-center">
            <p className="text-white/40 text-xs">
              This email will include a tracking pixel to monitor opens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 