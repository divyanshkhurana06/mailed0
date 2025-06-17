import React from 'react';
import { Mail } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping">
            <Mail className="w-16 h-16 text-purple-400 mx-auto" />
          </div>
          <Mail className="w-16 h-16 text-white mx-auto relative z-10" />
        </div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mailed</span>
          </h1>
          <p className="text-white/60 text-lg">Transforming your email experience</p>
          
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};