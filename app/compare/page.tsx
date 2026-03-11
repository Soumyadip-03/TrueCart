'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import type { Product } from '@/lib/types'
import { getProducts } from '@/lib/api'
import { 
  ArrowLeftRight, 
  Check, 
  X, 
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatPrice } from '@/lib/utils'

const comparisonFeatures = ['Battery', 'Camera', 'Performance', 'Build Quality', 'Display', 'Value']

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productA, setProductA] = useState<Product | null>(null)
  const [productB, setProductB] = useState<Product | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const response = await getProducts({ limit: 20 })
      if (response.success && response.data) {
        setProducts(response.data.products)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleSwap = () => {
    const temp = productA
    setProductA(productB)
    setProductB(temp)
  }

  const getFeatureScore = (product: Product | null, featureName: string): number => {
    if (!product) return 0
    const feature = product.features.find(
      (f) => f.name.toLowerCase() === featureName.toLowerCase()
    )
    return feature?.score ?? 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Compare Products
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Side-by-side AI-powered comparison of products
            </p>
          </div>

          {/* Product Selection with Swap Button */}
          <div className="mb-12 grid grid-cols-[1fr_auto_1fr] items-start gap-4">
            {/* Product A Selector */}
            <ProductSelectorBox
              selected={productA}
              onSelect={setProductA}
              exclude={productB?.id}
              products={products}
            />

            {/* Swap Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleSwap}
                disabled={!productA || !productB}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Swap products"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>
            </div>

            {/* Product B Selector */}
            <ProductSelectorBox
              selected={productB}
              onSelect={setProductB}
              exclude={productA?.id}
              products={products}
            />
          </div>

          {/* Comparison Cards */}
          {productA && productB && (
            <>
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <ComparisonCard product={productA} />
                <ComparisonCard product={productB} />
              </div>

              {/* Feature Comparison */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {comparisonFeatures.map((feature) => {
                      const scoreA = getFeatureScore(productA, feature)
                      const scoreB = getFeatureScore(productB, feature)
                      const winner = scoreA > scoreB ? 'a' : scoreB > scoreA ? 'b' : 'tie'

                      return (
                        <div key={feature}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {feature}
                            </span>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={cn(
                                'font-semibold',
                                winner === 'a' ? 'text-success' : 'text-muted-foreground'
                              )}>
                                {scoreA}%
                              </span>
                              <span className="text-muted-foreground">vs</span>
                              <span className={cn(
                                'font-semibold',
                                winner === 'b' ? 'text-success' : 'text-muted-foreground'
                              )}>
                                {scoreB}%
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    winner === 'a' ? 'bg-success' : 'bg-primary'
                                  )}
                                  style={{ width: `${scoreA}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={cn(
                                    'ml-auto h-full rounded-full transition-all',
                                    winner === 'b' ? 'bg-success' : 'bg-primary'
                                  )}
                                  style={{ width: `${scoreB}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Pros & Cons Comparison */}
              <div className="grid gap-6 md:grid-cols-2">
                <ProsConsComparison product={productA} />
                <ProsConsComparison product={productB} />
              </div>
            </>
          )}

          {/* Empty State */}
          {(!productA || !productB) && (
            <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">Select two products to compare</p>
                <p className="mt-2 text-muted-foreground">Choose products from the boxes above</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ProductSelectorBox({
  selected,
  onSelect,
  exclude,
  products,
}: {
  selected: Product | null
  onSelect: (product: Product) => void
  exclude?: string
  products: Product[]
}) {
  const availableProducts = products.filter((p) => p.id !== exclude)

  if (selected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(selected.price)}</p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[320px]">
          {availableProducts.map((product) => (
            <DropdownMenuItem
              key={product.id}
              onClick={() => onSelect(product)}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-all hover:border-primary/50 hover:bg-card">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/50">
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Select Product</p>
            <p className="text-sm text-muted-foreground">Click to choose a product</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]">
        {availableProducts.map((product) => (
          <DropdownMenuItem
            key={product.id}
            onClick={() => onSelect(product)}
            className="flex items-center gap-3 p-3 cursor-pointer"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-secondary">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ComparisonCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-xl bg-secondary">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="mt-2 font-semibold text-foreground">{product.name}</h3>
          <p className="mt-3 text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
          <div className="mt-4">
            <TrustScoreBadge score={product.trustScore} size="md" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {product.reviewCount.toLocaleString()} reviews
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProsConsComparison({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-success">
            <ThumbsUp className="h-4 w-4" />
            Pros
          </div>
          <ul className="space-y-2">
            {product.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-sm text-muted-foreground">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
            <ThumbsDown className="h-4 w-4" />
            Cons
          </div>
          <ul className="space-y-2">
            {product.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span className="text-sm text-muted-foreground">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
