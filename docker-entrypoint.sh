#!/bin/sh
set -e

echo "──────────────────────────────────────"
echo " App:     ${APP_VERSION:-unknown}"
echo " Env:     ${ENV:-production}"
echo " Node:    $(node --version)"
echo "──────────────────────────────────────"

# ── Guard: required env vars ─────────────────────────────────────────────────
: "${DATABASE_URL:?❌  DATABASE_URL is not set. Aborting.}"

# ── Prisma migrations ─────────────────────────────────────────────────────────
if [ "$SKIP_MIGRATIONS" != "true" ]; then
  echo "▶ Running Prisma migrations..."
  npm run prisma:migrate
else
  echo "▶ Skipping Prisma migrations..."
fi

echo "▶ Starting application..."
exec "$@"
