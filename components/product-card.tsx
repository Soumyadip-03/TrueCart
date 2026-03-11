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

// Generate unique image URL using DiceBear API
function getProductImageUrl(productId: string): string {
  // DiceBear provides reliable, fast avatar/image generation
  const seed = productId.replace(/[^a-zA-Z0-9]/g, '')
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&scale=80&backgroundColor=random&size=400`
}

export function ProductCard({ product, className }: ProductCardProps) {
  const trustColor = product.trustScore >= 90 
    ? 'bg-success text-success-foreground' 
    : product.trustScore >= 75 
    ? 'bg-warning text-warning-foreground' 
    : 'bg-destructive text-destructive-foreground'

  const imageUrl = getProductImageUrl(product.id)

  return (
    <Link href={`/product/${product.id}`}>
      <Card className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
        className
      )}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              unoptimized
            />
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
