#!/bin/sh
workingDir=$(pwd)

echo "Working directory is [${workingDir}], with contents:"
ls -la ${workingDir}

git config --global --add safe.directory ${workingDir}
echo "[Git config] Working directory marked as safe directory"

node /app/src/main/js/index.js
