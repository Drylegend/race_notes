import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const doodlesDir = path.join(rootDir, 'public', 'lab-doodles');
const generatedDir = path.join(rootDir, 'src', 'generated');
const captionsFile = path.join(doodlesDir, 'captions.json');

const VALID_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp']);

function cleanTitle(filename) {
  const base = path.parse(filename).name;
  // Strip leading digits and separators like "01 - " or "01_" or "1."
  const stripped = base.replace(/^\d+[\s._-]+/, '');
  const nameToClean = stripped || base;

  // Replace underscores and dashes with spaces
  const withSpaces = nameToClean.replace(/[-_]+/g, ' ').trim();

  // Convert to Title Case
  return withSpaces
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function loadCaptions() {
  if (!fs.existsSync(captionsFile)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(captionsFile, 'utf-8');
    const parsed = JSON.parse(raw);

    // If array format: [{ filename: '...', caption: '...' }]
    if (Array.isArray(parsed)) {
      const map = {};
      for (const item of parsed) {
        if (item && item.filename) {
          map[item.filename] = item;
        }
      }
      return map;
    }

    // If object format: { 'file.png': { caption: '...' } }
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.warn(`[WARN] Failed to parse captions.json: ${err.message}`);
  }
  return {};
}

async function buildLabDoodles() {
  console.log('🎨 Starting Lab Doodles manifest build pipeline...');

  // Ensure public/lab-doodles and src/generated exist
  if (!fs.existsSync(doodlesDir)) {
    fs.mkdirSync(doodlesDir, { recursive: true });
    console.log(`📁 Created directory: ${doodlesDir}`);
  }
  fs.mkdirSync(generatedDir, { recursive: true });

  const captionsMap = loadCaptions();

  // Read files in public/lab-doodles
  const allEntries = fs.readdirSync(doodlesDir, { withFileTypes: true });
  const imageFiles = allEntries
    .filter((entry) => entry.isFile() && VALID_IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  // Natural alphabetical sort for consistent ordering
  imageFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const doodles = imageFiles.map((filename, index) => {
    const ext = path.extname(filename);
    const idSlug = path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `doodle-${index + 1}`;
    const sidecar = captionsMap[filename] || {};

    const title = sidecar.title || cleanTitle(filename);
    const order = typeof sidecar.order === 'number' ? sidecar.order : index + 1;
    const caption = sidecar.caption || '';
    const date = sidecar.date || null;

    return {
      id: idSlug,
      filename,
      url: `/lab-doodles/${encodeURIComponent(filename)}`,
      title,
      caption,
      date,
      order,
      ...sidecar,
    };
  });

  // Sort by order if custom orders were provided
  doodles.sort((a, b) => (a.order || 0) - (b.order || 0));

  const outputPath = path.join(generatedDir, 'labDoodlesData.json');
  fs.writeFileSync(outputPath, JSON.stringify({ doodles }, null, 2), 'utf-8');
  console.log(`✅ Lab Doodles build complete! Manifest generated with ${doodles.length} item(s) -> ${outputPath}\n`);
}

buildLabDoodles().catch((err) => {
  console.error('❌ Lab Doodles build script error:', err);
  process.exit(1);
});
