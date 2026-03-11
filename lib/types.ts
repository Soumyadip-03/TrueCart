// ============================================
// SHARED TYPES - Used by both Frontend & Backend
// ============================================

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  image: string
  trustScore: number
  reviewCount: number
  rating: number
  pros: string[]
  cons: string[]
  aiSummary: string
  features: FeatureInsight[]
  fakeReviewAnalysis: FakeReviewAnalysis
}

export interface FeatureInsight {
  name: string
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
  insight: string
}

export interface FakeReviewAnalysis {
  trustPercentage: number
  authenticReviews: number
  suspiciousReviews: number
  flags: string[]
}

// ============================================
// API REQUEST TYPES
// ============================================

export interface ProductSearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minTrustScore?: number
  sortBy?: 'price' | 'rating' | 'trustScore' | 'reviewCount'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface AnalyzeProductRequest {
  productUrl?: string
  productId?: string
}

export interface CompareProductsRequest {
  productIds: string[]
}

export interface BudgetRecommendationRequest {
  minPrice: number
  maxPrice: number
  category?: string
  priorities: {
    battery: boolean
    camera: boolean
    gaming: boolean
    value: boolean
    durability: boolean
  }
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface AnalysisResponse {
  productId: string
  trustScore: number
  confidence: number
  fakeReviewAnalysis: FakeReviewAnalysis
  pros: string[]
  cons: string[]
  aiSummary: string
  features: FeatureInsight[]
  analyzedAt: string
}

export interface ComparisonResponse {
  products: Product[]
  winner: {
    overall: string
    byCategory: Record<string, string>
  }
  highlights: {
    productId: string
    advantage: string
  }[]
}

export interface BudgetRecommendationResponse {
  recommendations: Product[]
  matchScores: Record<string, number>
  bestMatch: string
  reasoning: string
}
