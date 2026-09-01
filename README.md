# Student Class Notes & Lab Doodles Web App

A production-ready static web application built with **React 18**, **Vite**, **Tailwind CSS**, and **Mammoth.js**.

This application is **100% static**, requiring no active backend server. It features two independent content pipelines:

1. **Day-based Course Materials**: Place Microsoft Word (`.docx`) transcripts/summaries and `links.txt` into `src/content/day-N/` folders.
2. **Standalone Visual Notes ("Lab Doodles")**: Place diagram/sketch images (`.png`, `.jpg`, etc.) into `public/lab-doodles/` with optional sidecar metadata.

---

## 📁 Directory Structure

```
d:/race_note_app/
├── automation/               # Multi-agent publishing orchestrator
│   ├── orchestrator.py
│   └── requirements.txt
├── public/
│   ├── downloads/            # Staged .docx files for direct client download
│   │   └── day-N/
│   └── lab-doodles/          # Standalone visual notes & diagrams (.png, .jpg, .webp)
│       └── captions.json     # (Optional) Metadata sidecar for captions/dates
├── scripts/
│   ├── build-content.mjs     # Mammoth docx -> HTML & links.txt -> JSON converter
│   └── build-lab-doodles.mjs # Scans lab-doodles & generates manifest
├── src/
│   ├── components/
│   │   ├── Header.jsx        # App bar with search, mobile toggle & notifications
│   │   ├── ImportantLinksTab.jsx
│   │   ├── LabDoodlesTab.jsx # Standalone gallery with lightbox & search
│   │   ├── Sidebar.jsx       # Left navigation (days + Lab Doodles route)
│   │   ├── SummaryTab.jsx    # Formatted HTML reader for summary.docx
│   │   ├── TabsNav.jsx       # Tab switcher for day materials
│   │   └── TranscriptsTab.jsx# Expandable transcript cards
│   ├── content/
│   │   ├── _template/        # Template for new day creation
│   │   ├── day-1/
│   │   ├── day-2/
│   │   ├── day-3/
│   │   └── day-4/
│   ├── generated/
│   │   ├── contentData.json  # Auto-generated day materials manifest
│   │   └── labDoodlesData.json # Auto-generated Lab Doodles manifest
│   ├── utils/
│   │   └── contentLoader.js  # Loader helper for generated data
│   ├── App.jsx               # Routes & Layout orchestrator
│   ├── index.css             # Tailwind base & DOCX rendered styling
│   └── main.jsx
├── tailwind.config.js        # Material 3 design tokens & custom colors
├── package.json
└── netlify.toml              # Netlify SPA redirect & build config
```

---

## 📝 Content Workflows

### 1. Adding a New Course Day (e.g. Day 5)

1. Create a folder `src/content/day-5/`.
2. Add your content files:
   - **Transcripts**: `transcript-1.docx` through `transcript-4.docx` (converted to styled HTML and staged for download).
   - **Summary**: `summary.docx` (converted to styled HTML and downloadable).
   - **Links**: `links.txt` with pipe-separated entries:
     ```text
     Title | URL | Short Description
     ```
3. Run `npm run dev` or `npm run build`—the pipeline updates `src/generated/contentData.json` automatically.

---

### 2. Adding Visual Notes & Diagrams ("Lab Doodles")

1. Place image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`) into `public/lab-doodles/`.
2. _(Optional)_ Create or edit `public/lab-doodles/captions.json` to assign custom titles, captions, dates, or display orders:
   ```json
   [
     {
       "filename": "rag-architecture.png",
       "title": "RAG Architecture Diagram",
       "caption": "High level retrieval augmented generation architecture",
       "date": "2026-08-31",
       "order": 1
     }
   ]
   ```
3. The `doodles:build` pipeline automatically scans images, cleans filenames into readable titles, merges captions, and produces `src/generated/labDoodlesData.json`.

---

## 🎨 UI & Features

- **Material 3 Design System**: Curated color palette (`#0058bc` primary, `#f9f9ff` surface), `Manrope` display typography, `Inter` body copy, and Google Material Symbols.
- **Deep-Linkable Client Routing**:
  - `/:daySlug/transcripts`
  - `/:daySlug/summary`
  - `/:daySlug/important-links`
  - `/lab-doodles` (Standalone visual gallery with independent route)
- **Interactive Lightbox Modal**:
  - Full-resolution image zoom view.
  - Previous / Next carousel navigation (`chevron_left` / `chevron_right`).
  - Keyboard shortcuts (`Escape` to close, `ArrowLeft` / `ArrowRight` to navigate).
  - Direct individual image download button.
- **Live In-Page Search**: Live search bar in `Header.jsx` filters transcripts, external links, and lab doodles instantly.
- **Mobile Drawer**: Responsive left navigation drawer on mobile and persistent sidebar on desktop.

---

## 🛠️ Commands & Scripts

### Installation

```bash
npm install
```

### Development Server

Runs both content pipelines (`content:build` + `doodles:build`) before launching the Vite dev server:

```bash
npm run dev
```

### Standalone Pipeline Builds

```bash
# Build day contents (docx -> HTML, links.txt -> JSON)
npm run content:build

# Build Lab Doodles manifest
npm run doodles:build
```

### Production Build

```bash
npm run build
```

### Automation Orchestrator

```bash
# Dry-run test (safe, no push)
python automation/orchestrator.py --dry-run

# Publish new content to GitHub (auto commits & pushes)
python automation/orchestrator.py
```
