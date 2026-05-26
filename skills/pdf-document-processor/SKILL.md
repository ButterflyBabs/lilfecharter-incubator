---
name: pdf-document-processor
description: Extracts, analyzes, and transforms content from PDF documents, enabling summarization, data extraction, and format conversion without external APIs.
version: 1.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":[],"bins":["curl", "python3"]},"primaryEnv":"","emoji":"🔧"}}
---

# PDF Document Processor

## When to activate

**Keywords**: PDF, document, process, extract, analyze, summarize, convert, read, parse, table, text, image, data, form, report, invoice, contract, paper, ebook, statement, receipt, scan, OCR, redact, merge, split, metadata

**Scenarios**:

- User uploads a PDF and asks for a summary of its content.
- User wants to extract all tables from a PDF report into a structured format like CSV or JSON.
- User needs to convert a PDF document into a Markdown file for easier editing and web publishing.
- User asks to find and extract specific information (e.g., a name, date, or total amount) from a PDF invoice or contract.
- User wants to get the text content from a scanned PDF, which requires Optical Character Recognition (OCR).
- User needs to analyze a batch of PDF documents and compile a consolidated report from their contents.
- User wants to extract all images from a PDF file and save them as individual image files.
- User asks to compare two PDF documents and identify the differences between them.
- User needs to redact sensitive information (like names or social security numbers) from a PDF document.
- User wants to retrieve the metadata of a PDF file, such as author, creation date, and subject.
- User needs to split a large PDF into several smaller documents or merge multiple PDF files into a single document.
- User wants to get the key findings and arguments from a dense academic research paper in PDF format.

## First interaction

> 👋 Hi there! I'm your PDF Document Processor. I can help you extract text, find specific information, summarize content, and even pull out tables and images from your PDF files. What would you like to do with your PDF today?

## Quick start

### 1. Summarize a PDF
> Just say: "Can you summarize this document for me? /path/to/my/report.pdf"

### 2. Extract all tables into a CSV file
> Just say: "Extract all the tables from this PDF and save them as a CSV. /path/to/data.pdf"

### 3. Convert a PDF to plain text
> Just say: "Convert this PDF to a text file. /path/to/document.pdf"

## Example prompts

- "Read this PDF and tell me what it's about."
- "Can you pull all the text out of this scanned invoice? It's located at /home/ubuntu/scans/invoice_123.pdf."
- "I need all the images from this product catalog PDF."
- "Find every mention of 'Project Alpha' in this contract: /home/ubuntu/docs/contract.pdf."
- "Please convert chapter_5.pdf into a Markdown file."
- "How many pages are in this document? /path/to/large_doc.pdf"
- "Extract the tables on pages 5-7 from this financial report."
- "Redact all the social security numbers from this PDF file for me."
- "Merge these three PDFs into one file: file1.pdf, file2.pdf, file3.pdf."
- "What's the author and creation date for this paper? /path/to/research.pdf"

## Workflow

This skill follows a systematic workflow to process PDF documents. The agent MUST adapt the steps based on the user's specific request.

💡 **Pro tip:** I handle everything right here, so there's no need for external websites or API keys (special passwords for other services). Your documents stay secure in your workspace.

### Step 1: Initial Assessment & Preparation

> ⏳ "Okay, let's get started. First, I'll set up a clean workspace and check if the PDF is text-based or a scanned image."

*   Confirm the path to the source PDF file provided by the user.
*   Use the `shell` tool to create a dedicated working directory for the task to keep all generated files organized (e.g., `mkdir /home/ubuntu/pdf_processing_task`).
*   Check for necessary tools like `poppler-utils` and `tesseract-ocr`. If not present, I will install them.
*   Determine if the PDF is text-based or image-based (scanned). A quick way is to attempt a text extraction. If the output is empty or garbled, it's likely a scanned PDF that needs OCR (Optical Character Recognition, a process to 'read' text from images).

> ✅ "Preparation complete. I've determined the PDF type and have all the tools I need."

### Step 2: Content Extraction (Text, Tables, Images)

> ⏳ "Now, I'm extracting the content you requested. This might take a moment for large or scanned documents."

*   **Text Extraction (for text-based PDFs)**: I'll use a command-line tool (`pdftotext`) to pull all the text into a simple `.txt` file.
*   **Text Extraction (for scanned PDFs using OCR)**: This is a multi-step process:
    1.  First, I convert each page of the PDF into an image.
    2.  Then, I use an OCR tool (`tesseract`) to analyze each image and recognize the text within it.
    3.  Finally, I combine the text from all pages into a single text file.
*   **Table Extraction**: I'll use a special Python library (`tabula-py`) designed to find and extract tables from PDFs, saving them into a structured format like a CSV file that you can open in a spreadsheet.
*   **Image Extraction**: I use another tool (`pdfimages`) to find and save all the images from the PDF into a designated folder.

> ✅ "Success! I've extracted the requested content from the PDF."

### Step 3: Processing & Analysis (Based on Your Goal)

> ⏳ "I have the raw content. Now I'm analyzing it to meet your specific goal..."

*   **Summarization**: I will read the extracted text and use my language understanding capabilities to create a concise summary of the key points.
*   **Specific Information Extraction**: I'll search through the text using pattern-matching tools (`grep` or Python scripts) to find the exact pieces of information you asked for.
*   **Format Conversion (e.g., to Markdown)**: I will process the extracted text and reformat it using Markdown syntax (which is great for web pages and notes), identifying headings, lists, and paragraphs to preserve the document's structure.
*   **Redaction**: To hide sensitive information, I will create a brand new PDF. I'll copy the content over but draw black boxes over the specific text you want to be redacted.

> ✅ "Analysis complete. I have prepared the final result for you."

### Step 4: Output Generation & Delivery

> ⏳ "Just a moment... I'm packaging everything up for you now."

*   Based on your request, I will generate the final output. This could be a text file with a summary, a CSV file with tables, a folder of images, or a new, modified PDF.
*   If the output consists of multiple files, I will package them into a single `.zip` archive for easy download.
*   I will then provide you with the exact path to your final file(s).

> ✅ "All done! Here is the path to your file(s): [path/to/output]. Let me know what you'd like to do next!"

## Guardrails

- **Do Not Use External APIs**: This skill MUST be executed using only the sandbox's built-in capabilities and open-source tools. No third-party API calls for OCR, summarization, or conversion are permitted.
- **Verify Tool Availability**: Before attempting to use a command-line tool like `pdftotext` or `tesseract`, always check if it is installed. If not, install it using the appropriate package manager.
- **Handle Scanned Documents Explicitly**: Always inform the user if a document is scanned and requires OCR. Set the expectation that OCR quality can vary and may not be 100% accurate.
- **Preserve Original File**: Never modify the original PDF file directly. All operations (e.g., redaction, conversion) MUST result in the creation of a new file.
- **Manage Intermediate Files**: Clean up all intermediate files (e.g., page images for OCR, temporary text files) after the final output has been generated, unless the user requests them.
- **Respect Document Structure**: When converting to other formats like Markdown, make a best effort to preserve the document's logical structure (headings, lists, paragraphs).
- **Process in a Dedicated Directory**: To avoid file conflicts and to keep the workspace clean, all work for a given PDF task should be done within a newly created, dedicated directory.
- **Handle Errors Gracefully**: If a tool fails (e.g., `pdftotext` cannot open a corrupted PDF), catch the error, inform the user of the failure, and suggest possible reasons or next steps.

## Failure Handling

| Error Condition | Detection | User-Friendly Message |
| :--- | :--- | :--- |
| **Corrupted or Password-Protected PDF** | `pdftotext` or other tools exit with an error. | ❌ "It looks like I can't open this PDF. It might be password-protected or corrupted. Could you please provide a different version of the file?" |
| **OCR Tool Not Installed** | The `tesseract` command returns a "command not found" error. | ⏳ "Looks like a tool I need for reading scanned documents isn't installed. I'll install it now and try again. This should only take a moment." |
| **Poor OCR Quality** | The extracted text from a scanned PDF is nonsensical. | 😕 "I was able to extract text from your scanned document, but the quality is very low. This usually happens if the original document has low resolution, unusual fonts, or handwriting. For better results, a clearer, higher-quality scan is needed." |
| **Table Extraction Fails** | The Python script for table extraction fails or returns no data. | 🧐 "I couldn't automatically extract the tables from this PDF. They might be in a very complex format or part of an image. I can try to extract the raw text for you instead." |
| **Large File Processing Timeout** | A command takes too long and times out. | ⏳ "This is a very large file and it's taking longer than expected to process. I'm going to try again with a longer timeout. Thanks for your patience!" |

## Real-world use cases

1.  **Financial Report Analysis**: A financial analyst uploads a 200-page quarterly earnings report in PDF. The agent uses the skill to first extract all text and tables. It then identifies key sections like "Management's Discussion and Analysis" to summarize, extracts all financial statements (tables) into separate CSV files for easy import into Excel, and provides the analyst with a zip file containing the summary and the structured data.

2.  **Legal Contract Review**: A lawyer needs to quickly find all instances of a specific clause or defined term within a 50-page legal contract. The agent uses `pdftotext` to get the full text, then uses `grep` to locate all occurrences of the specified term, providing the lawyer with the surrounding context for each match, saving hours of manual reading.

3.  **Academic Research Summarization**: A student is writing a literature review and has a folder of 30 academic papers in PDF. The agent iterates through each PDF, applies the workflow to extract the text, and generates a one-paragraph summary for each paper's abstract, introduction, and conclusion. The final output is a single Markdown file containing all the summaries, helping the student quickly grasp the core ideas of each paper.

4.  **Invoice Data Entry Automation**: An accounting clerk has a batch of 100 PDF invoices from various vendors. The agent processes each PDF, using OCR if necessary. It then uses a Python script with regular expressions to find and extract the invoice number, date, vendor name, and total amount from each one. The results are compiled into a single CSV file, ready to be uploaded to the accounting software.

5.  **Creating a Web-Friendly FAQ from a PDF Manual**: A company has a product manual in PDF format and wants to put the FAQ section on its website. The agent extracts the text from the PDF, identifies the question-and-answer pairs in the FAQ section, and converts them into a clean HTML or Markdown file. This file can be directly embedded into the company's website, making the content accessible and searchable online.
