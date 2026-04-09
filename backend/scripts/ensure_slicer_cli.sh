#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_BIN="$ROOT_DIR/.tools/bin"
mkdir -p "$TOOLS_BIN"

has_engine() {
  command -v bambu-studio >/dev/null 2>&1 \
    || command -v BambuStudio >/dev/null 2>&1 \
    || command -v orca-slicer >/dev/null 2>&1 \
    || command -v orcaslicer >/dev/null 2>&1 \
    || command -v OrcaSlicer >/dev/null 2>&1
}

link_bundle_binary_if_present() {
  local target="$1"
  local name="$2"
  if [ -x "$target" ]; then
    ln -sf "$target" "$TOOLS_BIN/$name"
    echo "[slicer] linked $name -> $target"
    return 0
  fi
  return 1
}

if has_engine; then
  echo "[slicer] CLI already available."
  exit 0
fi

echo "[slicer] CLI not found in PATH. Attempting install..."
if command -v brew >/dev/null 2>&1; then
  if ! brew list --cask bambu-studio >/dev/null 2>&1; then
    if brew install --cask bambu-studio >/dev/null 2>&1; then
      echo "[slicer] installed bambu-studio cask"
    else
      echo "[slicer] warning: failed to install bambu-studio via brew"
    fi
  else
    echo "[slicer] bambu-studio cask already installed"
  fi
else
  echo "[slicer] warning: Homebrew not found. Skipping auto-install."
fi

# Try linking app bundle binaries into backend local tool bin for predictable PATH usage.
link_bundle_binary_if_present "/Applications/BambuStudio.app/Contents/MacOS/BambuStudio" "BambuStudio" || true
link_bundle_binary_if_present "$HOME/Applications/BambuStudio.app/Contents/MacOS/BambuStudio" "BambuStudio" || true
link_bundle_binary_if_present "/Applications/OrcaSlicer.app/Contents/MacOS/OrcaSlicer" "OrcaSlicer" || true
link_bundle_binary_if_present "$HOME/Applications/OrcaSlicer.app/Contents/MacOS/OrcaSlicer" "OrcaSlicer" || true

if has_engine || [ -x "$TOOLS_BIN/BambuStudio" ] || [ -x "$TOOLS_BIN/OrcaSlicer" ]; then
  echo "[slicer] CLI bootstrap complete."
else
  echo "[slicer] warning: slicer CLI still unavailable."
  echo "[slicer] install manually and re-run: make -C backend ensure-slicer-cli"
fi

exit 0
