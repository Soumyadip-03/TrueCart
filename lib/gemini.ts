import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

if (!apiKey) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set')
}

const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Generate AI summary for a product based on reviews
 */
export async function generateProductSummary(
  productName: string,
  reviews: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a product analysis expert. Based on the following customer reviews for "${productName}", generate a concise and helpful summary (2-3 sentences) that captures the overall sentiment and key points.

Reviews:
${reviews.slice(0, 10).join('\n')}

Provide only the summary, no additional text.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

/**
 * Extract pros from reviews
 */
export async function extractPros(
  productName: string,
  reviews: string[]
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a product analysis expert. Based on the following customer reviews for "${productName}", extract the top 5 positive aspects (pros) that customers appreciate.

Reviews:
${reviews.slice(0, 10).join('\n')}

Return ONLY a JSON array of strings with the pros, nothing else. Example: ["Pro 1", "Pro 2", "Pro 3"]`

  const result = await model.generateContent(prompt)
  const response = await result.response
  
  try {
    const jsonMatch = response.text().match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error parsing pros:', error)
  }
  
  return []
}

/**
 * Extract cons from reviews
 */
export async function extractCons(
  productName: string,
  reviews: string[]
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a product analysis expert. Based on the following customer reviews for "${productName}", extract the top 5 negative aspects (cons) that customers mention.

Reviews:
${reviews.slice(0, 10).join('\n')}

Return ONLY a JSON array of strings with the cons, nothing else. Example: ["Con 1", "Con 2", "Con 3"]`

  const result = await model.generateContent(prompt)
  const response = await result.response
  
  try {
    const jsonMatch = response.text().match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error parsing cons:', error)
  }
  
  return []
}

/**
 * Analyze sentiment of reviews
 */
export async function analyzeSentiment(reviews: string[]): Promise<number> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a sentiment analysis expert. Analyze the following customer reviews and provide an overall sentiment score from 0-100, where 0 is extremely negative and 100 is extremely positive.

Reviews:
${reviews.slice(0, 10).join('\n')}

Return ONLY a single number between 0-100, nothing else.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  
  try {
    const score = parseInt(response.text().trim())
    return isNaN(score) ? 75 : Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    return 75
  }
}

/**
 * Detect fake reviews
 */
export async function detectFakeReviews(
  reviews: string[]
): Promise<{ trustPercentage: number; suspiciousCount: number }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a fake review detection expert. Analyze the following reviews and identify suspicious patterns that might indicate fake reviews (e.g., overly promotional language, generic praise, repetitive patterns, etc.).

Reviews:
${reviews.slice(0, 10).join('\n')}

Return a JSON object with:
- trustPercentage: percentage of reviews that appear authentic (0-100)
- suspiciousCount: number of reviews that appear suspicious

Example: {"trustPercentage": 85, "suspiciousCount": 2}

Return ONLY the JSON object, nothing else.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  
  try {
    const jsonMatch = response.text().match(/\{.*\}/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error detecting fake reviews:', error)
  }
  
  return { trustPercentage: 80, suspiciousCount: 0 }
}

/**
 * Generate feature insights
 */
export async function generateFeatureInsights(
  productName: string,
  reviews: string[]
): Promise<Array<{ name: string; sentiment: 'positive' | 'neutral' | 'negative'; score: number; insight: string }>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `You are a product analysis expert. Based on the following reviews for "${productName}", identify 3-5 key features/aspects and analyze customer sentiment for each.

Reviews:
${reviews.slice(0, 10).join('\n')}

Return a JSON array with objects containing:
- name: feature name (e.g., "Battery Life", "Camera Quality")
- sentiment: "positive", "neutral", or "negative"
- score: sentiment score 0-100
- insight: brief insight about this feature

Example: [{"name": "Battery Life", "sentiment": "positive", "score": 85, "insight": "Customers praise the long battery life"}]

Return ONLY the JSON array, nothing else.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  
  try {
    const jsonMatch = response.text().match(/\[.*\]/s)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error generating feature insights:', error)
  }
  
  return []
}
