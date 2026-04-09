from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile
from pydantic import BaseModel, Field

from app.core.config import get_settings

router = APIRouter(prefix='/slicer', tags=['slicer'])


class SlicerParseResponse(BaseModel):
    success: bool
    engine: str | None = None
    command: list[str]
    plate_index: int
    file_name: str
    file_size: int
    exit_code: int | None = None
    stdout: str = ''
    stderr: str = ''
    generated_files: list[str] = Field(default_factory=list)
    selected_settings: list[str] = Field(default_factory=list)
    error: str | None = None


def _resolve_engine() -> str | None:
    settings = get_settings()
    if settings.slicer_cli_path:
        direct = Path(settings.slicer_cli_path).expanduser()
        if direct.exists():
            return str(direct)

    candidates = [
        'bambu-studio',
        'BambuStudio',
        'orca-slicer',
        'orcaslicer',
        'OrcaSlicer',
    ]
    for candidate in candidates:
        found = shutil.which(candidate)
        if found:
            return found
    return None


def _guess_profiles_root(engine: str) -> Path | None:
    resolved = Path(engine).resolve()
    for index, part in enumerate(resolved.parts):
        if part.endswith('.app'):
            app_path = Path(*resolved.parts[: index + 1])
            candidate = app_path / 'Contents' / 'Resources' / 'profiles' / 'BBL'
            if candidate.exists():
                return candidate
    return None


def _resolve_slicer_settings(engine: str) -> list[str]:
    settings = get_settings()
    root = Path(settings.slicer_profiles_root).expanduser() if settings.slicer_profiles_root else _guess_profiles_root(engine)
    if not root:
        return []

    machine_file = root / 'machine' / settings.slicer_machine_preset
    process_file = root / 'process' / settings.slicer_process_preset
    selected: list[str] = []
    if machine_file.exists():
        selected.append(str(machine_file))
    if process_file.exists():
        selected.append(str(process_file))
    return selected


@router.post('/parse-3mf', response_model=SlicerParseResponse)
async def parse_3mf(
    file: UploadFile = File(...),
    plate_index: int = Form(0),
) -> SlicerParseResponse:
    if not file.filename.lower().endswith('.3mf'):
        return SlicerParseResponse(
            success=False,
            command=[],
            plate_index=plate_index,
            file_name=file.filename,
            file_size=0,
            error='Only .3mf files are supported.',
        )

    engine = _resolve_engine()
    if not engine:
        return SlicerParseResponse(
            success=False,
            command=[],
            plate_index=plate_index,
            file_name=file.filename,
            file_size=0,
            error='No slicer CLI found. Install Bambu Studio or OrcaSlicer CLI and ensure it is in PATH.',
        )

    temp_dir = Path(tempfile.mkdtemp(prefix='bebe-slicer-'))
    input_path = temp_dir / file.filename
    output_dir = temp_dir / 'slicedata'
    output_dir.mkdir(parents=True, exist_ok=True)

    content = await file.read()
    input_path.write_bytes(content)

    command = [
        engine,
        '--slice',
        str(plate_index),
    ]

    slicer_settings = _resolve_slicer_settings(engine)
    if slicer_settings:
        command.extend(
            [
                '--load-settings',
                ';'.join(slicer_settings),
            ]
        )

    settings = get_settings()
    if settings.slicer_load_default_filament:
        command.append('--load-defaultfila')
    if settings.slicer_allow_newer_file:
        command.append('--allow-newer-file')

    command.extend(
        [
        '--export-slicedata',
        str(output_dir),
        '--debug',
        '2',
        str(input_path),
        ]
    )

    try:
        completed = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=300,
            check=False,
        )
        generated_files = [
            str(path.relative_to(output_dir))
            for path in output_dir.rglob('*')
            if path.is_file()
        ]
        return SlicerParseResponse(
            success=completed.returncode == 0,
            engine=engine,
            command=command,
            plate_index=plate_index,
            file_name=file.filename,
            file_size=len(content),
            exit_code=completed.returncode,
            stdout=completed.stdout or '',
            stderr=completed.stderr or '',
            generated_files=generated_files,
            selected_settings=slicer_settings,
            error=None if completed.returncode == 0 else 'Slicer returned a non-zero exit code.',
        )
    except subprocess.TimeoutExpired as exc:
        return SlicerParseResponse(
            success=False,
            engine=engine,
            command=command,
            plate_index=plate_index,
            file_name=file.filename,
            file_size=len(content),
            stdout=exc.stdout or '',
            stderr=exc.stderr or '',
            selected_settings=slicer_settings,
            error='Slicer timed out while processing the 3MF.',
        )
