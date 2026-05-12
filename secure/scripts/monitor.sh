#!/bin/bash
# monitor.sh - Quick monitoring commands

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== System Resources ==="
free -h
echo ""
df -h | grep -E '^Filesystem|/dev/sda1|/dev/root'

echo ""
echo "=== PM2 Logs (tail) ==="
pm2 logs --lines 20 --nostream
