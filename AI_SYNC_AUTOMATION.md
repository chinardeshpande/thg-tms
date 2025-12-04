# AI Synchronization Automation Guide

> **Purpose:** Automate coordination between Claude Code and ChatGPT Codex to prevent conflicts and increase development velocity
> **Status:** Proposed Solutions - Awaiting Implementation
> **Last Updated:** 2025-12-04

---

## 🎯 Goals

1. **Prevent Work Conflicts** - Ensure both AIs know what the other is working on in real-time
2. **Increase Velocity** - Reduce manual coordination overhead
3. **Maintain Safety** - Protect work from accidental overwrites or merge conflicts
4. **Enable Parallel Work** - Allow both AIs to work simultaneously on different modules

---

## 🚀 Proposed Solutions

### Option 1: Git-Based Automation (Recommended - Simplest)

**How It Works:**
- Use GitHub Actions to automatically detect and communicate changes
- When either AI pushes to GitHub, a workflow triggers
- The workflow updates a status file that both AIs check before starting work

**Implementation Steps:**

#### 1. Create GitHub Actions Workflow

Create `.github/workflows/ai-sync.yml`:

```yaml
name: AI Synchronization

on:
  push:
    branches:
      - main
      - 'feat/**'
    paths:
      - 'AI_HANDOFF.md'
      - 'backend/**'
      - 'frontend/**'

jobs:
  sync-status:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Extract commit info
        id: commit
        run: |
          AUTHOR=$(git log -1 --pretty=format:'%an')
          MESSAGE=$(git log -1 --pretty=format:'%s')
          TIMESTAMP=$(git log -1 --pretty=format:'%ci')
          FILES=$(git diff --name-only HEAD~1 HEAD | tr '\n' ',' | sed 's/,$//')

          echo "author=$AUTHOR" >> $GITHUB_OUTPUT
          echo "message=$MESSAGE" >> $GITHUB_OUTPUT
          echo "timestamp=$TIMESTAMP" >> $GITHUB_OUTPUT
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Update sync status
        run: |
          cat > AI_SYNC_STATUS.json <<EOF
          {
            "lastUpdate": "${{ steps.commit.outputs.timestamp }}",
            "lastAuthor": "${{ steps.commit.outputs.author }}",
            "lastCommitMessage": "${{ steps.commit.outputs.message }}",
            "modifiedFiles": "${{ steps.commit.outputs.files }}".split(','),
            "needsSync": true
          }
          EOF

      - name: Commit sync status
        run: |
          git config user.name "AI Sync Bot"
          git config user.email "ai-sync@thg-tms.com"
          git add AI_SYNC_STATUS.json
          git commit -m "chore: update AI sync status [skip ci]" || echo "No changes to commit"
          git push
```

#### 2. Create Pre-Work Sync Check Script

Create `scripts/ai-sync-check.sh`:

```bash
#!/bin/bash

# AI Synchronization Check Script
# Run this before starting any work to ensure you're in sync

echo "🔄 Checking AI synchronization status..."

# Pull latest changes
git pull origin main

# Check if sync status file exists
if [ ! -f "AI_SYNC_STATUS.json" ]; then
  echo "⚠️  No sync status file found. Creating initial status..."
  echo '{"lastUpdate":"never","lastAuthor":"none","needsSync":false}' > AI_SYNC_STATUS.json
fi

# Read sync status
LAST_AUTHOR=$(jq -r '.lastAuthor' AI_SYNC_STATUS.json)
LAST_UPDATE=$(jq -r '.lastUpdate' AI_SYNC_STATUS.json)
NEEDS_SYNC=$(jq -r '.needsSync' AI_SYNC_STATUS.json)

echo "📊 Last update by: $LAST_AUTHOR at $LAST_UPDATE"

if [ "$NEEDS_SYNC" = "true" ]; then
  echo "⚠️  WARNING: Repository has recent changes. Please review AI_HANDOFF.md"
  echo "📄 Opening AI_HANDOFF.md for review..."
  cat AI_HANDOFF.md

  # Mark as synced
  jq '.needsSync = false' AI_SYNC_STATUS.json > temp.json && mv temp.json AI_SYNC_STATUS.json
else
  echo "✅ You are in sync with the latest changes"
fi

# Show current task ownership
echo ""
echo "📋 Current Task Ownership:"
grep -A 20 "## Task Ownership" AI_HANDOFF.md | grep -v "^$"

echo ""
echo "✅ Sync check complete. Safe to proceed with work."
```

Make it executable:
```bash
chmod +x scripts/ai-sync-check.sh
```

#### 3. Create Post-Work Sync Update Script

Create `scripts/ai-sync-update.sh`:

```bash
#!/bin/bash

# AI Synchronization Update Script
# Run this after completing work to notify the other AI

echo "📝 Updating AI synchronization status..."

# Ensure AI_HANDOFF.md is updated
if ! git diff --cached --name-only | grep -q "AI_HANDOFF.md"; then
  echo "⚠️  WARNING: AI_HANDOFF.md not staged for commit"
  echo "Please update AI_HANDOFF.md with your changes before pushing"
  exit 1
fi

# Show what's being committed
echo "📦 Files to be committed:"
git diff --cached --name-only

echo ""
echo "✅ Ready to commit. Your changes will trigger AI sync notification."
echo ""
echo "Recommended commit process:"
echo "  1. git commit -m 'your message'"
echo "  2. git push origin main"
echo "  3. The other AI will be notified via GitHub Actions"
```

Make it executable:
```bash
chmod +x scripts/ai-sync-update.sh
```

#### 4. Integration with AI Workflow

**For Claude Code:**
- Before starting work: Run `bash scripts/ai-sync-check.sh`
- After completing work: Run `bash scripts/ai-sync-update.sh`
- Always update AI_HANDOFF.md in commits

**For ChatGPT Codex:**
- Implement same workflow
- Check AI_SYNC_STATUS.json before starting
- Update AI_HANDOFF.md after completing work

**Estimated Setup Time:** 1-2 hours
**Maintenance:** Near-zero (fully automated)

---

### Option 2: Real-time Collaboration File (Simplest - No GitHub Actions)

**How It Works:**
- Both AIs check and update a shared `AI_CURRENT_WORK.md` file
- File contains current status of what each AI is working on
- Simple file-based locking mechanism

**Implementation:**

Create `AI_CURRENT_WORK.md`:

```markdown
# AI Current Work Status

**Auto-updated by:** Claude Code & ChatGPT Codex
**Purpose:** Real-time coordination to prevent work conflicts

---

## Claude Code Status

**Currently Working On:** None
**Module:** None
**Started At:** N/A
**Expected Completion:** N/A
**Files Being Modified:**
- None

**Last Checkin:** 2025-12-04 00:00:00

---

## ChatGPT Codex Status

**Currently Working On:** TrackingModule schema alignment
**Module:** TrackingModule
**Started At:** 2025-12-03 14:30:00
**Expected Completion:** 2025-12-04 (estimate)
**Files Being Modified:**
- backend/src/api/tracking/services/tracking.service.ts
- backend/src/api/tracking/dto/create-tracking.dto.ts
- backend/src/app.module.ts

**Last Checkin:** 2025-12-03 15:00:00

---

## Coordination Rules

1. **Before Starting Work:**
   - Pull latest changes: `git pull origin main`
   - Read this file to see what the other AI is working on
   - Update your status section with what you're about to work on
   - Commit and push this file: `git add AI_CURRENT_WORK.md && git commit -m "chore: claim [module] for work" && git push`

2. **During Work (Every 30-60 minutes):**
   - Update "Last Checkin" timestamp to show you're still active
   - Push updates: `git add AI_CURRENT_WORK.md && git commit -m "chore: working on [module]" && git push`

3. **After Completing Work:**
   - Set "Currently Working On" to "None"
   - Update AI_HANDOFF.md with your changes
   - Commit both files together

4. **Conflict Prevention:**
   - NEVER work on modules claimed by the other AI
   - If you see recent activity (Last Checkin < 2 hours ago), consider it actively claimed
   - If Last Checkin > 4 hours ago, you may cautiously proceed but verify first

---

## Available Modules for Work

- ✅ AuthModule - Complete
- ✅ UsersModule - Complete
- ✅ CompaniesModule - Complete
- ✅ ShipmentsModule - Complete
- ✅ CarriersModule - Complete
- ✅ BillingModule - Complete
- 🔴 RoutesModule - Available (minimal errors)
- ⚠️ TrackingModule - CLAIMED BY ChatGPT Codex
- 🔴 AnalyticsModule - Available (~35 errors)

---

## Emergency Override

If you must work on a module claimed by another AI (emergency bug fix, etc.):
1. Add a note in this file under "Emergency Overrides" section
2. Update AI_HANDOFF.md with detailed explanation
3. Use a feature branch instead of main
4. Notify via commit message: `git commit -m "EMERGENCY: fixing critical bug in [module]"`
```

**Estimated Setup Time:** 15 minutes
**Maintenance:** Manual updates required, but simple

---

### Option 3: Webhook-Based Notification (Most Advanced)

**How It Works:**
- GitHub webhook triggers on push events
- Webhook sends notification to a lightweight service
- Service updates a status dashboard or sends alerts

**Implementation:**

1. Set up a simple webhook receiver (Node.js/Express)
2. Configure GitHub webhook to POST to receiver
3. Receiver parses commit data and updates status
4. Optional: Send notifications via email/Slack

**Pros:**
- Real-time notifications
- Can integrate with communication tools
- Most sophisticated solution

**Cons:**
- Requires hosting a webhook receiver service
- More complex setup
- Overkill for 2-AI collaboration

**Estimated Setup Time:** 4-6 hours
**Recommendation:** Only if scaling to 3+ AI agents

---

## 📋 Recommended Implementation Path

### Phase 1: Immediate (Today) - Manual Protocol
1. ✅ Create `AI_CURRENT_WORK.md` (Option 2) - 15 minutes
2. ✅ Update both AIs to check this file before starting work
3. ✅ Establish checkin discipline (update status every hour)

### Phase 2: Short-term (This Week) - Script Automation
1. Create `ai-sync-check.sh` and `ai-sync-update.sh` scripts
2. Test workflow with both AIs
3. Document process in AI_HANDOFF.md

### Phase 3: Long-term (Next Week) - GitHub Actions
1. Implement GitHub Actions workflow (Option 1)
2. Create `AI_SYNC_STATUS.json` automated updates
3. Integrate with existing scripts
4. Monitor effectiveness for 1 week

---

## 🔧 Helper Scripts Reference

### Quick Sync Before Work
```bash
# Pull latest, check status, show available work
git pull origin main && \
cat AI_CURRENT_WORK.md && \
echo "" && \
echo "📋 Your options:" && \
grep "🔴.*Available" AI_CURRENT_WORK.md
```

### Quick Sync After Work
```bash
# Stage changes, update handoff, push
git add . && \
git status && \
echo "Did you update AI_HANDOFF.md? (yes/no)" && \
read answer && \
if [ "$answer" = "yes" ]; then \
  git commit && git push; \
else \
  echo "Please update AI_HANDOFF.md first!"; \
fi
```

### Check Other AI's Status
```bash
# See what the other AI is working on
git pull origin main > /dev/null 2>&1 && \
grep -A 10 "ChatGPT Codex Status" AI_CURRENT_WORK.md || \
grep -A 10 "Claude Code Status" AI_CURRENT_WORK.md
```

---

## 🎯 Success Metrics

**How we'll know this is working:**

1. **Zero Merge Conflicts** - No conflicts in the past week
2. **Clear Ownership** - Always know who's working on what
3. **Fast Handoffs** - < 5 minutes to sync and start work
4. **Parallel Work** - Both AIs working simultaneously on different modules
5. **No Duplicate Work** - Never working on the same module twice

---

## 🤝 Communication Best Practices

### For Claude Code
- Always run sync check before starting: `bash scripts/ai-sync-check.sh`
- Update AI_CURRENT_WORK.md immediately when claiming work
- Check in every 60 minutes during long tasks
- Clear status when done

### For ChatGPT Codex
- Same protocol as Claude Code
- Respect claimed modules
- Coordinate on shared files (like Prisma schema)
- Use feature branches for experimental work

---

## 📚 Related Documentation

- [AI_HANDOFF.md](./AI_HANDOFF.md) - Daily tactical coordination
- [GAPS_AND_ROADMAP.md](./GAPS_AND_ROADMAP.md) - Strategic planning
- [claude.md](./claude.md) - Project context

---

## 🔄 Next Steps

1. **Immediate:** Create `AI_CURRENT_WORK.md` and establish manual protocol
2. **This Week:** Implement sync check/update scripts
3. **Next Week:** Add GitHub Actions automation
4. **Ongoing:** Monitor and refine based on real usage

**Automation Status:**
- ⏳ AI_CURRENT_WORK.md - Ready to create
- ⏳ Sync scripts - Ready to implement
- ⏳ GitHub Actions - Ready to implement
- ⏳ Testing - Pending implementation

**Owner:** Both Claude Code and ChatGPT Codex
**Priority:** High (prevents work conflicts)
**Estimated Total Setup:** 2-3 hours for full automation
