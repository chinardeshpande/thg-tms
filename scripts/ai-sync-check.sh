#!/bin/bash

# AI Synchronization Check Script
# Purpose: Run this before starting any work to ensure you're in sync with the other AI
# Usage: bash scripts/ai-sync-check.sh

set -e

echo "🔄 Checking AI synchronization status..."
echo ""

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if AI_CURRENT_WORK.md exists
if [ ! -f "AI_CURRENT_WORK.md" ]; then
  echo "⚠️  AI_CURRENT_WORK.md not found. Creating initial file..."
  echo "Please update this file manually to track your work."
  exit 1
fi

# Show what the other AI is working on
echo "📊 CURRENT WORK STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract Claude Code status
echo "🤖 Claude Code Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sed -n '/## 🤖 Claude Code Status/,/^## 🤖 ChatGPT Codex Status/p' AI_CURRENT_WORK.md | head -n -2
echo ""

# Extract ChatGPT Codex status
echo "🤖 ChatGPT Codex Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sed -n '/## 🤖 ChatGPT Codex Status/,/^## 📋 Coordination Rules/p' AI_CURRENT_WORK.md | head -n -2
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show available modules
echo "🎯 AVAILABLE MODULES FOR WORK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sed -n '/## 🎯 Available Modules for Work/,/^## 🚨 Emergency Override Protocol/p' AI_CURRENT_WORK.md | grep -E "(###|^- \*\*)" | head -n 20
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show recent commits to understand what's changed
echo "📝 RECENT ACTIVITY (Last 5 commits)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git log -5 --pretty=format:"%C(yellow)%h%Creset %C(blue)%ar%Creset %C(green)%s%Creset" --abbrev-commit
echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for conflicts
CLAIMED_MODULES=$(grep -A 1 "Currently Working On:" AI_CURRENT_WORK.md | grep -v "^--$" | grep -v "Currently Working On:" | grep -v "None")

if [ ! -z "$CLAIMED_MODULES" ]; then
  echo "⚠️  WARNING: Modules currently claimed by another AI"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "$CLAIMED_MODULES"
  echo ""
  echo "Please avoid working on these modules unless coordinating directly."
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Sync check complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Choose an available module from the list above"
echo "  2. Update AI_CURRENT_WORK.md with your claimed work"
echo "  3. Commit and push: git add AI_CURRENT_WORK.md && git commit -m 'chore: claim [module]' && git push"
echo "  4. Start your work"
echo ""
echo "📚 For more info, see AI_SYNC_AUTOMATION.md"
echo ""
