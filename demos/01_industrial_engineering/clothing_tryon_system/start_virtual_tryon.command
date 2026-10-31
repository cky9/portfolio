#!/bin/bash
# ==============================================================================
# Fashion AI Studio - macOS One-Click Launch Script
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

PORT=8765
URL="http://127.0.0.1:$PORT"

echo "=========================================================="
echo "  👗 Fashion AI Studio - Virtual Try-On Platform           "
echo "=========================================================="
echo "  📁 Working Directory: $DIR"
echo "  🌐 Service Address:   $URL"
echo "----------------------------------------------------------"

# Check if port is occupied
PID=$(lsof -ti :$PORT)
if [ ! -z "$PID" ]; then
    echo "⚠️ Detected process ($PID) running on port $PORT, reusing existing instance..."
else
    echo "🚀 Starting backend engine..."
    PYTHONIOENCODING=utf-8 /usr/bin/python3 "$DIR/server.py" $PORT &
    SERVER_PID=$!
    sleep 1
fi

echo "✨ Opening platform in default browser..."
open "$URL"

echo "=========================================================="
echo "  Platform is running! Press Ctrl + C to exit."
echo "=========================================================="

wait
