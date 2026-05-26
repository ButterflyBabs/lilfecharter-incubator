---
name: plaid-finance
description: "Unlock comprehensive financial data aggregation and account management with the Plaid API. This skill enables seamless bank account linking, real-time transaction retrieval, balance verification, identity confirmation, investment tracking, and liability analysis. Activate this skill for any task involving personal or business financial data access, verification, or analysis to build powerful fintech applications."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["PLAID_CLIENT_ID","PLAID_SECRET","PLAID_ENV"],"bins":["curl"]},"primaryEnv":"PLAID_CLIENT_ID","emoji":"🏦"}}
---

# Plaid Finance

Manage financial data and accounts using the Plaid API, enabling bank linking, transaction retrieval, balance checks, identity verification, investment tracking, and liability analysis.

## When to activate

Use this skill when the user mentions any of the following keywords or scenarios:

- **Keywords:** Plaid, bank account, transactions, balance, identity, investments, liabilities, financial data, link bank, account management, credit score, income verification, asset verification, bank statement, loan application, payment processing, budgeting app, financial planning, wealth management, KYC, AML.
- **Scenarios:**
    - A user wants to connect their bank account to a new budgeting app.
    - A lender needs to verify a loan applicant's income and assets.
    - A financial advisor needs to get a holistic view of a client's investment portfolio.
    - A company wants to streamline its accounts payable process by verifying vendor bank accounts.
    - A user wants to check their credit score.
    - A developer is building a feature to detect and prevent fraudulent transactions.
    - A user wants to get a copy of their bank statement for a specific period.
    - A business needs to comply with KYC and AML regulations by verifying customer identities.
    - A user wants to analyze their spending habits over the past year.
    - A company wants to offer personalized financial advice to its users based on their transaction history.
    - A user is applying for a mortgage and needs to provide proof of funds.
    - A developer is building a peer-to-peer payment app.

## Required credentials

- `PLAID_CLIENT_ID` — Your Plaid client ID. Obtain from the [Plaid Dashboard](https://dashboard.plaid.com/developers/keys).
- `PLAID_SECRET` — Your Plaid secret key. Obtain from the [Plaid Dashboard](https://dashboard.plaid.com/developers/keys).
- `PLAID_ENV` — The Plaid environment to use (`sandbox`, `development`, or `production`).

If `PLAID_CLIENT_ID`, `PLAID_SECRET`, or `PLAID_ENV` are not set, instruct the user to configure them and stop.

## Helper script

Use `scripts/plaid_api.py` for common operations without writing boilerplate:

```bash
python scripts/plaid_api.py <command> [args]
```

| Command | Description |
|---|---|
| `create-link-token` | Create a Link Token for initializing Plaid Link |
| `exchange-public-token --public-token TOKEN` | Exchange a public token for an access token |
| `get-transactions --access-token TOKEN` | Retrieve transactions for an account |
| `sync-transactions --access-token TOKEN` | Sync transactions using a cursor |
| `get-balances --access-token TOKEN` | Retrieve account balances |
| `get-accounts --access-token TOKEN` | Retrieve account information |
| `get-identity --access-token TOKEN` | Retrieve identity information |
| `get-investments-holdings --access-token TOKEN` | Retrieve investment holdings |
| `get-investments-transactions --access-token TOKEN` | Retrieve investment transactions |
| `get-liabilities --access-token TOKEN` | Retrieve liabilities information |
| `get-institution-by-id --institution-id ID` | Retrieve institution by ID |
| `search-institutions --query QUERY` | Search for institutions |
| `get-item --access-token TOKEN` | Retrieve item information |
| `remove-item --access-token TOKEN` | Remove an item |

The script reads `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV` from the environment automatically.

## Workflow

### 1. Create a Link Token

**Endpoint:** `POST /link/token/create`

```bash
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "client_name": "OpenClaw App",
    "user": {"client_user_id": "user-id"},
    "products": ["auth", "transactions"],
    "country_codes": ["US"],
    "language": "en"
  }'
```

### 2. Exchange Public Token for Access Token

**Endpoint:** `POST /item/public_token/exchange`

```bash
curl -X POST https://sandbox.plaid.com/item/public_token/exchange \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "public_token": "public-sandbox-xxxx"
  }'
```

### 3. Get Transactions

**Endpoint:** `POST /transactions/get`

```bash
curl -X POST https://sandbox.plaid.com/transactions/get \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx",
    "start_date": "2023-01-01",
    "end_date": "2023-01-31"
  }'
```

### 4. Get Account Balances

**Endpoint:** `POST /accounts/balance/get`

```bash
curl -X POST https://sandbox.plaid.com/accounts/balance/get \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx"
  }'
```

### 5. Get Identity Information

**Endpoint:** `POST /identity/get`

```bash
curl -X POST https://sandbox.plaid.com/identity/get \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx"
  }'
```

### 6. Create Asset Report

**Endpoint:** `POST /asset_report/create`

```bash
curl -X POST https://sandbox.plaid.com/asset_report/create \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_tokens": ["access-sandbox-xxxx"],
    "days_requested": 730,
    "options": {
      "client_report_id": "client-report-id-123"
    }
  }'
```

### 7. Get Income Verification

**Endpoint:** `POST /income/verification/create`

```bash
curl -X POST https://sandbox.plaid.com/income/verification/create \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx"
  }'
```

## Pagination

When retrieving a large number of items, such as transactions, the response will be paginated. Use the `count` and `offset` parameters to control the number of items returned and the starting point.

- `count`: The number of items to return (default: 100, max: 500).
- `offset`: The number of items to skip.

Example of fetching the second page of 50 transactions:

```bash
curl -X POST https://sandbox.plaid.com/transactions/get \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx",
    "start_date": "2023-01-01",
    "end_date": "2023-01-31",
    "options": {
      "count": 50,
      "offset": 50
    }
  }'
```

## Webhook setup

Plaid uses webhooks to notify you of events, such as new transactions or when an Item is in an error state. To receive webhooks, you must configure a webhook URL in the Plaid Dashboard.

### 1. Update Webhook URL

**Endpoint:** `POST /item/webhook/update`

```bash
curl -X POST https://sandbox.plaid.com/item/webhook/update \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "$PLAID_CLIENT_ID",
    "secret": "$PLAID_SECRET",
    "access_token": "access-sandbox-xxxx",
    "webhook": "https://your-webhook-url.com/plaid-events"
  }'
```

## Multi-step workflows

### 1. Complete Customer Onboarding Flow

1.  Create a `link_token` for the user.
2.  The user links their bank account using Plaid Link, which gives you a `public_token`.
3.  Exchange the `public_token` for an `access_token`.
4.  Use the `access_token` to retrieve the user's identity information for KYC.
5.  Retrieve the user's account and routing numbers for setting up payments.

### 2. Weekly Report Generation

1.  For each user, retrieve their latest transactions using the `/transactions/get` endpoint.
2.  Categorize the transactions to identify spending patterns.
3.  Generate a report summarizing the user's weekly spending and send it to them.

## Real-world use cases

- **Personal Finance Management:** Aggregate data from multiple financial institutions to provide users with a holistic view of their finances.
- **Lending:** Verify a borrower's income, assets, and identity to make more informed lending decisions.
- **Payments:** Reduce payment failures and fraud by verifying account ownership and balance before initiating a transfer.
- **Brokerage:** Streamline account funding and reduce settlement times by using Plaid to authorize ACH transfers.
- **Business Financial Management:** Help businesses manage their cash flow, track expenses, and reconcile their accounts.
- **Real Estate:** Simplify the mortgage application process by allowing applicants to securely share their financial data with lenders.

## Output format

Always return results in structured JSON. For successful operations, confirm the action taken and include key identifiers. For list operations, present results as a formatted table with key fields (e.g., transaction details, account names, balances).

### Successful Transaction Retrieval

```json
{
  "ok": true,
  "action": "transactions_retrieved",
  "item": {
    "item_id": "xxxx",
    "institution_id": "yyyy"
  },
  "transactions": [
    {
      "transaction_id": "zzzz",
      "name": "Starbucks",
      "amount": 5.50,
      "date": "2023-01-15"
    }
  ]
}
```

### Error Response

```json
{
  "ok": false,
  "error_code": "ITEM_NOT_FOUND",
  "error_message": "The requested item could not be found."
}
```

## Guardrails

- **Never** expose `PLAID_CLIENT_ID`, `PLAID_SECRET`, or `access_token` in output or logs.
- **Never** initiate financial transactions or move funds without explicit user consent.
- **Always** confirm with the user before removing an item (disconnecting a bank account).
- **Always** specify the `country_codes` and `language` when creating a Link Token.
- **Always** use HTTPS for your webhook URL.
- **Always** verify the signature of incoming webhooks to ensure they are from Plaid.
- **Do not** store raw financial data on your servers unless it is absolutely necessary and you are compliant with all relevant security regulations (e.g., PCI DSS).
- **Be mindful** of the data you are requesting and only ask for the scopes you need.
- **Handle** rate limits gracefully by implementing exponential backoff.
- **Provide** clear error messages to the user when something goes wrong.

## Rate limits

Plaid's rate limits vary by product and plan. If a `429` HTTP status code is received, wait for the number of seconds specified in the `Retry-After` header before retrying the request.

| Endpoint | Max Requests per Item | Max Requests per Client |
|---|---|---|
| `/accounts/balance/get` | 5 per minute | 1,200 per minute |
| `/accounts/get` | 15 per minute | 15,000 per minute |
| `/transactions/get` | 30 per minute | 20,000 per minute |
| `/identity/get` | 15 per minute | 2,000 per minute |
| `/item/get` | 15 per minute | 5,000 per minute |

## Failure handling

| Error | Cause | Resolution |
|---|---|---|
| `ITEM_NOT_FOUND` | The `item_id` or `access_token` is invalid. | Ensure the correct `access_token` is used for the requested item. |
| `INVALID_INPUT` | One or more request parameters are invalid. | Check the API documentation for the correct parameters and their types. |
| `PRODUCT_NOT_READY` | The requested product is not yet ready for the item. | Wait for the product to become ready or try a different product. |
| `RATE_LIMIT_EXCEEDED` | Too many requests in a short period. | Wait for the `Retry-After` header seconds, then retry. |
| `ACCESS_TOKEN_EXPIRED` | The `access_token` has expired. | Re-authenticate the user to generate a new `access_token`. |
| `INSTITUTION_NOT_FOUND` | The institution ID is invalid. | Use `institutions/search` to find valid institution IDs. |
| `INSTITUTION_DOWN` | The financial institution is currently unavailable. | Try again later. Check the Plaid status page for more information. |
| `USER_PERMISSION_REVOKED` | The user has revoked your access to their account. | Notify the user and prompt them to re-link their account. |
| `INVALID_API_KEYS` | The `client_id` or `secret` is incorrect. | Verify your API keys in the Plaid Dashboard. |
| `MFA_NOT_SUPPORTED` | The institution requires a form of multi-factor authentication that Plaid does not support. | Inform the user that they will not be able to link this account. |

If any API call returns an error, extract the `error_code` and `error_message` fields and report them to the user with the resolution from the table above.

## Reference files

Read these only when detailed parameter info is needed:

- **`references/api-reference.md`** — Full Plaid API endpoint reference with parameters, response schemas, and pagination
