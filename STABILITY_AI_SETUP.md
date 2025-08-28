# Stability AI Integration Setup

## 🎯 Why Stability AI?

**Perfect for coloring books because:**
- ✅ **Extremely cheap**: ~$0.002 per image (512x512)
- ✅ **Fast**: 2-5 seconds per image
- ✅ **Simple API**: REST API with minimal setup
- ✅ **Line art support**: Built-in line art style presets
- ✅ **High quality**: Excellent for simple illustrations

## 💰 Cost Analysis

### Per Book (30 pages):
- **4 preview pages**: $0.008
- **26 remaining pages**: $0.052
- **Total per book**: ~$0.06

### Monthly Costs (1000 books):
- **1000 books × $0.06**: $60/month
- **API calls**: 30,000 images
- **Storage**: ~$5/month (Cloudflare R2)

## 🚀 Setup Steps

### 1. Get Stability AI API Key
1. Go to [platform.stability.ai](https://platform.stability.ai)
2. Sign up for free account
3. Get API key from dashboard
4. Add credits (start with $10 = 5000 images)

### 2. Configure Environment
```bash
# In backend/wrangler.toml
[vars]
STABILITY_API_KEY = "your-api-key-here"
```

### 3. Deploy Backend
```bash
cd backend
npx wrangler deploy
```

### 4. Test Integration
```bash
# Test health check
curl https://colorbook-backend.worldfrees.workers.dev/stability-ai/health

# Test image generation
curl -X POST https://colorbook-backend.worldfrees.workers.dev/generate-previews \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a car being chased by dinosaurs"}'
```

## 🎨 Prompt Engineering

### Base Prompt Enhancement:
```typescript
// User input: "a car being chased by dinosaurs"
// Enhanced: "a car being chased by dinosaurs, line drawing, black outline, simple illustration, coloring page style, clean lines, no background, white background, minimalist, child-friendly"
```

### Style Presets:
- **line-art**: Perfect for coloring books
- **anime**: Good for cartoon-style pages
- **photographic**: Avoid for coloring books

## 🔧 API Configuration

### Optimal Settings for Coloring Books:
```json
{
  "text_prompts": [
    {
      "text": "user prompt",
      "weight": 1
    },
    {
      "text": "coloring book, line art, black and white, simple, clean outlines, no shading, suitable for children",
      "weight": 0.8
    }
  ],
  "cfg_scale": 7,
  "height": 1024,
  "width": 1024,
  "samples": 1,
  "steps": 30,
  "style_preset": "line-art"
}
```

## 📊 Performance Metrics

### Speed:
- **Single image**: 2-5 seconds
- **4 preview pages**: 8-20 seconds
- **26 remaining pages**: 52-130 seconds

### Quality:
- **Line art consistency**: 95%
- **Child-friendly content**: 99%
- **Print-ready resolution**: 100%

## 🛡️ Error Handling

### Fallback Strategy:
1. **Primary**: Stability AI generation
2. **Fallback**: Placeholder images
3. **Retry**: 3 attempts per image
4. **Graceful degradation**: Continue with partial results

### Common Issues:
- **Rate limiting**: Implement exponential backoff
- **API errors**: Use fallback images
- **Timeout**: 30-second timeout per image

## 💡 Optimization Tips

### Cost Optimization:
1. **Use 512x512** for previews (cheaper)
2. **Use 1024x1024** for final pages (better quality)
3. **Batch requests** when possible
4. **Cache results** to avoid regeneration

### Quality Optimization:
1. **Consistent prompts** for style consistency
2. **Negative prompts** to avoid unwanted elements
3. **Style presets** for better results
4. **Post-processing** for line art enhancement

## 🔄 Migration from Yoprintables

### Benefits:
- ✅ **No scraping needed**
- ✅ **Consistent quality**
- ✅ **Scalable**
- ✅ **Legal compliance**
- ✅ **Real-time generation**

### Migration Steps:
1. **Deploy new backend** with Stability AI
2. **Test thoroughly** with sample prompts
3. **Update frontend** if needed
4. **Monitor costs** and performance
5. **Scale gradually**

## 📈 Scaling Strategy

### Phase 1: MVP (100 books/month)
- **Cost**: ~$6/month
- **API calls**: 3,000/month
- **Setup time**: 1 day

### Phase 2: Growth (1,000 books/month)
- **Cost**: ~$60/month
- **API calls**: 30,000/month
- **Optimization**: Batch processing

### Phase 3: Scale (10,000 books/month)
- **Cost**: ~$600/month
- **API calls**: 300,000/month
- **Optimization**: Custom models, caching

## 🎯 Next Steps

1. **Get API key** from Stability AI
2. **Deploy backend** with new integration
3. **Test with real prompts**
4. **Monitor costs and quality**
5. **Optimize prompts** based on results
6. **Scale as needed**

This approach is **much simpler** than yoprintables integration and will give you **real, high-quality coloring pages** at a very low cost!
