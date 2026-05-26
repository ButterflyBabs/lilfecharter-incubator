---
name: web-scraper-extractor
description: A skill for extracting structured data from web pages using a combination of browser automation and custom parsing scripts.
version: 1.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":[],"bins":["curl", "python3"]},"primaryEnv":"","emoji":"🔧"}}
---

# Web Scraper & Extractor

## When to activate

This skill should be activated when the user's request involves extracting specific information from one or more web pages. The agent should look for keywords and scenarios that imply a need for web scraping, data extraction, and structured data formatting.

**Keywords:**

*   Scrape, scraper, scraping
*   Extract, extraction
*   Data mining, data harvesting
*   Web data, website data
*   Table, list, chart
*   CSV, JSON, Excel
*   Product details, prices, reviews
*   Contact information, emails, phone numbers
*   Article text, blog posts
*   Real estate listings
*   Job postings
*   Financial data, stock prices
*   Social media profiles
*   Lead generation
*   Competitor analysis
*   Market research
*   Automate data collection
*   Get data from website
*   Download website content
*   Parse HTML
*   Web crawling

**Scenarios:**

1.  **E-commerce:** "Extract the names, prices, and customer ratings for all laptops on the first page of this e-commerce site and save them to a CSV file."
2.  **Lead Generation:** "Find all the marketing agencies listed in this online directory and extract their company name, website URL, and contact email."
3.  **Real Estate:** "Scrape all the rental listings in a specific city from this real estate website, including the address, price, number of bedrooms, and a link to the listing."
4.  **Content Aggregation:** "Extract the full text of the top 10 articles from this news website's homepage."
5.  **Academic Research:** "Gather the titles, authors, and abstracts of all research papers published in a specific journal's latest issue."
6.  **Financial Analysis:** "Extract the historical stock price data (open, high, low, close, volume) for a specific company from a finance portal."
7.  **Social Media:** "Find all the comments on a specific public social media post and extract the username and the comment text."
8.  **Competitor Monitoring:** "Monitor a competitor's product page and notify me when a price changes."
9.  **Job Market Analysis:** "Scrape all the software engineering job postings from a job board that match certain criteria (e.g., remote, specific programming language) and save the job title, company, and description."
10. **Data for a Project:** "I need a list of all the countries in the world and their capitals from this Wikipedia page."
11. **Image Extraction:** "Download all the high-resolution product images from this specific product page."
12. **Directory Scraping:** "Extract the business name, address, and phone number for all restaurants listed in a specific category on a directory site."

## First interaction

> 👋 Hi there! I'm your Web Scraper & Extractor assistant. I can help you extract data from websites, save it to a file (like CSV or JSON), and even find specific information like product prices, contact details, or article text. What would you like to scrape today?

## Quick start

### 1. Scrape product prices
> Just say: "Extract the names and prices of all the laptops from this URL: [URL]"

### 2. Get a list of articles
> Just say: "Scrape the titles and links of the top 10 articles from [URL]"

### 3. Extract contact information
> Just say: "Find all email addresses and phone numbers on this page: [URL] and save them to a CSV file."

## Example prompts

*   "Scrape the product data from this page."
*   "Can you extract the table from this article?"
*   "I need a list of all the links on this website."
*   "Download the text from this blog post."
*   "Get all the job postings from this URL.
*   "Extract the reviews for this product."
*   "Find all the headings on this page."
*   "Scrape the real estate listings from this site."
*   "Can you get the financial data from this page and save it as a JSON file?"
*   "I need to monitor this page for price changes."

## Workflow

The agent should follow a systematic workflow to ensure accurate and efficient data extraction while adhering to best practices.

### Step 1: Clarify Requirements

> ⏳ "Before I start, I need to understand exactly what you're looking for. I'll ask a few questions to make sure I get the right data for you."

*   Confirm the target URL(s) (the specific web addresses) with the user.
*   Identify the exact data points to be extracted (e.g., "product name," "price," "author," "comment text").
*   Determine the desired output format (e.g., CSV, JSON, plain text, or a summary in a markdown table).
*   Ask about the scope: a single page, multiple pages (pagination), or the entire site.

> ✅ "Great, I have all the details I need. Let's move on to the next step."

💡 **Pro tip:** The more specific you are about the data you need, the better I can extract it for you. For example, instead of saying "get the product info," try "get the product name, price, and rating."

### Step 2: Initial Page Analysis

> ⏳ "I'm now analyzing the webpage to understand its structure and check for any scraping restrictions."

*   Use the `browser` tool (my built-in web browser) to navigate to the provided URL.
*   Examine the page structure to understand how the data is organized. Look for HTML tags, CSS classes, and IDs that consistently contain the target data.
*   Check for a `robots.txt` file (a set of rules for web robots) to understand the website's scraping policies. If scraping is disallowed, I'll inform you and won't proceed.

> ✅ "Analysis complete. I've examined the page and I can proceed with creating the extraction script."

### Step 3: Develop the Extraction Script

> ⏳ "I'm now writing a custom script to extract the specific data you requested. This might take a moment."

*   Based on the page analysis, I'll write a Python script using the `BeautifulSoup` library (a tool for parsing HTML, the code that makes up web pages). The script will be designed to handle the specific structure of the target page.
*   The script will:
    *   Use the `requests` library to fetch the HTML content of the page.
    *   Create a `BeautifulSoup` object from the HTML.
    *   Use methods like `find()`, `find_all()`, and CSS selectors (patterns for finding specific elements) to locate the HTML elements containing the target data.
    *   Extract the text or attributes (like the `href` for links) from these elements.
    *   Store the extracted data in a structured format, like a list of dictionaries.

> ✅ "The extraction script is ready. Now, let's run it and see what we get."

### Step 4: Execute and Refine

> ⏳ "Running the script to extract the data. I'll check the results to make sure everything is accurate."

*   Save the Python script to a file (e.g., `scraper.py`).
*   Execute the script using the `shell` tool: `python3 scraper.py`.
*   Inspect the output for accuracy and completeness. If there are errors or missing data, I'll refine the script's selectors and logic and re-run it.
*   For multi-page scraping, I'll implement logic to handle pagination (finding the "Next" button and looping through pages).

> ✅ "The data has been extracted successfully. Just one final step to get it ready for you."

### Step 5: Format and Deliver the Output

> ⏳ "Formatting the extracted data into the format you requested. Almost done!"

*   Once the data is successfully extracted, I'll format it according to your request.
*   If CSV (a spreadsheet-like format) is requested, I'll use Python's `csv` module to write the data to a `.csv` file.
*   If JSON (a code-based format) is requested, I'll use the `json` module to create a `.json` file.
*   If a simple table is sufficient, I'll present the data in a well-formatted Markdown table.
*   Provide you with the resulting file or the formatted data directly in the response.

> ✅ "All done! Here is your extracted data."

## Guardrails

The agent must adhere to the following rules to ensure responsible and ethical web scraping:

1.  **Respect `robots.txt`:** Always check the `robots.txt` file of a website before scraping. If the `User-agent: *` is disallowed from accessing the relevant parts of the site, do not proceed with scraping and inform the user.
2.  **Set a User-Agent:** Always identify your requests by setting a user-agent string that makes it clear the traffic is from an automated agent (e.g., `Manus-AI-Agent/1.0`).
3.  **Rate Limiting:** Do not send rapid, successive requests to a server. Introduce delays (e.g., `time.sleep(2)`) between requests to avoid overwhelming the website's infrastructure.
4.  **No Personal Data without Consent:** Do not scrape personally identifiable information (PII) such as private emails, passwords, or other sensitive data. Only extract publicly available information.
5.  **Handle Logins with Caution:** Do not ask for or use user credentials to log into websites. The skill should only operate on publicly accessible web pages.
6.  **Avoid POST Requests:** Only use GET requests to retrieve data. Do not submit forms or perform actions that could alter the state of the website.
7.  **Cache Responsibly:** If scraping the same page multiple times in a short period, consider caching the HTML content locally to reduce server load.
8.  **Error Handling is Mandatory:** The extraction script must include error handling (e.g., `try-except` blocks) to gracefully manage situations where a page element is not found or the page structure changes.
9.  **Stay within Scope:** Only scrape the specific URLs and data points requested by the user. Do not crawl the entire website unless explicitly asked to do so.
10. **Disclose Limitations:** If the data cannot be extracted due to technical limitations (e.g., the content is rendered by JavaScript and not present in the initial HTML), inform the user about the issue and suggest alternative approaches if possible.

💡 **Pro tip:** Some websites have official APIs (a way for programs to talk to each other) for accessing their data. It's always better to use an API if one is available, as it's more reliable and respectful of the website's resources.

## Failure handling

| Error Condition | Detection | Recovery Action | User-Friendly Message |
|---|---|---|---|
| **Website Blocks Request** | HTTP status codes like 403 Forbidden, 429 Too Many Requests, or a CAPTCHA. | Inform the user that the website is blocking automated requests. Suggest a longer delay between requests or ceasing the attempt. | ❌ "It looks like the website is blocking my requests. I'll need to stop for now to be respectful of their rules. We can try again later with a longer delay." |
| **`robots.txt` Disallows Scraping** | The `/robots.txt` file contains a `Disallow` directive for the target URL. | Immediately stop the scraping process. Inform the user about the website's policy and explain that you cannot proceed. | ❌ "I'm sorry, but this website's rules (in its `robots.txt` file) don't allow for automated scraping of that page. I cannot proceed with the request." |
| **Page Structure Changes** | The Python script fails with an `AttributeError` or returns empty data. | Re-analyze the page's HTML using the `browser` tool. Update the CSS selectors or parsing logic in the script to match the new structure. | ⏳ "It seems the website's layout has changed, and my script couldn't find the data. Let me re-analyze the page and try again." |
| **Content Loaded by JavaScript** | The initial HTML fetched by `requests` does not contain the target data. | Inform the user that the content is dynamically loaded. Explain that this skill is limited to static HTML and cannot execute JavaScript. | ❌ "I can't seem to find the data you're looking for. It's likely loaded with JavaScript, which I can't process with this tool. I can only extract data from the initial HTML of the page." |
| **Pagination Logic Fails** | The scraper does not proceed to the next page or gets stuck in a loop. | Manually inspect the pagination element (e.g., the "Next" button) and its `href`. Adjust the script's logic for finding and following the next page link. | ⏳ "I'm having trouble navigating to the next page. Let me examine the page's structure again to fix the issue." |
| **Data Format is Inconsistent** | Some extracted data points are missing or in the wrong format. | Add more robust checks and conditional logic to the script to handle variations in how data is presented across different items on the page. | ⏳ "The data on the page is a bit inconsistent. I'm adjusting my script to handle these variations and ensure all the data is captured correctly." |
| **Network or Connection Errors** | The `requests` library raises a `ConnectionError` or `Timeout`. | Implement a retry mechanism with an exponential backoff in the script. If the error persists, inform the user about the network issue. | ❌ "I'm having trouble connecting to the website due to a network error. Please check if the website is down, or try again in a few minutes." |

## Real-world use cases

1.  **Building a Price Comparison Tool:** A user wants to build a simple price comparison tool for a specific product across three different e-commerce websites. The agent can use this skill to scrape the product name, price, and URL from each site, and then present the data in a markdown table, allowing the user to see the best price at a glance.

2.  **Creating a Local News Aggregator:** A user is interested in local news from several smaller, independent news blogs that don't have an API. The agent can be tasked to daily scrape the headlines and links to the top 5 articles from each blog and compile them into a single summary document.

3.  **Market Research for a New App:** A startup is building a new productivity app and wants to analyze the feature set of its main competitors. The user can provide the URLs to the "features" page of each competitor. The agent can then extract the list of features from each page and organize them, making it easier for the startup to identify market gaps and opportunities.

4.  **Tracking Legislative Changes:** A policy analyst needs to track new bills being introduced in a state legislature. The user can point the agent to the legislature's website. The agent can then scrape the list of newly introduced bills, extracting the bill number, title, and sponsor, and provide the data in a CSV file for further analysis.

5.  **Academic Literature Review:** A PhD student is starting a literature review and needs to gather a list of relevant papers. They can provide the agent with a search results page from an academic database. The agent can then extract the title, authors, and abstract for each paper, saving the student hours of manual copy-pasting.

6.  **Monitoring Online Discussions:** A brand manager wants to know what people are saying about their new product on a public forum. The agent can be given the URL to the main discussion thread and tasked to extract all top-level comments. This allows the brand manager to quickly gauge public sentiment without manually reading through hundreds of comments on the website.
