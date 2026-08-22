# Lumina Learning - Student Class Notes Web App

A production-ready static web application built with **React**, **Vite**, **Tailwind CSS**, and **Mammoth.js**.

This application is **100% static**, requiring no backend or manual HTML/Markdown conversions. Place your Microsoft Word (`.docx`) documents directly into the day folders, and the automated build pipeline converts them to styled HTML and stages downloadable assets upon `npm run build` or Netlify git push.

---

## 📁 Content Directory Structure

```
d:/race_note_app/
├── scripts/
│   └── build-content.mjs     # Mammoth docx -> HTML & links.txt -> JSON converter
├── src/
    └── content/
        ├── _template/        # Starter template containing links.txt guide
        │   └── links.txt
        └── day-1/            # Day 1 Folder
            ├── transcript-1.docx  (Optional: transcript-1.docx through transcript-4.docx)
            ├── transcript-2.docx
            ├── summary.docx       (Optional: summary.docx)
            └── links.txt          (Optional: pipe-separated links)
```

---

## 📝 Day-to-Day Publishing Workflow

Adding a new day's materials is effortless—**no manual conversion or Markdown writing required!**

### Step 1: Create the Day Folder
Create a folder under `src/content/` named `day-N` (e.g. `day-2`, `day-3`):
```bash
mkdir src/content/day-2
```

### Step 2: Drop in your `.docx` and `links.txt` Files

1. **Transcripts (`transcript-1.docx` through `transcript-4.docx`)**:
   - Simply drop your `.docx` transcript files directly into `src/content/day-N/`.
   - Supported filenames: `transcript-1.docx`, `transcript-2.docx`, `transcript-3.docx`, `transcript-4.docx`.
   - Embedded images, headings, and formatting inside `.docx` files are automatically extracted and converted to styled HTML at build time.
   - If a transcript file doesn't exist (e.g., you only have 2 transcripts for that day), the app cleanly renders only the transcripts present.

2. **Summary (`summary.docx`)**:
   - Drop your AI-generated or handwritten `summary.docx` file into `src/content/day-N/summary.docx`.
   - The build pipeline converts `summary.docx` into styled HTML while automatically providing a **"Download Summary (.docx)"** button at the top of the Summary tab.
   - If `summary.docx` is missing, the site displays a clean empty state ("No summary uploaded for this day yet.") and hides the download button.

3. **Important Links (`links.txt`)**:
   - Create a plain text file `src/content/day-N/links.txt` with one link per line using pipe (`|`) separation:
     ```text
     Title | URL | Short Description
     ```
   - Example:
     ```text
     Microsoft AI-103 Certification Overview | https://learn.microsoft.com | Official study guide and learning path for AI-103
     Azure AI Search Documentation | https://learn.microsoft.com/azure/search | Comprehensive API reference for vector search
     ```

### Step 3: Git Commit & Push to Deploy
```bash
git add src/content/day-2
git commit -m "Add Day 2 docx transcripts and summary"
git push origin main
```

**Netlify automatically runs `npm run build` (which triggers `node scripts/build-content.mjs` prebuild hook), converts all `.docx` files and `links.txt`, and publishes the live site in seconds!**

---

## ⚡ Build Pipeline Architecture

- **Prebuild Hook (`scripts/build-content.mjs`)**: Automatically executes prior to `vite build` or `vite dev`.
- **Mammoth.js Integration**: Converts `.docx` documents into HTML while preserving embedded images (as inline data URIs or extracted assets), headings, bold/italics, bullet lists, and tables.
- **Graceful Error Handling**: Corrupted or unreadable `.docx` files trigger a console warning and fall back to clean empty state cards without breaking the build.
- **Automatic Downloading**: Stages original `.docx` summary files to `/public/downloads/day-N/summary.docx` for user download.

---

## 🛠️ Local Development & Commands

### Installation
```bash
npm install
```

### Run Local Development Server (Includes Auto-Docx Conversion)
```bash
npm run dev
```
Open **http://localhost:5173**.

### Production Build Verification
```bash
npm run build
```
