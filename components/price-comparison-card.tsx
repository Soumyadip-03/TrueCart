'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingDown, Star, ExternalLink, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriceComparison } from '@/lib/price-comparison'

interface PriceComparisonCardProps {
  comparison: PriceComparison
  className?: string
}

export function PriceComparisonCard({ comparison, className }: PriceComparisonCardProps) {
  if (comparison.platforms.length === 0) {
    return null
  }

  const bestDealPlatform = comparison.platforms[0]
  const savings = comparison.highestPrice - comparison.lowestPrice
  const savingsPercent = Math.round((savings / comparison.highestPrice) * 100)

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-success" />
            Price Comparison Across Platforms
          </CardTitle>
          <Badge variant="outline" className="text-success">
            Save up to ₹{savings.toLocaleString('en-IN')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Lowest Price</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              ₹{comparison.lowestPrice.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{comparison.bestDealPlatform}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Average Price</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              ₹{comparison.averagePrice.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">All platforms</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Highest Price</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              ₹{comparison.highestPrice.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{comparison.platforms[comparison.platforms.length - 1].name}</p>
          </div>
        </div>

        {/* Platform List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Available on:</p>
          <div className="space-y-2">
            {comparison.platforms.map((platform) => {
              const isBestDeal = platform.name === comparison.bestDealPlatform
              const isBestRated = platform.name === comparison.bestRatedPlatform
              const isBestValue = platform.name === comparison.bestValuePlatform

              return (
                <div
                  key={platform.name}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 transition-colors',
                    isBestDeal ? 'border-success/50 bg-success/5' : 'border-border bg-card'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{platform.name}</p>
                      <div className="flex gap-1">
                        {isBestDeal && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                            Best Deal
                          </Badge>
                        )}
                        {isBestRated && (
                          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                            Best Rated
                          </Badge>
                        )}
                        {isBestValue && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                            Best Value
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        ₹{platform.price.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span className="text-xs font-medium text-foreground">{platform.rating}</span>
                      </div>
                      {platform.inStock === false && (
                        <span className="text-xs text-destructive">Out of Stock</span>
                      )}
                      {platform.inStock !== false && (
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="h-3 w-3" />
                          In Stock
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    asChild
                  >
                    <a href={platform.url || '#'} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Visit</span>
                    </a>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">💡 Recommendation</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Buy from <span className="font-semibold text-foreground">{comparison.bestValuePlatform}</span> for the best overall value. 
            You'll get a great rating ({comparison.platforms.find(p => p.name === comparison.bestValuePlatform)?.rating}★) 
            at a competitive price of ₹{comparison.platforms.find(p => p.name === comparison.bestValuePlatform)?.price.toLocaleString('en-IN')}.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
