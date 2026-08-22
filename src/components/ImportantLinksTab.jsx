import React from 'react';

export default function ImportantLinksTab({ links, searchQuery }) {
  if (!links || links.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary">
        No links uploaded for this day yet.
      </div>
    );
  }

  const filteredLinks = links.filter((link) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (link.title && link.title.toLowerCase().includes(query)) ||
      (link.description && link.description.toLowerCase().includes(query)) ||
      (link.url && link.url.toLowerCase().includes(query))
    );
  });

  if (!filteredLinks.length) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary">
        No links match your search query.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {filteredLinks.map((item) => (
        <div
          key={item.id}
          className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container hover-card transition-all duration-200 flex flex-col md:flex-row md:items-center gap-6 group"
        >
          <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-2xl">link</span>
          </div>

          <div className="flex-1">
            <h3 className="font-headline text-headline-sm text-on-surface mb-1 font-semibold group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="font-body text-body-sm text-secondary line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
            <p className="font-mono text-xs text-secondary mt-2 truncate max-w-lg">
              {item.url}
            </p>
          </div>

          <div className="shrink-0 mt-2 md:mt-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-secondary-container text-primary font-label text-label-md px-4 py-2 rounded-lg transition-colors border border-outline-variant/40 md:border-transparent hover:border-transparent"
            >
              <span>Open</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
