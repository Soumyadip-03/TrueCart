import { NextRequest, NextResponse } from 'next/server'
import { products, categories } from '@/lib/data'
import type { ApiResponse, ProductListResponse, ProductSearchParams } from '@/lib/types'

/**
 * GET /api/products
 * Fetch all products with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const params: ProductSearchParams = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minTrustScore: searchParams.get('minTrustScore') ? Number(searchParams.get('minTrustScore')) : undefined,
      sortBy: (searchParams.get('sortBy') as ProductSearchParams['sortBy']) || 'trustScore',
      sortOrder: (searchParams.get('sortOrder') as ProductSearchParams['sortOrder']) || 'desc',
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : 0,
    }

    let filteredProducts = [...products]

    // Filter by search query
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (params.category && params.category !== 'All') {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === params.category!.toLowerCase()
      )
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= params.minPrice!)
    }
    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= params.maxPrice!)
    }

    // Filter by minimum trust score
    if (params.minTrustScore !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.trustScore >= params.minTrustScore!)
    }

    // Sort products
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        const aVal = a[params.sortBy!] as number
        const bVal = b[params.sortBy!] as number
        return params.sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    // Pagination
    const total = filteredProducts.length
    const paginatedProducts = filteredProducts.slice(
      params.offset!,
      params.offset! + params.limit!
    )

    const response: ApiResponse<ProductListResponse> = {
      success: true,
      data: {
        products: paginatedProducts,
        total,
        page: Math.floor(params.offset! / params.limit!) + 1,
        pageSize: params.limit!,
        hasMore: params.offset! + params.limit! < total,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * GET /api/products/categories
 * This endpoint is handled separately, but we export categories for reference
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For future: Add new product (admin functionality)
    return NextResponse.json({
      success: false,
      error: 'Product creation not implemented',
    }, { status: 501 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request body',
    }, { status: 400 })
  }
}
