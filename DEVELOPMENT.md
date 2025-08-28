# Development Setup Guide - ColorMeFree

## Quick Start for Development

### 1. Environment Setup

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your development values
# For development, you can use placeholder values that will be replaced later
```

### 2. Development Environment Variables

For development, you can use these placeholder values in `.env.local`:

```bash
# Shopify Configuration (replace with your actual values for full functionality)
SHOPIFY_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_token
SHOPIFY_VARIANT_GID=gid://shopify/ProductVariant/your_variant_id

# Backend Configuration
BACKEND_URL=http://localhost:8787
```

### 3. Start Development Servers

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm run dev
```

### 4. Development Notes

#### Frontend Development
- The frontend will show a configuration error if environment variables are missing
- Copy `env.example` to `.env.local` and fill in your values
- The app validates configuration on startup

#### Backend Development
- Backend services will throw errors for unimplemented features
- This is expected behavior - the services are placeholders for production implementation
- Check the health endpoint at `http://localhost:8787/` for configuration status

#### Missing Features (Expected)
- Image generation (Stability AI integration)
- PDF generation (Lulu.com integration)
- Image storage (Cloudflare R2)
- Customer data storage (Cloudflare KV)

### 5. Production Deployment

When ready for production:

1. **Set up real services:**
   - Shopify store and products
   - Cloudflare Workers with proper secrets
   - Stability AI API key
   - Lulu.com API credentials

2. **Implement missing features:**
   - Replace placeholder services with real implementations
   - Set up proper image storage
   - Configure customer data storage

3. **Deploy:**
   - Frontend to GitHub Pages
   - Backend to Cloudflare Workers
   - Set all environment variables and secrets

### 6. Troubleshooting

#### Frontend Issues
- **Configuration Error**: Check `.env.local` file exists and has correct values
- **Build Errors**: Ensure all dependencies are installed with `npm install`

#### Backend Issues
- **Service Errors**: Expected for unimplemented features
- **Port Conflicts**: Change port in `wrangler.toml` if needed
- **Environment Variables**: Set Cloudflare secrets for production

### 7. Next Steps

1. Implement the placeholder services
2. Set up real API integrations
3. Configure production environment
4. Deploy to production

This development setup allows you to work on the frontend and backend structure while the integration services are being implemented.
