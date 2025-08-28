# Deployment Guide - ColorMeFree

## Security First! 🔒

**NEVER commit API keys to public repositories!** This guide shows you how to deploy securely.

## Required Information

### Shopify Setup
1. **Shopify Domain**: Your shop's `.myshopify.com` domain
2. **Storefront Access Token**: Public token for frontend API calls
3. **Product Variant ID**: The GID of your custom book product variant
4. **Webhook Secret**: For order verification (backend only)

### Lulu.com Setup
- ⚠️ API Key: `your_lulu_api_key` (configure in Cloudflare secrets)
- ⚠️ Client Secret: `your_lulu_client_secret` (configure in Cloudflare secrets)

## Frontend Deployment (GitHub Pages)

### 1. Environment Variables
Copy the example environment file and fill in your values:

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your actual values
# See env.example for required variables
```

### 2. Build and Deploy
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### 3. GitHub Pages Setup
- Repository: `ColorMeFree/ColorMe`
- Source: Deploy from a branch
- Branch: `main` or `gh-pages`
- Folder: `/ (root)` or `/docs`

## Backend Deployment (Cloudflare Workers)

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Configure Environment Variables
In Cloudflare Dashboard or via wrangler:

```bash
# Set sensitive variables in Cloudflare dashboard
wrangler secret put SHOPIFY_WEBHOOK_SECRET
wrangler secret put OPENAI_API_KEY
wrangler secret put STABILITY_API_KEY
```

### 4. Deploy Backend
```bash
cd backend
npm install
wrangler deploy
```

## Environment Variables Summary

### Frontend (Public - Safe to expose)
- Copy `env.example` to `.env.local` and fill in your values
- See `env.example` for the complete list of required variables

### Backend (Private - Keep secret)
- `SHOPIFY_WEBHOOK_SECRET`: For order verification
- `LULU_API_KEY`: ✅ Already configured
- `LULU_CLIENT_SECRET`: ✅ Already configured
- `OPENAI_API_KEY`: For LLM prompt expansion
- `STABILITY_API_KEY`: For image generation

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in committed files
- [ ] Backend secrets stored in Cloudflare
- [ ] Frontend uses only public tokens
- [ ] Repository is properly configured

## Next Steps

1. **Get Shopify Storefront Token**: From your Shopify admin
2. **Create Product Variant**: In Shopify for the custom book
3. **Set up Webhook**: In Shopify for order notifications
4. **Deploy Backend**: To Cloudflare Workers
5. **Deploy Frontend**: To GitHub Pages

## Need Help?

If you need help getting any of these values, let me know:
- Shopify admin access
- Product creation
- Webhook setup
- Cloudflare configuration

