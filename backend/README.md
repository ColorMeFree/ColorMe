# ColorBook Backend

Cloudflare Workers backend for the ColorMeFree coloring book service.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables in `wrangler.toml`:**
   - `OPENAI_API_KEY`: For LLM prompt expansion
   - `STABILITY_API_KEY`: For image generation
   - `SHOPIFY_WEBHOOK_SECRET`: For order verification
   - `LULU_API_KEY`: For print job submission
   - `S3_BUCKET`: For image storage

3. **Deploy to Cloudflare Workers:**
   ```bash
   npm run deploy
   ```

## API Endpoints

### POST /generate-previews
Generates 4 preview images for a given prompt.

**Input:**
```json
{
  "prompt": "a car driving down the highway being chased by dinosaurs"
}
```

**Output:**
```json
{
  "sessionId": "uuid",
  "images": ["url1", "url2", "url3", "url4"]
}
```

### POST /lock-design
Persists the chosen design for production.

**Input:**
```json
{
  "sessionId": "uuid",
  "chosen": ["url1", "url2", "url3", "url4"],
  "prompt": "original prompt"
}
```

**Output:**
```json
{
  "designId": "uuid"
}
```

### POST /order-paid
Shopify webhook that triggers when an order is paid.

**Process:**
1. Verify Shopify HMAC signature
2. Find line items with `designId` attribute
3. Generate remaining 26 pages
4. Assemble 30-page PDF
5. Submit to Lulu.com for printing

## Integration Points

### Image Generation
- **Stability AI**: Text-to-image with line art style
- **ControlNet**: For consistent black outlines
- **LLM**: Prompt expansion into diverse scenes

### Print Service
- **Lulu.com API**: Print-on-demand service
- **PDF Assembly**: 30-page coloring book creation
- **Shipping**: Direct to customer address

### Storage
- **Cloudflare R2/S3**: Image storage
- **Cloudflare KV**: Design metadata

## Development

```bash
npm run dev  # Start local development server
```
