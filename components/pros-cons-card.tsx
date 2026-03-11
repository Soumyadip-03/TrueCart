import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProsConsCardProps {
  type: 'pros' | 'cons'
  items: string[]
  className?: string
}

export function ProsConsCard({ type, items, className }: ProsConsCardProps) {
  const isPros = type === 'pros'
  
  return (
    <Card className={cn(
      'overflow-hidden',
      isPros ? 'border-success/20' : 'border-destructive/20',
      className
    )}>
      <CardHeader className={cn(
        'border-b',
        isPros 
          ? 'border-success/20 bg-success/5' 
          : 'border-destructive/20 bg-destructive/5'
      )}>
        <CardTitle className="flex items-center gap-2 text-lg">
          {isPros ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <ThumbsUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-success">Pros</span>
            </>
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <ThumbsDown className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-destructive">Cons</span>
            </>
          )}
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {items.length} points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-4">
              <div className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                isPros ? 'bg-success/10' : 'bg-destructive/10'
              )}>
                {isPros ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <X className="h-3 w-3 text-destructive" />
                )}
              </div>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
