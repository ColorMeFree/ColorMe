# GitHub Repository Secrets Setup

## 🔑 Required Secrets

You need to add these secrets to your GitHub repository for the website to work:

### Steps:
1. Go to your GitHub repository: https://github.com/ColorMeFree/ColorMe
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret below:

### Secrets to Add:

**SHOPIFY_DOMAIN**
```
e76594-67.myshopify.com
```

**SHOPIFY_STOREFRONT_TOKEN**
```
64b1058926b92710a97b8dadbcfff10d
```

**SHOPIFY_VARIANT_GID**
```
gid://shopify/ProductVariant/50287429779746
```

**BACKEND_URL**
```
https://colorbook-backend-worldfrees.3dworldjames.workers.dev
```

## 🚀 After Adding Secrets

1. Go to **Actions** tab
2. Find the latest workflow run
3. Click **Re-run jobs** to trigger a new build
4. The website will deploy with the correct environment variables

## 🔒 Security Note

These are public tokens that are safe to use in the frontend. The sensitive backend secrets remain secure in Cloudflare Workers.
