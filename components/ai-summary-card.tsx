import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AISummaryCardProps {
  summary: string
  className?: string
}

export function AISummaryCard({ summary, className }: AISummaryCardProps) {
  return (
    <Card className={cn('overflow-hidden border-primary/20', className)}>
      <CardHeader className="border-b border-primary/20 bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          AI Review Summary
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            Powered by AI
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  )
}
