import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TabsNav from './components/TabsNav';
import TranscriptsTab from './components/TranscriptsTab';
import SummaryTab from './components/SummaryTab';
import ImportantLinksTab from './components/ImportantLinksTab';
import { getAvailableDays, getDayContent } from './utils/contentLoader';

function MainView({ days, mobileOpen, setMobileOpen, searchQuery, setSearchQuery }) {
  const { daySlug, tabId } = useParams();

  // Validate active day or fallback to first available
  const availableSlugs = days.map((d) => d.slug);
  const activeDaySlug = availableSlugs.includes(daySlug) ? daySlug : days[0]?.slug || 'day-1';
  const activeTab = ['transcripts', 'summary', 'important-links'].includes(tabId) ? tabId : 'transcripts';

  // Load content for active day
  const content = useMemo(() => getDayContent(activeDaySlug), [activeDaySlug]);
  const activeDayObj = days.find((d) => d.slug === activeDaySlug);

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Sidebar Navigation */}
      <Sidebar
        days={days}
        activeDaySlug={activeDaySlug}
        activeTab={activeTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen">
        {/* Header App Bar */}
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Page Content Canvas */}
        <main className="flex-1 px-margin-mobile md:px-margin-desktop py-8 md:py-10 max-w-[1280px] w-full mx-auto">
          {/* Day Title & Subtitle */}
          <div className="mb-8">
            <h2 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold">
              {activeDayObj?.title || 'Materials'}
            </h2>
            <p className="font-body text-body-md text-secondary max-w-2xl">
              Course materials, lecture notes, key takeaways, and curated links for {activeDayObj?.title}.
            </p>
          </div>

          {/* Horizontal Tabs */}
          <TabsNav activeDaySlug={activeDaySlug} activeTab={activeTab} />

          {/* Active Tab View Content */}
          <div className="mt-6">
            {activeTab === 'transcripts' && (
              <TranscriptsTab transcripts={content.transcripts} searchQuery={searchQuery} />
            )}
            {activeTab === 'summary' && (
              <SummaryTab summary={content.summary} />
            )}
            {activeTab === 'important-links' && (
              <ImportantLinksTab links={content.links} searchQuery={searchQuery} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const days = useMemo(() => getAvailableDays(), []);

  const defaultDay = days[0]?.slug || 'day-1';

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${defaultDay}/transcripts`} replace />}
      />
      <Route
        path="/:daySlug"
        element={<Navigate to={`/${defaultDay}/transcripts`} replace />}
      />
      <Route
        path="/:daySlug/:tabId"
        element={
          <MainView
            days={days}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
      />
    </Routes>
  );
}
