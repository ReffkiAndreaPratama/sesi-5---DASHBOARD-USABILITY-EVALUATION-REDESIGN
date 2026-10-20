import type { ReactNode } from 'react'

interface ChartPanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function ChartPanel({ title, subtitle, children, action, className = '' }: ChartPanelProps) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
      {children}
    </div>
  )
}
