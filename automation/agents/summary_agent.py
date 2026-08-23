"""
Summary Agent
=============
Opens a single native file-select dialog to pick a .docx summary file,
then copies it into the day folder as summary.docx.
"""

import shutil
import tkinter as tk
from pathlib import Path
from tkinter import filedialog


class SummaryError(Exception):
    """Raised when summary selection fails or is cancelled."""
    pass


def collect_summary(day_folder: Path) -> None:
    """
    Open a file dialog to select the summary .docx, copy it into day_folder
    as summary.docx.

    Raises SummaryError if the user cancels the dialog.
    """
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)

    try:
        file_path = filedialog.askopenfilename(
            parent=root,
            title="Select Summary Document",
            filetypes=[("Word Documents", "*.docx"), ("All Files", "*.*")],
        )
    finally:
        root.destroy()

    if not file_path:
        raise SummaryError(
            "Summary selection was cancelled.\n"
            "Pipeline aborted — no summary file will be written."
        )

    source = Path(file_path)
    dest = day_folder / "summary.docx"
    shutil.copy2(str(source), str(dest))
    print(f"  ✓ Selected summary: {source.name}")
    print(f"  📄 Copied → {dest.name}")
