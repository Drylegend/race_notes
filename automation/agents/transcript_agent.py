"""
Transcript Agent
================
Prompts the user for how many transcripts (1–4) to collect, then opens
that many sequential native file-select dialogs (one at a time) to pick
.docx files. Copies each selected file into the day folder as
transcript-1.docx through transcript-N.docx.
"""

import shutil
import tkinter as tk
from pathlib import Path
from tkinter import filedialog


class TranscriptError(Exception):
    """Raised when transcript selection fails or is cancelled."""
    pass


def _prompt_transcript_count() -> int:
    """Ask the user how many transcripts they have (1–4)."""
    while True:
        try:
            raw = input("\n📋 How many transcripts are available for this day? (1–4): ").strip()
            count = int(raw)
            if 1 <= count <= 4:
                return count
            print("  ⚠  Please enter a number between 1 and 4.")
        except ValueError:
            print("  ⚠  Invalid input. Please enter a number between 1 and 4.")


def collect_transcripts(day_folder: Path) -> int:
    """
    Prompt for transcript count, open that many file dialogs sequentially,
    and copy each selected .docx into day_folder as transcript-N.docx.

    Returns the number of transcripts collected.
    Raises TranscriptError if the user cancels any dialog.
    """
    transcript_count = _prompt_transcript_count()

    # Initialize and immediately hide the root tkinter window
    root = tk.Tk()
    root.withdraw()
    # Force the dialog to appear on top
    root.attributes("-topmost", True)

    selected_files: list[Path] = []

    try:
        for i in range(1, transcript_count + 1):
            file_path = filedialog.askopenfilename(
                parent=root,
                title=f"Select Transcript {i}",
                filetypes=[("Word Documents", "*.docx"), ("All Files", "*.*")],
            )

            if not file_path:
                raise TranscriptError(
                    f"Transcript {i} selection was cancelled.\n"
                    "Pipeline aborted — no partial transcripts will be kept."
                )

            selected_files.append(Path(file_path))
            print(f"  ✓ Selected transcript {i}: {Path(file_path).name}")
    finally:
        root.destroy()

    # Copy all selected files into the day folder with standardised names
    for idx, source in enumerate(selected_files, start=1):
        dest = day_folder / f"transcript-{idx}.docx"
        shutil.copy2(str(source), str(dest))
        print(f"  📄 Copied → {dest.name}")

    return transcript_count
