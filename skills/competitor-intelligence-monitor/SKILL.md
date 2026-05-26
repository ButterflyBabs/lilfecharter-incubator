---
name: competitor-intelligence-monitor
description: A comprehensive intelligence agent that automates competitor monitoring across websites, pricing, product launches, customer reviews, and social media. Use this skill to gain a strategic advantage by receiving structured weekly reports, tracking market positioning, and identifying emerging threats or opportunities.
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["OPENAI_API_KEY", "SERP_API_KEY"],"bins":["curl"]},"primaryEnv":"OPENAI_API_KEY","emoji":"🔍"}}
---

# Competitor Intelligence Monitor

A composite agent workflow that performs weekly competitor research, monitoring websites, pricing, product launches, reviews, and social media to deliver structured intelligence reports.

## When to activate

This skill is ideal for tasks involving deep competitor analysis, ongoing market research, and strategic business planning. Activate using the following keywords and scenarios:

- **Keywords:** `competitor analysis`, `market research`, `competitive intelligence`, `competitor tracking`, `product monitoring`, `pricing analysis`, `review sentiment`, `social mentions`, `market positioning`, `product strategy`, `feature comparison`, `brand monitoring`, `swot analysis`, `competitor benchmark`, `market share`, `customer feedback analysis`, `new market entry`, `product roadmap`, `marketing campaigns`, `sales intelligence`, `investment research`, `due diligence`.
- **Scenarios:**
    - "Our sales team needs a weekly digest of what our top 3 competitors have been up to."
    - "Generate a report on the market's reaction to Competitor X's new feature launch."
    - "I need to understand the pricing strategy of all major players in the European market."
    - "Track any changes to the terms of service or privacy policy on our main competitor's website."
    - "Create a sentiment analysis report from customer reviews for all our direct competitors over the last quarter."
    - "Find out which new markets our competitors are targeting based on their recent job postings and press releases."
    - "I'm preparing for a board meeting and need a summary of the competitive landscape."
    - "Monitor social media for any negative press or customer complaints about our competitor's flagship product."

## Required credentials

- `OPENAI_API_KEY` — An OpenAI API key for content analysis and summarization. See [OpenAI API Keys](https://platform.openai.com/account/api-keys).
- `SERP_API_KEY` — A Serp API key for accessing search engine results and social media data. See [SerpApi API Key](https://serpapi.com/manage-api-key).

## Helper script

Use `scripts/competitor_intel_api.py` for executing the intelligence pipeline:

```bash
python scripts/competitor_intel_api.py <command> [args]
```

| Command | Description |
|---|---|
| `add-competitor --name NAME --url URL` | Add a new competitor to monitor. |
| `scrape-website --id ID` | Scrape the competitor's website for new content. |
| `monitor-pricing --id ID` | Track pricing changes for a competitor's products. |
| `track-launches --id ID` | Monitor for new product or feature launches. |
| `analyze-reviews --id ID` | Analyze sentiment of new customer reviews. |
| `monitor-social --id ID` | Track mentions and activity on social media. |
| `generate-report --id ID` | Generate a comprehensive intelligence report. |
| `compare-competitors --ids ID1,ID2` | Compare two or more competitors side-by-side. |
| `detect-strategy-changes --id ID` | Identify significant changes in a competitor's strategy. |
| `export-report --report-id RID --format FORMAT` | Export a report to Markdown or JSON. |
| `track-history --id ID` | View the historical data for a competitor. |

## Workflow

This workflow orchestrates web scraping, SERP API for search intelligence, and OpenAI for analysis to deliver structured competitor intelligence reports.

### 1. Add a Competitor Profile

**Action:** Register a competitor with their name and website URL.

```bash
python scripts/competitor_intel_api.py add-competitor --name "Competitor A" --url "https://competitor-a.com"
```

### 2. Scrape Competitor Website

**Action:** Crawl the competitor's website and extract key content.

```bash
python scripts/competitor_intel_api.py scrape-website --id 1
```

### 3. Monitor Pricing Changes

**Action:** Fetch the competitor's pricing page and detect changes.

```bash
python scripts/competitor_intel_api.py monitor-pricing --id 1
```

### 4. Analyze Reviews and Social Sentiment

**Action:** Search for reviews and social mentions, then analyze sentiment.

```bash
python scripts/competitor_intel_api.py analyze-reviews --id 1
```

### 5. Generate Intelligence Report

**Action:** Compile all data into a comprehensive report.

```bash
python scripts/competitor_intel_api.py generate-report --id 1
```

### 6. Export and Track Historical Changes

**Action:** Export the report and save a historical snapshot.

```bash
python scripts/competitor_intel_api.py export-report --report-id "report_12345" --format json > competitor_report.json
```

## Pagination

For endpoints that return a list of items, such as `list-reports`, use the `--page` and `--per-page` parameters to navigate through the results.

**Example: Get the second page of reports for a competitor**

```bash
python scripts/competitor_intel_api.py list-reports --competitor-id 1 --page 2 --per-page 10
```

## Multi-step workflows

### Quarterly Competitive Benchmark Report

This workflow creates a comprehensive benchmark report comparing your company against key competitors.

1.  **Add Competitors:**
    `python scripts/competitor_intel_api.py add-competitor --name "Competitor A" --url "https://competitor-a.com"`
    `python scripts/competitor_intel_api.py add-competitor --name "Competitor B" --url "https://competitor-b.com"`

2.  **Gather Data:**
    `python scripts/competitor_intel_api.py scrape-website --id 1`
    `python scripts/competitor_intel_api.py scrape-website --id 2`
    `python scripts/competitor_intel_api.py monitor-pricing --id 1`
    `python scripts/competitor_intel_api.py monitor-pricing --id 2`

3.  **Generate Comparison Report:**
    `python scripts/competitor_intel_api.py compare-competitors --ids 1,2`

## Real-world use cases

- **Product Management:** Inform product roadmap decisions by tracking competitor feature launches and customer feedback.
- **Marketing Strategy:** Adjust marketing campaigns based on competitor messaging and positioning changes.
- **Sales Enablement:** Equip the sales team with up-to-date battle cards and competitive intelligence.
- **Investment Analysis:** Conduct due diligence on companies by analyzing their market position and trajectory.
- **Corporate Strategy:** Identify potential acquisition targets or market gaps by monitoring the competitive landscape.
- **Brand Management:** Proactively manage brand reputation by tracking social media mentions and news coverage.

## Output format

Results are returned in structured JSON. The `action` field indicates the operation performed.

**Report Generation Output:**

```json
{
  "ok": true,
  "action": "report_generated",
  "report_id": "report_12345",
  "summary": "Competitor A launched a new product and increased pricing on their enterprise plan.",
  "report_path": "/home/ubuntu/skills/competitor-intelligence-monitor/reports/report_12345.md"
}
```

**Competitor Comparison Output:**

```json
{
  "ok": true,
  "action": "competitors_compared",
  "comparison_id": "comp_67890",
  "summary": "Competitor A has a broader feature set, but Competitor B offers more competitive pricing.",
  "comparison_path": "/home/ubuntu/skills/competitor-intelligence-monitor/reports/comp_67890.md"
}
```

## Guardrails

- **Confidentiality:** Never share generated intelligence reports outside of the intended audience.
- **Compliance:** Always respect `robots.txt` when scraping websites and adhere to the terms of service of all APIs.
- **Attribution:** Disclose the use of AI for analysis in the final report.
- **Data Privacy:** Do not collect or store any personally identifiable information (PII).
- **Rate Limiting:** Be mindful of API rate limits to avoid service disruption.
- **Legal:** Consult with legal counsel to ensure all intelligence gathering activities are compliant with relevant laws and regulations.
- **Security:** Store API keys and other credentials securely using a secret management system.
- **Accuracy:** Cross-validate findings from multiple sources to ensure accuracy.

## Rate limits

This skill is subject to the rate limits of the underlying APIs (OpenAI and Serp API). Refer to their respective documentation for details. As a general guideline:

- **OpenAI API:** Varies by model and tier. Typically around 60-100 requests per minute. See [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits).
- **Serp API:** Varies by plan. Typically around 60-200 requests per minute. See [SerpApi Plans](https://serpapi.com/plans).

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `api_key_invalid` | An API key is invalid or missing. | Verify that `OPENAI_API_KEY` and `SERP_API_KEY` are set correctly. |
| `scraping_failed` | The website structure changed, or the scraping is blocked. | Update the scraping logic or use a different data source. |
| `analysis_failed` | The OpenAI API call failed. | Check the OpenAI API status and retry the request. |
| `rate_limit_exceeded` | Too many requests to an API. | Implement exponential backoff and retry the request. |
| `competitor_not_found` | The specified competitor ID does not exist. | Use `add-competitor` to add the competitor first. |
| `report_not_found` | The specified report ID does not exist. | Check the report ID and ensure the report has been generated. |
| `invalid_format` | The requested export format is not supported. | Use a supported format such as `markdown` or `json`. |
| `permission_denied` | The agent does not have permission to access a required resource. | Check file permissions and ensure the agent is running with the correct user. |

## Reference files

- **`references/api-reference.md`** — Detailed documentation of the APIs being orchestrated.
