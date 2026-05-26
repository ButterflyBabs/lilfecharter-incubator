# PopLinks / Page Sprout API Reference

## Authentication
```
Authorization: Bearer UYUp3qUqz4u289du8UWK8B60rRbzG7N5
```

## Base URL
```
https://api.poplinks.io/api/ai
```

---

## PopLinks

### Create PopLink
```http
POST /poplinks
Content-Type: application/json

{
  "name": "Link Name",
  "destination_url": "https://example.com",
  "visible_url": "slug",
  "domain_id": 1977,
  "status": "ACTIVE"
}
```

### List Domains
```http
GET /domains
```

---

## Lead Pages

### Create Lead Page
```http
POST /lead-pages
Content-Type: application/json

{
  "name": "Page Name"
}
```

### Update URL
```http
PUT /lead-pages/{id}/url
Content-Type: application/json

{
  "leadpage_keyword": "slug",
  "conf_keyword": "slug-thanks",
  "domain_id": 1977,
  "domain_type": "personal"
}
```

### Update Headline
```http
PUT /lead-pages/{id}/headline
Content-Type: application/json

{
  "main_headline": "<b>Line 1</b><br><u>Line 2</u><br><i>Line 3</i>"
}
```

### Update Bullets
```http
PUT /lead-pages/{id}/bullets
Content-Type: application/json

{
  "bullet_title": "Title:",
  "bullets": [
    {"name": "Bullet 1"},
    {"name": "Bullet 2"},
    {"name": "Bullet 3"},
    {"name": "Bullet 4"},
    {"name": "Bullet 5"}
  ]
}
```

---

## Bridge Pages

### Create Bridge Page
```http
POST /bridge-pages
Content-Type: application/json

{
  "name": "Bridge Page Name"
}
```

### Clone Bridge Page
```http
POST /bridge-pages/{id}/clone
```

### Update URL
```http
PUT /bridge-pages/{id}/url
Content-Type: application/json

{
  "leadpage_keyword": "slug",
  "domain_id": 1977
}
```

---

## Domain ID Reference

| Domain | ID |
|--------|-----|
| chadnicely.com | 1977 |

