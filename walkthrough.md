# Walkthrough - Student Class Notes & Lab Doodles Web App

Successfully enhanced and validated the **Student Class Notes & Lab Doodles Web App** with dual independent build pipelines, deep-linkable routing, responsive UI components, and full Google Stitch Material 3 design fidelity.

---

## Key Accomplishments

### 1. Dual Independent Content Pipelines

- **Day-Based Content Pipeline ([`scripts/build-content.mjs`](file:///d:/race_note_app/scripts/build-content.mjs))**:
  - Automatically parses `.docx` transcripts and summaries using `mammoth`.
  - Stages downloadable files into `public/downloads/day-N/`.
  - Produces `src/generated/contentData.json`.
- **Standalone Lab Doodles Pipeline ([`scripts/build-lab-doodles.mjs`](file:///d:/race_note_app/scripts/build-lab-doodles.mjs))**:
  - Scans `public/lab-doodles/` for `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`.
  - Normalizes filenames to human-readable titles.
  - Merges metadata from optional `public/lab-doodles/captions.json` sidecar.
  - Generates `src/generated/labDoodlesData.json`.
  - Wired into `package.json` under `"doodles:build"`, `"predev"`, and `"prebuild"`.

### 2. Standalone Visual Notes Navigation & Routing

- **Sidebar Integration ([`src/components/Sidebar.jsx`](file:///d:/race_note_app/src/components/Sidebar.jsx))**:
  - Added a dedicated "VISUAL NOTES" section with divider.
  - Standalone "Lab Doodles" button (`draw` icon) navigating to `/lab-doodles`.
  - Custom active state styling matching day items.
- **Top-Level Route in [`src/App.jsx`](file:///d:/race_note_app/src/App.jsx)**:
  - Added `/lab-doodles` route bypassing the day tab bar (`TabsNav`) while retaining top header search and mobile drawer functionality.

### 3. Interactive Lab Doodles Component ([`src/components/LabDoodlesTab.jsx`](file:///d:/race_note_app/src/components/LabDoodlesTab.jsx))

- **Responsive Thumbnail Grid**: 2 columns on mobile, 3 to 4 columns on desktop with hover zoom animations.
- **Full-Screen Lightbox Modal**:
  - Dismiss via Close button, backdrop click, or `Escape` key.
  - Previous / Next carousel navigation (`chevron_left` / `chevron_right`) and `ArrowLeft` / `ArrowRight` keyboard shortcuts.
  - Position counter (`X of Y`) and individual image download button.
- **Live Search Filtering**: Filters doodles dynamically as the user types into the top header search bar.

---

## File Map

| File Path                                                                                               | Description                                                                           |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------ |
| [`package.json`](file:///d:/race_note_app/package.json)                                                 | NPM scripts (`content:build`, `doodles:build`, `predev`, `prebuild`) & dependencies   |
| [`tailwind.config.js`](file:///d:/race_note_app/tailwind.config.js)                                     | Material 3 color tokens (`primary: #0058bc`, `surface: #f9f9ff`), typography, shadows |
| [`scripts/build-content.mjs`](file:///d:/race_note_app/scripts/build-content.mjs)                       | Day-based docx & links parser pipeline                                                |
| [`scripts/build-lab-doodles.mjs`](file:///d:/race_note_app/scripts/build-lab-doodles.mjs)               | Standalone image scan & metadata pipeline                                             |
| [`src/components/Sidebar.jsx`](file:///d:/race_note_app/src/components/Sidebar.jsx)                     | Left navigation sidebar with course days & Lab Doodles item                           |
| [`src/components/Header.jsx`](file:///d:/race_note_app/src/components/Header.jsx)                       | Sticky top bar with mobile menu button and live search input                          |
| [`src/components/TabsNav.jsx`](file:///d:/race_note_app/src/components/TabsNav.jsx)                     | Horizontal tab switcher for day views                                                 |
| [`src/components/TranscriptsTab.jsx`](file:///d:/race_note_app/src/components/TranscriptsTab.jsx)       | Expandable transcript cards with docx downloads & search                              |
| [`src/components/SummaryTab.jsx`](file:///d:/race_note_app/src/components/SummaryTab.jsx)               | Formatted summary HTML reader with docx download                                      |
| [`src/components/ImportantLinksTab.jsx`](file:///d:/race_note_app/src/components/ImportantLinksTab.jsx) | Resource link cards with tags and external open buttons                               |
| [`src/components/LabDoodlesTab.jsx`](file:///d:/race_note_app/src/components/LabDoodlesTab.jsx)         | Visual gallery with search, responsive grid, and interactive lightbox                 |
| [`src/App.jsx`](file:///d:/race_note_app/src/App.jsx)                                                   | Router configuration (`/:daySlug/:tabId` and `/lab-doodles`)                          |
| [`README.md`](file:///d:/race_note_app/README.md)                                                       | Setup, multi-day addition guide, Lab Doodles guide, and commands                      |

---

## Verification Results

1. **Standalone Pipeline Build**: `npm run doodles:build` generated `src/generated/labDoodlesData.json` with 0 errors.
2. **Predev / Prebuild Combined Run**: `npm run predev` ran both `build-content.mjs` and `build-lab-doodles.mjs` successfully.
3. **Production Compilation**: `npm run build` compiled 44 modules cleanly into `dist/` with 0 errors.
