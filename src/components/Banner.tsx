import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <div className="w-full bg-[#1F3A5F] text-white px-4 py-2 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-between border-b border-[#142742] shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-center gap-2 text-center">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-400/20 text-teal-300">
          <ShieldAlert className="w-3 h-3 text-teal-300" />
        </span>
        <span className="font-semibold text-teal-300">DEMO MODE:</span>
        <span className="text-slate-200">Sample data only. Nothing is sent or charged.</span>
        <span className="hidden md:inline-block text-slate-400 font-normal">| Australian Cleaning Industry Platform</span>
      </div>
    </div>
  );
};
