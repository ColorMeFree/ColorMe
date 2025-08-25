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
Create a `.env.local` file in the root directory (this will be gitignored):

```bash
SHOPIFY_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_token
SHOPIFY_VARIANT_GID=gid://shopify/ProductVariant/your_variant_id
BACKEND_URL=https://colorbook-backend.your-subdomain.workers.dev
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
- `SHOPIFY_DOMAIN`: Your shop domain
- `SHOPIFY_STOREFRONT_TOKEN`: Public storefront token
- `SHOPIFY_VARIANT_GID`: Product variant ID
- `BACKEND_URL`: Your Cloudflare Workers URL

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

