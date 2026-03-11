// ============================================
// MOCK DATABASE
// In production, this would be replaced with actual database queries
// Products data is loaded from /data/products.json
// ============================================

import type { Product, FeatureInsight, FakeReviewAnalysis } from './types'
import productsData from '@/data/products.json'

// Re-export types for backward compatibility
export type { Product, FeatureInsight, FakeReviewAnalysis }

// Load products from external dataset
export const products: Product[] = productsData.products as Product[]

// Load categories from external dataset
export const categories: string[] = productsData.categories
