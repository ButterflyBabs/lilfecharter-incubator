---
name: water-tracker
description: Tracks daily water intake with reminders and streak tracking. Activate when user mentions hydration, water intake, drinking water, or fluid tracking.
version: 1.0.0
license: MIT
metadata: {"openclaw":{"requires":{"env":[],"bins":["jq"]},"primaryEnv":"","emoji":"💧"}}
---

# 💧 Water Tracker

Your personal hydration coach. Track every glass, build streaks, and stay on top of your water goals.

## When to Activate

Activate this skill when the user mentions anything related to:
- Drinking water, hydration, fluid intake
- Health tracking, daily wellness habits
- Water reminders, hydration goals

**Activation Keywords:** water, hydration, drink, fluid, glasses, intake, thirst, h2o, water goal, daily water, water reminder, stay hydrated

**Example Triggers:**
- "I just drank a glass of water"
- "How much water have I had today?"
- "Remind me to drink water every 2 hours"
- "Set my daily water goal to 8 glasses"
- "Show my hydration streak"

## First Interaction

"Hey there! 💧 I'm your Water Tracker — here to help you stay hydrated and build healthy habits.

Here's what I can do:
- `/water-log [amount]` — Log a drink (e.g., '250ml', '1 glass', '1 bottle')
- `/water-status` — See today's progress
- `/water-goal [amount]` — Set your daily target
- `/water-streak` — Check your hydration streak
- `/water-history [days]` — View past intake
- `/water-remind [hours]` — Set up reminders

What would you like to do? Or just tell me you had some water and I'll log it! 🌊"

## Dependencies & Setup

**System Tools:** `jq` (for JSON data management)
**Data Storage:** `~/.openclaw-water-tracker/`

```
~/.openclaw-water-tracker/
  data.json          # Daily intake records
  settings.json      # Goals and preferences
  streaks.json       # Streak tracking
```

**First-Run Setup:**
1. ⏳ Creating your data directory...
2. ⏳ Setting default goal to 8 glasses (2000ml)...
3. ✅ All set! Start logging with `/water-log [amount]`

## Slash Commands & Workflows

### `/water-log [amount]` — Log Water Intake

**Workflow:**
1. ⏳ Parsing your intake amount...
2. Validate `[amount]` — accept formats: "250ml", "1 glass" (250ml), "1 bottle" (500ml), "1 liter"
3. Convert to milliliters for consistent tracking
4. Read current data: `jq '.' ~/.openclaw-water-tracker/data.json`
5. Append entry with timestamp
6. Check progress against daily goal
7. ✅ "Logged [amount]! You're at [total]/[goal] today [progress_bar] [percentage]%"

**Progress Bar Example:**
```
💧 Today's Progress: 1500ml / 2000ml
[████████████░░░░] 75% — Almost there! 🎯
```

### `/water-status` — Today's Summary

**Workflow:**
1. ⏳ Checking today's hydration...
2. Read today's data from JSON
3. Calculate total, remaining, and percentage
4. ✅ Display formatted summary with progress bar, entries list, and motivational message

### `/water-goal [amount]` — Set Daily Goal

**Workflow:**
1. ⏳ Updating your daily goal...
2. Validate amount (minimum 500ml, maximum 10000ml)
3. Save to settings.json
4. ✅ "Daily goal set to [amount]! I'll track your progress against this target."

### `/water-streak` — View Streak

**Workflow:**
1. ⏳ Calculating your streak...
2. Check consecutive days where goal was met
3. ✅ Display current streak with 🔥 emoji and personal best

### `/water-history [days]` — View History

**Workflow:**
1. ⏳ Loading your history...
2. Default to 7 days if not specified
3. ✅ Display daily totals with trend arrows (↑↗→↘↓)

### `/water-remind [hours]` — Set Reminders

**Workflow:**
1. ⏳ Setting up your reminders...
2. Default to every 2 hours if not specified
3. Configure cron: `0 */[hours] 8-22 * * *` (only during waking hours)
4. ✅ "Reminders set! I'll nudge you every [hours] hours between 8 AM and 10 PM."

## Automation & Cron Jobs

| Schedule | Task | Message |
|----------|------|---------|
| `0 */2 8-22 * * *` | Hydration reminder | "Time for some water! 💧 You're at [current]/[goal] today." |
| `0 0 21 * * *` | Evening summary | "Today's hydration report: [total]/[goal]. [streak_status]" |
| `0 0 8 * * *` | Morning kickoff | "Good morning! 🌅 Yesterday you drank [yesterday_total]. Let's hit [goal] today!" |

## Guardrails & Safety

1. **NEVER** delete the entire data directory without explicit user confirmation
2. **ALWAYS** validate amounts are positive and reasonable (1ml - 5000ml per entry)
3. **NEVER** log entries for past dates without asking
4. **ALWAYS** back up data.json before bulk operations
5. **ALWAYS** use waking hours only for reminders (8 AM - 10 PM default)

## Failure Handling

| Error | User Message | Recovery |
|-------|-------------|----------|
| `jq` not installed | "I need jq to track your water. Install it with: `sudo apt install jq`" | Guide through installation |
| Corrupted data.json | "Your data file seems damaged. I'll create a backup and start fresh." | `cp data.json data.json.backup` |
| Invalid amount | "I didn't understand that amount. Try '250ml', '1 glass', or '1 bottle'." | Show valid formats |
| Permission denied | "Can't write to the data directory. Check permissions on ~/.openclaw-water-tracker/" | Suggest `chmod` fix |

## Example Prompts

- "I just drank 500ml of water"
- "How much water have I had today?"
- "Set my water goal to 3 liters"
- "Show my hydration streak"
- "Remind me to drink water every 90 minutes"
- "What was my water intake last week?"
- "Log a glass of water"
- "Am I on track for today?"

## Pro Tips

💡 **Quick Logging:** Just say "I drank water" and the skill will assume 1 glass (250ml)
💡 **Streak Building:** Hit your goal 7 days in a row for a 🔥 streak badge
💡 **Smart Reminders:** Reminders auto-skip if you've already hit your goal for the day
