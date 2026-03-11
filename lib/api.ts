// ============================================
// FRONTEND API CLIENT
// All API calls to the backend go through here
// ============================================

import type {
  Product,
  ProductSearchParams,
  ProductListResponse,
  AnalysisResponse,
  ComparisonResponse,
  BudgetRecommendationResponse,
  BudgetRecommendationRequest,
  ApiResponse,
} from './types'

const API_BASE = '/api'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        message: data.message,
      }
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// PRODUCTS API
// ============================================

/**
 * Fetch all products with optional filtering
 */
export async function getProducts(
  params?: ProductSearchParams
): Promise<ApiResponse<ProductListResponse>> {
  const searchParams = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })
  }

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'

  return fetchApi<ProductListResponse>(endpoint)
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return fetchApi<Product>(`/products/${id}`)
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<ApiResponse<string[]>> {
  return fetchApi<string[]>('/categories')
}

// ============================================
// SEARCH API
// ============================================

/**
 * Search product by URL
 */
export async function searchProductByUrl(
  productUrl: string
): Promise<ApiResponse<Product>> {
  return fetchApi<Product>('/search', {
    method: 'POST',
    body: JSON.stringify({ productUrl }),
  })
}

// ============================================
// ANALYZE API
// ============================================

/**
 * Analyze a product by ID
 */
export async function analyzeProduct(
  productId: string
): Promise<ApiResponse<AnalysisResponse>> {
  return fetchApi<AnalysisResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

/**
 * Analyze a product by URL (for external products)
 */
export async function analyzeProductUrl(
  productUrl: string
): Promise<ApiResponse<AnalysisResponse>> {
  return fetchApi<AnalysisResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify({ productUrl }),
  })
}

/**
 * Get cached analysis for a product
 */
export async function getAnalysis(
  productId: string
): Promise<ApiResponse<AnalysisResponse>> {
  return fetchApi<AnalysisResponse>(`/analyze?productId=${productId}`)
}

// ============================================
// COMPARE API
// ============================================

/**
 * Compare multiple products
 */
export async function compareProducts(
  productIds: string[]
): Promise<ApiResponse<ComparisonResponse>> {
  return fetchApi<ComparisonResponse>('/compare', {
    method: 'POST',
    body: JSON.stringify({ productIds }),
  })
}

// ============================================
// BUDGET API
// ============================================

/**
 * Get budget-based recommendations
 */
export async function getBudgetRecommendations(
  request: BudgetRecommendationRequest
): Promise<ApiResponse<BudgetRecommendationResponse>> {
  return fetchApi<BudgetRecommendationResponse>('/budget', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

// ============================================
// HOOKS-COMPATIBLE FETCHERS (for SWR)
// ============================================

/**
 * SWR-compatible fetcher for products
 */
export const productsFetcher = async (url: string) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

/**
 * SWR-compatible fetcher for a single product
 */
export const productFetcher = async (url: string) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}
