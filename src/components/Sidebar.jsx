import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ days, activeDaySlug, activeTab, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDoodlesActive = location.pathname.startsWith('/lab-doodles');

  const handleDaySelect = (daySlug) => {
    navigate(`/${daySlug}/${activeTab || 'transcripts'}`);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleDoodlesSelect = () => {
    navigate('/lab-doodles');
    if (setMobileOpen) setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface border-r border-outline-variant w-72">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3.5 bg-surface-container-low border-b border-outline-variant/30">
        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-on-primary-container text-xl">school</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-headline text-headline-sm font-bold text-on-surface leading-snug">Class Notes</h1>
          <p className="font-label text-xs text-secondary mt-0.5 leading-snug break-words">
            Azure AI Apps & Agents Developer Associate - AI103 Certification
          </p>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 pb-2">
          <span className="text-xs font-label uppercase tracking-wider text-secondary font-semibold">Course Days</span>
        </div>
        <ul className="space-y-1">
          {days.map((day) => {
            const isActive = !isDoodlesActive && day.slug === activeDaySlug;
            return (
              <li key={day.slug}>
                <button
                  onClick={() => handleDaySelect(day.slug)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left font-label text-label-md transition-all border-l-4 ${
                    isActive
                      ? 'bg-secondary-container text-primary border-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-variant border-transparent'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-secondary'}`}>
                    {day.icon || 'calendar_today'}
                  </span>
                  <span>{day.title}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Visual Divider & Section Header */}
        <div className="pt-5 pb-2 px-4">
          <div className="border-t border-outline-variant/40 mb-3" />
          <span className="text-xs font-label uppercase tracking-wider text-secondary font-semibold">Visual Notes</span>
        </div>

        {/* Standalone Lab Doodles Navigation Item */}
        <ul className="space-y-1">
          <li>
            <button
              onClick={handleDoodlesSelect}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left font-label text-label-md transition-all border-l-4 ${
                isDoodlesActive
                  ? 'bg-secondary-container text-primary border-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined ${isDoodlesActive ? 'text-primary' : 'text-secondary'}`}>
                draw
              </span>
              <span>Lab Doodles</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-surface shadow-2xl z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
