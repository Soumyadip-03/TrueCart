import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import type { ApiResponse, BudgetRecommendationResponse, BudgetRecommendationRequest, Product } from '@/lib/types'

/**
 * POST /api/budget
 * Get product recommendations based on budget and priorities
 */
export async function POST(request: NextRequest) {
  try {
    const body: BudgetRecommendationRequest = await request.json()

    const { minPrice, maxPrice, category, priorities } = body

    // Validate input
    if (minPrice === undefined || maxPrice === undefined) {
      return NextResponse.json({
        success: false,
        error: 'minPrice and maxPrice are required',
      }, { status: 400 })
    }

    if (minPrice > maxPrice) {
      return NextResponse.json({
        success: false,
        error: 'minPrice cannot be greater than maxPrice',
      }, { status: 400 })
    }

    // Filter products by price range and category
    let filteredProducts = products.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    )

    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (filteredProducts.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          recommendations: [],
          matchScores: {},
          bestMatch: '',
          reasoning: 'No products found matching your criteria. Try adjusting your budget or category.',
        },
      })
    }

    // Calculate match scores based on priorities
    const matchScores: Record<string, number> = {}

    for (const product of filteredProducts) {
      let score = 50 // Base score

      // Trust score contributes to overall match
      score += (product.trustScore - 80) * 0.5

      // Check priorities against features
      if (priorities) {
        if (priorities.battery) {
          const batteryFeature = product.features.find(f => f.name === 'Battery')
          if (batteryFeature) {
            score += batteryFeature.score * 0.15
          }
        }

        if (priorities.camera) {
          const cameraFeature = product.features.find(f => f.name === 'Camera')
          if (cameraFeature) {
            score += cameraFeature.score * 0.15
          }
        }

        if (priorities.gaming) {
          const performanceFeature = product.features.find(f => f.name === 'Performance')
          if (performanceFeature) {
            score += performanceFeature.score * 0.15
          }
        }

        if (priorities.value) {
          const valueFeature = product.features.find(f => f.name === 'Value')
          if (valueFeature) {
            score += valueFeature.score * 0.15
          }
          // Also consider price relative to features
          const priceValue = ((maxPrice - product.price) / (maxPrice - minPrice)) * 10
          score += priceValue
        }

        if (priorities.durability) {
          const buildFeature = product.features.find(f => f.name === 'Build Quality')
          if (buildFeature) {
            score += buildFeature.score * 0.15
          }
        }
      }

      // Normalize score to 0-100
      matchScores[product.id] = Math.min(100, Math.max(0, Math.round(score)))
    }

    // Sort by match score
    const sortedProducts = filteredProducts.sort((a, b) => 
      matchScores[b.id] - matchScores[a.id]
    )

    // Find best match and generate reasoning
    const bestMatch = sortedProducts[0]
    const bestMatchReasons: string[] = []

    if (priorities?.battery) {
      const batteryFeature = bestMatch.features.find(f => f.name === 'Battery')
      if (batteryFeature && batteryFeature.sentiment === 'positive') {
        bestMatchReasons.push('excellent battery life')
      }
    }
    if (priorities?.camera) {
      const cameraFeature = bestMatch.features.find(f => f.name === 'Camera')
      if (cameraFeature && cameraFeature.sentiment === 'positive') {
        bestMatchReasons.push('outstanding camera quality')
      }
    }
    if (priorities?.gaming) {
      const perfFeature = bestMatch.features.find(f => f.name === 'Performance')
      if (perfFeature && perfFeature.sentiment === 'positive') {
        bestMatchReasons.push('powerful performance for gaming')
      }
    }
    if (priorities?.value) {
      bestMatchReasons.push('great value for money')
    }
    if (priorities?.durability) {
      const buildFeature = bestMatch.features.find(f => f.name === 'Build Quality')
      if (buildFeature && buildFeature.sentiment === 'positive') {
        bestMatchReasons.push('premium build quality')
      }
    }

    const reasoning = bestMatchReasons.length > 0
      ? `Based on your priorities, we recommend the ${bestMatch.name} for its ${bestMatchReasons.join(', ')}. It has a ${bestMatch.trustScore}% trust score from ${bestMatch.reviewCount.toLocaleString()} reviews.`
      : `The ${bestMatch.name} is our top recommendation in your budget with a ${bestMatch.trustScore}% trust score.`

    const response: ApiResponse<BudgetRecommendationResponse> = {
      success: true,
      data: {
        recommendations: sortedProducts,
        matchScores,
        bestMatch: bestMatch.id,
        reasoning,
      },
    }

    return NextResponse.json(response)

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to get recommendations',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/budget
 * Get recommendations with query params
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const category = searchParams.get('category')
  
  // Parse priority params
  const priorities = {
    battery: searchParams.get('battery') === 'true',
    camera: searchParams.get('camera') === 'true',
    gaming: searchParams.get('gaming') === 'true',
    value: searchParams.get('value') === 'true',
    durability: searchParams.get('durability') === 'true',
  }

  if (!minPrice || !maxPrice) {
    return NextResponse.json({
      success: false,
      error: 'minPrice and maxPrice query parameters are required',
    }, { status: 400 })
  }

  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      category: category || undefined,
      priorities,
    }),
  })

  return POST(mockRequest)
}
