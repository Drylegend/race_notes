"""
Day Detector Agent
==================
Scans src/content/ for folders matching 'day-N', finds the highest N,
creates the next day folder (highest + 1), and returns the new day number
and folder path. Never fills gaps — always takes highest + 1.
"""

import re
from pathlib import Path


class DayDetectorError(Exception):
    """Raised when day detection or folder creation fails."""
    pass


def detect_next_day(project_root: Path) -> tuple[int, Path]:
    """
    Scan src/content/ for existing day-N folders, determine the next day
    number (highest N + 1), create the folder, and return (day_number, folder_path).

    Raises DayDetectorError if the target folder already exists or
    if the content directory is missing.
    """
    content_dir = project_root / "src" / "content"

    if not content_dir.is_dir():
        raise DayDetectorError(
            f"Content directory not found: {content_dir}\n"
            "Make sure you run this from the project root."
        )

    # Find all existing day-N folders
    day_pattern = re.compile(r"^day-(\d+)$", re.IGNORECASE)
    existing_days: list[int] = []

    for entry in content_dir.iterdir():
        if entry.is_dir():
            match = day_pattern.match(entry.name)
            if match:
                existing_days.append(int(match.group(1)))

    # Determine next day number
    if existing_days:
        highest = max(existing_days)
        next_day = highest + 1
    else:
        next_day = 1

    # Build the target folder path
    day_folder = content_dir / f"day-{next_day}"

    # Safety check — never overwrite
    if day_folder.exists():
        raise DayDetectorError(
            f"Target folder already exists: {day_folder}\n"
            "This should not happen. Please check and remove it manually if needed."
        )

    # Create the folder
    day_folder.mkdir(parents=False, exist_ok=False)

    return next_day, day_folder


def get_highest_existing_day(project_root: Path) -> int:
    """
    Independently re-scan src/content/ and return the highest existing day-N
    number, or 0 if none exist. Used by validator_agent for cross-verification.
    """
    content_dir = project_root / "src" / "content"
    if not content_dir.is_dir():
        return 0

    day_pattern = re.compile(r"^day-(\d+)$", re.IGNORECASE)
    existing_days: list[int] = []

    for entry in content_dir.iterdir():
        if entry.is_dir():
            match = day_pattern.match(entry.name)
            if match:
                existing_days.append(int(match.group(1)))

    return max(existing_days) if existing_days else 0
