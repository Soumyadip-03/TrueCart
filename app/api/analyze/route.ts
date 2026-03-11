import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import type { ApiResponse, AnalysisResponse, AnalyzeProductRequest } from '@/lib/types'
import {
  generateProductSummary,
  extractPros,
  extractCons,
  analyzeSentiment,
  detectFakeReviews,
  generateFeatureInsights,
} from '@/lib/gemini'

/**
 * Mock reviews for demonstration
 * In production, these would be scraped from actual product URLs
 */
function getMockReviews(): string[] {
  return [
    'Great product! Works as expected and arrived quickly.',
    'Excellent quality and very durable. Highly recommend!',
    'Good value for money. Very satisfied with my purchase.',
    'Amazing! Better than I expected. Will buy again.',
    'Perfect! Exactly what I was looking for.',
    'Good product but shipping took longer than expected.',
    'Decent quality but a bit pricey.',
    'Works well but could be improved in some areas.',
    'Satisfied with the purchase overall.',
    'Great customer service and fast delivery!',
  ]
}

/**
 * POST /api/analyze
 * Analyze a product and return AI-generated insights using Gemini
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeProductRequest = await request.json()

    if (!body.productId && !body.productUrl) {
      return NextResponse.json({
        success: false,
        error: 'Either productId or productUrl is required',
      }, { status: 400 })
    }

    // If productId provided, use existing product data
    if (body.productId) {
      const product = products.find(p => p.id === body.productId)
      
      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Product not found',
        }, { status: 404 })
      }

      const analysis: AnalysisResponse = {
        productId: product.id,
        trustScore: product.trustScore,
        confidence: 0.92,
        fakeReviewAnalysis: product.fakeReviewAnalysis,
        pros: product.pros,
        cons: product.cons,
        aiSummary: product.aiSummary,
        features: product.features,
        analyzedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        data: analysis,
      })
    }

    // If productUrl provided, use Gemini AI for analysis
    if (body.productUrl) {
      try {
        const mockReviews = getMockReviews()
        const productName = new URL(body.productUrl).pathname.split('/').pop() || 'Product'

        // Run all AI analyses in parallel
        const [summary, pros, cons, sentiment, fakeReviewAnalysis, features] = await Promise.all([
          generateProductSummary(productName, mockReviews),
          extractPros(productName, mockReviews),
          extractCons(productName, mockReviews),
          analyzeSentiment(mockReviews),
          detectFakeReviews(mockReviews),
          generateFeatureInsights(productName, mockReviews),
        ])

        const trustScore = Math.round(sentiment * 0.8 + fakeReviewAnalysis.trustPercentage * 0.2)

        const analysis: AnalysisResponse = {
          productId: 'url-analysis-' + Date.now(),
          trustScore,
          confidence: 0.88,
          fakeReviewAnalysis: {
            trustPercentage: fakeReviewAnalysis.trustPercentage,
            authenticReviews: mockReviews.length - fakeReviewAnalysis.suspiciousCount,
            suspiciousReviews: fakeReviewAnalysis.suspiciousCount,
            flags: ['Analysis powered by Google Gemini AI'],
          },
          pros: pros.slice(0, 5),
          cons: cons.slice(0, 5),
          aiSummary: summary,
          features: features.slice(0, 5),
          analyzedAt: new Date().toISOString(),
        }

        return NextResponse.json({
          success: true,
          data: analysis,
          message: 'Analysis generated using Google Gemini AI',
        })
      } catch (aiError) {
        console.error('Gemini AI Error:', aiError)
        return NextResponse.json({
          success: false,
          error: 'AI analysis failed',
          message: aiError instanceof Error ? aiError.message : 'Failed to analyze product with AI',
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request',
    }, { status: 400 })

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to analyze product',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/analyze
 * Get analysis status or retrieve cached analysis
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({
      success: false,
      error: 'productId query parameter is required',
    }, { status: 400 })
  }

  const product = products.find(p => p.id === productId)
  
  if (!product) {
    return NextResponse.json({
      success: false,
      error: 'No analysis found for this product',
    }, { status: 404 })
  }

  const analysis: AnalysisResponse = {
    productId: product.id,
    trustScore: product.trustScore,
    confidence: 0.92,
    fakeReviewAnalysis: product.fakeReviewAnalysis,
    pros: product.pros,
    cons: product.cons,
    aiSummary: product.aiSummary,
    features: product.features,
    analyzedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: analysis,
  })
}
