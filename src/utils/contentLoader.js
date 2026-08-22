import contentData from '../generated/contentData.json';

export function getAvailableDays() {
  const days = contentData.days || [];
  return days.map((day) => ({
    slug: day.slug,
    num: day.num,
    title: day.title,
    icon: 'calendar_today',
  }));
}

export function getDayContent(daySlug) {
  const days = contentData.days || [];
  const day = days.find((d) => d.slug === daySlug);

  if (!day) {
    return {
      transcripts: [],
      summary: { html: '', hasDocx: false, downloadUrl: null },
      links: [],
    };
  }

  return {
    transcripts: day.transcripts || [],
    summary: day.summary || { html: '', hasDocx: false, downloadUrl: null },
    links: day.links || [],
  };
}
