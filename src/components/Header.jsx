import React from 'react';

export default function Header({ onMenuToggle, searchQuery, setSearchQuery }) {
  return (
    <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 sticky top-0 z-30 bg-surface shadow-sm border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant"
          aria-label="Open Navigation Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-display text-lg md:text-headline-sm font-bold text-primary tracking-tight">
          AI103 | SEM 03 | Module 15
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-secondary-container transition-all">
          <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search transcripts & notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-sm font-body w-48 lg:w-64 placeholder:text-secondary"
          />
        </div>

        {/* Action Controls: Notification Bell Only */}
        <div className="flex items-center">
          <button
            className="p-2 text-secondary hover:text-primary hover:bg-surface-container-low rounded-full transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
}
