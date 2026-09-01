import React, { useState, useEffect, useCallback } from 'react';
import doodlesData from '../generated/labDoodlesData.json';

export default function LabDoodlesTab({ searchQuery }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const doodles = doodlesData?.doodles || [];

  // Filter using live search from Header.jsx (same pattern as TranscriptsTab)
  const filteredDoodles = doodles.filter((doodle) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (doodle.title && doodle.title.toLowerCase().includes(query)) ||
      (doodle.caption && doodle.caption.toLowerCase().includes(query)) ||
      (doodle.filename && doodle.filename.toLowerCase().includes(query))
    );
  });

  const totalDoodles = filteredDoodles.length;
  const isModalOpen = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < totalDoodles;
  const currentDoodle = isModalOpen ? filteredDoodles[selectedIndex] : null;

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalDoodles - 1));
  }, [totalDoodles]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => (prev < totalDoodles - 1 ? prev + 1 : 0));
  }, [totalDoodles]);

  // Keyboard navigation: Escape to close, Left/Right arrows to navigate
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose, handlePrev, handleNext]);

  if (!doodles || doodles.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 md:p-12 text-center shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="material-symbols-outlined text-3xl">draw</span>
        </div>
        <h3 className="font-headline text-headline-sm font-bold text-on-surface mb-2">No Lab Doodles Yet</h3>
        <p className="font-body text-body-md text-secondary max-w-md mx-auto">
          Add your diagram, architecture sketch, and whiteboard images into <code className="bg-surface-container-low text-primary font-mono text-xs px-2 py-1 rounded border border-outline-variant/40">public/lab-doodles/</code> to render them here.
        </p>
      </div>
    );
  }

  if (!filteredDoodles.length) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary shadow-card">
        No lab doodles match your search query.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Responsive Adaptive Grid: auto-fill columns sized for legible infographic tiles */}
      <div
        className="gap-5 md:gap-6"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
      >
        {filteredDoodles.map((doodle, index) => (
          <article
            key={doodle.id}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIndex(index); } }}
            role="button"
            tabIndex={0}
            aria-label={`View ${doodle.title || doodle.filename}`}
            className="bg-surface-container-lowest rounded-xl border border-surface-container overflow-hidden hover-card cursor-pointer group flex flex-col shadow-card transition-all duration-300 ease-out hover:scale-[1.03] hover:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            {/* Image Preview — aspect-[9/5] matches actual doodle dimensions (~1.8:1 landscape) */}
            <div className="aspect-[9/5] bg-surface-container-lowest relative overflow-hidden border-b border-outline-variant/20">
              <img
                src={doodle.url}
                alt={doodle.title || doodle.filename}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/8 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-surface/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                </div>
              </div>
            </div>

            {/* Card Details — title only, no filename or Open button */}
            {doodle.title && (
              <div className="px-4 py-3 md:px-5 md:py-3.5">
                <h3 className="font-headline text-sm md:text-base font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                  {doodle.title}
                </h3>
                {doodle.caption && (
                  <p className="font-body text-xs md:text-sm text-secondary line-clamp-1 leading-relaxed mt-0.5">
                    {doodle.caption}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal with Prev/Next, Download, and Keyboard Controls */}
      {isModalOpen && currentDoodle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-on-surface/85 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={currentDoodle.title || 'Doodle Image'}
        >
          {/* Modal Container */}
          <div
            className="relative bg-surface rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-outline-variant/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between gap-4 bg-surface-container-lowest">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline text-headline-sm font-bold text-on-surface truncate">
                    {currentDoodle.title || currentDoodle.filename}
                  </h3>
                  {totalDoodles > 1 && (
                    <span className="font-label text-xs text-secondary bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/30 shrink-0 font-medium">
                      {selectedIndex + 1} of {totalDoodles}
                    </span>
                  )}
                </div>

                {currentDoodle.caption && (
                  <p className="font-body text-body-sm text-secondary mt-0.5 line-clamp-1">
                    {currentDoodle.caption}
                  </p>
                )}
              </div>

              {/* Action Controls: Download & Close */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={currentDoodle.url}
                  download={currentDoodle.filename}
                  className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-secondary-container text-primary font-label text-xs px-3.5 py-2 rounded-full transition-colors font-medium border border-outline-variant/40 shadow-sm"
                  title="Download image"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={handleClose}
                  className="p-2 text-secondary hover:text-on-surface rounded-full hover:bg-surface-container-low transition-colors"
                  aria-label="Close modal (Escape)"
                  title="Close (Escape)"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Modal Image Body with Prev / Next Buttons */}
            <div className="relative p-4 md:p-6 flex-1 overflow-auto bg-surface-container-low flex items-center justify-center min-h-[350px]">
              {/* Previous Button (if multiple doodles) */}
              {totalDoodles > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-surface/90 hover:bg-surface text-on-surface hover:text-primary shadow-lg flex items-center justify-center border border-outline-variant/30 transition-all hover:scale-105 active:scale-95"
                  title="Previous image (Left Arrow)"
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
              )}

              {/* Displayed Image */}
              <img
                src={currentDoodle.url}
                alt={currentDoodle.title || currentDoodle.filename}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-sm select-none"
              />

              {/* Next Button (if multiple doodles) */}
              {totalDoodles > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-surface/90 hover:bg-surface text-on-surface hover:text-primary shadow-lg flex items-center justify-center border border-outline-variant/30 transition-all hover:scale-105 active:scale-95"
                  title="Next image (Right Arrow)"
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
