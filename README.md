# ColorMeFree 🎨

**Create Custom Coloring Books for Your Child - Instantly!**

ColorMeFree is a web application that lets parents create personalized 30-page coloring books for their children using AI-generated content. Simply type any idea, see 4 preview pages instantly, and get a complete custom coloring book delivered to your door.

## ⚠️ Security Notice

**IMPORTANT: Always protect your APIs and secrets!**

- Never commit API keys, secrets, or sensitive configuration to version control
- Use environment variables and secure secret management systems
- Keep your `.env` files, `config.secret`, and other sensitive files out of git
- Follow security best practices for all integrations (Shopify, Lulu, etc.)

See the [Configuration](#-configuration) section for proper setup instructions.

<!-- Deployment triggered: 2024-12-19 -->
<!-- Second deployment trigger -->

## ✨ Features

- **Instant Preview Generation**: See 4 sample pages immediately
- **AI-Powered Content**: Uses yoprintables.com for free coloring page generation
- **Custom Prompts**: Type any idea (e.g., "a car driving down the highway being chased by dinosaurs")
- **Multiple Variations**: Generate up to 5 different sets of previews
- **Print-on-Demand**: Complete 30-page books printed and shipped via Lulu.com
- **Shopify Integration**: Seamless e-commerce experience
- **COPPA Compliant**: Designed for adults, safe for children

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account (free)
- Shopify store (free trial available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ColorMeFree.git
   cd ColorMeFree
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your actual values
   # See env.example for required variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Deploy backend**
   ```bash
   cd backend
   wrangler deploy
   ```

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Analytics**: Plausible (privacy-friendly)

### Backend (Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js
- **Services**: 
  - Yoprintables integration
  - Lulu.com print API
  - Shopify webhooks

### Integrations
- **Shopify**: E-commerce and order management
- **Lulu.com**: Print-on-demand service
- **Yoprintables.com**: Free coloring page generation
- **Plausible**: Privacy-friendly analytics

## 📁 Project Structure

```
colorbook-site/
├── src/
│   ├── ui/
│   │   └── App.jsx          # Main application component
│   ├── lib/
│   │   ├── shopify.js       # Shopify API integration
│   │   ├── analytics.js     # Analytics tracking
│   │   └── yoprintables.js  # Coloring page service
│   └── config.js            # Configuration
├── backend/
│   ├── src/
│   │   ├── index.ts         # Main API endpoints
│   │   ├── lulu.ts          # Lulu.com integration
│   │   └── shopify.ts       # Shopify webhook handling
│   └── wrangler.toml        # Cloudflare Workers config
├── public/
│   ├── index.html
│   └── privacy.html
└── docs/
    ├── DEPLOYMENT.md        # Deployment guide
    └── GITHUB_DEPLOYMENT.md # GitHub-specific deployment
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```bash
# Copy env.example to .env.local and fill in your values
# See env.example for the complete list of required variables
```

**Backend (Cloudflare Secrets)**
```bash
# Set these using wrangler secret put SECRET_NAME
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
LULU_API_KEY=your_lulu_api_key
LULU_CLIENT_SECRET=your_lulu_client_secret
```

## 🚀 Deployment

### GitHub Pages + Cloudflare Workers

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   wrangler deploy
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages (created by GitHub Actions)

4. **Set Environment Variables**
   - Add secrets in GitHub repository settings
   - Configure Cloudflare Workers secrets

See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
npm run dev          # Start local development
npm run deploy       # Deploy to Cloudflare Workers
```

### API Endpoints

- `POST /generate-previews` - Generate 4 preview pages
- `POST /lock-design` - Lock selected design for production
- `POST /order-paid` - Process paid orders (Shopify webhook)
- `GET /print-job/:jobId` - Get print job status

## 🎯 User Flow

1. **User enters prompt** (e.g., "dinosaurs playing soccer")
2. **System generates 4 preview pages** using yoprintables.com
3. **User can enhance or regenerate** up to 5 times
4. **User selects favorite set** and approves
5. **System locks design** and adds to Shopify cart
6. **User completes checkout** through Shopify
7. **Backend receives webhook** and generates remaining 26 pages
8. **System creates print job** via Lulu.com
9. **Book is printed and shipped** directly to customer

## 🔒 Security & Privacy

- **COPPA Compliant**: No collection of children's personal information
- **Adult-Focused**: Designed for parents (18+) creating books for children
- **Secure Payments**: Shopify handles all payment processing
- **Privacy-Friendly Analytics**: Plausible (no cookies, GDPR compliant)
- **HTTPS Everywhere**: All communications encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ColorMeFree/issues)
- **Email**: support@colormefree.com

## 🎉 Acknowledgments

- **Yoprintables.com** for free coloring page generation
- **Lulu.com** for print-on-demand services
- **Shopify** for e-commerce platform
- **Cloudflare** for serverless hosting
- **React & Vite** for the amazing development experience

---

**Made with ❤️ for parents and children everywhere**
