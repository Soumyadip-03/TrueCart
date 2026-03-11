import { Header } from '@/components/header'
import { SearchBar } from '@/components/search-bar'
import { Sparkles, TrendingUp, Zap, Shield, ShoppingCart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Review Analysis</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Make smarter shopping decisions with{' '}
              <span className="text-primary">AI insights</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Analyze thousands of product reviews in seconds. Get AI-generated pros, cons, 
              trust scores, and detect fake reviews before you buy.
            </p>
            
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchBar large />
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span>Fake Review Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-warning" />
                <span>Smart Comparisons</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Why shoppers trust TrueCart
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Our AI analyzes reviews from multiple sources to give you the most accurate picture
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="AI-Powered Analysis"
                description="Advanced NLP models analyze thousands of reviews to extract meaningful insights and summarize key points."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Fake Review Detection"
                description="Our algorithms identify suspicious patterns, repetitive wording, and unnatural posting behavior."
              />
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Smart Comparisons"
                description="Compare products side-by-side with AI-generated feature breakdowns and recommendations."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to shop smarter?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Install our Chrome extension to get instant AI insights on any product page.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Sparkles className="h-5 w-5" />
                Install Chrome Extension
              </button>
              <button className="rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ShoppingCart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">TrueCart</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Helping shoppers make informed decisions since 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
