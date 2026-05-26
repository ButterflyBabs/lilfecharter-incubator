# Email Conversion Engine

**🎯 TRIGGER:** `/email conversion` or when user requests email copywriting assistance

**⚡ EXECUTION STYLE:** 3-layer system (Category → Framework → Style). Simple for user, advanced behind the scenes.

---

## Purpose

Write high-converting email broadcasts, promotions, launches, and story emails using proven direct-response frameworks and copywriting styles.

The system remains **SIMPLE for the user** while using **advanced persuasion frameworks** behind the scenes.

---

## 3-Layer System

```
CATEGORY → FRAMEWORK → STYLE
```

The user only selects **CATEGORY** and **STYLE**.

The **FRAMEWORK** is automatically selected by the system.

---

## STEP 1 — Ask User for Email Category

**Ask:**

> What type of email do you want to write?
>
> **Sales** | **Story** | **Authority** | **Curiosity** | **Relationship** | **Urgency**

If the user does not know, offer **AUTO MODE**.

**AUTO MODE** will automatically choose the best category based on context.

---

## STEP 2 — Ask User for Style

**Ask:**

> What style do you want?
>
> **Daily Email** | **Direct Response** | **Story Sell** | **Big Opportunity** | **Clean Professional**

### Style Definitions

| Style | Description |
|-------|-------------|
| **Daily Email** | Ben Settle inspired daily conversational email |
| **Direct Response** | Gary Halbert / Dan Kennedy style hard hitting persuasion |
| **Story Sell** | Frank Kern / Chris Orzechowski story driven selling |
| **Big Opportunity** | Agora style high opportunity framing |
| **Clean Professional** | Professional business tone with strong clarity |

If the user does not choose a style, automatically select one based on category.

---

## STEP 3 — Ask for Required Information

**Ask:**

> What are we promoting?

### Required Input (MUST ASK)
- **CTA link** — "What link should I include in the email?"

### Optional Inputs
- Deadline
- Audience
- Offer description

**CRITICAL RULES:**
- **ALWAYS ask for the CTA link before writing the email**
- **The link MUST appear within the first 3-4 sentences from the top**
- **The link MUST also appear in the P.S. section**
- Use placeholder like `[LINK]` if user hasn't provided one yet

If the user provides minimal information, infer the best hook and angle without inventing fake claims.

---

## Framework Engine

Once the category is known, select a framework automatically.

### Sales Framework Options
- Problem → Agitate → Solve
- Opportunity → Mechanism → Offer
- Lead → Story → Offer
- Offer → Stack → CTA
- Why Now → CTA

### Story Framework Options
- Story → Lesson → Offer
- Observation → Insight → Offer
- Failure → Discovery → Solution
- Daily Life → Hidden Opportunity

### Authority Framework Options
- Myth → Truth → Opportunity
- Industry Insight → Strategy → Offer
- Prediction → Warning → Solution

### Curiosity Framework Options
- Open Loop → Reveal → CTA
- Strange Observation → Insight → Offer
- Hidden Opportunity → Explanation → CTA

### Relationship Framework Options
- Conversation → Insight → Soft CTA
- Personal Update → Lesson → Soft CTA

### Urgency Framework Options
- Deadline Reminder
- Last Chance → CTA
- Bonus Expiring
- Cart Closing

---

## Style Engine

Once framework is chosen, apply the selected writing style.

### Daily Email Style
- Conversational
- Personality driven
- Story based
- Curiosity driven
- Feels like one person talking to one reader

### Direct Response Style
- Punchy
- Short paragraphs
- Strong hook
- Clear persuasion
- Fast momentum
- Strong CTA

### Story Sell Style
- Narrative driven
- Smooth persuasion
- Soft selling
- Personal story
- Insight driven

### Big Opportunity Style
- High stakes
- Opportunity framing
- Emotional tension
- Bold promise
- Strong intrigue

### Clean Professional Style
- Clear
- Readable
- Business friendly
- Persuasive without hype

---

## Email Structure

Build the email using:

1. **Hook (1-2 sentences)**
2. **Link placement (within first 3-4 sentences)** ⚡ MANDATORY
3. **Context or problem**
4. **Emotional expansion**
5. **Story or explanation**
6. **Offer introduction**
7. **CTA**
8. **Reinforcement**
9. **Closing**
10. **P.S. with link** ⚡ MANDATORY

### Link Placement Rules (CRITICAL)
- **First link MUST appear within first 3-4 sentences from the very top**
- **P.S. MUST include the same link**
- Do not bury the first link deep in the email
- The early link creates the "click habit" and improves engagement

---

## Subject Line Generator

Always produce **3 subject lines**:

1. **Curiosity subject**
2. **Benefit subject**
3. **Intrigue subject**

---

## Preview Text

Write preview text that complements the subject but does not repeat it.

---

## Output Format

Return the following:

```
**Selected Category:** [category]
**Selected Style:** [style]

---

**Subject Line 1:** [curiosity]
**Subject Line 2:** [benefit]
**Subject Line 3:** [intrigue]

**Preview Text:** [text]

---

**Full Email:**

[email body]

---

**P.S.** [p.s. text]

---

**Alternate Hook Ideas:**
- [idea 1]
- [idea 2]
- [idea 3]
```

---

## Universal Email Rules

- Use short paragraphs (1-3 sentences max)
- Avoid robotic wording
- Make the email feel human
- Every section must keep the reader moving forward
- Use natural conversational flow
- Do not sound like an instruction manual
- Avoid generic AI phrasing
- Keep readability between 5th and 8th grade unless user requests otherwise
- **Do not fabricate testimonials, income claims, or guarantees**

## Text Formatting Options

The skill supports formatting markup. Ask the user if they want formatting:

> Do you want text formatting? (bold, italics, underline)

### Formatting Syntax
| Format | Syntax | Example |
|--------|--------|---------|
| **Bold** | `**text**` or `__text__` | `**Click here**` → **Click here** |
| *Italics* | `*text*` or `_text_` | `*important*` → *important* |
| <u>Underline</u> | `<u>text</u>` | `<u>Click here</u>` → <u>Click here</u> |
| ~~Strikethrough~~ | `~~text~~` | `~~old price~~` → ~~old price~~ |

### Formatting Best Practices
- Use **bold** for CTAs and key phrases
- Use *italics* for emphasis and tone
- Use <u>underline</u> sparingly for maximum impact
- Don't over-format — less is more
- Keep formatting consistent throughout the email

---

## Hook Engine

Choose the best hook type automatically based on category and style.

### Hook Options
- Contrarian statement
- Personal story
- Hidden opportunity
- Problem escalation
- Curiosity loop
- Insight reveal
- Urgency alert
- Industry truth

---

## CTA Rules

- Include at least one primary CTA
- The CTA must match the tone of the style selected
- Place a final CTA near the close of the email
- Use natural, conversational CTAs

---

## AUTO MODE

If the user only says:

> "Write an email promoting X"

Automatically determine:
- Best category
- Best framework
- Best style

Then generate the email.

---

## Advanced Commands

The skill must also understand commands like:

| Command | Action |
|---------|--------|
| "Write a story email promoting X" | Use Story category + Story Sell style |
| "Write a sales email promoting X" | Use Sales category + Direct Response style |
| "Make this more curiosity driven" | Adjust to Curiosity category |
| "Rewrite this in direct response style" | Change style to Direct Response |
| "Rewrite this in daily email style" | Change style to Daily Email |
| "Make this more aggressive" | Increase urgency and punchiness |
| "Make this more professional" | Switch to Clean Professional style |
| "Give me 5 subject lines" | Generate 5 subject line variations |
| "Turn this into a 3 email sequence" | Create a 3-part email series |
| "Add urgency" | Inject urgency elements |
| "Make the CTA stronger" | Strengthen the call-to-action |

---

## Quality Check

Before returning the email, verify:

- ✅ The hook is strong
- ✅ **Link appears within first 3-4 sentences from the top** (CRITICAL)
- ✅ **Link appears in the P.S. section** (CRITICAL)
- ✅ The email flows naturally
- ✅ The CTA is clear
- ✅ The tone matches the selected style
- ✅ The email feels human and interesting
- ✅ Formatting is applied correctly (if requested)

If the email feels bland, rewrite it to be more engaging and persuasive.

---

## Final Behavior

When the skill activates, ask:

> What type of email do you want to write?
>
> **Sales** | **Story** | **Authority** | **Curiosity** | **Relationship** | **Urgency**

Then guide the user through the steps and generate the email.

---

## Category Quick Reference

| Category | Best For | Default Style |
|----------|----------|---------------|
| **Sales** | Direct promotions, product launches | Direct Response |
| **Story** | Building connection, soft selling | Story Sell |
| **Authority** | Establishing expertise, trust | Clean Professional |
| **Curiosity** | Opening loops, driving clicks | Daily Email |
| **Relationship** | Nurturing, engagement | Daily Email |
| **Urgency** | Deadlines, scarcity, last chance | Direct Response |

---

**SKILL CREATED:** 2026-03-14
