/**
 * Product Image Generator
 * Generates unique placeholder images for products based on their category and name
 */

export function generateProductImage(productId: string, productName: string, category: string): string {
  // Use a deterministic hash to generate consistent colors for each product
  const hash = productId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  
  const hue = Math.abs(hash) % 360
  const saturation = 70 + (Math.abs(hash) % 20)
  const lightness = 50 + (Math.abs(hash) % 20)
  
  const bgColor = `hsl(${hue},${saturation}%,${lightness}%)`
  const textColor = lightness > 60 ? '000000' : 'FFFFFF'
  
  // Use placeholder service with custom colors
  const encodedName = encodeURIComponent(productName.substring(0, 20))
  
  // Using placeholder.com service
  return `https://via.placeholder.com/400x400/${bgColor.replace('hsl(', '').replace(')', '').replace(/,/g, '')}/FFFFFF?text=${encodedName}`
}

/**
 * Alternative: Use DiceBear avatars for product images
 */
export function generateProductImageDiceBear(productId: string, productName: string): string {
  const seed = productId.replace(/[^a-zA-Z0-9]/g, '')
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&scale=80&backgroundColor=random`
}

/**
 * Alternative: Use Unsplash for category-based images
 */
export function generateProductImageUnsplash(category: string, productId: string): string {
  const categoryMap: Record<string, string> = {
    'Smartphones': 'mobile-phone',
    'Laptops': 'laptop-computer',
    'Tablets': 'tablet-device',
    'Headphones': 'headphones-audio',
    'TVs': 'television-screen',
    'AC': 'air-conditioner',
    'Refrigerator': 'refrigerator',
  }
  
  const query = categoryMap[category] || 'electronics'
  const seed = productId.charCodeAt(0)
  
  return `https://images.unsplash.com/photo-${seed}?w=400&h=400&fit=crop&q=80`
}

/**
 * Get a consistent image URL for a product
 * Falls back to placeholder if service is unavailable
 */
export function getProductImageUrl(productId: string, productName: string, category: string): string {
  // Using a simple color-based placeholder
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8',
    'F7DC6F', 'BB8FCE', '85C1E2', 'F8B88B', 'A9DFBF'
  ]
  
  const colorIndex = productId.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]
  
  return `https://via.placeholder.com/400x400/${bgColor}/FFFFFF?text=${encodeURIComponent(productName.substring(0, 15))}`
}
