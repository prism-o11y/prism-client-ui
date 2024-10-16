import * as React from "react"
import { TooltipProps } from "recharts"

export function ChartContainer({
  children,
  config,
  className,
}: {
  children: React.ReactNode
  config: Record<string, { label: string; color: string }>
  className?: string
}) {
  return (
    <div className={className} style={{ "--color-cpu": config.cpu.color, "--color-memory": config.memory.color } as React.CSSProperties}>
      {children}
    </div>
  )
}

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">CPU</span>
            <span className="font-bold text-muted-foreground">{payload[0].value}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Memory</span>
            <span className="font-bold text-muted-foreground">{payload[1].value}%</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function ChartTooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
              <span className="font-bold text-muted-foreground">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}