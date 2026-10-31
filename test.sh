#!/bin/sh
# Runs the GovReady tests on macOS and Linux.
#   sh test.sh
# (Windows users: double-click test.bat instead. Both call scripts/run-tests.js.)

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo
  echo "  Node.js was not found."
  echo "  Install it from https://nodejs.org and run this file again."
  echo
  exit 1
fi

node scripts/run-tests.js
exit $?
