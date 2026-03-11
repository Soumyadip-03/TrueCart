// ============================================
// MOCK DATABASE
// In production, this would be replaced with actual database queries
// Products data is loaded from /data/categories/*.json files
// ============================================

import type { Product, FeatureInsight, FakeReviewAnalysis } from './types'
import { loadAllProducts, extractCategories } from './load-products'

// Re-export types for backward compatibility
export type { Product, FeatureInsight, FakeReviewAnalysis }

// Load products from all category files
export const products: Product[] = loadAllProducts()

// Extract categories from products
export const categories: string[] = extractCategories(products)
