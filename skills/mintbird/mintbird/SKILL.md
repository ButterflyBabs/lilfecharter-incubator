# MintBird Skill

**🎯 TRIGGER:** `/sales offer`, `/sales page`, `/funnel`

**⚡ EXECUTION STYLE:** Complete workflows with products linked

---

## Critical MintBird Rule

**EVERY sales page, upsell, downsell, or funnel step MUST:**
1. Have a **product created**
2. Have that **product linked to the page**

**NEVER skip product creation + linking.**

---

## Commands

### 1. `/sales offer` ⭐ NEW

**Purpose:** Create a complete sales page with product and checkout (enhanced workflow)

**STEP 1: Get the Big Idea/Hook**

**Ask:** "What's the big idea/hook for this offer?"

*(User provides the hook/angle)*

**STEP 2: Order Form Type**

**Ask:** "Do you want:
- **Button** that goes to checkout
- **Order Form** embedded on the page"

**STEP 3: If Order Form Selected**

**Ask:** "One Step or Two Step order form?"

*(One Step = all fields on one page, Two Step = email first, then details)*

**STEP 4: Generate Everything**

**Then automatically:**
1. **Generate Product Name** — Based on the hook (creates compelling name)
2. **Generate Sales Page** via AI with:
   - `is_orderform`: `true` or `false` (based on choice)
   - `orderform_step`: `"one"` or `"two"` (if order form selected)
3. **Create URL Slug** — Auto-generate from product name (e.g., "TikTok Cash System" → `tiktok-cash`)
4. **Use Domain:** `chadnicely.com` (domain_id: 1977)
5. **Create Product** in MintBird:
   - Name from generated name
   - Price (ask if not clear from context)
   - Type: "digital"
   - Payment: Stripe (ID: 640)
6. **Link Product** to sales page via `/sales-pages/link-product`

**STEP 5: Return Results**

```
✅ SALES OFFER CREATED!

Product: [Generated Name]
Price: $[amount]

Sales Page: https://chadnicely.com/[slug]
Checkout: https://chadnicely.com/[slug]/checkout (or embedded)

Product ID: [id]
Page ID: [id]
```

**Example:**
```
User: /sales offer
Me: What's the big idea/hook?
User: Help people make money with TikTok without dancing
Me: Button or Order Form on page?
User: Order Form
Me: One Step or Two Step?
User: Two Step
Me: [generates "TikTok Silent Profit System", creates page with 2-step form, creates product, links them]
Me: ✅ Product: TikTok Silent Profit System
   Sales Page: https://chadnicely.com/tiktok-silent-profit
   Checkout: Embedded 2-step
```

---

### 3. `/sales page`

**Purpose:** Create a complete sales page with product and checkout

**STEP 1: Ask Order Form Questions**

1. **"Do you want to add an Order Form to the sales page?"** (Yes/No)
2. **If Yes:** "How many steps should the Order Form have?" (One Step/Two Steps)

**STEP 2: Get Product Details**

Ask for:
- Product name
- Target audience
- Result/benefit
- Price

**STEP 3: Generate Sales Page**

**API Parameters:**
- `prompt`: Product description
- `name`: Product name
- `sub_type`: "salespage"
- `is_orderform`: `true` or `false`
- `orderform_step`: `"one"` or `"two"` (if is_orderform = true)

**Logic:**
- No → `is_orderform = false`
- Yes + One Step → `is_orderform = true`, `orderform_step = "one"`
- Yes + Two Steps → `is_orderform = true`, `orderform_step = "two"`

**STEP 4: Create Product (MANDATORY)**

After sales page is generated:
1. Create product via `POST /products`:
   - Body: `{name, description, price, type: "digital", payment_provider: "stripe", payment_integration_id: 640}`
2. Link product to sales page via `POST /sales-pages/link-product`:
   - Body: `{sales_page_id, product_id, payment_option_type: "dropdown", is_one_time_payment: 1}`
3. Return: Sales page URL + Order form URL

**Example:**
```
User: /sales page
Me: Do you want to add an Order Form? (Yes/No)
User: Yes
Me: One Step or Two Steps?
User: One Step
Me: What's the product name?
User: TikTok Growth System
Me: [generates page, creates product, links them]
Me: ✅ Sales Page: https://...
   Order Form: https://...
```

---

### 4. `/funnel`

**Purpose:** Create a complete sales funnel with multiple pages

**PHASE 1 — Main Offer Setup**

**STEP 1:** Ask "What's the big idea/hook for this offer?"

**STEP 2:** Ask "Do you want:
1. **Button** that goes to checkout
2. **Order Form** embedded on the page"

**STEP 3:** If Order Form selected, ask "One Step or Two Step order form?"

**STEP 4:** Generate automatically:
1. **Product Name** — Create compelling name from hook
2. **Sales Page** — Generate via AI with:
   - `is_orderform`: `true` or `false` (based on choice)
   - `orderform_step`: `"one"` or `"two"` (if order form)
3. **URL Slug** — Auto-generate from product name
4. **Domain** — Use `chadnicely.com` (domain_id: 1977)
5. **Product** — Create in MintBird:
   - Name from generated name
   - Price (ask if not clear)
   - Type: "digital"
6. **Link** — Connect product to sales page

**Payment Setup:** Stripe via Nicely Media LLC (ID: 640) — Set once at funnel level after funnel creation

**PHASE 2 — Upsells**

**STEP 5:** Ask "How many upsells do you want?"

**STEP 6:** Look at original offer → Create **consistent & congruent** upsells:
- Must logically extend the main offer
- Same niche/topic
- Higher price (Upsell #1 < Upsell #2 < Upsell #3)

**STEP 7:** Wait for approval on upsells

**PHASE 3 — Build Everything**

**STEP 8:** Once approved, execute all at once:
1. Generate all upsell pages via AI (simultaneously)
2. Create products for each upsell
3. Link products to upsell pages
4. Create funnel container
5. Connect all pages as funnel steps
6. **Set Payment Provider** — Configure Stripe via Nicely Media LLC (ID: 640) at funnel level for all products

**PHASE 4 — Simple Report**

Return clean summary:
```
✅ FUNNEL COMPLETE!

Product: [Name]
Price: $[amount]
URL: https://chadnicely.com/[slug]

Upsell #1: [Name] — $[amount]
Upsell #2: [Name] — $[amount]

Funnel ID: [id]
Payment: Stripe (Nicely Media LLC)
```

**When suggesting upsells:**
- If they want 2 → suggest 2 options
- If they want 3 → suggest 3 options
- **Prices MUST increase** (Upsell #1 < Upsell #2 < Upsell #3)

**Upsell Suggestion Format:**
```
---

### **UPSELL #1**

**Name:** [Name]

**What it helps:**  
[Description]

**Price:** $[amount]

---

### **UPSELL #2**

**Name:** [Name]

**What it helps:**  
[Description]

**Price:** $[amount]

---
```

**After suggestions approved:**
- **BUILD ALL UPSELLS AT ONCE** (not one at a time)
- Generate all pages via API simultaneously
- Create products for each
- Link products to each upsell page
- Return ALL URLs

**PHASE 4 — Create Funnel Container & Connect Pages**

**Step 1: Create the funnel container:**
```powershell
$funnelBody = @{
    name = "[Funnel Name]"
    description = "[Description]"
} | ConvertTo-Json

$funnel = Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/sales-funnels" -Method Post -Headers $headers -Body $funnelBody
$funnelId = $funnel.data.sales_funnel.id
```

**Step 2: Add pages as funnel steps:**
```powershell
# Step 1: Sales Page
$step1 = @{
    sales_page_id = [sales_page_id]
    step_type = "sales_page"
    name = "[Step Name]"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/sales-funnels/$funnelId/steps" -Method Post -Headers $headers -Body $step1

# Step 2: Upsell  
$step2 = @{
    sales_page_id = [upsell_page_id]
    step_type = "upsell"
    name = "[Step Name]"
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.poplinks.io/api/ai/sales-funnels/$funnelId/steps" -Method Post -Headers $headers -Body $step2
```

**FUNNEL COMPLETE!**

**Example:**
```
User: /funnel
Me: [Stage 1 questions]
User: [answers]
Me: Summary approved?
User: Yes
Me: [generates sales page]
Me: How many upsells?
User: 2
Me: [suggests 2 upsells]
User: Good
Me: [builds everything, creates products, links them, creates funnel container]
Me: ✅ Funnel Complete!
   Sales Page → $27
   Upsell #1 → $67
   Upsell #2 → $197
```

---

## API Details

**Base URL:** `https://api.poplinks.io/api/ai`

**Authentication:** `Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW`

### Sales Page Generation

**Async Process:**
1. Start generation: `POST /sales-page/generate`
2. Poll for completion: `GET /sales-page/status/{job_key}`
3. Typical completion: 60-120 seconds

### Product Creation

```http
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 27.00,
  "type": "digital",
  "payment_provider": "stripe",
  "payment_integration_id": 640
}
```

### Link Product to Sales Page

```http
POST /sales-pages/link-product
Content-Type: application/json

{
  "sales_page_id": 12345,
  "product_id": 67890,
  "payment_option_type": "dropdown",
  "is_one_time_payment": 1
}
```

### Funnel Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Create Funnel | POST | `/sales-funnels` |
| Add Step | POST | `/sales-funnels/{id}/steps` |
| List Steps | GET | `/sales-funnels/{id}/steps` |

---

## Payment Integration

**Default:** Stripe via Nicely Media LLC (ID: 640)

---

## Critical Rules

1. **ALWAYS create product** (can't skip)
2. **ALWAYS link product** to page (or checkout won't work)
3. **Poll for AI generation** (60-120 seconds typical)
4. **Get approval** between phases
5. **Build upsells all at once** (not one by one)

**SKILL CREATED:** 2026-03-16
