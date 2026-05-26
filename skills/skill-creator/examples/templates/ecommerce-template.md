---
name: ecommerce-template
description: A template for skills that manage products, orders, and inventory via e-commerce platform APIs.
version: 1.0.0
license: MIT
metadata: '{"dependencies": ["curl", "jq"], "platforms": ["Shopify", "WooCommerce"]}'
---

### When to Activate

This skill should be activated when the user wants to perform e-commerce operations like managing products, handling orders, or checking inventory on platforms such as Shopify or WooCommerce. It is ideal for tasks involving programmatic interaction with an online store's backend.

### First Interaction

On first use, the skill must prompt for the e-commerce platform and API credentials, guiding the user to set up an environment variable like `[YOUR-API-KEY-ENV-VAR]` for secure storage.

### Dependencies & Setup

This skill requires `curl` for API requests and `jq` for parsing JSON. Ensure they are installed.

1.  **Install dependencies:** `sudo apt-get update && sudo apt-get install -y curl jq`
2.  **Configure API Key:** The user must provide an API key, stored in `[YOUR-API-KEY-ENV-VAR]`, for authentication.

### Slash Commands & Workflows

**/list-products**
Lists all available products from the store.
1.  Make a GET request to the products endpoint using `curl`.
2.  Use `jq` to format and display product names and SKUs.
3.  Handle API errors like authentication failure.

**/create-order [product-id] [quantity]**
Creates a new order for a given product.
1.  Validate `product-id` and `quantity`.
2.  Construct the JSON payload for the new order.
3.  Send a POST request to the orders endpoint.
4.  Confirm order creation and return the order ID.

**/check-inventory [product-id]**
Checks the inventory level for a specific product.
1.  Make a GET request to the inventory endpoint for the `product-id`.
2.  Parse the response to extract the stock quantity.
3.  Return the inventory count to the user.

**/track-order [order-id]**
Tracks the status of an existing order.
1.  Make a GET request to the order status endpoint with the `order-id`.
2.  Parse the response for shipping and delivery status.
3.  Provide tracking information to the user.

### Guardrails & Safety

-   Never expose raw API keys or sensitive customer data in logs or messages.
-   All API requests must use HTTPS to ensure data encryption.
-   Implement rate limiting to avoid exceeding API request limits.
-   Validate and sanitize all user inputs to prevent injection attacks.

### Failure Handling

If an API call fails, retry with exponential backoff. If failure persists, inform the user with a clear error message, suggesting potential causes like an invalid API key or network issues.

### Example Prompts

- "List all products from my Shopify store."
- "Create an order for product ID `PROD-123` with a quantity of 2."
- "What's the inventory level for `SKU-XYZ`?"
- "Track the status of my order `ORDER-456`."