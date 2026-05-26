---
name: unsplash-media
description: "Seamlessly search, discover, and integrate millions of high-resolution, royalty-free images from Unsplash directly into your projects. Use this skill to find the perfect visuals for marketing campaigns, presentations, websites, and creative content, leveraging powerful search and filtering capabilities."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["UNSPLASH_ACCESS_KEY"],"bins":["curl"]},"primaryEnv":"UNSPLASH_ACCESS_KEY","emoji":"🖼️"}}
---

# Unsplash Media

This skill provides comprehensive access to the Unsplash API, allowing you to search for and retrieve high-quality stock photos for any creative or business need.

## When to activate

**Keywords:**
- Unsplash, stock photo, image search, royalty-free images, high-resolution photos
- Find visuals, background image, header image, marketing image, presentation photo
- Creative assets, design resources, photo library, image API, picture search
- Download image, fetch photo, get wallpaper, find artwork, source visuals
- Photo discovery, curated collections, topic-based images, free-to-use photos

**Scenarios:**
- The user needs to find a specific type of image for a new marketing campaign (e.g., "Find images of people working remotely").
- A content creator is looking for a high-quality background for a blog post or social media graphic.
- A web developer needs to populate a new website template with placeholder or final images.
- A marketing team wants to create a mood board by gathering a collection of inspirational photos.
- The user asks to find a new desktop wallpaper based on a theme like "nature" or "cityscapes."
- An application needs to programmatically fetch and display images based on user-generated content or tags.
- A presentation designer is searching for compelling visuals to include in a slide deck.
- The user wants to explore curated photo collections around topics like "technology," "business," or "travel."
- A social media manager needs a stream of fresh, relevant images for daily posts.
- The user is building a feature that allows their own users to search for and select Unsplash images within an application.

## Required credentials

- `UNSPLASH_ACCESS_KEY` — An Unsplash Access Key is required to authenticate with the API. You can obtain one from the [Unsplash Developer Portal](https://unsplash.com/developers).

## Helper script

For common operations, you can use the provided helper script `scripts/unsplash_media_api.py`.

```bash
python scripts/unsplash_media_api.py <command> [args]
```

| Command | Description |
|---|---|
| `search-photos --query Q [--limit N]` | Search for photos matching a specific query. |
| `get-photo --photo-id ID` | Retrieve detailed information for a single photo. |
| `list-photos [--limit N]` | Get a list of the latest photos. |
| `get-random-photo [--query Q]` | Fetch a random photo, optionally filtered by a query. |
| `list-collections` | List all curated photo collections. |
| `get-user-photos --username U` | Get a list of photos uploaded by a specific user. |

## Workflow

### 1. Search for Photos
**Endpoint:** `GET /search/photos`

Search for photos by keyword. Use the `query` parameter to specify what you're looking for.

```bash
curl -X GET "https://api.unsplash.com/search/photos?query=minimalist office&per_page=10" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 2. Get a Specific Photo
**Endpoint:** `GET /photos/:id`

Retrieve a single photo by its unique ID.

```bash
curl -X GET "https://api.unsplash.com/photos/F_r83OJ3Q_M" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 3. Get a Random Photo
**Endpoint:** `GET /photos/random`

Fetch a random photo. You can add a `query` to get a random photo from a specific category.

```bash
curl -X GET "https://api.unsplash.com/photos/random?query=technology" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 4. List Collections
**Endpoint:** `GET /collections`

Retrieve a list of curated photo collections.

```bash
curl -X GET "https://api.unsplash.com/collections?per_page=10" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 5. Get a Collection's Photos
**Endpoint:** `GET /collections/:id/photos`

Retrieve all photos within a specific collection.

```bash
curl -X GET "https://api.unsplash.com/collections/158641/photos?per_page=10" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 6. Get User's Public Profile
**Endpoint:** `GET /users/:username`

Retrieve the public profile information for a given user.

```bash
curl -X GET "https://api.unsplash.com/users/anniespratt" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

### 7. Track a Photo Download
**Endpoint:** `GET /photos/:id/download`

To comply with the Unsplash API guidelines, you must trigger a download endpoint when a photo is downloaded. This also provides a temporary redirect to the file.

```bash
curl -X GET "https://api.unsplash.com/photos/F_r83OJ3Q_M/download" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

## Pagination

When retrieving lists of photos or collections, the API uses pagination. You must use the `page` and `per_page` parameters to navigate through the results.

- `page`: The page number to retrieve. (Default: 1)
- `per_page`: The number of items per page. (Default: 10, Max: 30)

**Example:** Retrieve the second page of "nature" photos with 20 results per page.
```bash
curl -X GET "https://api.unsplash.com/search/photos?query=nature&page=2&per_page=20" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

## Multi-step workflows

### Workflow 1: Find and Download an Image for a Blog Post
1. **Search for relevant photos:** Use the `search-photos` command with a descriptive query.
2. **Select a photo:** From the search results, the user selects a photo ID.
3. **Retrieve photo details:** Use the `get-photo` command to get the full-size image URL.
4. **Track the download:** Call the `/photos/:id/download` endpoint to comply with API terms.

### Workflow 2: Create a Curated Photo Collection for a Project
1. **Search for a base theme:** Use `search-photos` to find initial images (e.g., "corporate wellness").
2. **Identify a relevant collection:** Use `list-collections` and inspect the titles and descriptions.
3. **Explore the collection:** Use `get-collection-photos` to view all images within the chosen collection.
4. **Gather user photos:** If a specific photographer's style is liked, use `get-user-photos` to see more of their work.

## Real-world use cases

- **Automated Content Creation:** A marketing automation platform uses this skill to find and insert relevant, high-quality images into email newsletters and social media posts based on the content's theme.
- **Website Development:** A CMS or website builder integrates the skill to allow users to search and embed Unsplash images directly into their web pages without leaving the platform.
- **Presentation Software:** A tool like PowerPoint or Google Slides could use this skill to offer a built-in image search feature for users to enhance their presentations.
- **Dynamic Digital Signage:** A digital signage system dynamically pulls and displays images based on time of day, weather, or current events (e.g., "sunny beach" photos on a warm day).
- **In-App Image Selection:** A social media scheduling app allows its users to search for and attach professional photos to their scheduled posts.
- **Theme Customization:** A theme provider for a platform like Shopify or WordPress could let users search for a hero image that matches their brand's aesthetic.

## Output format

Responses should be in structured JSON. Include confirmation of the action and key details from the result.

**Search Success:**
```json
{
  "status": "success",
  "operation": "search_photos",
  "query": "minimalist office",
  "results_found": 7512,
  "photos": [
    {
      "id": "F_r83OJ3Q_M",
      "description": "A clean, modern office space with a laptop on a white desk.",
      "urls": {
        "regular": "https://images.unsplash.com/photo-15..."
      },
      "user": {
        "name": "Annie Spratt"
      }
    }
  ]
}
```

**Get Photo Success:**
```json
{
  "status": "success",
  "operation": "get_photo",
  "photo": {
    "id": "F_r83OJ3Q_M",
    "created_at": "2021-05-01T12:00:00Z",
    "description": "A clean, modern office space with a laptop on a white desk.",
    "urls": {
      "full": "https://images.unsplash.com/photo-15...",
      "regular": "https://images.unsplash.com/photo-15..."
    },
    "views": 1500000,
    "downloads": 25000
  }
}
```

## Guardrails

- **Never** expose the `UNSPLASH_ACCESS_KEY` in output, logs, or stored files.
- **Always** respect the API rate limits to avoid being blocked.
- **Always** trigger the download endpoint for every photo downloaded to credit the photographer.
- **Do not** use the API for any illegal, abusive, or harmful purposes.
- **Cache** results when appropriate to reduce redundant API calls, but respect cache-control headers.
- **Verify** that search queries are non-malicious and appropriate for a general audience.
- **Handle** cases where no results are found gracefully by informing the user.
- **Do not** attempt to reverse-engineer or scrape the Unsplash website; use only the official API endpoints.
- **Attribute** photographers and Unsplash where possible, as per the API guidelines.
- **Ensure** that any application using the API provides a clear user experience and does not mislead users about the source of the images.

## Rate limits

The Unsplash API has a rate limit to ensure fair usage for all developers.

- **Demo Apps:** 50 requests per hour.
- **Production Apps:** 5,000 requests per hour (once approved).

Exceeding this limit will result in a `403 Forbidden` response. Check the `X-Ratelimit-Limit` and `X-Ratelimit-Remaining` headers in the API response to monitor your usage.

## Failure handling

| HTTP Status | Error | Cause | Resolution |
|---|---|---|---|
| `400 Bad Request` | `errors` in body | A required parameter is missing or invalid. | Review the API documentation for the endpoint and correct the request parameters. |
| `401 Unauthorized` | `OAuth error` | The `UNSPLASH_ACCESS_KEY` is missing, invalid, or revoked. | Verify the `UNSPLASH_ACCESS_KEY` is correct and has the necessary permissions. |
| `403 Forbidden` | `Rate Limit Exceeded` | You have made too many requests in a given time frame. | Check the `X-Ratelimit-Remaining` header and wait until the limit resets. Implement caching to reduce calls. |
| `403 Forbidden` | `Permission denied` | You are trying to access an endpoint your key does not have permission for. | Check your application's scope and permissions in the Unsplash Developer Portal. |
| `404 Not Found` | `Not Found` | The requested resource (photo, collection, user) does not exist. | Verify the ID or username is correct. Inform the user the item could not be found. |
| `500 Internal Server Error` | `Server Error` | An unexpected error occurred on Unsplash's servers. | This is a server-side issue. Retry the request after a short delay (e.g., exponential backoff). |
| `503 Service Unavailable` | `Service Unavailable` | The Unsplash API is temporarily down for maintenance or is overloaded. | The service is temporarily unavailable. Advise the user to try again later. |

## Reference files

- **`references/api-reference.md`** — This document contains a full Unsplash API endpoint reference, parameter details, and response schemas.
