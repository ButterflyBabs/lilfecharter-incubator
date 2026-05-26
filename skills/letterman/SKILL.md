---
name: letterman
description: Letterman newsletter platform API for managing publications, articles, and AI-generated content. Use when asked to create articles, manage publications, update SEO settings, check URL availability, or generate article content from URLs/text.
---

# Letterman Skill

Letterman is a newsletter/article management platform with AI content generation.

## Credentials

**Check in this order:**

1. **Gateway config** (for distributed installs):
   ```
   skills.entries.letterman.apiKey
   ```

2. **Credentials file** (for workspace setups):
   ```
   credentials/titanium-api-keys.txt
   ```
   Key name: `Letterman`

3. **Ask user** if neither exists

**API Setup:**
- **Header:** `Authorization: Bearer {jwt_token}`
- **Base URL:** `https://api.letterman.ai/api/ai`

## Available AI Models

| Model | Key | Notes |
|-------|-----|-------|
| OpenAI GPT | `OPEN_AI` | Default, reliable |
| Google Gemini | `GOOGLE_GEN_AI` | Alternative |
| xAI Grok | `GROK` | Newer option |
| Anthropic Claude | `CLAUDE` | Quality writing |

---

## Quick Reference - All Endpoints

### User
| Action | Method | Endpoint |
|--------|--------|----------|
| Get current user | GET | `/user` |

### Publications
| Action | Method | Endpoint |
|--------|--------|----------|
| List publications | GET | `/newsletters-storage` |

### Articles (Newsletters)
| Action | Method | Endpoint |
|--------|--------|----------|
| List articles | GET | `/newsletters-storage/{storageId}/newsletters?state={state}&type=ARTICLE` |
| Create article | POST | `/newsletters` |
| Get article | GET | `/newsletters/{id}` |
| **Update article** | PUT | `/newsletters/{id}` |
| **Delete article** | DELETE | `/newsletters/{id}` |
| Check URL path | POST | `/newsletters/check-url-path` |
| Update SEO | POST | `/newsletters/update-seo-settings/{id}` |
| Update summary | POST | `/newsletters/update-article-summary/{id}` |
| Add to newsletter cue | POST | `/newsletters/update-add-to-newsletter-cue/{id}` |
| Add to news feed | POST | `/newsletters/update-add-to-news-feed/{id}` |
| Get keyword suggestions | POST | `/newsletters/get-suggested-article-keywords` |

### Sections (Content Blocks)
| Action | Method | Endpoint |
|--------|--------|----------|
| **List sections** | GET | `/newsletters/{newsletterId}/sections` |
| **Create section** | POST | `/newsletters/{newsletterId}/sections` |
| **Get section** | GET | `/newsletters/{newsletterId}/sections/{id}` |
| **Update section** | PUT | `/newsletters/{newsletterId}/sections/{id}` |
| **Delete section** | DELETE | `/newsletters/{newsletterId}/sections/{id}` |

### Images
| Action | Method | Endpoint |
|--------|--------|----------|
| **Upload images** | POST | `/images` (multipart/form-data) |

---

## Key Publication IDs

| Publication | ID | Domain |
|-------------|-----|--------|
| West Valley Shoutouts | 677895a2584a3ce5878fcf5b | westvalleyshoutouts.com |
| Summerlin Shoutouts | 66569dc96c58db7f4dfff4a5 | summerlinshoutouts.com |
| Save The Doggy | 68a78eba3ce3e647df7fefaa | savethedoggy.com |
| Vegas Fork | 68a790aa3ce3e647df7ff272 | vegasfork.com |
| Summerlin Hair Salons | 68bc9ab49f0ba7c81fd95a90 | summerlinhairsalons.com |
| United Patriots | 68cd923993abe8e0c5d90e4e | unitedpatriotsassocation.com |
| Summerlin Small Business | 68d71b009810d7125b9480e7 | (no domain yet) |

---

## Create Article - 3 Modes

### WARNING BEFORE CREATING ANY ARTICLE — ASK USER:
1. **Blank or AI-generated?**
2. **Local or Niche?** (for SEO strategy)
3. **How many words?**
4. **Image URL or generate one?**
5. **Check the content bank?**

---

### Mode 1: AI from URL

```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "URL",
    "url": "https://example.com/source-article",
    "wordsCount": 200,
    "keywords": "tech,innovation",
    "imageUrl": "https://example.com/image.jpg",
    "aiModel": "OPEN_AI"
  }
}
```

### Mode 2: AI from Content

```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "CONTENT",
    "content": "Your raw text content...",
    "wordsCount": 200,
    "keywords": "tech,innovation",
    "aiModel": "OPEN_AI"
  }
}
```

---

### WARNING Mode 3: keepOriginal (NO AI Processing) - CRITICAL!

**When I write an article myself, USE THIS MODE.**

When `keepOriginal: true` is set, the API will:
- **NOT** process content through AI
- **NOT** modify your headline, content, or summary
- Use your provided data **exactly** as submitted
- Skip AI model requirement entirely

```json
POST /newsletters
{
  "storageId": "{publication_id}",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "CONTENT",
    "keepOriginal": true,
    "headline": "Your Exact Title - No AI Changes",
    "subHeadline": "Your exact subtitle",
    "content": "<p>Your exact HTML content preserved without AI processing.</p>",
    "keywords": ["keyword1", "keyword2"],
    "imageUrl": "https://example.com/image.jpg",
    "summary": {
      "title": "Summary Title",
      "description": "Summary description",
      "imageUrl": "https://example.com/image.jpg",
      "content": "<p>Summary HTML content</p>"
    }
  }
}
```

---

## Update Article (PUT)

**NEW!** Direct update endpoint for existing articles:

```json
PUT /newsletters/{id}
{
  "title": "Updated Article Title",
  "description": "Updated article description.",
  "keywords": ["updated-keyword-1", "updated-keyword-2"],
  "state": "DRAFT"
}
```

**Updatable Fields:**
- `name`, `title`, `description`
- `subject`, `preHeader` (for email)
- `imageUrl`
- `keywords`
- `state` (DRAFT, APPROVED, PUBLISHED)
- `settings`, `style`

---

## Complete Article Update Reference (TESTED 2026-02-13)

### All Updatable Fields & Endpoints

| Field | Endpoint | Body Field |
|-------|----------|------------|
| **Headline** | `PUT /newsletters/{id}/sections/{sectionId}` | `title` |
| **Subheadline** | `PUT /newsletters/{id}/sections/{sectionId}` | `promptOutPut` |
| **Content (body)** | `PUT /newsletters/{id}/sections/{sectionId}` | `promptOutPut` |
| **Hero Image** | `PUT /newsletters/{id}/sections/{sectionId}` | `imageUrl` |
| **SEO Title** | `POST /newsletters/update-seo-settings/{id}` | `title` |
| **SEO Description** | `POST /newsletters/update-seo-settings/{id}` | `description` |
| **URL Slug** | `POST /newsletters/update-seo-settings/{id}` | `urlPath` |
| **Preview Image** | `POST /newsletters/update-seo-settings/{id}` | `previewImageUrl` |
| **Archive Thumbnail** | `POST /newsletters/update-seo-settings/{id}` | `archiveThumbnailImageUrl` |
| **Summary Card** | `POST /newsletters/update-article-summary/{id}` | `summary` object |
| **Keywords** | `PUT /newsletters/{id}` | `keywords` |
| **Article Title** | `PUT /newsletters/{id}` | `title` |
| **Article Description** | `PUT /newsletters/{id}` | `description` |

### Section Structure

Articles have sections (content blocks). Get them first:
```
GET /newsletters/{id}/sections
```

**Common section types:**
- **HEADLINE_COMBO** (index 0): `title` = headline, `promptOutPut` = subheadline, `imageUrl` = hero image
- **TEXT** (index 1+): `promptOutPut` = body content (HTML)

### Update Headline Section Example

```json
PUT /newsletters/{articleId}/sections/{headlineSectionId}
{
  "title": "New Headline Here",
  "promptOutPut": "New subheadline here",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

### Update Body Content Example

```json
PUT /newsletters/{articleId}/sections/{textSectionId}
{
  "promptOutPut": "<p>New body content here.</p><p>&nbsp;</p><p>Second paragraph.</p>"
}
```

### Update All SEO Example

```json
POST /newsletters/update-seo-settings/{articleId}
{
  "urlPath": "my-seo-optimized-slug",
  "title": "SEO Title | Site Name",
  "description": "Meta description for search results",
  "previewImageUrl": "https://example.com/og-image.jpg",
  "archiveThumbnailImageUrl": "https://example.com/thumbnail.jpg"
}
```

### Update Summary Card Example

```json
POST /newsletters/update-article-summary/{articleId}
{
  "summary": {
    "title": "Card Title",
    "description": "Card subtitle",
    "imageUrl": "https://example.com/card-image.jpg",
    "content": "<p>Short summary HTML content.</p>"
  }
}
```

---

## Delete Article

```json
DELETE /newsletters/{id}
```

Returns the deleted article object. Also deletes all associated sections.

---

## Sections API (Content Blocks)

Articles are made of sections. The **HEADLINE_COMBO** section contains:
- `title` = Main Article Headline
- `promptOutPut` = Article Sub Headline
- `imageUrl` = Hero image

### Section Types

`TEXT`, `TITLE`, `HEADLINE_COMBO`, `CUSTOM_COMBO`, `LINK_SUMMARY`, `ARTICLE_SUMMARY`, `AI_ARTICLE`, `VIDEO`, `IMAGE`, `SPACER`, `BORDER`, `BULLETS`, `FEATURED`, `FANCY_BLOCK`, `MONETIZATION`, `SINGLE_STATEMENT`, `TRIVIA_QUESTION`, `TRIVIA_QUESTION_ANSWER`, `ECOMMERCE_PRODUCT`, `CUSTOM`, `SPONSOR_SPOT`, `NEWSLETTER_HEADLINE_COMBO`, `ARTICLE_CUE`

### List Sections

```json
GET /newsletters/{newsletterId}/sections
```

Returns array sorted by `index`.

### Create Section

```json
POST /newsletters/{newsletterId}/sections
{
  "type": "TEXT",
  "index": 2
}
```

### Update Section

```json
PUT /newsletters/{newsletterId}/sections/{id}
{
  "title": "Updated Section Title",
  "promptOutPut": "<p>Updated content with <strong>HTML</strong>.</p>",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Delete Section

```json
DELETE /newsletters/{newsletterId}/sections/{id}
```

Deletes section and re-indexes remaining sections.

---

## Upload Images (NEW!)

**Upload directly to Letterman storage instead of external hosting!**

```
POST /images
Content-Type: multipart/form-data

images: [file(s)]
```

**Response:**
```json
{
  "imageUrls": [
    "https://storage.example.com/images/.../uploaded-image-1.jpg"
  ]
}
```

### PowerShell Example:
```powershell
$form = @{
    images = Get-Item -Path "path/to/image.jpg"
}
Invoke-RestMethod -Uri "$baseUrl/images" -Method POST -Headers $headers -Form $form
```

---

## Update SEO Settings

```json
POST /newsletters/update-seo-settings/{id}
{
  "urlPath": "my-optimized-slug",
  "title": "SEO Title for Search Results",
  "description": "Meta description shown in search results",
  "previewImageUrl": "https://example.com/image.jpg",
  "archiveThumbnailImageUrl": "https://example.com/image.jpg",
  "noIndex": false
}
```

---

## Update Article Summary

```json
POST /newsletters/update-article-summary/{id}
{
  "summary": {
    "title": "Updated Article Title",
    "description": "Updated subtitle",
    "imageUrl": "https://example.com/image.jpg",
    "content": "<p><strong>Updated summary</strong> with formatting.</p>"
  }
}
```

---

## Content Formatting Rules

### Paragraph Spacing (CRITICAL!)
```html
<p>First sentence here.</p>
<p>&nbsp;</p>
<p>Second sentence here.</p>
<p>&nbsp;</p>
```

Every period = new paragraph + blank line after it.

### Strategic Bolding
Bold sparingly - only the most important terms:
- **Location names** (Summerlin, Las Vegas, Nevada)
- **Program/business names**
- **Organization names**
- **Key people's names** when introduced

---

## Article States

| State | Description |
|-------|-------------|
| `DRAFT` | Not published, editable |
| `APPROVED` | Ready for publishing |
| `PUBLISHED` | Live on website |
| `NEED_APPROVAL` | Pending review |

---

## Safety Rules

### [OK] Safe Operations
- **Read operations** — GET requests, listing, viewing
- **Create article** — Creates as DRAFT (not public)
- **Update SEO/summary** — Modifies draft content
- **Upload images** — Safe, returns URLs

### WARNING Requires Confirmation
- **Publish article** — Makes content public
- **Delete article** — Permanent removal

### [LOCKED] ABSOLUTE RULE
**NEVER auto-publish articles.** 
- Create as DRAFT
- Chad reviews
- Chad says "publish"
- THEN publish

---

## Command Workflows

### /local article - Create Publish-Ready Articles

**When user types `/local article`:**

**Ask for required inputs:**
1. Publication name (West Valley Shoutouts, Summerlin Shoutouts, etc.)
2. Topic/story (what's the article about?)
3. Primary keyword
4. Target word count
5. Source material (URL, notes, details)

**Then automatically generate complete article package:**

**ARTICLE STRUCTURE:**
- Headline (must contain primary keyword)
- 3 alternate headlines
- Meta title (with site name)
- Meta description (150-160 chars, SEO-optimized)
- URL slug (clean, keyword-based)
- Excerpt
- Primary keyword
- Secondary keywords (5-6)
- Category + tags
- Full article body (HTML formatted)
- 3 Unsplash images with search phrase, URL, alt text, caption, photographer credit
- Social promo package: Facebook teaser, email teaser, 3 curiosity hooks

**ARTICLE BODY RULES:**
- Conversational, editorial tone (like a local journalist)
- Strong opening hook
- 1-2 sentence paragraphs ONLY (mobile-friendly)
- H2 subheadings every 150-250 words
- One H2 must contain primary keyword
- Section explaining why story matters locally
- Natural transitions between sections
- Avoid bullet lists (write as sentences)
- 6th-8th grade readability
- Never invent facts, quotes, dates, addresses, statistics
- HTML format: `<p>text</p><p>&nbsp;</p><h2>Heading</h2><p>&nbsp;</p>`

**CREATE IN LETTERMAN:**
1. Write article JSON to file
2. POST to `/newsletters` with `keepOriginal: true`
3. Update SEO settings via `/update-seo-settings/{id}`
4. Return article ID + preview URL

**QUALITY STANDARD:** Must read like a real local journalist wrote it. Publish-ready.

**When complete, return:**
- Article created as DRAFT
- Article ID
- Preview URL

---

### /story search - Build Content Bank

**When user types `/story search`:**

**Ask:**
1. Which publication?
2. How many stories?

**Then:**
1. Search the web for relevant local stories for that city/area
2. Save stories to file: `story-bank-{publication}.json`
3. Show list of stories found

**Story format:**
```json
{
  "publication": "West Valley Shoutouts",
  "stories": [
    {
      "id": 1,
      "headline": "Story headline",
      "source": "Source URL",
      "summary": "Brief summary",
      "localRelevance": "Why it matters locally",
      "suggestedKeyword": "primary keyword",
      "wordCount": 800,
      "used": false
    }
  ]
}
```

**Integration with /local article:**
- When `/local article` is run, check story bank first
- Show available stories for that publication
- Ask which story to use
- Mark story as "used" after article creation

---

## Official Docs

**Full API Reference:** https://api.letterman.ai/ai-api-docs

---

*Last updated: 2026-03-10*


