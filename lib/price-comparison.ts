/**
 * Price Comparison Service
 * Analyzes product prices and ratings across different platforms
 */

export interface PlatformInfo {
  name: string
  price: number
  rating: number
  url?: string
  inStock?: boolean
}

export interface PriceComparison {
  lowestPrice: number
  highestPrice: number
  averagePrice: number
  priceDifference: number
  bestDealPlatform: string
  bestRatedPlatform: string
  bestValuePlatform: string
  platforms: PlatformInfo[]
}

/**
 * Extract platform information from product data
 */
export function extractPlatformInfo(product: any): PlatformInfo[] {
  const platforms: PlatformInfo[] = []

  // Check if product has priceHistory and ratings
  if (product.priceHistory && product.ratings) {
    Object.entries(product.priceHistory).forEach(([platform, price]) => {
      const rating = (product.ratings as Record<string, number>)[platform] || 0
      platforms.push({
        name: capitalizeFirst(platform),
        price: price as number,
        rating: rating,
        url: product.platformUrls?.[platform] || '#',
        inStock: product.inStock?.[platform] !== false,
      })
    })
  }

  return platforms
}

/**
 * Calculate price comparison metrics
 */
export function calculatePriceComparison(platforms: PlatformInfo[]): PriceComparison {
  if (platforms.length === 0) {
    return {
      lowestPrice: 0,
      highestPrice: 0,
      averagePrice: 0,
      priceDifference: 0,
      bestDealPlatform: '',
      bestRatedPlatform: '',
      bestValuePlatform: '',
      platforms: [],
    }
  }

  const prices = platforms.map(p => p.price)
  const lowestPrice = Math.min(...prices)
  const highestPrice = Math.max(...prices)
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  const priceDifference = highestPrice - lowestPrice

  // Find best deal (lowest price)
  const bestDealPlatform = platforms.reduce((prev, current) =>
    prev.price < current.price ? prev : current
  ).name

  // Find best rated platform
  const bestRatedPlatform = platforms.reduce((prev, current) =>
    prev.rating > current.rating ? prev : current
  ).name

  // Find best value (combination of price and rating)
  const bestValuePlatform = platforms.reduce((prev, current) => {
    const prevScore = (current.rating / 5) * 100 - (current.price / highestPrice) * 50
    const currentScore = (prev.rating / 5) * 100 - (prev.price / highestPrice) * 50
    return prevScore > currentScore ? current : prev
  }).name

  return {
    lowestPrice,
    highestPrice,
    averagePrice,
    priceDifference,
    bestDealPlatform,
    bestRatedPlatform,
    bestValuePlatform,
    platforms: platforms.sort((a, b) => a.price - b.price),
  }
}

/**
 * Generate AI recommendation for best platform
 */
export function generatePriceRecommendation(comparison: PriceComparison): string {
  if (comparison.platforms.length === 0) {
    return 'No platform information available.'
  }

  const savings = comparison.highestPrice - comparison.lowestPrice
  const savingsPercent = Math.round((savings / comparison.highestPrice) * 100)

  return `Best deal on ${comparison.bestDealPlatform} at ₹${comparison.lowestPrice.toLocaleString('en-IN')}. ` +
    `${comparison.bestRatedPlatform} has the highest rating (${comparison.platforms.find(p => p.name === comparison.bestRatedPlatform)?.rating}★). ` +
    `Best overall value on ${comparison.bestValuePlatform}. ` +
    `Save up to ₹${savings.toLocaleString('en-IN')} (${savingsPercent}%) by choosing the cheapest option.`
}

/**
 * Format price in Indian Rupees
 */
export function formatIndianPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
