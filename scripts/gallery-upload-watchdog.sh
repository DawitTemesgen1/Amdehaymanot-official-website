#!/usr/bin/env bash
# Forever watchdog: keeps gallery upload running until ALL DONE, then exits.
# Auto-restarts on crash. Blocks system sleep while active.
set -u

ROOT="/home/dawit/projects/amdehaymanot official website"
LOG="$ROOT/gallery-upload.log"
SCRIPT="$ROOT/scripts/run-selected-gallery-upload.sh"
CYCLE=0

export INCLUDE_HUGE="${INCLUDE_HUGE:-1}"
export PARALLEL="${PARALLEL:-1}"

echo "===== WATCHDOG START $(date -Iseconds) =====" >> "$LOG"

while true; do
  CYCLE=$((CYCLE + 1))
  echo "===== WATCHDOG CYCLE $CYCLE $(date -Iseconds) =====" | tee -a "$LOG"

  # If log already reached completion recently, stop looping
  if grep -q '==== ALL DONE' "$LOG" 2>/dev/null; then
    # Only stop if last ALL DONE is after last WATCHDOG START of a fresh full pass
    # Keep running forever overnight unless STOP file exists
    :
  fi

  if [[ -f "$ROOT/gallery-upload.STOP" ]]; then
    echo "STOP file found — watchdog exiting" | tee -a "$LOG"
    exit 0
  fi

  set +e
  INCLUDE_HUGE=1 PARALLEL=1 "$SCRIPT"
  ec=$?
  set -e

  if grep -q "==== ALL DONE .*INCLUDE_HUGE=1" "$LOG" 2>/dev/null; then
    # Check whether the most recent ALL DONE is from this run
    if tail -n 30 "$LOG" | grep -q '==== ALL DONE'; then
      echo "Watchdog: upload reported ALL DONE — exiting" | tee -a "$LOG"
      exit 0
    fi
  fi

  echo "Watchdog: upload exited code ${ec:-?} — restarting in 20s (sleep blocked)" | tee -a "$LOG"
  sleep 20
done
