# /CREATE BUSINESS - PRODUCT CREATION ENGINE

**ABSOLUTE RULE: NEVER DEVIATE FROM THIS PROTOCOL.**

When Chad types `/create business`:
1. Execute each stage completely
2. **STOP after each stage**
3. **WAIT for Chad to say "continue"** before proceeding to next stage
4. Never auto-advance through stages

**Stages:**
- Stage 1: Opportunity Intelligence
- Stage 2: Product Architecture
- Stage 3: Product Identity — Name + Logo + GitHub Repo + Vercel Project
- Stage 4: Sales Page
- Stage 5: VSL + Stripe + Checkout + Core Delivery Pages
- Stage 6: Product Deliverables + Bonuses
- Stage 7: Review Checkpoint
- Stage 8: Domain Setup
- Stage 9: Traffic + Conversion Assets
- Stage 10: Active Traffic Deployment
- Stage 11: Scale Plan

---

## STAGE 1 — OPPORTUNITY INTELLIGENCE

**Start by asking the user exactly this:**

> "What would you like to build a business around?
>
> You can:
> 1️⃣ Tell me a topic or niche and I'll build out the opportunity
> 2️⃣ Let me generate 10 ideas for you to choose from"

**If they choose option 1 (they give a topic):**
- Ask: "How many product ideas would you like me to generate for that niche?"
- Generate that many opportunities (minimum 5, maximum 10)
- For each idea identify:
  - Target buyer
  - Painful problem
  - Demand indicators
  - Price range
  - 2–3 competitors
  - Profit potential (low / medium / high)
- Score each on urgency, speed to revenue, competition, scalability
- Highlight the top recommendation
- Ask: "Which one do you want to build? Or say 'continue' to go with the recommended one."

**If they choose option 2 (generate ideas):**
- Generate 10 viable product opportunities
- For each idea identify:
  - Target buyer
  - Painful problem
  - Demand indicators (search activity, competitors, social signals)
  - Supported market price range
  - 2–3 competitors or substitutes
  - Estimated profit potential (low / medium / high) with reasoning
- Score each idea on urgency, speed to revenue, competition strength, and scalability
- Highlight the top recommendation
- Ask: "Which one do you want to build? Or say 'continue' to go with the recommended one."

**Wait for their selection before proceeding to Stage 2.**

**Stage output format (option 2):**
```
## STAGE 1 — OPPORTUNITY INTELLIGENCE

[10 ideas listed with scores]

🏆 Recommended: [Product Idea]

Which one do you want to build?
```

---

## STAGE 2 — PRODUCT ARCHITECTURE

Create a Business Blueprint including:
- Core offer
- Unique positioning
- Pricing strategy
- Upsell / backend potential
- Traffic entry point
- Fulfillment model
- Revenue model (one-time, subscription, hybrid)

**Rule:** Do not proceed if the blueprint is weak or unclear.

**Stage output format:**
```
## STAGE 2 — PRODUCT ARCHITECTURE

Product: [Name placeholder]
Price: $[X]
Model: [one-time / subscription]
Core Promise: [one sentence]
Target Buyer: [who]
Traffic Entry: [how they find it]

---
Ready for Stage 3? (Reply 'continue')
```

---

## STAGE 3 — PRODUCT IDENTITY

**Purpose:** Lock in the product name, logo, GitHub repo, and Vercel project BEFORE building any pages. Everything built after this stage carries the brand.

### Step 1: Name + Domain Suggestions

Ask TWO questions at once:
- "Would you like help coming up with a product name and finding an available domain?"
- "If yes — how many name suggestions would you like?"

If YES:
1. Ask: "What's the core transformation or result this product delivers? (1 sentence)"
2. Generate 2x requested quantity of name ideas
3. Run DNS availability check using `skills/domain-name-finder/scripts/check-domains-dns.js`
4. Check `.com`, `.net`, `.org` for each name
5. Present results showing ALL available extensions per name:

```
Here are [X] available options:

1. [DomainName]
   ✅ .com  ✅ .net  ❌ .org

2. [DomainName]
   ✅ .com  ❌ .net  ✅ .org
```

6. Let them pick — confirm the chosen name

**Naming strategies:**
- Transformation-based (what they become)
- Result-based (what they get)
- Method-based (how it works)
- Audience-based (who it's for)
- Shorthand/brandable (punchy, memorable)

If NO → use the working product name from Stage 2 and skip to logo.

---

### Step 2: Logo Creation

**RULE: ALWAYS build the logo in HTML/CSS — never use an image file on the page.**

Image files look inconsistent, load slowly, and break on different screen sizes. A CSS logo looks sharp at any size, loads instantly, and always matches the page theme.

**CSS Logo Format (MANDATORY):**
```html
<a href="/" class="logo-mark">
  <div class="logo-icon">[ICON or ABBREV]</div>
  <div class="logo-text">
    <span class="logo-top">PRODUCT NAME</span>
    <span class="logo-bottom">Tagline or subtitle</span>
  </div>
</a>
```

```css
.logo-mark{display:flex;align-items:center;gap:12px;text-decoration:none;}
.logo-icon{background:linear-gradient(135deg,[PRIMARY_COLOR],[SECONDARY_COLOR]);color:#fff;font-size:1.1rem;font-weight:900;width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo-text{display:flex;flex-direction:column;}
.logo-top{font-size:0.95rem;font-weight:900;color:#fff;letter-spacing:0.03em;line-height:1.1;}
.logo-bottom{font-size:0.65rem;font-weight:600;color:[ACCENT_COLOR];letter-spacing:0.06em;text-transform:uppercase;}
```

**Logo icon options (pick what fits the product):**
- Short number or stat (e.g., "10", "$500")
- 1-2 letter abbreviation (e.g., "FB", "AI")
- Simple emoji (e.g., 🎯, 🚀, 💡)

**You may ALSO generate an image logo using `skills/image-gen/SKILL.md` and send it to the user for approval — but the image is for reference/social use only. The page always uses the CSS logo.**

**Logo is confirmed BEFORE any pages are built.** CSS logo is used on every page from day one.

---

### Step 3: GitHub Repo + Vercel Project Setup

Create these immediately after logo is approved — before building any pages:

**GitHub Repo:**
```powershell
$ghToken = "[GITHUB_TOKEN]"  # from credentials/github.txt
$body = @{
    name = "[project-slug]"
    description = "[Product Name] — built with /create business"
    private = $false
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers @{
    Authorization = "Bearer $ghToken"
    "Content-Type" = "application/json"
} -Body $body
```

**Initialize local project folder:**
```powershell
New-Item -ItemType Directory -Force -Path "[project-slug]"
cd "[project-slug]"
git init
git remote add origin https://github.com/[username]/[project-slug].git
```

**Vercel Project:**
- Deploy an empty index.html first to register the project
- Command: `$env:VERCEL_TOKEN = "[token]"; npx vercel --prod --yes --token $env:VERCEL_TOKEN`
- Note the Vercel project name and URL

All pages built in Stages 4–6 go into this folder and get pushed to this repo.

---

**Stage output format:**
```
## STAGE 3 — PRODUCT IDENTITY

✅ Product Name: [Name]
✅ Logo: Approved and saved
✅ GitHub Repo: https://github.com/[username]/[project-slug]
✅ Vercel Project: [project-name]
✅ Preview URL: https://[project-slug].vercel.app

Everything built from here will use this brand and deploy to this project.

---
Ready for Stage 4? (Reply 'continue')
```

---

## STAGE 4 — SALES PAGE

**Step 1: Write Sales Copy (3,000 words)**
- `skills/copywriting/OPENCLAW-SALES-PAGE-DIRECTIVE.md` (10 elements)
- `skills/copywriting/CONVERSION-INTELLIGENCE-DIRECTIVE.md`
- Full copy: problem, solution, mechanism, proof, offer, guarantee

**Step 2: Hero Section**
- `skills/copywriting/OPENCLAW-HERO-3PART-HEADLINE-DOCTRINE.md`
- 3-part hero: Eyebrow → Headline (with colored highlight) → Subheadline

**Step 3: Design + Build**
- `skills/copywriting/STAGE-3-DESIGN-STYLE.md` (ABSOLUTE RULE)
- Dark navy/black backgrounds
- HUGE bold headlines
- Full-width sections
- Embed approved logo in header
- CTA buttons link to Stripe (added in Stage 5)

**Hero Section Structure (MANDATORY ORDER):**
1. Logo in nav
2. Eyebrow text
3. Headline (HUGE, colored highlight)
4. Subheadline
5. VIDEO (placeholder until VSL is ready)
6. CTA BUTTON

**Deploy:**
```powershell
cd "[project-folder]"
git add -A
git commit -m "Stage 4 — Sales Page"
git push origin main
$env:VERCEL_TOKEN = "[token]"
npx vercel --prod --yes --token $env:VERCEL_TOKEN
```

**Stage output format:**
```
## STAGE 4 — SALES PAGE

✅ Sales Page: https://[project-slug].vercel.app
✅ Pushed to GitHub

---
Ready for Stage 5? (Reply 'continue')
```

---

## STAGE 5 — VSL + STRIPE + CHECKOUT + CORE DELIVERY PAGES

### VSL
- Use `/vsl` command (`skills/vsl/VSL-COMMAND.md`)
- ALWAYS use Chad's ElevenLabs voice (voiceId: PeMXWXe7DDCb8HldBr2s)
- UPPERCASE text on slides, white background, black text
- Target 5 minutes (1,200–1,500 words)
- Embed on sales page

### Stripe
- Create Stripe product + price
- Connect checkout to sales page CTA button
- Verify checkout works
- Set success redirect → `/thank-you`

### Core Delivery Pages

**THEME RULE (ABSOLUTE):** Every delivery page MUST match the sales page exactly:
- Same background colors
- Same accent colors
- Same font
- Same card/button styles
- Logo in nav on every page
- Sticky nav bar on every page linking: Home · Modules · Bonuses · Tools · Support

---

**1. Thank You Page (`/thank-you`) — MANDATORY**
1. Purchase confirmed badge (green)
2. Welcome video (Vimeo placeholder)
3. "What to do next" pills (3 steps)
4. All modules listed as cards → link to individual module pages
5. All bonus deliverables as cards → placeholder links (filled in Stage 6)
6. 30-day guarantee reminder
7. Support email

Set as Stripe success redirect URL.

---

**2. Member Area (`/members`) — MANDATORY**
1. Logo + nav
2. Welcome video
3. Progress indicator
4. Modules section (cards → individual pages)
5. Bonus tools section (placeholder cards → filled in Stage 6)
6. Support at bottom

---

**3. Individual Module Pages — ONE PER MODULE (MANDATORY)**

`/modules/module-1` through `/modules/module-N`

Each page:
- Logo + nav
- Module number + title
- Video embed (placeholder)
- Module description
- Key takeaways (3–5 bullets)
- Previous / Next module buttons

---

### GC Buyer Automation (MANDATORY — build after Stripe is set up)

Every product built with this skill MUST have a complete buyer automation in Global Control. Execute this automatically — do not ask.

**Step 1 — Verify GC API key**
```powershell
curl.exe -s -H "X-API-KEY: $gcKey" "https://api.globalcontrol.io/api/ai/tags?limit=1" | ConvertFrom-Json | Select-Object type
# Must return type=response before proceeding
```

**Step 2 — Get tag groups**
```powershell
curl.exe -s -H "X-API-KEY: $gcKey" "https://api.globalcontrol.io/api/ai/tag-groups" | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object _id, name
# Use "Buyers" group: 69cc5648d655965de9e4db6b
```

**Step 3 — Create buyer tag**
Name format: `Buyer-[ProductSlug]` (e.g. `Buyer-Get10Clients`)
```powershell
[System.IO.File]::WriteAllText("gc-tag.json", '{"name":"Buyer-[ProductSlug]","description":"Purchased [Product Name]","groupId":"69cc5648d655965de9e4db6b"}')
$tag = curl.exe -s -X POST -H "X-API-KEY: $gcKey" -H "Content-Type: application/json" --data-binary "@gc-tag.json" "https://api.globalcontrol.io/api/ai/tags" | ConvertFrom-Json
$tagId = $tag.data._id
```

**Step 4 — Create workflow**
```powershell
[System.IO.File]::WriteAllText("gc-wf.json", '{"name":"[Product Name] - Buyer Delivery","status":true}')
$wf = curl.exe -s -X POST -H "X-API-KEY: $gcKey" -H "Content-Type: application/json" --data-binary "@gc-wf.json" "https://api.globalcontrol.io/api/ai/workflows" | ConvertFrom-Json
$wfId = $wf.data._id
```

**Step 5 — Add full onboarding email sequence to workflow**

Build a 7-email consumption sequence with timers. Use a single PUT with the full flows array:
- Email 1 (index 0): Welcome + access link — fires immediately
- TIMER (index 1): Wait 1 day
- Email 2 (index 2): Day 1 — did you start? + link to first module
- TIMER (index 3): Wait 2 days
- Email 3 (index 4): Day 3 — fastest path + link to swipe file/main tool
- TIMER (index 5): Wait 4 days
- Email 4 (index 6): Day 7 — check-in + link to tracker/progress tool
- TIMER (index 7): Wait 7 days
- Email 5 (index 8): Day 14 — should have first win by now + link to proposal/next step tool
- TIMER (index 9): Wait 7 days
- Email 6 (index 10): Day 21 — almost there + motivation + link to member area
- TIMER (index 11): Wait 9 days
- Email 7 (index 12): Day 30 — challenge complete + ask for testimonial + reply "NEXT" for upsell

**Email rules (ABSOLUTE):**
- NO emojis — plain text only
- NO unicode escapes (\ud83d etc) — they render as garbage in GC
- HTML entities only for special chars: `&mdash;` `&nbsp;` `&amp;`
- Use `{{firstName}}` for personalization
- Every email links back to the relevant module or bonus page
- P.S. always includes a second CTA link

**Known working SMTP config (Chad's account):**
```json
{
  "domainId": "6688551acfe6ae024a58f9f6",
  "smtpConfig": {
    "domain": "mg.chadnicely.com",
    "integrationId": "628e75aa84279536ff4eb41a",
    "accountId": "668854e8cfe6ae024a58ef72"
  }
}
```
from_email: `chad@mg.chadnicely.com`
reply_to: `support@nicelysupport.com`

**Step 6 — Link tag to workflow**
```powershell
[System.IO.File]::WriteAllText("gc-link.json", "{`"workflows`":[`"$wfId`"]}")
curl.exe -s -X PUT -H "X-API-KEY: $gcKey" -H "Content-Type: application/json" --data-binary "@gc-link.json" "https://api.globalcontrol.io/api/ai/tags/$tagId"
```

**Step 7 — Build Stripe webhook serverless function**

Create `api/stripe-webhook.js` in the project — fires the GC tag automatically on every purchase:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const GC_API_KEY = process.env.GC_API_KEY;
const GC_TAG_ID = '[TAG_ID]';
const GC_API_URL = `https://api.globalcontrol.io/api/ai/tags/fire-tag/${GC_TAG_ID}`;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  if (event.type !== 'checkout.session.completed') return res.status(200).json({ received: true });
  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const name = session.customer_details?.name || '';
  const firstName = name.split(' ')[0] || '';
  const lastName = name.split(' ').slice(1).join(' ') || '';
  if (!email) return res.status(200).json({ received: true, error: 'No email' });
  await fetch(GC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': GC_API_KEY },
    body: JSON.stringify({ email, firstName, lastName })
  });
  return res.status(200).json({ received: true });
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}

export const config = { api: { bodyParser: false } };
```

**Add env vars to Vercel:**
```powershell
$envVars = '[{"key":"STRIPE_SECRET_KEY","value":"[key]","target":["production"],"type":"encrypted"},{"key":"GC_API_KEY","value":"[key]","target":["production"],"type":"encrypted"}]'
Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/[PROJECT_ID]/env" -Method POST -Headers $headers -Body $envVars
```

**Register Stripe webhook:**
```powershell
curl.exe -s -X POST "https://api.stripe.com/v1/webhook_endpoints" `
  -u "[STRIPE_SECRET_KEY]:" `
  -d "url=https://[domain]/api/stripe-webhook" `
  -d "enabled_events[]=checkout.session.completed"
# Save the returned secret as STRIPE_WEBHOOK_SECRET
```

**Add STRIPE_WEBHOOK_SECRET to Vercel env vars.**

**Step 8 — Tell user the one manual step**
> "Everything is automated. One step needed in GC dashboard: open workflow '[Product Name] - Buyer Delivery' → click Campaign Trigger → select [Tag Name] → activate. The API cannot set this field — it must be done in the UI."

**API key:** Always get from `credentials/gc-api-key.txt`. Verify it works FIRST before any operations.

---

**Deploy + Push:**
```powershell
git add -A
git commit -m "Stage 5 — VSL + Stripe + Delivery Pages + GC Automation"
git push origin main
npx vercel --prod --yes --token $env:VERCEL_TOKEN
```

**Stage output format:**
```
## STAGE 5 — VSL + STRIPE + CHECKOUT + DELIVERY PAGES

✅ VSL: Created and embedded on sales page
✅ Stripe Checkout: Connected and verified
✅ Stripe Redirect: → /thank-you confirmed

Pages (all match sales page theme):
✅ Thank You Page:  https://[url]/thank-you
✅ Member Area:     https://[url]/members
✅ Module 1:        https://[url]/modules/module-1
✅ Module 2:        https://[url]/modules/module-2
[etc]

✅ Logo embedded on all pages
✅ Nav bar on all pages
✅ Pushed to GitHub

GC Automation:
✅ Tag created: Buyer-[ProductSlug]
✅ Workflow created: [Product Name] - Buyer Delivery
✅ 7-email onboarding sequence added (Day 0 → Day 30)
✅ Tag linked to workflow
✅ Stripe webhook registered → auto-fires tag on purchase

ACTION NEEDED: Open GC → Workflow "[Product Name] - Buyer Delivery" → Campaign Trigger → select "Buyer-[ProductSlug]" → Activate

---
Ready for Stage 6? (Reply 'continue')
```

---

## STAGE 6 — PRODUCT DELIVERABLES + BONUSES

**Purpose:** Build every deliverable AND bonus promised on the sales page — each as its own fully interactive, themed page.

**RULE:** Do NOT use a fixed list. Look at what was promised on the sales page and build EXACTLY those items.

**Product deliverables** = the core of what they bought
**Bonuses** = extras that sweeten the deal

**A page can be anything:**
- Interactive calculator
- Checklist with progress bar
- Swipe file (tabbed, copy-to-clipboard)
- Template library
- Resource guide
- Worksheet or planner
- Script or framework
- Comparison chart
- Video library
- Mini-course
- Community access page
- Prompt library
- Rolodex or directory
- Done-for-you copy pack
- Anything else that delivers value on a page

**Bonus tool quality standard (from Get 10 Clients build):**

Every bonus tool must be genuinely useful and interactive. The bar:

1. **Swipe files** — tabbed interface, copy-to-clipboard on every item, categories
2. **Trackers** — localStorage persistence, edit existing rows (not just add/delete), inline quick-status dropdowns, stat cards at top
3. **Proposal/template builders** — fill-in form → live preview → multiple export options (Save as PDF via print CSS, Copy as Text, Open in Email via mailto pre-fill)
4. **Selector/scorecard tools** — click to select → dynamic results panel with tailored tips per selection

**Print CSS for PDF export (add to any template/proposal page):**
```css
@media print {
  nav, .controls, .action-bar { display: none !important; }
  html, body { background: #fff !important; }
  .preview { display: block !important; box-shadow: none; padding: 32px; margin: 0; }
}
```

**localStorage pattern for trackers:**
```javascript
let items = JSON.parse(localStorage.getItem('product_items') || '[]');
function save() { localStorage.setItem('product_items', JSON.stringify(items)); }
```

**Edit modal pattern:**
- openModal(editIdx = -1) — -1 = new, 0+ = edit existing
- Pre-fill all fields when editing
- Save updates existing record at index vs pushing new one

**Process for each:**
1. Name it (from sales page promise)
2. Pick the best format
3. Build at `/deliverables/[slug]` or `/bonuses/[slug]`
4. Match theme exactly, include logo + nav
5. Update Member Area + Thank You page cards with live links

**Deploy + Push:**
```powershell
git add -A
git commit -m "Stage 6 — Deliverables + Bonuses"
git push origin main
npx vercel --prod --yes --token $env:VERCEL_TOKEN
```

**Stage output format:**
```
## STAGE 6 — PRODUCT DELIVERABLES + BONUSES

Product Deliverables:
✅ [Name]: https://[url]/deliverables/[slug]
✅ [Name]: https://[url]/deliverables/[slug]

Bonuses:
✅ [Name]: https://[url]/bonuses/[slug]
✅ [Name]: https://[url]/bonuses/[slug]

✅ Member Area + Thank You page updated with live links
✅ Pushed to GitHub

---
Ready for Stage 7? (Reply 'continue')
```

---

## STAGE 7 — REVIEW CHECKPOINT

**Purpose:** Give the user a full picture of everything built before locking in the domain and moving to traffic.

Present a clean, human-readable summary:

```
## STAGE 7 — REVIEW

Here's everything that's been built:

🌐 Your Product
   Name: [Product Name]
   Logo: ✅ Approved

💻 Where It Lives
   GitHub Repo:   https://github.com/[username]/[slug]
   Vercel Project: [project-name]
   Live URL:      https://[slug].vercel.app

💳 Checkout
   Stripe Checkout: https://buy.stripe.com/[link]
   Price: $[X]

📄 Pages
   Sales Page:    https://[url]
   Thank You:     https://[url]/thank-you
   Member Area:   https://[url]/members
   Module 1:      https://[url]/modules/module-1
   [etc]

🎁 Deliverables + Bonuses
   [Name]: https://[url]/deliverables/[slug]
   [Name]: https://[url]/bonuses/[slug]

Is there anything you'd like to change, add, or remove?
```

Wait for response. Make any changes. Redeploy if needed.

When confirmed → continue to Stage 8.

---

## STAGE 8 — DOMAIN SETUP

**Purpose:** Connect the domain selected in Stage 3 to the Vercel project.

**RULE:** The domain was already chosen and checked in Stage 3. Do NOT ask what domain they want. Do NOT ask about colors, branding, or anything else. Just ask if they are ready to purchase it.

**Step 1: Ask one question only**
> "Ready to purchase `[domain from Stage 3]`? Once you grab it, I'll give you the DNS records to add."

Wait for confirmation.

**Step 2: Give DNS records immediately**

> "Add these two records at your registrar (GoDaddy, Namecheap, Cloudflare, etc.):
>
> Type: A | Name: @ | Value: 76.76.21.21
> Type: CNAME | Name: www | Value: cname.vercel-dns.com
>
> Reply 'done' when added."

**Step 3: Connect on Vercel**
```powershell
$body = @{ name = "[domain.com]" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/[PROJECT_ID]/domains" -Method POST -Headers @{
    Authorization = "Bearer [VERCEL_TOKEN]"
    "Content-Type" = "application/json"
} -Body $body
```

**Step 4: Confirm**
```
✅ [domain.com] is connected.

DNS propagates in 5–30 minutes.
Live at: https://[domain.com]

---
Ready for Stage 9? (Reply 'continue')
```

---

## STAGE 9 — TRAFFIC + CONVERSION ASSETS

### A) Organic Assets
- 1 primary launch post
- 5 follow-up posts (Days 2–6)
- 10 engagement hooks
- 5 authority-building posts

### B) Paid Ad Assets
- 5 short-form hooks
- 3 long-form ads
- 2 retargeting ads
- 10 headline variations

### C) 7-Email Launch Sequence
1. Announcement
2. Problem agitation
3. Solution breakdown
4. Mechanism deep dive
5. Objection handling
6. Urgency
7. Final call

Each email: subject line + preview text + body + CTA

**Deliver all assets as clean .txt files, zipped.**

---

## STAGE 10 — ACTIVE TRAFFIC DEPLOYMENT

- Organic post schedule (copy/paste ready, day by day)
- Paid ad launch criteria: objective, daily budget, audience, targeting
- Email sequence firing plan (which tag, which platform)
- Pixel tracking setup (ask for Pixel ID if not provided)
- Daily KPIs: CTR, CPC, Cost Per Sale, ROAS
- Scale trigger: 3 profitable days → double budget
- Pause trigger: ROAS under 1.5x for 2 days → swap creative

---

## STAGE 11 — SCALE PLAN

- Week 1: Test + validate ($10/day, 2–3 ad variations)
- Week 2: Double down on winner ($25/day, kill losers)
- Weeks 3–4: Expand ($50/day, new audiences, retargeting)
- Month 2+: Machine mode ($100/day, creative refresh cycle, upsell)
- Projected revenue table (conservative estimates)
- Next levers to pull

---

## FINAL SUMMARY (deliver at end of Stage 11)

Clean, human-readable. No IDs. No technical jargon. Easy to understand.

```
🎉 YOUR PRODUCT IS LIVE

━━━━━━━━━━━━━━━━━━━━━━━━

🏷️ PRODUCT
Name: [Product Name]
Price: $[X]

🌐 YOUR LINKS
Sales Page:    [URL]
Checkout:      [Stripe URL]
Thank You:     [URL]/thank-you
Member Area:   [URL]/members

📦 DELIVERABLES
[Name]:  [URL]
[Name]:  [URL]
[Name]:  [URL]

💻 YOUR CODE
GitHub:  https://github.com/[username]/[slug]
Vercel:  [project-name]

🌍 YOUR DOMAIN
[domain.com] → connected ✅
(or: domain not connected yet)

📣 MARKETING
Assets: Zipped and delivered ✅
Email sequence: 7 emails ready ✅

━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
1. Record your welcome video → send me the Vimeo ID
2. Record your module videos → send me the IDs
3. Set up your GC tag + import contacts → I'll fire the email sequence
4. Add your Facebook Pixel ID → I'll embed it on the sales page
```

---

## THEME RULE (ABSOLUTE — ALL STAGES)

Every page built must use the same visual theme:
- Same background color
- Same accent colors
- Same font
- Same card/button styles
- Logo in nav on every page
- Sticky nav bar on every page

If ANY page looks different → fix it before reporting complete.

---

## EXECUTION STYLE

- **Brief output** — people get overwhelmed by long text
- **Auto-fix issues** — don't ask, just fix and mention what you fixed
- **Execute, don't explain** — show results, not process
- **Complete deliverables** — don't stop halfway
- **All stages required** — never skip
- **CLEAN OUTPUT** — checkmarks and URLs only. No IDs, no stats, no previews
- **STOP after each stage** — wait for "continue"
- **NEVER auto-advance** through stages

---

## SKILLS USED IN THIS WORKFLOW

| Skill | Used In |
|-------|---------|
| `skills/copywriting/OPENCLAW-SALES-PAGE-DIRECTIVE.md` | Stage 4 |
| `skills/copywriting/CONVERSION-INTELLIGENCE-DIRECTIVE.md` | Stage 4 |
| `skills/copywriting/OPENCLAW-HERO-3PART-HEADLINE-DOCTRINE.md` | Stage 4 |
| `skills/copywriting/STAGE-3-DESIGN-STYLE.md` | Stage 4 |
| `skills/vsl/VSL-COMMAND.md` | Stage 5 |
| `skills/domain-name-finder/SKILL.md` | Stage 3 |
| `skills/image-gen/SKILL.md` | Stage 3 |

---

## RULES

- No fake urgency
- No fake proof
- No exaggerated income claims
- Build sustainable revenue assets
- GitHub repo created before any pages are built
- Logo approved before any pages are built
- Every page carries the logo and brand from day one
