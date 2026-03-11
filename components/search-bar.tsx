'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchProductByUrl } from '@/lib/api'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  large?: boolean
  className?: string
}

export function SearchBar({ large = false, className }: SearchBarProps) {
  const [url, setUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const handlePasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      setError(null)
    } catch {
      setError('Unable to read clipboard. Please paste manually.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please enter a product URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await searchProductByUrl(url)
      
      if (response.success && response.data) {
        // Navigate to product details page
        router.push(`/product/${response.data.id}`)
        setUrl('')
      } else {
        setError(response.message || 'Product not found in our database')
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'relative flex items-center rounded-2xl border bg-card transition-all duration-200',
            isFocused
              ? 'border-primary ring-4 ring-primary/10'
              : 'border-border hover:border-primary/50',
            large ? 'p-2' : 'p-1'
          )}
        >
          <div className={cn('flex items-center gap-2 pl-4', large ? 'pr-2' : 'pr-1')}>
            {loading ? (
              <Loader2 className={cn('animate-spin text-primary', large ? 'h-5 w-5' : 'h-4 w-4')} />
            ) : (
              <Search className={cn('text-muted-foreground', large ? 'h-5 w-5' : 'h-4 w-4')} />
            )}
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError(null)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste product link here..."
            className={cn(
              'flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none',
              large ? 'py-3 text-lg' : 'py-2 text-sm'
            )}
            disabled={loading}
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              type="button"
              onClick={handlePasteLink}
              disabled={loading}
              className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
            >
              <span>Paste Link</span>
            </button>
            <Button
              type="submit"
              size={large ? 'default' : 'sm'}
              disabled={loading}
              className={cn('gap-2', large && 'px-6')}
            >
              <Search className={cn(large ? 'h-4 w-4' : 'h-3 w-3')} />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Search Result</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
