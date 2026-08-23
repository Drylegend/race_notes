"""
Validator Agent — the Judge
===========================
Independently verifies the contents of a newly created day-N folder
AFTER transcript_agent and summary_agent have run, BEFORE git_agent.

Checks:
  1. Folder exists and matches expected next-day number (re-verified independently).
  2. transcript-1.docx through transcript-N.docx exist (N = user-specified count),
     each > 0 bytes, each a valid openable .docx.
  3. summary.docx exists, > 0 bytes, valid .docx.
  4. links.txt exists (auto-copies from _template if missing).
  5. No unexpected files beyond the expected set.
"""

import re
import shutil
from pathlib import Path

from docx import Document


class ValidationResult:
    """Holds the results of all validation checks."""

    def __init__(self):
        self.checks: list[tuple[str, bool, str]] = []  # (label, passed, detail)

    def add(self, label: str, passed: bool, detail: str = "") -> None:
        self.checks.append((label, passed, detail))

    @property
    def all_passed(self) -> bool:
        return all(passed for _, passed, _ in self.checks)

    def print_report(self) -> None:
        print("\n" + "=" * 60)
        print("  VALIDATION REPORT")
        print("=" * 60)
        for label, passed, detail in self.checks:
            icon = "✅" if passed else "❌"
            msg = f"  {icon}  {label}"
            if detail:
                msg += f"  —  {detail}"
            print(msg)
        print("=" * 60)
        if self.all_passed:
            print("  ✅  ALL CHECKS PASSED")
        else:
            failed = sum(1 for _, p, _ in self.checks if not p)
            print(f"  ❌  {failed} CHECK(S) FAILED — git push will NOT proceed.")
        print("=" * 60 + "\n")


def _is_valid_docx(file_path: Path) -> tuple[bool, str]:
    """Try to open a .docx with python-docx; return (ok, error_message)."""
    try:
        Document(str(file_path))
        return True, ""
    except Exception as exc:
        return False, str(exc)


def validate(
    day_number: int,
    day_folder: Path,
    project_root: Path,
    transcript_count: int,
) -> ValidationResult:
    """
    Run all validation checks on the day folder.

    Args:
        day_number: The expected day number (e.g. 2).
        day_folder: Path to the day-N folder.
        project_root: Path to the project root.
        transcript_count: Number of transcripts the user specified (1–4).

    Returns:
        ValidationResult with all check outcomes.
    """
    result = ValidationResult()

    # ── 1. Folder existence ─────────────────────────────────────────────
    folder_exists = day_folder.is_dir()
    result.add(
        f"Folder day-{day_number} exists",
        folder_exists,
        str(day_folder) if folder_exists else "MISSING",
    )

    # ── 1b. Independent next-day verification ───────────────────────────
    content_dir = project_root / "src" / "content"
    day_pattern = re.compile(r"^day-(\d+)$", re.IGNORECASE)
    existing_days: list[int] = []
    for entry in content_dir.iterdir():
        if entry.is_dir():
            m = day_pattern.match(entry.name)
            if m:
                existing_days.append(int(m.group(1)))

    if existing_days:
        # The expected day should now BE the highest (since we just created it)
        highest = max(existing_days)
        day_number_correct = highest == day_number
    else:
        day_number_correct = False

    result.add(
        f"Day number {day_number} is consistent (highest existing = {max(existing_days) if existing_days else 'none'})",
        day_number_correct,
    )

    if not folder_exists:
        # Can't check contents if folder doesn't exist
        result.add("Skipped remaining checks", False, "folder missing")
        return result

    # ── 2. Transcript files ─────────────────────────────────────────────
    for i in range(1, transcript_count + 1):
        t_path = day_folder / f"transcript-{i}.docx"
        exists = t_path.is_file()
        size_ok = exists and t_path.stat().st_size > 0
        result.add(
            f"transcript-{i}.docx exists & non-empty",
            exists and size_ok,
            f"{t_path.stat().st_size:,} bytes" if exists else "MISSING",
        )
        if exists and size_ok:
            valid, err = _is_valid_docx(t_path)
            result.add(
                f"transcript-{i}.docx is a valid .docx",
                valid,
                err if not valid else "",
            )

    # Check for gap: ensure no transcript-K.docx is missing for K in 1..transcript_count
    # (already covered above, but also ensure there are no extras beyond transcript_count)
    for i in range(transcript_count + 1, 5):
        unexpected_t = day_folder / f"transcript-{i}.docx"
        if unexpected_t.exists():
            result.add(
                f"transcript-{i}.docx should NOT exist (user specified {transcript_count} transcripts)",
                False,
                "unexpected file",
            )

    # ── 3. Summary file ────────────────────────────────────────────────
    summary_path = day_folder / "summary.docx"
    s_exists = summary_path.is_file()
    s_size_ok = s_exists and summary_path.stat().st_size > 0
    result.add(
        "summary.docx exists & non-empty",
        s_exists and s_size_ok,
        f"{summary_path.stat().st_size:,} bytes" if s_exists else "MISSING",
    )
    if s_exists and s_size_ok:
        valid, err = _is_valid_docx(summary_path)
        result.add("summary.docx is a valid .docx", valid, err if not valid else "")

    # ── 4. links.txt (auto-copy from _template if missing) ─────────────
    links_path = day_folder / "links.txt"
    if not links_path.is_file():
        template_links = project_root / "src" / "content" / "_template" / "links.txt"
        if template_links.is_file():
            shutil.copy2(str(template_links), str(links_path))
            result.add(
                "links.txt exists",
                True,
                "auto-copied from _template",
            )
        else:
            result.add(
                "links.txt exists",
                False,
                "missing and _template/links.txt not found to copy from",
            )
    else:
        result.add("links.txt exists", True)

    # ── 5. No unexpected files ──────────────────────────────────────────
    expected_names = {"summary.docx", "links.txt", "images"}
    for i in range(1, transcript_count + 1):
        expected_names.add(f"transcript-{i}.docx")

    actual_names = {entry.name for entry in day_folder.iterdir()}
    unexpected = actual_names - expected_names
    result.add(
        "No unexpected files in folder",
        len(unexpected) == 0,
        f"unexpected: {', '.join(sorted(unexpected))}" if unexpected else "",
    )

    return result
