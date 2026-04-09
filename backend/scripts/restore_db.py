from __future__ import annotations

import argparse
from pathlib import Path

from scripts.snapshot_db import restore_snapshot


def main() -> None:
    parser = argparse.ArgumentParser(description="Restore DynamoDB data from a snapshot JSON file.")
    parser.add_argument(
        "--input",
        required=True,
        help="Path to snapshot JSON file.",
    )
    args = parser.parse_args()
    restore_snapshot(Path(args.input).expanduser())


if __name__ == "__main__":
    main()
