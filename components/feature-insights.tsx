import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FeatureInsight } from '@/lib/data'

interface FeatureInsightsProps {
  features: FeatureInsight[]
  className?: string
}

export function FeatureInsights({ features, className }: FeatureInsightsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          Feature-Based Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ feature }: { feature: FeatureInsight }) {
  const getSentimentConfig = (sentiment: FeatureInsight['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: TrendingUp,
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          barColor: 'bg-success'
        }
      case 'negative':
        return {
          icon: TrendingDown,
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          barColor: 'bg-destructive'
        }
      default:
        return {
          icon: Minus,
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          barColor: 'bg-warning'
        }
    }
  }

  const config = getSentimentConfig(feature.sentiment)
  const Icon = config.icon

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', config.bgColor)}>
            <Icon className={cn('h-3.5 w-3.5', config.textColor)} />
          </div>
          <span className="font-medium text-foreground">{feature.name}</span>
        </div>
        <span className={cn('text-sm font-semibold', config.textColor)}>
          {feature.score}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all', config.barColor)}
          style={{ width: `${feature.score}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">{feature.insight}</p>
    </div>
  )
}
