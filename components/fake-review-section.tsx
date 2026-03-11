'use client'

import { ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FakeReviewAnalysis } from '@/lib/data'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface FakeReviewSectionProps {
  analysis: FakeReviewAnalysis
  className?: string
}

export function FakeReviewSection({ analysis, className }: FakeReviewSectionProps) {
  const chartData = [
    { name: 'Authentic', value: analysis.authenticReviews, color: 'hsl(var(--success))' },
    { name: 'Suspicious', value: analysis.suspiciousReviews, color: 'hsl(var(--destructive))' },
  ]

  const totalReviews = analysis.authenticReviews + analysis.suspiciousReviews

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          Fake Review Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <div className="relative h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                            <p className="text-sm font-medium text-foreground">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value.toLocaleString()} reviews
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {analysis.trustPercentage}%
                </span>
                <span className="text-xs text-muted-foreground">Authentic</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Suspicious</span>
              </div>
            </div>
          </div>

          {/* Stats and Flags */}
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<CheckCircle className="h-5 w-5 text-success" />}
                label="Authentic Reviews"
                value={analysis.authenticReviews.toLocaleString()}
                percentage={`${((analysis.authenticReviews / totalReviews) * 100).toFixed(1)}%`}
                variant="success"
              />
              <StatCard
                icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
                label="Suspicious Reviews"
                value={analysis.suspiciousReviews.toLocaleString()}
                percentage={`${((analysis.suspiciousReviews / totalReviews) * 100).toFixed(1)}%`}
                variant="destructive"
              />
            </div>

            {/* Detection Flags */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Detection Analysis
              </h4>
              <ul className="space-y-2">
                {analysis.flags.map((flag, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <span className="text-sm text-muted-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({
  icon,
  label,
  value,
  percentage,
  variant,
}: {
  icon: React.ReactNode
  label: string
  value: string
  percentage: string
  variant: 'success' | 'destructive'
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        variant === 'success'
          ? 'border-success/20 bg-success/5'
          : 'border-destructive/20 bg-destructive/5'
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">
            {label} ({percentage})
          </p>
        </div>
      </div>
    </div>
  )
}
