import Link from 'next/link'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const trustColor = product.trustScore >= 90 
    ? 'bg-success text-success-foreground' 
    : product.trustScore >= 75 
    ? 'bg-warning text-warning-foreground' 
    : 'bg-destructive text-destructive-foreground'

  // Use a simple color-based background
  const colors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-yellow-400 to-yellow-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
  ]
  
  const colorIndex = product.id.charCodeAt(0) % colors.length
  const gradientClass = colors[colorIndex]

  return (
    <Link href={`/product/${product.id}`}>
      <Card className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
        className
      )}>
        <CardContent className="p-0">
          <div className={cn(
            'relative aspect-square overflow-hidden bg-gradient-to-br flex items-center justify-center',
            gradientClass
          )}>
            <div className="text-center text-white">
              <div className="text-5xl font-bold opacity-20 mb-2">
                {product.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-semibold opacity-70">
                {product.category}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute right-3 top-3">
              <Badge className={cn('gap-1 font-semibold', trustColor)}>
                <Shield className="h-3 w-3" />
                {product.trustScore}%
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
              <p className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">{product.category}</p>
            </div>
            <h3 className="mt-1 font-semibold text-foreground line-clamp-2 text-balance">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <ThumbsUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {product.pros[0]}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ThumbsDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {product.cons[0]}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{product.reviewCount.toLocaleString()} reviews</span>
              <span>·</span>
              <span>{product.rating} rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
