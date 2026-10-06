import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">QuoteFlow</span>
          <span>·</span>
          <span>Reviews & Call Tracking Module</span>
        </div>
        <div className="text-slate-600 font-medium">
          QuoteFlow demo. For management review.
        </div>
      </div>
    </footer>
  );
};
