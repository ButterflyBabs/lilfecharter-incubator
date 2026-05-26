# MintBird API Reference

## Authentication
```
Authorization: Bearer z12Y1nJjkG275WIEJKM58QsnGoAoIhuW
```

## Base URL
```
https://api.poplinks.io/api/ai
```

---

## AI Sales Page Generation (Async)

### Start Generation
```http
POST /sales-page/generate
Content-Type: application/json

{
  "prompt": "Create a sales page for...",
  "name": "Product Name",
  "sub_type": "salespage",
  "is_orderform": true,
  "orderform_step": "one"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "job_key": "uuid-here"
  }
}
```

### Poll Status
```http
GET /sales-page/status/{job_key}
```

**Processing Response:**
```json
{
  "data": {
    "status": "processing"
  }
}
```

**Done Response:**
```json
{
  "data": {
    "status": "done",
    "id": 12345,
    "view_url": "https://..."
  }
}
```

**Poll every 5-7 seconds. Typical time: 60-120 seconds.**

---

## Products

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 27.00,
  "type": "digital",
  "payment_provider": "stripe",
  "payment_integration_id": 640
}
```

### List Products
```http
GET /products
```

---

## Sales Pages

### List Sales Pages
```http
GET /sales-pages
```

### Get Sales Page
```http
GET /sales-pages/{id}
```

### Link Product to Sales Page
```http
POST /sales-pages/link-product
Content-Type: application/json

{
  "sales_page_id": 12345,
  "product_id": 67890,
  "payment_option_type": "dropdown",
  "is_one_time_payment": 1,
  "is_two_time_payment": 0,
  "is_subscription_payment": 0
}
```

### Link Product to Funnel Step
```http
POST /sales-pages/link-product-funnel
Content-Type: application/json

{
  "sales_page_id": 12345,
  "product_id": 67890,
  "step_type": "sales_page",
  "product_payment_option_ids": [111, 222]
}
```

---

## Sales Funnels

### Create Funnel
```http
POST /sales-funnels
Content-Type: application/json

{
  "name": "Funnel Name",
  "description": "Funnel description"
}
```

### Set Funnel Payment Provider
```http
POST /sales-funnels/{id}/payment-settings
Content-Type: application/json

{
  "payment_provider": "stripe",
  "payment_integration_id": 640,
  "account_name": "Nicely Media LLC"
}
```

**Note:** Set payment provider once at funnel level. All products in funnel inherit this setting.

### Add Step to Funnel
```http
POST /sales-funnels/{id}/steps
Content-Type: application/json

{
  "sales_page_id": 12345,
  "step_type": "sales_page",
  "name": "Step Name"
}
```

**Step Types:**
- `sales_page` — Front offer
- `upsell` — Upsell page
- `downsell` — Downsell page
- `orderform` — Order form
- `confpage` — Confirmation page

### List Funnel Steps
```http
GET /sales-funnels/{id}/steps
```

---

## Payment Options

### Create Payment Plan
```http
POST /products/{id}/payment-plans
Content-Type: application/json

{
  "product_payment_option_id": 123
}
```

---

## Page Sub-Types

| Type | Description |
|------|-------------|
| `salespage` | Standard sales page |
| `orderform` | Checkout/order form |
| `upsale` | Upsell page |
| `downsale` | Downsell page |
| `confpage` | Confirmation page |
| `signuppage` | Opt-in/signup page |

---

## Stripe Integration

**Default Account:** Nicely Media LLC  
**Integration ID:** 640

```json
{
  "payment_provider": "stripe",
  "payment_integration_id": 640
}
```

