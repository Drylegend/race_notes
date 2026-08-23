# 📚 Race Note — Content Publishing Automation

A local CLI pipeline to publish new day content after each class. **Not part of the Vite build or Netlify deploy** — this is a developer-only tool you run manually in your terminal.

## Quick Start

```powershell
# 1. Install the one dependency (first time only)
pip install -r automation/requirements.txt

# 2. Run the pipeline from the project root
python automation/orchestrator.py
```

That's it. The orchestrator will walk you through everything interactively.

## What Happens When You Run It

The pipeline runs **5 agents** in strict order:

| Step | Agent | What it does |
|------|-------|-------------|
| 1 | **Day Detector** | Scans `src/content/` for existing `day-N` folders, creates the next one (highest N + 1). |
| 2 | **Transcript Agent** | Asks how many transcripts (1–4), opens that many file-select dialogs, copies each `.docx` into the new day folder as `transcript-1.docx` through `transcript-N.docx`. |
| 3 | **Summary Agent** | Opens one file-select dialog for the summary `.docx`, copies it as `summary.docx`. |
| 4 | **Validator Agent** | Independently verifies: folder exists, all transcripts present & valid, summary valid, `links.txt` present (auto-copies from `_template` if missing), no unexpected files. |
| 5 | **Git Agent** | Runs `git add .` → `git commit` → `git push`. **Only runs if validation passes.** |

After a successful push, Netlify automatically picks up the commit and deploys (~1 minute).

## If Validation Fails

When validation fails, **nothing gets pushed to git**. The day folder will exist on disk but may contain incomplete content.

### To fix and retry:

1. **Read the validation report** — it shows exactly which checks failed (✅/❌).
2. **Delete the incomplete day folder:**
   ```powershell
   Remove-Item -Recurse -Force "src/content/day-N"
   ```
   Replace `N` with the day number that was created.
3. **Re-run the pipeline:**
   ```powershell
   python automation/orchestrator.py
   ```

### Common failure causes:
- **Cancelled a file dialog** — pipeline aborts immediately, no partial content is written.
- **Corrupted .docx file** — validator catches this. Replace the source file and retry.
- **Git push failed** — network issue or auth problem. The content is valid on disk; fix git and you can manually `git add . && git commit && git push`.

## File Structure

```
automation/
├── agents/
│   ├── __init__.py
│   ├── day_detector_agent.py   # Detects & creates next day folder
│   ├── transcript_agent.py     # Collects transcript .docx files
│   ├── summary_agent.py        # Collects summary .docx file
│   ├── validator_agent.py      # Verifies all folder contents
│   └── git_agent.py            # Git add / commit / push
├── orchestrator.py             # Entry point — coordinates all agents
├── requirements.txt            # python-docx only
└── README.md                   # This file
```

## Requirements

- **Python 3.10+** (uses `match` syntax and type hints)
- **tkinter** (bundled with standard Python on Windows)
- **python-docx** (`pip install -r automation/requirements.txt`)
- **Git** configured with push access to the remote
