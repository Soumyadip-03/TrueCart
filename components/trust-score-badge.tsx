import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrustScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function TrustScoreBadge({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: TrustScoreBadgeProps) {
  const getScoreConfig = (score: number) => {
    if (score >= 90) {
      return {
        icon: ShieldCheck,
        label: 'Highly Trusted',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        ringColor: 'ring-success/20'
      }
    }
    if (score >= 75) {
      return {
        icon: Shield,
        label: 'Generally Trusted',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        ringColor: 'ring-warning/20'
      }
    }
    return {
      icon: ShieldAlert,
      label: 'Use Caution',
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      ringColor: 'ring-destructive/20'
    }
  }

  const config = getScoreConfig(score)
  const Icon = config.icon

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 gap-1',
      icon: 'h-3 w-3',
      score: 'text-sm font-semibold',
      label: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 gap-1.5',
      icon: 'h-4 w-4',
      score: 'text-base font-bold',
      label: 'text-xs'
    },
    lg: {
      container: 'px-4 py-2 gap-2',
      icon: 'h-5 w-5',
      score: 'text-xl font-bold',
      label: 'text-sm'
    }
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl ring-1',
        config.bgColor,
        config.ringColor,
        sizes.container,
        className
      )}
    >
      <Icon className={cn(config.textColor, sizes.icon)} />
      <span className={cn(config.textColor, sizes.score)}>{score}%</span>
      {showLabel && (
        <span className={cn('text-muted-foreground', sizes.label)}>
          {config.label}
        </span>
      )}
    </div>
  )
}
