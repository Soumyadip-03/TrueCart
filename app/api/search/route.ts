import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import type { ApiResponse, Product } from '@/lib/types'

/**
 * Extract product name from URL
 */
function extractProductFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    
    // Extract from common e-commerce patterns
    // Amazon: /dp/ASIN or /s?k=product-name
    // eBay: /itm/product-name
    // Generic: last path segment or query parameter
    
    const pathSegments = pathname.split('/').filter(s => s)
    
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      if (lastSegment && lastSegment !== 'dp' && lastSegment !== 'itm') {
        return decodeURIComponent(lastSegment).replace(/[-_]/g, ' ')
      }
    }
    
    // Try query parameters
    const searchParams = urlObj.searchParams
    const query = searchParams.get('q') || searchParams.get('k') || searchParams.get('search')
    if (query) {
      return decodeURIComponent(query)
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Find matching product from dataset
 */
function findMatchingProduct(productName: string): Product | null {
  if (!productName || productName.trim().length === 0) {
    return null
  }
  
  const searchTerm = productName.toLowerCase().trim()
  
  // Exact match first
  const exactMatch = products.find(p => 
    p.name.toLowerCase() === searchTerm ||
    p.id.toLowerCase() === searchTerm
  )
  
  if (exactMatch) return exactMatch
  
  // Partial match
  const partialMatches = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    searchTerm.includes(p.name.toLowerCase())
  )
  
  if (partialMatches.length > 0) {
    // Return highest trust score match
    return partialMatches.sort((a, b) => b.trustScore - a.trustScore)[0]
  }
  
  return null
}

/**
 * POST /api/search
 * Search product by URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productUrl } = body
    
    if (!productUrl || typeof productUrl !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Invalid product URL',
        message: 'Please provide a valid product URL',
      }, { status: 400 })
    }
    
    // Extract product name from URL
    const productName = extractProductFromUrl(productUrl)
    
    if (!productName) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract product information from URL',
        message: 'Unable to parse the provided URL',
      }, { status: 400 })
    }
    
    // Find matching product in dataset
    const matchingProduct = findMatchingProduct(productName)
    
    if (!matchingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        message: `Sorry! We do not have this product listed on our software. Searched for: "${productName}"`,
      }, { status: 404 })
    }
    
    const response: ApiResponse<Product> = {
      success: true,
      data: matchingProduct,
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}
