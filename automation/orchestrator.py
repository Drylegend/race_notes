"""
Content Publishing Orchestrator
================================
Entry point: python automation/orchestrator.py
Run from the project root in PowerShell / terminal.

Flags:
  --dry-run   Run steps 1–4 (detect, transcripts, summary, validate) but
              skip git push and auto-clean the test day folder afterwards.
              Safe for testing — nothing is committed or pushed.

Coordinates five agents in strict order:
  1. day_detector_agent  — detect & create next day folder
  2. transcript_agent    — collect transcript .docx files via file dialogs
  3. summary_agent       — collect summary .docx via file dialog
  4. validator_agent     — independently verify all folder contents
  5. git_agent           — git add / commit / push (only if validation passes)
"""

import shutil
import sys
from pathlib import Path

# Force UTF-8 output on Windows (cp1252 chokes on emoji)
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# Resolve project root (parent of the automation/ folder)
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

# Add automation/ to sys.path so agent imports work
sys.path.insert(0, str(SCRIPT_DIR))

from agents.day_detector_agent import DayDetectorError, detect_next_day
from agents.transcript_agent import TranscriptError, collect_transcripts
from agents.summary_agent import SummaryError, collect_summary
from agents.validator_agent import validate
from agents.git_agent import GitError, push_to_remote


STEP_COUNT = 5


def _header(dry_run: bool) -> None:
    print("\n" + "=" * 60)
    print("  📚  RACE NOTE — Content Publishing Pipeline")
    if dry_run:
        print("  🧪  DRY-RUN MODE — git push will be skipped")
    print("=" * 60)


def _step(num: int, msg: str) -> None:
    print(f"\n[{num}/{STEP_COUNT}] {msg}")
    print("-" * 50)


def _fail_summary(step_name: str, error: str, day_folder: Path | None) -> None:
    print("\n" + "!" * 60)
    print("  ❌  PIPELINE FAILED")
    print("!" * 60)
    print(f"  Failed at: {step_name}")
    print(f"  Error:     {error}")
    if day_folder and day_folder.exists():
        print(f"\n  ⚠  Day folder was created at: {day_folder}")
        print("     It may contain incomplete content.")
        print("     To retry, delete it first:")
        print(f"       Remove-Item -Recurse -Force \"{day_folder}\"")
    print("!" * 60 + "\n")


def main() -> None:
    dry_run = "--dry-run" in sys.argv

    _header(dry_run)

    day_number: int | None = None
    day_folder: Path | None = None
    transcript_count: int = 0

    # ── Step 1: Detect next day ─────────────────────────────────────────
    _step(1, "Detecting next day...")
    try:
        day_number, day_folder = detect_next_day(PROJECT_ROOT)
        print(f"  ✅ Day {day_number} detected → {day_folder}")
    except DayDetectorError as exc:
        _fail_summary("Day Detection", str(exc), day_folder)
        sys.exit(1)

    # ── Step 2: Collect transcripts ─────────────────────────────────────
    _step(2, f"Select transcripts for Day {day_number}...")
    try:
        transcript_count = collect_transcripts(day_folder)
        print(f"  ✅ {transcript_count} transcript(s) collected successfully.")
    except TranscriptError as exc:
        _fail_summary("Transcript Collection", str(exc), day_folder)
        sys.exit(1)

    # ── Step 3: Collect summary ─────────────────────────────────────────
    _step(3, f"Select summary document for Day {day_number}...")
    try:
        collect_summary(day_folder)
        print("  ✅ Summary collected successfully.")
    except SummaryError as exc:
        _fail_summary("Summary Collection", str(exc), day_folder)
        sys.exit(1)

    # ── Step 4: Validate ────────────────────────────────────────────────
    _step(4, f"Validating Day {day_number} folder contents...")
    validation = validate(day_number, day_folder, PROJECT_ROOT, transcript_count)
    validation.print_report()

    if not validation.all_passed:
        _fail_summary(
            "Validation",
            "One or more validation checks failed (see report above).",
            day_folder,
        )
        sys.exit(1)

    # ── Step 5: Git push (or skip in dry-run) ───────────────────────────
    if dry_run:
        _step(5, "Git push — SKIPPED (dry-run mode)")
        print("  ⏭️  No git commands were executed.")

        # Auto-clean the test folder so dry-run is repeatable
        if day_folder and day_folder.exists():
            shutil.rmtree(day_folder)
            print(f"  🧹 Auto-cleaned test folder: {day_folder}")

        print("\n" + "=" * 60)
        print("  ✅  DRY-RUN COMPLETE — All checks passed!")
        print("=" * 60)
        print("  Everything looks good. When ready for real, run:")
        print("    python automation/orchestrator.py")
        print("  (without --dry-run)")
        print("=" * 60 + "\n")
    else:
        _step(5, f"Pushing Day {day_number} content to GitHub...")
        try:
            push_to_remote(day_number, PROJECT_ROOT)
        except GitError as exc:
            _fail_summary("Git Push", str(exc), day_folder)
            sys.exit(1)

        # ── Success ─────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("  🎉  SUCCESS — Day {} content published!".format(day_number))
        print("=" * 60)
        print("  Netlify will automatically pick up the new commit.")
        print("  Expect the live site to update in ~1 minute.")
        print("  Note: The Vite build script (npm run build) processes")
        print("  the .docx files into the deployed site content.")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
