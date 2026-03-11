import { Sparkles, ThumbsUp, ThumbsDown, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ChromeExtensionPanelProps {
  product: Product
  className?: string
}

export function ChromeExtensionPanel({ product, className }: ChromeExtensionPanelProps) {
  const trustColor = product.trustScore >= 90 
    ? 'text-success' 
    : product.trustScore >= 75 
    ? 'text-warning' 
    : 'text-destructive'

  return (
    <div className={cn('mx-auto max-w-sm', className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">TrueCart</span>
          </div>
          <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Trust Score */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Shield className={cn('h-5 w-5', trustColor)} />
              <span className="text-sm font-medium text-foreground">Trust Score</span>
            </div>
            <span className={cn('text-2xl font-bold', trustColor)}>
              {product.trustScore}%
            </span>
          </div>

          {/* Pros */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">Top Pros</span>
            </div>
            <ul className="space-y-1.5">
              {product.pros.slice(0, 3).map((pro, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">Top Cons</span>
            </div>
            <ul className="space-y-1.5">
              {product.cons.slice(0, 3).map((con, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {con}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Summary */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI Summary</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {product.aiSummary}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-secondary/30 px-4 py-2">
          <p className="text-center text-[10px] text-muted-foreground">
            Based on {product.reviewCount.toLocaleString()} analyzed reviews
          </p>
        </div>
      </div>
    </div>
  )
}
