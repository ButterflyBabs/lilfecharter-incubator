# Install Notes

## Package contents
- `skill.json` - skill metadata
- `command.json` - command family bindings
- `input.schema.json` - request validation
- `executor.py` - execution runtime
- `examples/` - ready-to-run payloads

## Suggested registration pattern
Map these files into your OpenClaw custom skill loader:
- Register `skill.json`
- Register `command.json`
- Attach `input.schema.json` to input validation
- Point the runtime executor to `executor.py`

## Safe defaults included
- `overwrite` defaults to `false`
- `safe_extract` defaults to `true`
- Hidden files can be controlled during zip creation

## Recommended future upgrades
- tar.gz support
- password-protected zip support
- checksum output
- file size summary
- dry-run preview mode
