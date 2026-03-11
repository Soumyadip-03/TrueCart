import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { ProsConsCard } from '@/components/pros-cons-card'
import { FeatureInsights } from '@/components/feature-insights'
import { FakeReviewSection } from '@/components/fake-review-section'
import { AISummaryCard } from '@/components/ai-summary-card'
import { ChromeExtensionPanel } from '@/components/chrome-extension-panel'
import { PersonalizedInsights } from '@/components/personalized-insights'
import { ArrowLeft, Star, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Fetch product from API
async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    return null
  }
  
  const data = await res.json()
  return data.success ? data.data : null
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Back Navigation */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          {/* Product Header */}
          <div className="mb-8 grid gap-8 lg:grid-cols-[400px_1fr]">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm text-muted-foreground">
                  {product.category}
                </span>
                <span className="text-sm text-muted-foreground">{product.brand}</span>
              </div>

              <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold text-foreground">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <TrustScoreBadge score={product.trustScore} size="lg" />
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="rounded-lg bg-success/10 px-2 py-1 text-sm font-medium text-success">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Amazon
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Analysis
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <QuickStat 
                  label="Reviews Analyzed" 
                  value={product.reviewCount.toLocaleString()} 
                />
                <QuickStat 
                  label="Trust Score" 
                  value={`${product.trustScore}%`} 
                />
                <QuickStat 
                  label="Avg Rating" 
                  value={product.rating.toString()} 
                />
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <AISummaryCard summary={product.aiSummary} className="mb-8" />

          {/* Pros and Cons */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <ProsConsCard type="pros" items={product.pros} />
            <ProsConsCard type="cons" items={product.cons} />
          </div>

          {/* Feature Insights */}
          <FeatureInsights features={product.features} className="mb-8" />

          {/* Fake Review Analysis */}
          <FakeReviewSection analysis={product.fakeReviewAnalysis} className="mb-8" />

          {/* Personalized Insights */}
          <PersonalizedInsights product={product} className="mb-8" />

          {/* Chrome Extension Panel Demo */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Chrome Extension Preview
            </h2>
            <p className="mb-4 text-muted-foreground">
              This is how insights appear on shopping websites with our extension installed.
            </p>
            <ChromeExtensionPanel product={product} />
          </div>
        </div>
      </main>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
