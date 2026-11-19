import { useEffect, useRef, useState } from 'react'

type Point = { label: string; value: number }

type Props = {
  points: Point[]
  ariaLabel: string
  formatAxis: (n: number) => string
  height?: number
  target?: { value: number; label: string }
  /** Label shown beside the last point */
  endLabel?: string
}

const PAD = { top: 16, right: 52, bottom: 26, left: 2 }

/**
 * A quiet line chart drawn at real pixel size (no stretching), so text stays crisp.
 * Flat area fill, 4 gridlines, an optional dashed target line, emphasised last point.
 */
export function LineChart({ points, ariaLabel, formatAxis, height = 240, target, endLabel }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const values = points.map((p) => p.value).concat(target ? [target.value] : [])
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const step = niceStep((rawMax - rawMin) / 4 || rawMax / 4 || 1)
  const min = Math.floor((rawMin - step * 0.25) / step) * step
  const max = Math.ceil((rawMax + step * 0.15) / step) * step
  const ticks: number[] = []
  for (let t = min; t <= max + 1e-6; t += step) ticks.push(t)

  const W = width
  const H = height
  const innerW = Math.max(0, W - PAD.left - PAD.right)
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : 0)
  const y = (v: number) => PAD.top + innerH - ((v - min) / (max - min || 1)) * innerH

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${y(min)} L${x(0)} ${y(min)} Z`
  const every = Math.max(1, Math.ceil((points.length * 44) / Math.max(innerW, 1)))
  const last = points.length - 1
  const narrow = W < 520

  return (
    <div ref={box} className="relative w-full" style={{ height: H }}>
      {W > 0 && (
        <svg role="img" aria-label={ariaLabel} width={W} height={H} className="absolute inset-0 overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right + 8} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
              <text x={W - PAD.right + 14} y={y(t) + 4} fontSize="11" fill="var(--color-subtle)">
                {formatAxis(t)}
              </text>
            </g>
          ))}
          {target && (
            <g>
              <line
                x1={PAD.left}
                x2={W - PAD.right + 8}
                y1={y(target.value)}
                y2={y(target.value)}
                stroke="var(--color-ink)"
                strokeDasharray="4 4"
              />
              <text x={PAD.left + 4} y={y(target.value) - 6} fontSize="11" fill="var(--color-ink)" fontWeight={500}>
                {target.label}
              </text>
            </g>
          )}
          <path d={area} fill="var(--color-accent)" fillOpacity={0.06} />
          <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) =>
            i % every === 0 || i === last ? (
              <text
                key={p.label + i}
                x={x(i)}
                y={H - 6}
                fontSize="11"
                fill={i === last ? 'var(--color-ink)' : 'var(--color-subtle)'}
                fontWeight={i === last ? 500 : 400}
                textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}
              >
                {narrow && i !== 0 && i !== last ? '' : p.label}
              </text>
            ) : null,
          )}
          <line
            x1={x(last)}
            x2={x(last)}
            y1={y(points[last].value)}
            y2={y(min)}
            stroke="var(--color-accent)"
            strokeDasharray="2 3"
          />
          <circle cx={x(last)} cy={y(points[last].value)} r={4.5} fill="var(--color-panel)" stroke="var(--color-accent)" strokeWidth={2} />
          {endLabel && (
            <text
              x={x(last) - 10}
              y={y(points[last].value) - 10}
              fontSize="12"
              fontWeight={600}
              fill="var(--color-ink)"
              textAnchor="end"
            >
              {endLabel}
            </text>
          )}
        </svg>
      )}
    </div>
  )
}

function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw))
  const f = raw / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p
}
