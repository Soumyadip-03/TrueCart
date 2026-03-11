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
    const pathSegments = pathname.split('/').filter(s => s)
    
    // For Flipkart URLs like /product-name/p/PRODUCT_ID
    // We need to get the segment BEFORE /p/
    if (pathSegments.length > 0) {
      let productSegment = null
      
      // Find the segment before /p/ (Flipkart pattern)
      const pIndex = pathSegments.indexOf('p')
      if (pIndex > 0) {
        productSegment = pathSegments[pIndex - 1]
      } else {
        // Otherwise get the last meaningful segment
        const lastSegment = pathSegments[pathSegments.length - 1]
        if (lastSegment && lastSegment !== 'dp' && lastSegment !== 'itm' && lastSegment !== 'p' && !lastSegment.startsWith('itm')) {
          productSegment = lastSegment
        }
      }
      
      if (productSegment) {
        let productName = decodeURIComponent(productSegment).replace(/[-_]/g, ' ')
        
        // Clean up the product name - remove extra specs and keep only product name
        productName = productName
          .replace(/\d+\s*-?\s*\d+\s*ghz/gi, '') // Remove GHz specs
          .replace(/lga\s*-?\s*\d+/gi, '') // Remove LGA specs
          .replace(/\d+\s*-?core\s*processor/gi, '') // Remove core processor specs
          .replace(/designed\s*mobile/gi, '') // Remove "designed mobile"
          .replace(/magsafe\s*case/gi, '') // Remove case info
          .replace(/usb\s*-?c/gi, '') // Remove USB-C
          .replace(/white|black|blue|red|green|silver|gold|pink|purple/gi, '') // Remove colors
          .replace(/\s+/g, ' ') // Clean up multiple spaces
          .trim()
        
        if (productName && productName.length > 2) {
          return productName
        }
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
  
  // Partial match with better scoring
  const partialMatches = products.filter(p => {
    const productNameLower = p.name.toLowerCase()
    const brandLower = p.brand.toLowerCase()
    
    // Check if search term contains product name or brand
    return (
      productNameLower.includes(searchTerm) ||
      searchTerm.includes(productNameLower) ||
      brandLower.includes(searchTerm) ||
      searchTerm.includes(brandLower) ||
      // Check for key words match
      searchTerm.split(' ').some(word => 
        word.length > 3 && (productNameLower.includes(word) || brandLower.includes(word))
      )
    )
  })
  
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
