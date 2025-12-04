#!/bin/bash

# AI Synchronization Update Script
# Purpose: Run this after completing work to notify the other AI
# Usage: bash scripts/ai-sync-update.sh

set -e

echo "📝 Updating AI synchronization status..."
echo ""

# Ensure we're in the project root
cd "$(dirname "$0")/.."

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if AI_CURRENT_WORK.md is staged
if ! git diff --cached --name-only | grep -q "AI_CURRENT_WORK.md"; then
  echo "⚠️  WARNING: AI_CURRENT_WORK.md is not staged for commit"
  echo ""
  echo "Please update AI_CURRENT_WORK.md to release your claimed work:"
  echo "  - Set 'Currently Working On' to 'None'"
  echo "  - Update 'Last Checkin' timestamp"
  echo "  - Update 'Available Modules' section if you completed a module"
  echo ""
  echo "Then stage it with: git add AI_CURRENT_WORK.md"
  echo ""
  exit 1
fi

# Check if AI_HANDOFF.md is staged
if ! git diff --cached --name-only | grep -q "AI_HANDOFF.md"; then
  echo "⚠️  WARNING: AI_HANDOFF.md is not staged for commit"
  echo ""
  echo "Please update AI_HANDOFF.md with your completed work:"
  echo "  - Add entry to 'Recent Changes' section"
  echo "  - Update 'What's Next' section"
  echo "  - Update 'Task Ownership' table"
  echo ""
  echo "Then stage it with: git add AI_HANDOFF.md"
  echo ""
  exit 1
fi

echo "✅ Required files staged for commit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show what's being committed
echo "📦 Files staged for commit:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git diff --cached --name-status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show diff summary
echo "📊 Changes summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git diff --cached --stat
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify AI_CURRENT_WORK.md shows work is released
CURRENT_WORK=$(grep -A 1 "^**Currently Working On:**" AI_CURRENT_WORK.md | head -1 | grep -o "None" || echo "")

if [ -z "$CURRENT_WORK" ]; then
  echo "⚠️  WARNING: AI_CURRENT_WORK.md still shows active work"
  echo ""
  echo "Please update AI_CURRENT_WORK.md to set 'Currently Working On: None'"
  echo ""
  exit 1
fi

echo "✅ AI_CURRENT_WORK.md correctly shows no active work"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Ready to commit!"
echo ""
echo "📋 Recommended next steps:"
echo ""
echo "  1. Review the changes above"
echo "  2. Create commit with descriptive message:"
echo "     git commit -m 'feat: completed [ModuleName] - [brief description]'"
echo ""
echo "  3. Push to GitHub:"
echo "     git push origin main"
echo ""
echo "  4. Your changes will be visible to the other AI immediately"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 For more info, see AI_SYNC_AUTOMATION.md"
echo ""
