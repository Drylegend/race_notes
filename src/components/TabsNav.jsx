import React from 'react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'transcripts', label: 'Transcripts' },
  { id: 'summary', label: 'Summary' },
  { id: 'important-links', label: 'Important Links' },
];

export default function TabsNav({ activeDaySlug, activeTab }) {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    navigate(`/${activeDaySlug}/${tabId}`);
  };

  return (
    <div className="flex border-b border-outline-variant/50 mb-8 overflow-x-auto hide-scrollbar gap-8">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`pb-3 pt-1 font-label text-label-md transition-all whitespace-nowrap border-b-2 ${
              isActive
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
