# GitHub Deployment Guide - ColorMeFree

## 🚀 Quick Start

This guide will help you deploy your ColorMeFree coloring book website to GitHub Pages and set up the complete infrastructure.

## Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Cloudflare Account**: For backend deployment (free tier available)
3. **Shopify Store**: For e-commerce functionality
4. **Domain Name**: Optional but recommended

## Step 1: GitHub Repository Setup

### Create New Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `ColorMeFree` or `colorbook-site`
3. Make it **Public** (required for GitHub Pages)
4. Don't initialize with README (we'll push our existing code)

### Push Your Code
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: ColorMeFree MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ColorMeFree.git
git push -u origin main
```

## Step 2: Environment Variables Setup

### Frontend Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Shopify Configuration
SHOPIFY_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_token
SHOPIFY_VARIANT_GID=gid://shopify/ProductVariant/your_variant_id

# Backend URL (will be set after Cloudflare deployment)
BACKEND_URL=https://colorbook-backend.your-subdomain.workers.dev
```

### Backend Environment Variables (Cloudflare)
Set these in Cloudflare Dashboard:

```bash
# Shopify Webhook Secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Lulu.com API (configure these with your actual credentials)
LULU_API_KEY=your_lulu_api_key
LULU_CLIENT_SECRET=your_lulu_client_secret
```

## Step 3: Shopify Store Setup

### 1. Create Shopify Store
1. Go to [Shopify](https://shopify.com) and create a free trial store
2. Choose a store name (e.g., `colormefree`)

### 2. Create Custom Book Product
1. Go to **Products** → **Add product**
2. Product name: "Custom Coloring Book"
3. Price: Set your desired price (e.g., $19.99)
4. **Important**: Add these product options:
   - `designId` (text)
   - `prompt` (text)

### 3. Get Storefront Token
1. Go to **Settings** → **Apps and sales channels**
2. Click **Develop apps**
3. Create a new app
4. Go to **Configuration** → **Storefront API**
5. Enable **Storefront API**
6. Copy the **Storefront access token**

### 4. Set Up Webhook
1. Go to **Settings** → **Notifications**
2. Add webhook for **Order payment**
3. URL: `https://your-backend-url.workers.dev/order-paid`
4. Copy the webhook secret

## Step 4: Cloudflare Workers Deployment

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Deploy Backend
```bash
cd backend
npm install
wrangler deploy
```

### 4. Set Environment Variables
```bash
wrangler secret put SHOPIFY_WEBHOOK_SECRET
# Enter your webhook secret when prompted
```

## Step 5: GitHub Pages Deployment

### 1. Build Frontend
```bash
# In the root directory
npm install
npm run build
```

### 2. Configure GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/ (root)**
6. Click **Save**

### 3. Deploy to GitHub Pages
```bash
# Create a deployment branch
git checkout -b gh-pages
git add dist/ -f
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Or use GitHub Actions (recommended)
```

## Step 6: GitHub Actions (Optional but Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        SHOPIFY_DOMAIN: ${{ secrets.SHOPIFY_DOMAIN }}
        SHOPIFY_STOREFRONT_TOKEN: ${{ secrets.SHOPIFY_STOREFRONT_TOKEN }}
        SHOPIFY_VARIANT_GID: ${{ secrets.SHOPIFY_VARIANT_GID }}
        BACKEND_URL: ${{ secrets.BACKEND_URL }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Step 7: Environment Variables in GitHub

Go to your repository → **Settings** → **Secrets and variables** → **Actions**:

Add these repository secrets:
- `SHOPIFY_DOMAIN`
- `SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_VARIANT_GID`
- `BACKEND_URL`

## Step 8: Custom Domain (Optional)

### 1. Buy Domain
Purchase a domain (e.g., `colormefree.com`)

### 2. Configure DNS
Point your domain to GitHub Pages:
- Type: `CNAME`
- Name: `@`
- Value: `YOUR_USERNAME.github.io`

### 3. Update GitHub Pages
1. Go to repository → **Settings** → **Pages**
2. Add your custom domain
3. Check **Enforce HTTPS**

## Step 9: Testing Your Deployment

### 1. Test Frontend
Visit your GitHub Pages URL and test:
- [ ] Prompt input works
- [ ] Preview generation works
- [ ] Cart creation works
- [ ] Checkout flow works

### 2. Test Backend
Test your Cloudflare Workers endpoints:
```bash
# Health check
curl https://your-backend.workers.dev/

# Generate previews
curl -X POST https://your-backend.workers.dev/generate-previews \
  -H "Content-Type: application/json" \
  -d '{"prompt":"a car driving down the highway"}'
```

### 3. Test Complete Flow
1. Create a test order in Shopify
2. Verify webhook is received
3. Check Lulu print job creation

## Troubleshooting

### Common Issues

**Frontend not loading:**
- Check environment variables
- Verify build output in `dist/` folder
- Check GitHub Pages settings

**Backend errors:**
- Verify Cloudflare Workers deployment
- Check environment variables in Cloudflare
- Review Cloudflare Workers logs

**Shopify integration issues:**
- Verify storefront token
- Check product variant ID
- Test webhook endpoint

### Getting Help

1. Check Cloudflare Workers logs: `wrangler tail`
2. Check GitHub Actions logs
3. Verify all environment variables are set
4. Test endpoints individually

## Next Steps

After successful deployment:

1. **Replace placeholder images** with actual yoprintables.com integration
2. **Implement PDF generation** for the complete 30-page books
3. **Add email notifications** for order confirmations
4. **Set up monitoring** and error tracking
5. **Optimize performance** and user experience

## Security Notes

- ✅ Never commit `.env.local` files
- ✅ Use only public tokens in frontend
- ✅ Store sensitive data in Cloudflare secrets
- ✅ Verify webhook signatures
- ✅ Use HTTPS everywhere

Your ColorMeFree website should now be live and ready for customers! 🎉
