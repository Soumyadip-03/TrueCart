'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { getBudgetRecommendations } from '@/lib/api'
import type { Product } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  Sparkles, 
  SlidersHorizontal,
  Loader2
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

const CATEGORIES = [
  'All',
  'Smartphones',
  'Laptops',
  'Tablets',
  'Headphones',
  'TV',
  'AC',
  'Refrigerator'
]

export default function BudgetPage() {
  const [budgetEnabled, setBudgetEnabled] = useState(false)
  const [maxPrice, setMaxPrice] = useState('50000')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch recommendations when filters change
  const fetchRecommendations = useCallback(async () => {
    if (!budgetEnabled) {
      setFilteredProducts([])
      return
    }

    setLoading(true)
    const price = parseInt(maxPrice) || 0
    
    const response = await getBudgetRecommendations({
      minPrice: 0,
      maxPrice: price,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      priorities: {},
    })
    
    if (response.success && response.data) {
      setFilteredProducts(response.data.recommendations)
    }
    setLoading(false)
  }, [maxPrice, selectedCategory, budgetEnabled])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value)
  }

  const handleBudgetToggle = (checked: boolean) => {
    setBudgetEnabled(checked)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Recommendations</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Budget Shopping Assistant
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find the best products within your budget
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              {/* Budget Toggle */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className="text-lg font-bold text-primary">₹</span>
                      Budget Filter
                    </CardTitle>
                    <Switch
                      checked={budgetEnabled}
                      onCheckedChange={handleBudgetToggle}
                      aria-label="Toggle budget filter"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {!budgetEnabled ? (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-secondary/20 px-3 py-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Turn on the budget filter to start filtering products
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Maximum Price
                        </label>
                        <Input
                          type="number"
                          value={maxPrice}
                          onChange={handlePriceChange}
                          placeholder="Enter max price"
                          className="mt-2"
                          min="0"
                        />
                      </div>
                      <div className="rounded-lg bg-secondary px-3 py-2 text-center">
                        <p className="text-sm text-muted-foreground">Up to</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatPrice(parseInt(maxPrice) || 0)}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Categories */}
              {budgetEnabled && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'secondary'}
                          className={cn(
                            'cursor-pointer transition-colors',
                            selectedCategory === category
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-secondary/80'
                          )}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results */}
            <div>
              {!budgetEnabled ? (
                <Card className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Sparkles className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">
                    Budget Filter is Off
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Enable the budget filter in the sidebar to start filtering products by price and category
                  </p>
                </Card>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Recommended Products
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {loading ? 'Loading...' : `${filteredProducts.length} products found`}
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex min-h-[40vh] items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <span className="text-2xl font-bold text-muted-foreground">₹</span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        No products found
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Try adjusting your budget or category filter
                      </p>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
