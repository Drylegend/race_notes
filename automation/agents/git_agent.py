"""
Git Agent
=========
Runs git add / commit / push via subprocess. Only called by the orchestrator
AFTER validator_agent has confirmed all checks pass.
"""

import subprocess
from pathlib import Path


class GitError(Exception):
    """Raised when a git command fails."""
    pass


def push_to_remote(day_number: int, project_root: Path) -> None:
    """
    Execute git add → commit → push from the project root.

    Raises GitError with the actual git stderr if any step fails.
    """
    commands = [
        (["git", "add", "."], "git add ."),
        (["git", "commit", "-m", f"Add Day {day_number} content"], "git commit"),
        (["git", "push"], "git push"),
    ]

    for cmd, label in commands:
        print(f"    → Running: {label}")
        proc = subprocess.run(
            cmd,
            cwd=str(project_root),
            capture_output=True,
            text=True,
        )

        # Print stdout if any
        if proc.stdout.strip():
            for line in proc.stdout.strip().splitlines():
                print(f"      {line}")

        if proc.returncode != 0:
            error_output = proc.stderr.strip() or proc.stdout.strip() or "(no output)"
            raise GitError(
                f"'{label}' failed (exit code {proc.returncode}):\n"
                f"{error_output}"
            )

    print("    ✅ All git commands succeeded.")
