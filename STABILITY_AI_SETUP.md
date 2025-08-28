# Stability AI Integration Setup

## Overview
This document outlines the integration with Stability AI for generating coloring book pages. The system uses Stability AI's text-to-image API to create simple, black and white line art suitable for coloring books.

## Features
- **Text-to-Image Generation**: Convert text prompts into coloring book pages
- **Line Art Style**: Optimized for black and white coloring pages
- **Cost Effective**: ~$0.06 per book (30 pages)
- **Fast Generation**: 4 preview pages in seconds
- **Bulk Generation**: 26 additional pages after purchase

## API Configuration

### 1. Get Stability AI API Key
1. Go to [Stability AI](https://platform.stability.ai/)
2. Create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Cloudflare Workers
```bash
# Set the API key as a Cloudflare secret
npx wrangler secret put STABILITY_API_KEY
# Enter your API key when prompted
```

### 3. Update Backend Configuration
The backend will automatically use the API key from Cloudflare secrets.

## Usage

### Health Check
```bash
curl https://your-backend.workers.dev/stability-ai/health
```

### Generate Preview Pages
```bash
curl -X POST https://your-backend.workers.dev/generate-previews \
  -H "Content-Type: application/json" \
  -d '{"prompt":"a car driving down the highway"}'
```

### Generate Remaining Pages
```bash
curl -X POST https://your-backend.workers.dev/order-paid \
  -H "Content-Type: application/json" \
  -d '{"orderId":"12345","prompt":"a car driving down the highway"}'
```

## Prompt Engineering

### Base Prompts
The system automatically enhances user prompts for optimal line art generation:

**Input**: "a car driving down the highway"
**Enhanced**: "black and white line art, simple coloring book page, a car driving down the highway, clean lines, no shading, suitable for children to color"

### Style Modifiers
- `black and white line art`
- `simple coloring book page`
- `clean lines`
- `no shading`
- `suitable for children to color`

## Cost Analysis

### Pricing
- **Stability AI**: $10 for 1,000 credits
- **Per Image**: ~2 credits
- **Per Book**: 30 images × 2 credits = 60 credits
- **Cost per Book**: $0.60

### Optimization
- Use simple prompts to reduce credit usage
- Batch generation for efficiency
- Cache generated images when possible

## Error Handling

### Common Issues
1. **API Key Invalid**: Check Cloudflare secrets
2. **Rate Limiting**: Implement exponential backoff
3. **Invalid Prompts**: Filter inappropriate content
4. **Generation Failures**: Retry with simplified prompts

### Monitoring
- Track generation success rates
- Monitor API usage and costs
- Log failed generations for analysis

## Security Considerations

### API Key Protection
- ✅ Store in Cloudflare secrets
- ✅ Never expose in client-side code
- ✅ Rotate keys regularly
- ✅ Monitor usage for anomalies

### Content Filtering
- Filter inappropriate prompts
- Validate generated images
- Implement content moderation

## Testing

### Local Development
```bash
# Test with mock API responses
npm run dev:backend

# Test with real API (use test key)
STABILITY_API_KEY=sk-test-... npm run dev:backend
```

### Production Testing
```bash
# Health check
curl https://your-backend.workers.dev/

# Generate test pages
curl -X POST https://your-backend.workers.dev/generate-previews \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test coloring page"}'
```

## Integration Points

### Frontend
- Prompt input and validation
- Preview display
- Generation status tracking

### Backend
- API key management
- Image generation
- Error handling
- Cost tracking

### Shopify
- Order processing
- Webhook handling
- Customer data management

## Future Enhancements

### Planned Features
- Multiple art styles
- Custom color schemes
- Batch processing
- Advanced prompt templates

### Performance Improvements
- Image caching
- Parallel generation
- Optimized prompts
- Cost reduction strategies
