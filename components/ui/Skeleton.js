import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-border via-surface-2 to-border bg-[length:200%_100%] animate-shimmer rounded-sm',
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-1">
        {[1,2,3].map(i => <Skeleton key={i} className="h-4 w-4 rounded-full" />)}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-3">
        <Skeleton className="aspect-square w-full" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-16" />)}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    </div>
  )
}
