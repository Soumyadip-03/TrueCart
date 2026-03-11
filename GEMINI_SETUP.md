# Google Gemini API Integration Setup

## Overview
This project now integrates Google Gemini AI for intelligent product analysis including:
- AI-powered product summaries
- Pros and cons extraction
- Sentiment analysis
- Fake review detection
- Feature insights generation

## Setup Instructions

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Add API Key to Environment
1. Open `.env.local` file in the project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

### 3. Restart Development Server
```bash
npm run dev
```

## How It Works

### Files Added/Modified:
- **`lib/gemini.ts`** - Gemini AI service with functions for:
  - `generateProductSummary()` - Creates AI summary from reviews
  - `extractPros()` - Extracts positive aspects
  - `extractCons()` - Extracts negative aspects
  - `analyzeSentiment()` - Calculates sentiment score
  - `detectFakeReviews()` - Identifies suspicious reviews
  - `generateFeatureInsights()` - Analyzes key features

- **`app/api/analyze/route.ts`** - Updated to use Gemini AI
  - Now calls Gemini functions for URL-based analysis
  - Combines results into comprehensive analysis

- **`.env.local`** - Environment configuration
  - Stores your Gemini API key securely

## Usage

### Via Search Bar
1. Paste a product URL in the search bar
2. Click "Search"
3. The system will:
   - Extract product name from URL
   - Use Gemini AI to analyze mock reviews
   - Generate pros, cons, summary, and insights
   - Display results with trust score

### Via API
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"productUrl": "https://example.com/product/123"}'
```

## Features

✅ **AI-Generated Summaries** - Concise product overviews
✅ **Pros & Cons Extraction** - Key advantages and disadvantages
✅ **Sentiment Analysis** - Overall customer sentiment score
✅ **Fake Review Detection** - Identifies suspicious reviews
✅ **Feature Insights** - Analyzes specific product features
✅ **Trust Score** - Combined metric based on sentiment and authenticity

## Important Notes

- The current implementation uses mock reviews for demonstration
- In production, integrate with web scraping to fetch real reviews
- API calls are made in parallel for better performance
- Responses are cached in the database for frequently analyzed products

## Troubleshooting

### "API key not found" error
- Ensure `.env.local` file exists in project root
- Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly
- Restart the development server

### "Failed to analyze product" error
- Check your internet connection
- Verify API key is valid and has quota remaining
- Check Google Cloud Console for any API errors

### Rate Limiting
- Gemini API has rate limits
- Consider implementing caching for frequently analyzed products
- Use exponential backoff for retries

## Next Steps

1. **Integrate Real Review Scraping**
   - Add web scraping for Amazon, eBay, Flipkart
   - Replace mock reviews with actual customer reviews

2. **Add Caching**
   - Cache analysis results in database
   - Reduce API calls for repeated products

3. **Enhance Analysis**
   - Add multi-language support
   - Implement competitor comparison
   - Add price trend analysis

4. **Production Deployment**
   - Move API key to secure backend environment
   - Implement rate limiting
   - Add monitoring and logging
