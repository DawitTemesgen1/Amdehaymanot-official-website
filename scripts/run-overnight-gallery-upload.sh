#!/usr/bin/env bash
# Overnight gallery upload: blocks sleep/lid suspend while running.
set -euo pipefail

ROOT="/home/dawit/projects/amdehaymanot official website"
LOG="$ROOT/gallery-upload.log"
OUT="$ROOT/gallery-upload.nohup.out"

# Keep machine awake for this process
exec systemd-inhibit \
  --what=idle:sleep:handle-lid-switch \
  --who="Amde Gallery Upload" \
  --why="Overnight gallery rsync to server" \
  --mode=block \
  env INCLUDE_HUGE=1 PARALLEL="${PARALLEL:-4}" \
  "$ROOT/scripts/run-selected-gallery-upload.sh"
