from __future__ import annotations

import fnmatch
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile


class SkillError(Exception):
    pass


COMPRESSION_MAP = {
    "stored": ZIP_STORED,
    "deflated": ZIP_DEFLATED,
}


def _load_payload() -> Dict:
    if len(sys.argv) > 1:
        raw = Path(sys.argv[1]).read_text(encoding="utf-8")
    else:
        raw = sys.stdin.read()
    if not raw.strip():
        raise SkillError("No input payload was provided.")
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise SkillError(f"Invalid JSON payload: {exc}") from exc


def _timestamped_path(output_path: Path) -> Path:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return output_path.with_name(f"{output_path.stem}_{stamp}{output_path.suffix}")


def _is_hidden(path: Path) -> bool:
    return any(part.startswith(".") for part in path.parts if part not in (".", ".."))


def _should_exclude(relative_path: str, patterns: Iterable[str]) -> bool:
    normalized = relative_path.replace("\\", "/")
    return any(fnmatch.fnmatch(normalized, pattern) for pattern in patterns)


def _iter_source_files(source: Path, include_hidden: bool, exclude_patterns: List[str]) -> Iterable[Path]:
    if source.is_file():
        if not include_hidden and _is_hidden(source):
            return []
        return [source]

    files: List[Path] = []
    for path in source.rglob("*"):
        if path.is_dir():
            continue
        rel = path.relative_to(source)
        rel_str = rel.as_posix()
        if not include_hidden and _is_hidden(rel):
            continue
        if _should_exclude(rel_str, exclude_patterns):
            continue
        files.append(path)
    return files


def run_zip(payload: Dict) -> Dict:
    source = Path(payload["source_path"]).expanduser().resolve()
    output = Path(payload["output_path"]).expanduser()
    include_timestamp = payload.get("include_timestamp", False)
    overwrite = payload.get("overwrite", False)
    exclude_patterns = payload.get("exclude_patterns", [])
    compression = COMPRESSION_MAP[payload.get("compression", "deflated")]
    include_hidden = payload.get("include_hidden", True)
    root_folder_mode = payload.get("root_folder_mode", "preserve")

    if not source.exists():
        raise SkillError(f"Source path does not exist: {source}")

    if output.suffix.lower() != ".zip":
        output = output.with_suffix(".zip")

    if include_timestamp:
        output = _timestamped_path(output)

    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    if output.exists() and not overwrite:
        raise SkillError(f"Output archive already exists and overwrite=false: {output}")

    files = list(_iter_source_files(source, include_hidden, exclude_patterns))
    if source.is_dir() and not files:
        raise SkillError("No files matched the ZIP request after exclusions were applied.")

    archived_files = []
    with ZipFile(output, mode="w", compression=compression) as zf:
        if source.is_file():
            zf.write(source, arcname=source.name)
            archived_files.append(source.name)
        else:
            for file_path in files:
                rel = file_path.relative_to(source)
                if root_folder_mode == "preserve":
                    arcname = Path(source.name) / rel
                else:
                    arcname = rel
                zf.write(file_path, arcname=arcname.as_posix())
                archived_files.append(arcname.as_posix())

    return {
        "ok": True,
        "action": "zip",
        "source_path": str(source),
        "output_path": str(output),
        "file_count": len(archived_files),
        "archived_files": archived_files,
    }


def _safe_destination(base_dir: Path, member_name: str) -> Path:
    destination = (base_dir / member_name).resolve()
    base_resolved = base_dir.resolve()
    if destination != base_resolved and base_resolved not in destination.parents:
        raise SkillError(f"Unsafe ZIP member path detected: {member_name}")
    return destination


def _flatten_if_needed(extract_to: Path) -> None:
    entries = [p for p in extract_to.iterdir()]
    if len(entries) != 1 or not entries[0].is_dir():
        return
    root = entries[0]
    temp_dir = extract_to / "__flatten_temp__"
    temp_dir.mkdir(exist_ok=False)
    try:
        for item in root.iterdir():
            shutil.move(str(item), temp_dir / item.name)
        root.rmdir()
        for item in temp_dir.iterdir():
            shutil.move(str(item), extract_to / item.name)
        temp_dir.rmdir()
    except Exception:
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        raise


def run_unzip(payload: Dict) -> Dict:
    archive = Path(payload["archive_path"]).expanduser().resolve()
    extract_to = Path(payload["extract_to"]).expanduser().resolve()
    overwrite = payload.get("overwrite", False)
    safe_extract = payload.get("safe_extract", True)
    flatten_single_root = payload.get("flatten_single_root", False)

    if not archive.exists():
        raise SkillError(f"Archive path does not exist: {archive}")
    if archive.suffix.lower() != ".zip":
        raise SkillError("Only .zip archives are supported by this skill.")

    extract_to.mkdir(parents=True, exist_ok=True)

    extracted = []
    with ZipFile(archive, mode="r") as zf:
        for member in zf.infolist():
            target = _safe_destination(extract_to, member.filename) if safe_extract else (extract_to / member.filename)

            if member.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue

            if target.exists() and not overwrite:
                raise SkillError(f"Target file already exists and overwrite=false: {target}")

            target.parent.mkdir(parents=True, exist_ok=True)
            with zf.open(member, "r") as src, open(target, "wb") as dst:
                shutil.copyfileobj(src, dst)
            extracted.append(str(target.relative_to(extract_to)))

    if flatten_single_root:
        _flatten_if_needed(extract_to)
        extracted = [str(p.relative_to(extract_to)) for p in extract_to.rglob("*") if p.is_file()]

    return {
        "ok": True,
        "action": "unzip",
        "archive_path": str(archive),
        "extract_to": str(extract_to),
        "file_count": len(extracted),
        "extracted_files": extracted,
    }


def main() -> None:
    try:
        payload = _load_payload()
        action = payload.get("action")
        if action == "zip":
            result = run_zip(payload)
        elif action == "unzip":
            result = run_unzip(payload)
        else:
            raise SkillError("Invalid or missing action. Use 'zip' or 'unzip'.")
        print(json.dumps(result, indent=2))
    except SkillError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()
