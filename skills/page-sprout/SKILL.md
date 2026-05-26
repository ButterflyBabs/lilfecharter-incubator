# Page Sprout Skill (PopLinks)

**🎯 TRIGGER:** `/poplink`, `/leadstep`, `/bridge page`

**⚡ EXECUTION STYLE:** Fast, minimal questions, just URLs

---

## Commands

### 1. `/poplink`

**Purpose:** Create a shortened tracking link

**THE ONLY QUESTION:** "What's the destination?"

**Then automatically:**
1. Use **chadnicely.com** as domain (unless user specifies different)
2. Pick best slug from destination URL (e.g., walmart.com → walmart)
3. Create poplink via API
4. Return the URL

**CRITICAL - SLUG FORMAT:**
- ❌ NEVER use "/" in front of slug: `visible_url = '/jvzoo'` ← WRONG
- ✅ ALWAYS omit the slash: `visible_url = 'jvzoo'` ← CORRECT

**NEVER ASK:**
- ❌ What domain?
- ❌ What slug?
- ❌ Any other questions

**Just: destination → execute → return URL.**

**Example:**
```
User: /poplink
Me: What's the destination?
User: https://walmart.com
Me: ✅ chadnicely.com/walmart
```

---

### 2. `/leadstep`

**Purpose:** Create a lead capture page with thank you page

**THE ONLY QUESTION:** "What's the hook?"

**Then automatically:**
1. Create lead page (no template_id - let it default)
2. Set domain: **chadnicely.com** (domain_id = 1977)
3. Pick best URL slug from hook
4. Create 3-line headline with `<br>` tags and HTML formatting (`<b>`, `<i>`, `<u>`)
5. Add pre-headline and post-headline
6. Add 5 mechanism-based bullets
7. Return **ONLY 2 URLs**

**CRITICAL RULES:**
- ✅ NO template_id in creation (defaults work)
- ✅ domain_id = 1977 (chadnicely.com)
- ✅ 3-line headline with `<br>` tags
- ✅ Use HTML formatting (`<b>`, `<i>`, `<u>`)
- ✅ 5 mechanism-based bullets
- ✅ Return **ONLY 2 URLs** (no explanations, no metadata)

**NEVER:**
- ❌ Ask about page name
- ❌ Ask about domain choice
- ❌ Ask about URL slug
- ❌ Show SEO metadata
- ❌ Show images
- ❌ Show detailed breakdowns
- ❌ Return anything except the 2 URLs

**Example:**
```
User: /leadstep
Me: What's the hook?
User: Making Money With TikTok
Me: https://chadnicely.com/tiktok-money
   https://chadnicely.com/tiktok-money-thanks
```

---

### 3. `/bridge page`

**Purpose:** Create a bridge page (pre-sale page that warms up visitors)

**THE ONLY QUESTION:** "What's the destination?"

**Then automatically:**
1. Get destination URL
2. Ask which course/product this is for (if not clear)
3. Create bridge page via API
4. Set URL slug based on destination
5. Return the bridge page URL

**Example:**
```
User: /bridge page
Me: What's the destination?
User: https://go.openclawcracked.com/simonspecial
Me: ✅ chadnicely.com/simonspecial
```

---

## API Details

**Base URL:** `https://api.poplinks.io/api/ai`

**Authentication:** `Bearer UYUp3qUqz4u289du8UWK8B60rRbzG7N5`

### PopLinks Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| List all | GET | `/poplinks` |
| Create | POST | `/poplinks` |
| Clone | POST | `/poplinks/:id/clone` |

### Lead Page Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Create | POST | `/lead-pages` |
| Update URL | PUT | `/lead-pages/:id/url` |
| Update Headline | PUT | `/lead-pages/:id/headline` |
| Update Pre-Headline | PUT | `/lead-pages/:id/pre-headline` |
| Update Post-Headline | PUT | `/lead-pages/:id/post-headline` |
| Update Bullets | PUT | `/lead-pages/:id/bullets` |

### Bridge Page Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| List all | GET | `/bridge-pages` |
| Create | POST | `/bridge-pages` |
| Clone | POST | `/bridge-pages/:id/clone` |
| Update URL | PUT | `/bridge-pages/:id/url` |

---

## Domain Info

**chadnicely.com (ID: 1977)** — Default domain for all pages

Other personal domains available if needed.

---

## Critical Rules (MEMORIZED)

1. **Ask ONE question only**
2. **Figure out everything else automatically**
3. **Return ONLY URLs** (no fluff, no metadata)
4. **Never show SEO, images, or details**
5. **Fast execution, no delays**

**SKILL CREATED:** 2026-03-16
