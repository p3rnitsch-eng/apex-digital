#!/usr/bin/env bash
set -e

DFX_CACHE_PATH="${DFX_CACHE_PATH:-$(dfx cache show 2>/dev/null || true)}"
CALM_MOC_PATH="${MOC_PATH:-$(command -v moc 2>/dev/null || true)}"
CALM_MOTOKO_BASE="${MOTOKO_BASE:-${DFX_CACHE_PATH:+$DFX_CACHE_PATH/base}}"
CALM_MOTOKO_CORE="${MOTOKO_CORE:-${DFX_CACHE_PATH:+$DFX_CACHE_PATH/core}}"

# Remove any prior src to avoid nested src/src
BUILD_DIR=$(mktemp -d)
cp -rf ./src/. "$BUILD_DIR/"
cd "$BUILD_DIR"

ls -la

if [ ! -x "$CALM_MOC_PATH" ]; then
    echo "Error: Motoko compiler not found. Install dfx or set MOC_PATH." >&2
    exit 1
fi

if [ ! -d "$CALM_MOTOKO_BASE" ]; then
    echo "Error: Motoko base library not found. Check dfx cache or set MOTOKO_BASE." >&2
    exit 1
fi

if [ ! -d "$CALM_MOTOKO_CORE" ]; then
    echo "Error: Motoko core library not found. Check dfx cache or set MOTOKO_CORE." >&2
    exit 1
fi

pnpm install --prefer-offline --child-concurrency 2 --network-concurrency 6
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
node scripts/prune-unused-images.js
node scripts/resize-images.js

"$CALM_MOC_PATH" --implicit-package core --default-persistent-actors -no-check-ir -E M0236 -E M0235 -E M0223 -E M0237 --actor-idl src/backend/system-idl --package base "$CALM_MOTOKO_BASE" --package core "$CALM_MOTOKO_CORE" src/backend/main.mo -o src/backend/backend.wasm

mkdir -p /workdir/src/frontend/
mkdir -p /workdir/src/backend/
cp -rf src/frontend/dist/ /workdir/src/frontend/ 2>/dev/null || echo "No frontend dist to copy"
cp -f src/backend/backend.wasm /workdir/src/backend/ 2>/dev/null || echo "No backend wasm to copy"
