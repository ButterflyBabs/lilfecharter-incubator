# Zip + Unzip File Utility

An OpenClaw-native utility skill for packaging files into ZIP archives and extracting ZIP files from one command family.

## Commands

### General router
`/archive`

Use `action: "zip"` or `action: "unzip"`.

### ZIP shortcut
`/zipfiles`

### UNZIP shortcut
`/unzipfiles`

## Supported operations
- Zip a single file
- Zip a full folder
- Exclude files by glob pattern
- Add timestamps to output archive names
- Preserve root folder or archive contents only
- Extract ZIP archives
- Block unsafe extraction paths by default
- Optionally flatten a single top-level extracted folder

## Typical OpenClaw flow
1. Register or load the skill pack.
2. Bind `skill.json` and `command.json` into your OpenClaw skill registry.
3. Validate request bodies with `input.schema.json`.
4. Execute `executor.py` with the JSON payload.

## Example ZIP payload
```json
{
  "action": "zip",
  "source_path": "/workspace/project",
  "output_path": "/workspace/exports/project.zip",
  "include_timestamp": true,
  "overwrite": false,
  "exclude_patterns": ["*.log", ".git/*", "node_modules/*"],
  "compression": "deflated",
  "include_hidden": true,
  "root_folder_mode": "preserve"
}
```

## Example UNZIP payload
```json
{
  "action": "unzip",
  "archive_path": "/workspace/exports/project_20260403_201500.zip",
  "extract_to": "/workspace/restored/project",
  "overwrite": false,
  "safe_extract": true,
  "flatten_single_root": false
}
```

## Runtime notes
- The executor supports either stdin JSON or a path to a JSON file as the first CLI argument.
- `.zip` is the only archive format supported in this version.
- Safe extraction is enabled by default to prevent path traversal attacks.
