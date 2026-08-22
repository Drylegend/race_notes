import React, { useState } from 'react';

export default function TranscriptsTab({ transcripts, searchQuery }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!transcripts || transcripts.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary">
        No transcripts uploaded for this day yet.
      </div>
    );
  }

  const filteredTranscripts = transcripts.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(query)) ||
      (t.html && t.html.toLowerCase().includes(query))
    );
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!filteredTranscripts.length) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary">
        No transcripts match your search query.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {filteredTranscripts.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <article
            key={item.id}
            onClick={() => toggleExpand(item.id)}
            className="bg-surface-container-lowest rounded-xl border border-surface-container p-6 hover-card cursor-pointer group transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                  {item.num || 'T'}
                </div>
                <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                {item.hasDocx && item.downloadUrl && (
                  <a
                    href={item.downloadUrl}
                    download={`transcript-${item.num || 1}.docx`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-secondary-container text-primary font-label text-xs px-3 py-1.5 rounded-full transition-colors border border-outline-variant/40 font-medium hover:border-primary/40 shadow-sm"
                    title={`Download ${item.title} (.docx)`}
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download</span>
                  </a>
                )}
                <span className="font-label text-xs text-secondary bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/20">
                  {isExpanded ? 'Click to Collapse' : 'Click to Read'}
                </span>
                <button
                  type="button"
                  className="text-secondary group-hover:text-primary transition-colors p-1"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>
            </div>

            {isExpanded && (
              <div
                className="mt-6 pt-6 border-t border-outline-variant/30 docx-rendered-html text-on-surface leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}
