import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import type { ApiResponse, ComparisonResponse, CompareProductsRequest, Product } from '@/lib/types'

/**
 * POST /api/compare
 * Compare multiple products and determine winners by category
 */
export async function POST(request: NextRequest) {
  try {
    const body: CompareProductsRequest = await request.json()

    if (!body.productIds || body.productIds.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'At least 2 product IDs are required for comparison',
      }, { status: 400 })
    }

    if (body.productIds.length > 4) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 4 products can be compared at once',
      }, { status: 400 })
    }

    // Find all products
    const comparedProducts: Product[] = []
    for (const id of body.productIds) {
      const product = products.find(p => p.id === id)
      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product not found: ${id}`,
        }, { status: 404 })
      }
      comparedProducts.push(product)
    }

    // Calculate winners by category
    const byCategory: Record<string, string> = {}
    
    // Overall trust score winner
    const overallWinner = comparedProducts.reduce((best, current) => 
      current.trustScore > best.trustScore ? current : best
    )
    
    // Feature-based comparisons
    const featureCategories = ['Battery', 'Camera', 'Performance', 'Build Quality', 'Display', 'Value', 'Sound Quality', 'Noise Cancellation', 'Comfort']
    
    for (const category of featureCategories) {
      let bestProduct: Product | null = null
      let bestScore = -1

      for (const product of comparedProducts) {
        const feature = product.features.find(f => f.name === category)
        if (feature && feature.score > bestScore) {
          bestScore = feature.score
          bestProduct = product
        }
      }

      if (bestProduct) {
        byCategory[category] = bestProduct.id
      }
    }

    // Price winner (lowest price)
    const priceWinner = comparedProducts.reduce((best, current) =>
      current.price < best.price ? current : best
    )
    byCategory['Price'] = priceWinner.id

    // Rating winner
    const ratingWinner = comparedProducts.reduce((best, current) =>
      current.rating > best.rating ? current : best
    )
    byCategory['Rating'] = ratingWinner.id

    // Generate highlights
    const highlights: { productId: string; advantage: string }[] = []
    
    for (const product of comparedProducts) {
      // Find this product's strongest advantage
      const advantages: string[] = []
      
      if (product.id === overallWinner.id) {
        advantages.push('Highest overall trust score')
      }
      if (product.id === priceWinner.id) {
        advantages.push('Most affordable option')
      }
      if (product.id === ratingWinner.id) {
        advantages.push('Highest customer rating')
      }

      // Check feature wins
      for (const [category, winnerId] of Object.entries(byCategory)) {
        if (winnerId === product.id && !['Price', 'Rating'].includes(category)) {
          advantages.push(`Best ${category.toLowerCase()}`)
        }
      }

      if (advantages.length > 0) {
        highlights.push({
          productId: product.id,
          advantage: advantages.slice(0, 2).join(', '),
        })
      }
    }

    const comparison: ComparisonResponse = {
      products: comparedProducts,
      winner: {
        overall: overallWinner.id,
        byCategory,
      },
      highlights,
    }

    const response: ApiResponse<ComparisonResponse> = {
      success: true,
      data: comparison,
    }

    return NextResponse.json(response)

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to compare products',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/compare
 * Get comparison with product IDs from query params
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productIds = searchParams.getAll('ids')

  if (productIds.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'At least 2 product IDs required (use ?ids=id1&ids=id2)',
    }, { status: 400 })
  }

  // Redirect to POST logic
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ productIds }),
  })

  return POST(mockRequest)
}
