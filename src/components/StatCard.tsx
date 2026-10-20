import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: number        // positive = up, negative = down, 0/undefined = neutral
  trendLabel?: string
  colorClass?: string   // Tailwind text color for icon background
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  colorClass = 'text-primary-600',
}: StatCardProps) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown
  const trendColor = trend === undefined || trend === 0
    ? 'text-gray-500'
    : trend > 0 ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className="card p-5" role="region" aria-label={title}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400 truncate">{subtitle}</p>
          )}
          {(trend !== undefined || trendLabel) && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={13} />
              <span>{trendLabel ?? `${Math.abs(trend ?? 0)}%`}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`ml-4 shrink-0 p-2.5 rounded-lg bg-gray-50 ${colorClass}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
