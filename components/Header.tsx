
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.198 15.293 3 18" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">LinguistTrack</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Your Daily Lexicon</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <nav className="flex gap-4">
            <a href="#" className="text-sm font-semibold text-indigo-600">Overview</a>
            <a href="#" className="text-sm font-semibold text-gray-400 hover:text-gray-600">History</a>
            <a href="#" className="text-sm font-semibold text-gray-400 hover:text-gray-600">Settings</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
