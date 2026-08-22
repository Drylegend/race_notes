import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'src', 'content');
const generatedDir = path.join(rootDir, 'src', 'generated');
const publicDownloadsDir = path.join(rootDir, 'public', 'downloads');

async function buildContent() {
  console.log('🔄 Starting content build pipeline (docx -> HTML, links.txt -> JSON)...');

  if (!fs.existsSync(contentDir)) {
    console.warn(`[WARN] Content directory not found at ${contentDir}`);
    return;
  }

  // Ensure output directories exist
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.mkdirSync(publicDownloadsDir, { recursive: true });

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const dayFolders = entries
    .filter((entry) => entry.isDirectory() && /^day-\d+$/i.test(entry.name))
    .map((entry) => {
      const match = entry.name.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 0;
      return { name: entry.name, num };
    })
    .sort((a, b) => a.num - b.num);

  const daysData = [];

  for (const { name: folderName, num } of dayFolders) {
    const daySlug = folderName.toLowerCase();
    const dayPath = path.join(contentDir, folderName);
    console.log(`📁 Processing ${daySlug} (Day ${num})...`);

    // 1. Transcripts (transcript-1.docx to transcript-4.docx)
    const transcripts = [];
    for (let i = 1; i <= 4; i++) {
      const docxName = `transcript-${i}.docx`;
      const docxPath = path.join(dayPath, docxName);

      if (fs.existsSync(docxPath)) {
        try {
          const result = await mammoth.convertToHtml({ path: docxPath });
          
          // Copy transcript-X.docx to public/downloads/day-N/transcript-X.docx
          const dayDownloadDir = path.join(publicDownloadsDir, daySlug);
          fs.mkdirSync(dayDownloadDir, { recursive: true });
          const targetDocxPath = path.join(dayDownloadDir, docxName);
          fs.copyFileSync(docxPath, targetDocxPath);

          transcripts.push({
            id: `transcript-${i}`,
            num: i,
            title: `Transcript ${i}`,
            html: result.value || '',
            hasDocx: true,
            downloadUrl: `/downloads/${daySlug}/${docxName}`,
          });
          console.log(`  ✓ Converted ${docxName} & staged download`);
        } catch (err) {
          console.warn(`  ⚠️ Failed converting ${docxName}: ${err.message}`);
        }
      }
    }

    // 2. Summary (summary.docx)
    const summaryDocxPath = path.join(dayPath, 'summary.docx');
    let summaryObj = { html: '', hasDocx: false, downloadUrl: null };

    if (fs.existsSync(summaryDocxPath)) {
      try {
        const result = await mammoth.convertToHtml({ path: summaryDocxPath });
        
        // Copy summary.docx to public/downloads/day-N/summary.docx
        const dayDownloadDir = path.join(publicDownloadsDir, daySlug);
        fs.mkdirSync(dayDownloadDir, { recursive: true });
        const targetDocxPath = path.join(dayDownloadDir, 'summary.docx');
        fs.copyFileSync(summaryDocxPath, targetDocxPath);

        summaryObj = {
          html: result.value || '',
          hasDocx: true,
          downloadUrl: `/downloads/${daySlug}/summary.docx`,
        };
        console.log(`  ✓ Converted summary.docx & staged download`);
      } catch (err) {
        console.warn(`  ⚠️ Failed converting summary.docx: ${err.message}`);
      }
    }

    // 3. Links (links.txt)
    const linksTxtPath = path.join(dayPath, 'links.txt');
    const links = [];

    if (fs.existsSync(linksTxtPath)) {
      try {
        const rawText = fs.readFileSync(linksTxtPath, 'utf-8');
        const lines = rawText.split(/\r?\n/);
        
        let linkCounter = 1;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;

          const parts = trimmed.split('|').map((p) => p.trim());
          if (parts.length >= 2) {
            links.push({
              id: `link-${linkCounter++}`,
              title: parts[0],
              url: parts[1],
              description: parts[2] || '',
            });
          }
        }
        console.log(`  ✓ Parsed links.txt (${links.length} links)`);
      } catch (err) {
        console.warn(`  ⚠️ Failed parsing links.txt: ${err.message}`);
      }
    }

    daysData.push({
      slug: daySlug,
      num,
      title: `Day ${num}`,
      transcripts,
      summary: summaryObj,
      links,
    });
  }

  const outputPath = path.join(generatedDir, 'contentData.json');
  fs.writeFileSync(outputPath, JSON.stringify({ days: daysData }, null, 2), 'utf-8');
  console.log(`✅ Content build complete! Generated ${daysData.length} days -> ${outputPath}\n`);
}

buildContent().catch((err) => {
  console.error('❌ Content build script error:', err);
  process.exit(1);
});
