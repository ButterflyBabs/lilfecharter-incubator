---
name: imagekit-media
description: "Unlock powerful, on-the-fly image and video transformations, optimization, and delivery with the ImageKit API. Use this skill to manage your entire media lifecycle, from uploading and organizing assets to delivering perfectly optimized content on your website or app."
version: 2.0.0
license: Proprietary
metadata: {"openclaw":{"requires":{"env":["IMAGEKIT_PRIVATE_KEY"],"bins":["curl"]},"primaryEnv":"IMAGEKIT_PRIVATE_KEY","emoji":"🖼️"}}
---

# ImageKit Media

Automate your media workflows with the ImageKit API. This skill provides comprehensive tools for asset management, including file uploads, transformations, optimization, and delivery, helping you deliver high-quality, responsive media with ease.

## When to activate

Activate this skill for any tasks involving media asset management on the ImageKit platform. Look for the following keywords and scenarios:

- **Keywords:** ImageKit, media library, image optimization, video transformation, digital asset management, DAM, CDN, image resize, video compression, media delivery, asset upload, image tagging
- **Scenarios:**
    - A user wants to upload a new product image to their e-commerce store.
    - A marketing team needs to resize a batch of promotional images for a social media campaign.
    - A developer is looking to integrate a media library into a new web application.
    - A content manager needs to organize and tag a large collection of video assets.
    - A user wants to apply a watermark to all images in a specific folder.
    - A team needs to generate thumbnails for a video gallery.
    - A user wants to search for images with a specific tag.
    - A developer needs to purge the CDN cache for a specific image.
    - A user wants to get analytics on their media assets.
    - A team needs to set up a webhook to be notified of new uploads.
    - A user wants to bulk delete outdated images.
    - A developer needs to generate a signed URL for a private image.

## Required credentials

- `IMAGEKIT_PRIVATE_KEY` — Your ImageKit private API key. You can find this in your [ImageKit Dashboard](https://imagekit.io/dashboard/developer/api-keys) under the API Keys section. Ensure the key has the necessary permissions for the operations you want to perform.

If the `IMAGEKIT_PRIVATE_KEY` is not set, the skill should stop and instruct the user to configure it.

## Helper script

For more complex operations, you can use the `scripts/imagekit_api.py` helper script:

```bash
python scripts/imagekit_api.py <command> [args]
```

| Command | Description |
|---|---|
| `upload-file --file PATH --file-name NAME [--folder PATH]` | Upload a new media file. |
| `list-files [--limit N] [--skip N]` | List media files with pagination. |
| `get-file-details --file-id ID` | Retrieve details of a specific file. |
| `delete-file --file-id ID` | Delete a media file. |
| `update-file-metadata --file-id ID --tags TAGS` | Update metadata or tags for a file. |
| `bulk-delete-files --file-ids ID1,ID2,...` | Delete multiple files in bulk. |
| `bulk-move-files --source-folder PATH --dest-folder PATH` | Move files from one folder to another in bulk. |
| `generate-url --file-path PATH [--transformation JSON]` | Generate a transformed URL for a file. |
| `get-file-metadata --file-id ID` | Retrieve metadata for a file. |
| `update-file-metadata-custom --file-id ID --payload JSON` | Update custom metadata fields for a file. |

## Workflow

All API endpoints are available under `https://api.imagekit.io/v1` and require HTTP Basic Authentication with your private key as the username.

### 1. Upload a File

**Endpoint:** `POST https://api.imagekit.io/v1/files/upload`

```bash
curl -X POST "https://api.imagekit.io/v1/files/upload" \
  -u $IMAGEKIT_PRIVATE_KEY: \
  -F file=@/path/to/image.jpg \
  -F fileName="image.jpg" \
  -F folder="/products"
```

### 2. List and Search Files

**Endpoint:** `GET https://api.imagekit.io/v1/files`

```bash
curl -G "https://api.imagekit.io/v1/files" \
  -u $IMAGEKIT_PRIVATE_KEY: \
  --data-urlencode "searchQuery=tags: 'sale' AND format: 'jpg'" \
  --data-urlencode "limit=100"
```

### 3. Get File Details

**Endpoint:** `GET https://api.imagekit.io/v1/files/{fileId}`

```bash
curl "https://api.imagekit.io/v1/files/your_file_id" \
  -u $IMAGEKIT_PRIVATE_KEY:
```

### 4. Bulk Delete Files

**Endpoint:** `POST https://api.imagekit.io/v1/files/batch/deleteByFileIds`

```bash
curl -X POST "https://api.imagekit.io/v1/files/batch/deleteByFileIds" \
  -u $IMAGEKIT_PRIVATE_KEY: \
  -H "Content-Type: application/json" \
  -d '{"fileIds":["file_id_1","file_id_2"]}'
```

### 5. Purge CDN Cache

**Endpoint:** `POST https://api.imagekit.io/v1/files/purge`

```bash
curl -X POST "https://api.imagekit.io/v1/files/purge" \
  -u $IMAGEKIT_PRIVATE_KEY: \
  -H "Content-Type: application/json" \
  -d '{"url":"https://ik.imagekit.io/your_imagekit_id/image.jpg"}'
```

### 6. Get File Versions

**Endpoint:** `GET https://api.imagekit.io/v1/files/{fileId}/versions`

```bash
curl "https://api.imagekit.io/v1/files/your_file_id/versions" \
  -u $IMAGEKIT_PRIVATE_KEY:
```

## Pagination

For endpoints that return a list of items, such as `list-files`, ImageKit uses `skip` and `limit` parameters for pagination. 

- `limit`: The number of results to return per page (default is 1000, max is 1000).
- `skip`: The number of results to skip from the beginning.

To fetch the second page of 50 results, you would use `limit=50` and `skip=50`.

## Webhook setup

ImageKit can send webhooks to your server for various events. To set up a webhook:

1.  Go to the [Webhooks](https://imagekit.io/dashboard/webhooks) section in your ImageKit dashboard.
2.  Click "Add new" and enter the URL of your webhook endpoint.
3.  Select the events you want to be notified about (e.g., `file.created`, `file.deleted`).
4.  Secure your webhook endpoint by verifying the signature provided in the `x-imagekit-signature` header of each request.

## Multi-step workflows

### Watermark all images in a folder

1.  List all files in the target folder.
2.  For each file, generate a new URL with a watermark transformation.
3.  (Optional) Overwrite the original files with the watermarked versions.

### Weekly Media Report

1.  Use the `list-files` endpoint with a date filter to get all files uploaded in the last week.
2.  Get file details for each file to get metadata like tags and size.
3.  Generate a summary report with the total number of uploads, total size, and a breakdown by file type.

## Real-world use cases

- **E-commerce:** Automatically resize and optimize product images for fast-loading product pages.
- **Social Media:** Create multiple versions of a marketing image for different social media platforms.
- **User-Generated Content:** Allow users to upload their own images and videos, and automatically moderate them.
- **Blog/News Site:** Deliver responsive images that are optimized for the user's device and screen size.
- **Internal Asset Management:** Create a centralized media library for your team to store, organize, and share assets.
- **Video Streaming:** Transcode videos to different formats and bitrates for adaptive streaming.

## Output format

Return results in structured JSON. For successful actions, confirm the operation and include the relevant object ID or URL.

**File Upload:**
```json
{
  "success": true,
  "action": "file_uploaded",
  "file_id": "631f25c7e8f1f537c839a91c",
  "url": "https://ik.imagekit.io/your_imagekit_id/products/image.jpg",
  "message": "File uploaded successfully."
}
```

**File List:**
```json
{
  "success": true,
  "action": "files_listed",
  "files": [
    {
      "fileId": "631f25c7e8f1f537c839a91c",
      "name": "image.jpg",
      "url": "https://ik.imagekit.io/your_imagekit_id/products/image.jpg",
      "tags": ["sale", "new"],
      "size": 123456
    }
  ]
}
```

## Guardrails

- **Never** expose the `IMAGEKIT_PRIVATE_KEY` in logs or user-facing output.
- **Never** delete files without explicit user confirmation.
- **Always** validate file types and sizes before uploading to prevent abuse.
- **Always** use HTTPS to protect data in transit.
- **Always** handle user data in compliance with privacy and copyright laws.
- **Always** implement proper error handling and retry logic for API calls.
- **Be mindful** of the rate limits to avoid being blocked.
- **Use** signed URLs for private content to prevent unauthorized access.
- **Regularly** audit your media library for unused assets to save storage space.
- **Consider** using webhooks to automate your media workflows.

## Rate limits

ImageKit enforces a rate limit of 1000 requests per minute per API key for most APIs. The upload API has a limit of 500 requests per minute. If you exceed the limit, the API will return an HTTP `429 Too Many Requests` error. Implement exponential backoff for retries.

## Failure handling

| Error Code | Cause | Resolution |
|---|---|---|
| `invalid_request` | A required parameter is missing or invalid. | Check the API documentation for the correct parameters and format. |
| `authentication_failed` | The API key is invalid or missing. | Verify that the `IMAGEKIT_PRIVATE_KEY` is set correctly. |
| `file_not_found` | The specified file ID does not exist. | Confirm the file ID is correct or use `list-files` to find it. |
| `rate_limit_exceeded` | Too many requests have been made in a short period. | Wait and retry the request after a short delay. Implement exponential backoff. |
| `unsupported_file_type` | The uploaded file type is not supported. | Ensure the file format is one of the supported types (e.g., JPG, PNG, MP4). |
| `internal_server_error` | An unexpected error occurred on the ImageKit server. | Retry the request after a short delay. If the error persists, contact ImageKit support. |
| `bad_request` | The request is malformed. | Check the request syntax and ensure it is valid JSON. |
| `forbidden` | You do not have permission to perform this action. | Check the permissions of your API key in the ImageKit dashboard. |
| `folder_not_found` | The specified folder does not exist. | Create the folder first or check the folder path for typos. |
| `file_already_exists` | A file with the same name already exists at the destination. | Choose a different file name or delete the existing file. |

## Reference files

- **`references/api-reference.md`** — Detailed ImageKit API endpoint documentation, including all parameters, response schemas, and error codes.
