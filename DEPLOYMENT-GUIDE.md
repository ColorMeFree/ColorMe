# 🚀 Simple Deployment Guide

## Option 1: Local Build & Manual Upload (Recommended)

### Step 1: Build Production Version
```bash
node build-production.js
```

This will:
- Read your `config.secret` file (keeps secrets private)
- Build the production version with correct environment variables
- Create a `dist/` folder with your website

### Step 2: Upload to Your Web Server
Upload the contents of the `dist/` folder to your web server at `free1mind.com`

## Option 2: GitHub Pages (Limited)

GitHub Pages doesn't support environment variables, so the website will show configuration errors.

## 🔒 Security Benefits

- ✅ No secrets exposed in code
- ✅ No GitHub repository secrets needed
- ✅ `config.secret` stays private
- ✅ Works with any web hosting provider

## 🎯 Result

Your website will work perfectly at `free1mind.com` with all features:
- ✅ Shopify integration
- ✅ Backend API calls
- ✅ Complete checkout flow
- ✅ Everything except Stability AI (using placeholders)
