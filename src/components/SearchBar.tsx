import React from 'react';
import { Search, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 group-focus-within:border-purple-400/50 transition-all duration-300">
        <Search className="w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
        
        <input
          type="text"
          placeholder="Search emails..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-white placeholder-white/40 outline-none flex-1 text-sm"
        />
        
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
};