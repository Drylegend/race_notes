import React from 'react';

export default function SummaryTab({ summary, markdownContent, content }) {
  const summaryData = summary || markdownContent || content;
  const isObject = summaryData && typeof summaryData === 'object';
  const html = isObject ? summaryData.html : (typeof summaryData === 'string' ? summaryData : '');
  const hasDocx = isObject ? summaryData.hasDocx : false;
  const downloadUrl = isObject ? summaryData.downloadUrl : null;

  const hasContent = html && html.trim() !== '';

  if (!hasContent) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-8 text-center text-secondary">
        No summary uploaded for this day yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Top Controls: Download Button */}
      {hasDocx && downloadUrl && (
        <div className="mb-6 flex justify-end">
          <a
            href={downloadUrl}
            download="summary.docx"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-label-md px-4 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Download Summary (.docx)</span>
          </a>
        </div>
      )}

      {/* Main Converted Summary Content */}
      <article className="hover-card bg-surface-container-lowest border border-surface-container rounded-xl p-6 md:p-12 mb-12 shadow-card">
        <div
          className="docx-rendered-html text-on-surface leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
