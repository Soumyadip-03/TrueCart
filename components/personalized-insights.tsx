'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Sparkles, 
  Battery, 
  Camera, 
  Gamepad2, 
  Wallet, 
  Shield,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

const priorities = [
  { id: 'battery', label: 'Battery Life Priority', icon: Battery, feature: 'Battery' },
  { id: 'camera', label: 'Camera Quality Priority', icon: Camera, feature: 'Camera' },
  { id: 'gaming', label: 'Gaming Performance', icon: Gamepad2, feature: 'Performance' },
  { id: 'value', label: 'Budget Value', icon: Wallet, feature: 'Value' },
  { id: 'durability', label: 'Durability', icon: Shield, feature: 'Build Quality' },
]

interface PersonalizedInsightsProps {
  product: Product
  className?: string
}

export function PersonalizedInsights({ product, className }: PersonalizedInsightsProps) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['camera', 'battery'])

  const togglePriority = (priorityId: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priorityId)
        ? prev.filter((p) => p !== priorityId)
        : [...prev, priorityId]
    )
  }

  const getPersonalizedInsights = () => {
    if (selectedPriorities.length === 0) {
      return product.features.slice(0, 3)
    }

    return selectedPriorities
      .map((priorityId) => {
        const priority = priorities.find((p) => p.id === priorityId)
        if (!priority) return null
        return product.features.find(
          (f) => f.name.toLowerCase() === priority.feature.toLowerCase()
        )
      })
      .filter(Boolean)
  }

  const insights = getPersonalizedInsights()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          Personalized Insights
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            Dynamic
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Insights Display */}
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Based on your selected priorities, here are the most relevant insights:
            </p>
            
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight) => {
                  if (!insight) return null
                  const isPositive = insight.sentiment === 'positive'
                  const isNegative = insight.sentiment === 'negative'
                  
                  return (
                    <div
                      key={insight.name}
                      className={cn(
                        'rounded-xl border p-4',
                        isPositive && 'border-success/20 bg-success/5',
                        isNegative && 'border-destructive/20 bg-destructive/5',
                        !isPositive && !isNegative && 'border-warning/20 bg-warning/5'
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">{insight.name}</span>
                        <span className={cn(
                          'text-lg font-bold',
                          isPositive && 'text-success',
                          isNegative && 'text-destructive',
                          !isPositive && !isNegative && 'text-warning'
                        )}>
                          {insight.score}%
                        </span>
                      </div>
                      <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            isPositive && 'bg-success',
                            isNegative && 'bg-destructive',
                            !isPositive && !isNegative && 'bg-warning'
                          )}
                          style={{ width: `${insight.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.insight}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
                <RefreshCw className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select priorities to see personalized insights
                </p>
              </div>
            )}
          </div>

          {/* Priority Toggles */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Your Priorities
            </h4>
            <div className="space-y-3">
              {priorities.map((priority) => {
                const Icon = priority.icon
                const isSelected = selectedPriorities.includes(priority.id)
                
                return (
                  <div
                    key={priority.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 transition-colors',
                      isSelected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-transparent bg-secondary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn(
                        'h-4 w-4',
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <Label
                        htmlFor={`priority-${priority.id}`}
                        className={cn(
                          'cursor-pointer text-sm',
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {priority.label}
                      </Label>
                    </div>
                    <Switch
                      id={`priority-${priority.id}`}
                      checked={isSelected}
                      onCheckedChange={() => togglePriority(priority.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
