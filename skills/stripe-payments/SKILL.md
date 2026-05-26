---
name: stripe-payments
description: "Seamlessly integrate Stripe to manage the entire customer lifecycle, from creating customers and processing one-time charges to handling recurring subscriptions, invoices, and refunds. Use this skill for all payment-related operations to build robust financial workflows."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["STRIPE_SECRET_KEY"],"bins":["curl"]},"primaryEnv":"STRIPE_SECRET_KEY","emoji":"💳"}}
---

# Stripe Payments

Process payments and manage billing with the Stripe API. This skill enables creating and managing customers, charges, subscriptions, invoices, and more.

## When to activate

Use this skill for any tasks related to payment processing or financial management involving the Stripe platform. Activate on keywords and scenarios such as:

- **Keywords:** Stripe, payment, charge, credit card, subscription, invoice, refund, customer, product, price, billing, checkout, pay, bill, transaction, revenue, MRR, ARR, SaaS metrics, payment gateway, online payment, e-commerce transaction, credit card processing, accept payment, issue refund, recurring billing, subscription management, dunning, trial period, coupon, discount.
- **Scenarios:** 
    - Charging a customer's credit card for a one-time purchase.
    - Setting up a new recurring subscription for a SaaS product.
    - Generating and sending a PDF invoice to a client.
    - Refunding a previously completed transaction.
    - Listing all active customers and their payment methods.
    - Creating a new product and associated pricing plan in the Stripe catalog.
    - Managing payment disputes and chargebacks.
    - Calculating monthly recurring revenue (MRR) from active subscriptions.
    - Applying a discount coupon to a customer's subscription.
    - Onboarding a new customer with a free trial period.
    - Exporting a list of all transactions for a given period for accounting purposes.
    - Checking the status of a specific payment.

## Required credentials

- `STRIPE_SECRET_KEY` — A Stripe secret API key (e.g., `sk_live_...` or `sk_test_...`). Obtain from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

Stripe API keys are not scoped with granular permissions like OAuth tokens. The secret key grants broad access to the API. Ensure the key has the necessary permissions for the intended operations. Restricted keys can be created in the dashboard for limited access.

If `STRIPE_SECRET_KEY` is not set, instruct the user to configure it and stop.

## Helper script

Use `scripts/stripe_api.py` for convenient, high-level operations:

```bash
python scripts/stripe_api.py <command> [args]
```

| Command | Description |
|---|---|
| `create-customer --email EMAIL --name NAME` | Create a new customer |
| `create-charge --customer ID --amount CENTS --currency CUR` | Create a new charge |
| `create-subscription --customer ID --price-id PRICE_ID` | Create a new subscription |
| `list-products [--limit N]` | List all products |
| `create-product --name NAME` | Create a new product |
| `create-price --product-id PROD_ID --amount CENTS --currency CUR` | Create a new price for a product |
| `create-payment-intent --amount CENTS --currency CUR` | Create a Payment Intent |
| `refund-charge --charge-id CHARGE_ID [--amount CENTS]` | Refund a charge |
| `list-customers [--limit N]` | List all customers |
| `get-balance` | Get current account balance |

## Workflow

Stripe uses form-encoded request bodies for POST requests and Bearer token authentication with the secret key.

### 1. Create a Customer

**Endpoint:** `POST https://api.stripe.com/v1/customers`

```bash
curl https://api.stripe.com/v1/customers \
  -u $STRIPE_SECRET_KEY: \
  -d email="customer@example.com" \
  -d name="Jane Doe" \
  -d description="New customer for project X"
```

### 2. Search for Customers

**Endpoint:** `GET https://api.stripe.com/v1/customers/search`

```bash
# Search for customers with a specific name and email
curl "https://api.stripe.com/v1/customers/search?query=name:'Jane%20Doe'%20AND%20email:'customer@example.com'" \
  -u $STRIPE_SECRET_KEY:
```

### 3. Create a Charge

**Endpoint:** `POST https://api.stripe.com/v1/charges`

```bash
curl https://api.stripe.com/v1/charges \
  -u $STRIPE_SECRET_KEY: \
  -d amount=2000 \
  -d currency=usd \
  -d source="tok_visa" \
  -d description="Charge for product Y"
```

### 4. Create a Subscription

**Endpoint:** `POST https://api.stripe.com/v1/subscriptions`

```bash
# First, create a customer and a price (see other examples)
customer_id="cus_..."
price_id="price_..."

curl https://api.stripe.com/v1/subscriptions \
  -u $STRIPE_SECRET_KEY: \
  -d customer=$customer_id \
  -d "items[0][price]"=$price_id
```

### 5. List All Subscriptions

**Endpoint:** `GET https://api.stripe.com/v1/subscriptions`

```bash
curl "https://api.stripe.com/v1/subscriptions?limit=10&status=active" \
  -u $STRIPE_SECRET_KEY:
```

### 6. Create a Product

**Endpoint:** `POST https://api.stripe.com/v1/products`

```bash
curl https://api.stripe.com/v1/products \
  -u $STRIPE_SECRET_KEY: \
  -d name="Premium Subscription" \
  -d type=service
```

### 7. List All Invoices

**Endpoint:** `GET https://api.stripe.com/v1/invoices`

```bash
curl "https://api.stripe.com/v1/invoices?limit=10&status=paid" \
  -u $STRIPE_SECRET_KEY:
```

### 8. Retrieve a Specific Invoice

**Endpoint:** `GET https://api.stripe.com/v1/invoices/{invoice_id}`

```bash
INVOICE_ID="in_1J..."
curl "https://api.stripe.com/v1/invoices/$INVOICE_ID" \
  -u $STRIPE_SECRET_KEY:
```

### 9. Create a Refund

**Endpoint:** `POST https://api.stripe.com/v1/refunds`

```bash
CHARGE_ID="ch_1J..."
curl https://api.stripe.com/v1/refunds \
  -u $STRIPE_SECRET_KEY: \
  -d charge=$CHARGE_ID \
  -d amount=1000
```

## Pagination

For all list endpoints, Stripe uses cursor-based pagination. Use the `limit` parameter to control the number of objects returned (between 1 and 100). If more objects are available, the response will include a `has_more: true` attribute and a `next_page` attribute containing the ID of the first object in the next page. To fetch the next page, make another request using the `starting_after` parameter with this ID.

```bash
# Get the first page of customers
curl "https://api.stripe.com/v1/customers?limit=5" -u $STRIPE_SECRET_KEY:

# Assume the last customer ID on the first page is "cus_XYZ"
# Get the second page of customers
curl "https://api.stripe.com/v1/customers?limit=5&starting_after=cus_XYZ" -u $STRIPE_SECRET_KEY:
```

## Webhook setup

Stripe can send webhook events to notify your application of account activity. To set up a webhook:

1.  **Create a Webhook Endpoint:**

    ```bash
    curl https://api.stripe.com/v1/webhook_endpoints \
      -u $STRIPE_SECRET_KEY: \
      -d url="https://example.com/my/webhook/handler" \
      -d "enabled_events[]"="charge.succeeded" \
      -d "enabled_events[]"="charge.failed"
    ```

2.  **List Webhook Endpoints:**

    ```bash
    curl https://api.stripe.com/v1/webhook_endpoints -u $STRIPE_SECRET_KEY:
    ```

3.  **Delete a Webhook Endpoint:**

    ```bash
    WEBHOOK_ID="we_..."
    curl -X DELETE "https://api.stripe.com/v1/webhook_endpoints/$WEBHOOK_ID" -u $STRIPE_SECRET_KEY:
    ```

## Multi-step workflows

### Complete Customer Onboarding Flow

1.  Create a `Customer` with their email and name.
2.  Create a `Subscription` for the customer, attaching them to a specific `Price`.
3.  The first invoice is automatically generated and payment is attempted.
4.  Monitor for a `invoice.payment_succeeded` webhook to confirm successful onboarding.

### Weekly Report Generation

1.  List all `Charge` objects from the last 7 days using the `created` parameter with a timestamp range.
2.  Paginate through the results if there are more than 100 charges.
3.  Calculate total revenue and number of transactions.
4.  Generate a summary report and save it to a file.

### Bulk Import and Sync

1.  Read a list of customers from a local CSV file.
2.  For each customer, use the `Search Customers` endpoint to see if they already exist in Stripe.
3.  If a customer does not exist, create a new `Customer` object.
4.  If a customer exists, update their metadata with any new information from the CSV.

## Real-world use cases

- **SaaS Platform:** Automate monthly billing for thousands of subscribers, handle prorations for upgrades/downgrades, and manage trial periods.
- **E-commerce Store:** Process payments from customers worldwide, manage product inventory via metadata, and handle refunds and disputes seamlessly.
- **Marketplace:** Onboard sellers, split payments between the platform and sellers using Stripe Connect, and manage payouts.
- **Consulting Agency:** Generate and send professional invoices to clients for project work, and track payment status automatically.
- **Non-Profit Organization:** Accept one-time and recurring donations, and provide donors with automated receipts.
- **Mobile App:** Enable in-app purchases and subscriptions for digital goods and services using the Stripe mobile SDKs.

## Output format

Return results in structured JSON. For successful actions, confirm the operation and include the object ID.

**Customer Created:**
```json
{
  "ok": true,
  "action": "customer_created",
  "customer_id": "cus_ABC123",
  "message": "Customer created successfully."
}
```

**List of Charges:**
```json
{
  "ok": true,
  "action": "charges_listed",
  "charges": [
    {
      "id": "ch_1J...",
      "amount": 2000,
      "currency": "usd",
      "status": "succeeded"
    },
    {
      "id": "ch_2K...",
      "amount": 1500,
      "currency": "usd",
      "status": "succeeded"
    }
  ]
}
```

## Guardrails

- **Never** expose the `STRIPE_SECRET_KEY` in logs or user-facing output.
- **Never** charge a customer without their explicit consent and a clear description of the charge.
- **Never** delete customers, products, or subscriptions unless explicitly instructed by the user and after double-confirmation.
- **Always** use idempotency keys (`Idempotency-Key` header) for creating charges and other critical operations to prevent duplicate transactions.
- **Always** verify the amount and currency before creating a charge or subscription.
- **Always** handle customer data securely and in compliance with PCI DSS standards.
- **Always** use the `expand` parameter to fetch related objects in a single API call to avoid extra requests.
- **Always** store Stripe object IDs (e.g., `cus_...`, `sub_...`) locally for future reference.
- **Do not** run data-intensive list operations during peak business hours to avoid API rate limiting.
- **Validate** webhook signatures to ensure requests are genuinely from Stripe.

## Rate limits

Stripe allows up to 100 read and 100 write operations per second in live mode (25 in test mode). If the limit is exceeded, the API returns an HTTP `429` error. Implement a retry mechanism with exponential backoff.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `invalid_request_error` | Invalid parameters in request | Check API documentation for correct parameters. |
| `api_key_expired` | The API key has expired | Generate a new key from the Stripe Dashboard. |
| `authentication_error` | Invalid or missing API key | Verify `STRIPE_SECRET_KEY` is set correctly. |
| `card_error` | Card declined by the payment gateway | Instruct the user to ask the customer to try a different card. |
| `rate_limit_error` | Too many requests in a short period | Retry the request after a short delay, using an exponential backoff strategy. |
| `resource_missing` | The requested object (e.g., customer, charge) does not exist | Verify the ID is correct. List resources to find the correct ID. |
| `idempotency_error` | An idempotency key was reused with a different request body | Ensure a unique idempotency key is generated for each new request. |
| `processing_error` | An error occurred during payment processing | The error is intermittent; retry the request. If it persists, contact Stripe support. |
| `account_invalid` | The Stripe account is invalid or restricted | Contact Stripe support to resolve issues with the account. |
| `webhook_signing_error` | The webhook signature is invalid | Verify the webhook signing secret and the signature generation logic. |

## Reference files

- **`references/api-reference.md`** — Detailed Stripe API endpoint documentation, including all parameters, response schemas, and error codes.
