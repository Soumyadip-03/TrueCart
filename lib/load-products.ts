// ============================================
// PRODUCT LOADER
// Dynamically loads all category JSON files
// ============================================

import type { Product } from './types'
import fs from 'fs'
import path from 'path'

/**
 * Load all products from category JSON files
 */
export function loadAllProducts(): Product[] {
  const categoriesDir = path.join(process.cwd(), 'data', 'categories')
  
  // Check if categories directory exists
  if (!fs.existsSync(categoriesDir)) {
    console.warn('Categories directory not found at:', categoriesDir)
    return []
  }

  const allProducts: Product[] = []
  
  try {
    // Read all JSON files from categories directory
    const files = fs.readdirSync(categoriesDir).filter(file => file.endsWith('.json'))
    
    files.forEach(file => {
      try {
        const filePath = path.join(categoriesDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(fileContent)
        
        // Handle both array and object with products property
        const products = Array.isArray(data) ? data : data.products || []
        allProducts.push(...products)
      } catch (error) {
        console.error(`Error loading ${file}:`, error)
      }
    })
  } catch (error) {
    console.error('Error reading categories directory:', error)
  }

  return allProducts
}

/**
 * Extract unique categories from products
 */
export function extractCategories(products: Product[]): string[] {
  const categories = new Set<string>(['All'])
  
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category)
    }
  })
  
  return Array.from(categories).sort()
}
