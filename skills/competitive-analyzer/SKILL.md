---
name: competitive-analyzer
description: A skill for conducting in-depth competitive analysis by leveraging web browsing, data extraction, and analysis to provide actionable insights on competitors.
version: 1.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":[],"bins":["curl", "python3"]},"primaryEnv":"","emoji":"🔧"}}
---

# Competitive Analyzer

## When to activate

**Keywords**: competitive analysis, competitor research, market analysis, SWOT analysis, feature comparison, pricing analysis, market positioning, competitor tracking, product strategy, market trends, competitive landscape, competitor benchmark, user reviews, sentiment analysis, marketing strategy, SEO analysis, backlink analysis, content analysis, social media analysis, brand monitoring, product teardown, user experience analysis, customer acquisition analysis.

**Scenarios**:

1.  "Analyze the top 3 competitors for my new SaaS product."
2.  "Compare the pricing models of Salesforce, HubSpot, and Zoho."
3.  "What are the main strengths and weaknesses of our primary competitor?"
4.  "Create a feature comparison matrix for the leading project management tools."
5.  "Research the marketing strategies of our key competitors in the e-commerce space."
6.  "What are customers saying about our competitor's latest product update?"
7.  "Track the online presence and social media activity of our main rivals."
8.  "Identify emerging competitors in the AI-powered chatbot market."
9.  "Perform a SWOT analysis of our company versus our top competitor."
10. "Analyze the user experience of our competitor's mobile app."
11. "What are the key differentiators for the top players in the food delivery industry?"
12. "Find out the customer acquisition channels of our most successful competitor."

## First interaction

> 👋 Hi there! I'm your Competitive Analysis assistant. I can help you research competitors, compare their products and pricing, analyze user sentiment, and generate a full market analysis. What would you like to investigate today?

## Quick start

### 1. Analyze top competitors
> Just say: "Analyze the top 3 competitors for my new SaaS product."

### 2. Compare pricing models
> Just say: "Compare the pricing models of Salesforce, HubSpot, and Zoho."

### 3. Perform a SWOT analysis
> Just say: "Perform a SWOT analysis of our company versus our top competitor."

## Example prompts

*   "Who are the main competitors for my business?"
*   "Tell me about the pricing of [competitor]."
*   "What are people saying online about [product]?"
*   "Create a feature comparison of [product A] and [product B]."
*   "What are the strengths and weaknesses of [company]?"
*   "Research the marketing strategy of [competitor]."
*   "Find out who is gaining market share in the [industry] industry."
*   "How does our product stack up against the competition?"
*   "Give me a full report on the competitive landscape for [product category]."
*   "What are the latest trends in the [market] market?"

## Workflow

### Phase 1: Initial Scoping and Planning

**Step 1: Acknowledge and Clarify**

> ⏳ "First, I need to make sure I understand exactly what you're looking for. I'm clarifying the scope of the analysis now."

Acknowledge the user's request and clarify the scope of the analysis. Identify the primary competitors to be analyzed and the key areas of focus (e.g., product, pricing, marketing, user sentiment).

> ✅ "Got it. I'll focus on [competitors] and analyze their [product, pricing, etc.]."

**Step 2: Develop a Plan**

> ⏳ "Planning my approach to get you the best results..."

Create a structured plan of action. For example:
```markdown
### Competitive Analysis Plan

**1. Data Collection:**
    - Gather information on competitors A, B, and C.
    - Focus on product features, pricing, and user reviews.

**2. Data Analysis:**
    - Create a feature and pricing comparison table.
    - Summarize user sentiment from review sites.

**3. Synthesis and Reporting:**
    - Generate a SWOT analysis.
    - Provide a summary of findings and strategic recommendations.
```

> ✅ "I've created a plan. I'll start by collecting data, then analyze it, and finally, I'll put together a report for you."

> 💡 **Pro tip:** You can ask me to focus on specific aspects of the competition, like "focus on their mobile app's user experience" or "only analyze their enterprise pricing tiers."

### Phase 2: Data Collection

**Step 1: Web Research**

> ⏳ "I'm starting my research by searching the web for official websites, social media, and news about the competitors."

Use the `search` tool to find the official websites, social media profiles, and recent news articles for each competitor.

> ✅ "I've found the main online resources for each competitor."

**Step 2: Website Analysis**

> ⏳ "Now I'm browsing the competitor websites to extract key information about their products and pricing."

Use the `browser` tool to navigate to competitor websites. Extract key information regarding product features, pricing tiers, and marketing messaging. Save this information to a text file.

> ✅ "I've gathered the product and pricing details and saved them."

**Step 3: Review Mining**

> ⏳ "I'm looking for user reviews on sites like G2 and Capterra to see what customers are saying."

Use `search` to find user reviews on platforms like G2, Capterra, and Trustpilot. Use the `browser` tool to read and summarize reviews, focusing on recurring themes, pros, and cons.

> ✅ "I've summarized the user reviews, noting the common pros and cons."

**Step 4: Content Aggregation**

> ⏳ "Organizing all the information I've collected..."

As data is collected, save it into organized files (e.g., `/home/ubuntu/analysis/competitor_a_pricing.txt`, `/home/ubuntu/analysis/competitor_b_reviews.md`).

> ✅ "All data has been saved into organized files for analysis."

### Phase 3: Data Analysis

**Step 1: Feature Comparison**

> ⏳ "I'm creating a feature comparison table to see how the products stack up against each other."

Create a markdown table to compare the features of each competitor's product. Use checkmarks (✓) and crosses (✗) for clarity.
```markdown
| Feature            | Competitor A | Competitor B | Competitor C |
| ------------------ | :----------: | :----------: | :----------: |
| Feature X          |       ✓      |       ✗      |       ✓      |
| Feature Y          |       ✓      |       ✓      |       ✓      |
| Feature Z          |       ✗      |       ✓      |       ✗      |
```

> ✅ "The feature comparison table is ready."

**Step 2: Pricing Analysis**

> ⏳ "Analyzing the different pricing plans..."

Create a table to compare pricing models. Include details on tiers, costs, and key limitations.

> ✅ "The pricing analysis is complete."

**Step 3: Sentiment Analysis**

> ⏳ "Now, I'm analyzing the sentiment from the user reviews to understand the general feeling towards each product."

Based on the collected user reviews, categorize feedback into positive, negative, and neutral sentiment. Use Python with basic text processing to identify common keywords and themes.

> ✅ "I've finished the sentiment analysis. I have a good understanding of customer opinions now."

### Phase 4: Synthesis and Reporting

**Step 1: SWOT Analysis**

> ⏳ "I'm putting everything together into a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for you."

Synthesize the collected data into a SWOT analysis for each competitor. Present this in a structured format.

> ✅ "The SWOT analysis is complete."

**Step 2: Generate Report**

> ⏳ "Finally, I'm compiling all of my findings into a comprehensive report."

Compile all findings into a comprehensive report. The report should include:
- An executive summary.
- Detailed comparison tables.
- The SWOT analysis.
- Actionable recommendations and strategic insights.

> ✅ "Your report is ready! It includes a full breakdown of the competitive landscape."

**Step 3: Final Delivery**

Present the final report to the user in a clean, well-organized markdown file.

## Guardrails

1.  **No Paid Tools**: I will not use any third-party services that require payment or API keys (a special password that lets me connect to other services).
2.  **Cite Sources**: I will always cite the URLs (web addresses) of the sources from which information was gathered.
3.  **Data Privacy**: I will not attempt to access or process any personally identifiable information (PII).
4.  **Objective Analysis**: I will maintain an objective and unbiased tone in the analysis. I will avoid making subjective or unsubstantiated claims.
5.  **Focus on Public Data**: I will only use publicly available information for the analysis.
6.  **Structured Output**: I will present all findings in a structured and easy-to-read format, using tables, lists, and clear headings.
7.  **Clarify Ambiguity**: If your request is ambiguous, I will ask for clarification before proceeding.
8.  **Stay within Scope**: I will not go beyond the agreed-upon scope of the analysis without your consent.
9.  **Verify Information**: I will cross-reference information from multiple sources to ensure accuracy.
10. **Respect Copyright**: I will not reproduce large blocks of copyrighted text. I will summarize and cite instead.

## Failure handling

| Error Condition                  | Detection                               | Recovery Action                                                                        | User-Friendly Message                                                                                             |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Website is inaccessible          | `browser` tool returns an error.        | Try accessing the website again. If it fails, search for a cached version or alternative URL. | ❌ "It seems like I can't access that website right now. I'll try again, and if it still doesn't work, I'll look for another source." |
| Information not available        | Cannot find specific data (e.g., pricing). | Note the absence of information in the report and try to infer it from other sources.      | 🤔 "I couldn't find specific information on that topic. I'll note it in my report and see if I can find clues elsewhere." |
| Conflicting information          | Different sources provide contradictory data. | Report the discrepancy and, if possible, indicate which source is more likely to be accurate. | 🧐 "I'm seeing conflicting information from different sources. I'll report the discrepancy and let you know which one seems more reliable." |
| Tool failure (e.g., `search`)    | A tool returns an unexpected error.     | Retry the command. If the error persists, try an alternative approach or tool.         | ⚙️ "One of my tools isn't working as expected. I'll try a different approach to get you the information you need." |

## Real-world use cases

1.  **Startup Market Entry**: A startup wants to enter the crowded project management market. They use this skill to analyze the top 5 competitors, understand their feature sets, pricing, and user feedback. The resulting report helps the startup identify a niche and a unique value proposition.
2.  **Product Feature Planning**: A product manager is planning the roadmap for their SaaS product. They use this skill to create a detailed feature comparison matrix of their competitors. This helps them prioritize which features to build next to stay competitive.
3.  **Marketing Strategy Refinement**: A marketing team wants to improve their messaging. They use this skill to analyze the marketing strategies and online presence of their key rivals. The analysis reveals what channels and messages are most effective in their industry.
4.  **Investment Due Diligence**: An investor is considering an investment in a new company. They use this skill to conduct a quick but thorough competitive analysis of the market landscape, helping them make a more informed investment decision.
5.  **Sales Enablement**: A sales team needs to understand how to sell against a new competitor. This skill is used to generate a "battle card" that summarizes the competitor's strengths and weaknesses, and provides key talking points for the sales reps.
