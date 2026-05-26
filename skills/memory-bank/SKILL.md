# Memory Bank Skill

**Command:** `/memory bank`
**Workshop Command:** `/memory bank workshop`
**Version:** 1.0.0
**Author:** Pacino / Titanium Software
**No API keys required.**

## Purpose
Build and maintain persistent knowledge banks from any document source (PDF, transcript, URL, pasted text). Each bank is a folder with an append-only knowledge base, source archive, and index log. Workshop mode auto-generates summaries and action steps on every ingest.

## Trigger
User types: `/memory bank`

## File ingestion reality (important)
- ✅ **Pasted text** → works
- ✅ **Shareable URL** (Google Drive PDF, Dropbox, direct link) → fetch with `web_fetch`
- ✅ **File path already on VPS** → read with `read`
- ❌ **Telegram document attachments** → **NOT auto-downloaded**. Do **not** search for them. Immediately redirect the user to A/B/C.
- ⚠️ **Google Slides / PPTX** text export commonly returns placeholder notes only (not the visual text). **Export decks to PDF first**.

## Workflow

### Step 0 — Ask how they're providing the source
Ask exactly:

> "How are you providing the source?
> (A) Paste text directly in chat
> (B) Share a link (Google Drive, Dropbox, direct URL)
> (C) File path on the VPS"

Routing:
- (A) → wait for pasted text in the next message
- (B) → use `web_fetch` to fetch the source and extract text
 - For Google Drive PDFs, convert the share link to a direct download URL:
 - `https://drive.google.com/uc?export=download&id=FILE_ID`
- (C) → use `read` on the provided path
- If a Telegram doc attachment is received → do **not** loop or attempt to discover it; ask the user to use A/B/C.

**Shortcut:** If the user provides bank name + source in one message, skip menus and proceed.

---

### Step 1 — Existing bank or new bank
Ask exactly:

> "Is this for:
> 1️⃣ Existing bank
> 2️⃣ New bank"

- If (1) → list folder names from `memory/banks/` → ask which one
- If (2) → ask for bank name → create scaffolding:
 - `memory/banks/{bank_name}/`
 - `memory/banks/{bank_name}/sources/`
 - `memory/banks/{bank_name}/recaps/`
 - `memory/banks/{bank_name}/knowledge-base.md` (create fresh)
 - `memory/banks/{bank_name}/index.md` (create fresh)

**Exception — Shadow Workshop rules (below):** after Day 1, auto-select existing bank and skip prompting.

---

### Step 2 — Ingest source
Based on Step 0 method:
- (A) take pasted text as-is
- (B) fetch via `web_fetch`, then:
 - If PDF bytes: save PDF into `sources/`, extract text with `pdf`, and save extracted text into `sources/`
- (C) read file at provided path

Save raw/extracted content into:
- `memory/banks/{bank_name}/sources/{descriptive-name}_{date}.txt`
- For PDFs also save original:
 - `memory/banks/{bank_name}/sources/{descriptive-name}_{date}.pdf`

---

### Step 3 — Update artifacts (never overwrite)

**knowledge-base.md** — append this block:

```markdown
---

## Source: {source_name} — {date}

{extracted content, cleaned and formatted}
```

**index.md** — append one row:

```markdown
| {date} | {source name or URL} | {1-sentence topic summary} |
```

---

### Step 4 — Confirm + extras
Send exactly:

> "✅ Added to **{bank_name}**.
> Source stored → `sources/{filename}`
> KB updated → `knowledge-base.md`
> Index logged → `index.md`"

Then ask separately (standard mode):
- "Want a summary of what was added?"
- "Want action steps extracted from it?"

In **workshop mode**, skip asking and do both automatically (see below).

## Workshop mode

**Trigger:**
- `/memory bank workshop`, OR
- bank name contains `Workshop` or `Session`, OR
- user says "workshop mode"

**Differences from standard mode:**
- Auto-generate summary + action steps
- Save recap to:
 - `memory/banks/{bank_name}/recaps/{Day/Session label}-recap.md`

**Recap format:**

```markdown
# Workshop Recap: {source_name}
*Date: {date}*

## Summary
{3-5 sentence summary}

## Key Takeaways
- {takeaway 1}
- {takeaway 2}
- {takeaway 3}
- {takeaway 4}
- {takeaway 5}

## Action Steps
1. {step}
2. {step}
3. {step}
4. {step}
5. {step}
```

## Shadow Workshop — standing rules
For the 7-day series:

- **Bank name:** `Shadow Workshop`
- **Workshop mode:** ALWAYS ON
- **Day 1:** create the bank
- **Days 2–7:** auto-select `Shadow Workshop` (do not ask existing vs new)
- **Source naming:** `Day1-{filename}`, `Day2-{filename}`, etc.
- **KB header per entry:** `## Day X — {filename} — {date}`
- **Recap naming:** `recaps/DayX-recap.md`
- **Source priority:** PDF → pasted text → Google Doc / .txt link

## File structure

```
memory/banks/
 {bank_name}/
 knowledge-base.md
 index.md
 sources/
 {source}_{date}.txt
 {source}_{date}.pdf
 recaps/
 {label}-recap.md
```

## Rules

**Never:**
- Overwrite `knowledge-base.md` or `index.md` (append-only)
- Loop searching for Telegram document attachments
- Include credentials, API keys, or personal data in skill files
- Create separate banks per session when Shadow Workshop rule is active

**Always:**
- Start with Step 0 unless shortcut applies
- Save raw source and extracted text to `sources/`
- Append KB with dated header
- Update `index.md` for every addition
- Confirm with exact file paths
- Run workshop mode automatically when triggered
