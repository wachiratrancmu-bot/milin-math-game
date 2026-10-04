import { useId } from 'react'
import type { NumberLineSpec } from '../types'

// ──────────────────────────────────────────────────────────────
// เส้นจำนวน: ในโจทย์ทำเครื่องหมายจุดเริ่มต้น ในวิธีคิดแสดงการกระโดดทีละ 1 ช่อง
// นับเพิ่ม = เดินไปทางขวา · ถอยหลัง = เดินไปทางซ้าย
// ──────────────────────────────────────────────────────────────

const GAP = 40
const PAD = 22

export function NumberLine({
  spec,
  showJumps = false,
  markEnd = false,
}: {
  spec: NumberLineSpec
  /** แสดงการกระโดดจาก start ไป end (ใช้ในวิธีคิด) */
  showJumps?: boolean
  /** ทำเครื่องหมายจุดปลายด้วย (เมื่อโจทย์บอกจุดปลายมาแล้ว) */
  markEnd?: boolean
}) {
  const markerId = `arrow${useId().replace(/:/g, '')}`
  const { min, max, start, end } = spec
  const width = PAD * 2 + (max - min) * GAP
  const axisY = showJumps ? 72 : 30
  const height = axisY + 44
  const x = (v: number) => PAD + (v - min) * GAP
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const step = end >= start ? 1 : -1
  const jumps = showJumps
    ? Array.from({ length: Math.abs(end - start) }, (_, i) => start + i * step)
    : []

  const label = showJumps
    ? `เส้นจำนวนตั้งแต่ ${min} ถึง ${max} ${step > 0 ? 'นับเพิ่ม' : 'ถอยหลัง'}จาก ${start} ไปถึง ${end} รวม ${Math.abs(end - start)} ช่อง`
    : `เส้นจำนวนตั้งแต่ ${min} ถึง ${max} จุดเริ่มต้นอยู่ที่ ${start}${markEnd ? ` จุดปลายอยู่ที่ ${end}` : ''}`

  return (
    <figure className="numberLine">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: `${width * 1.25}px` }}
        role="img"
        aria-label={label}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <line x1={6} y1={axisY} x2={width - 6} y2={axisY} stroke="var(--ink-2)" strokeWidth={2.5} />
        <path d={`M${width - 6},${axisY} l-9,-6 v12 z`} fill="var(--ink-2)" />
        <path d={`M6,${axisY} l9,-6 v12 z`} fill="var(--ink-2)" />
        {jumps.map((v, i) => {
          const x1 = x(v)
          const x2 = x(v + step)
          return (
            <g key={v}>
              <path
                d={`M${x1},${axisY - 8} Q${(x1 + x2) / 2},${axisY - 46} ${x2},${axisY - 10}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2.5}
                markerEnd={`url(#${markerId})`}
              />
              <text
                x={(x1 + x2) / 2}
                y={axisY - 40}
                textAnchor="middle"
                fontSize={14}
                fontWeight={700}
                fill="var(--accent-ink)"
              >
                {i + 1}
              </text>
            </g>
          )
        })}
        {ticks.map((v) => {
          const isStart = v === start
          const isEnd = v === end && (showJumps || markEnd)
          return (
            <g key={v}>
              <line
                x1={x(v)}
                y1={axisY - 8}
                x2={x(v)}
                y2={axisY + 8}
                stroke="var(--ink-2)"
                strokeWidth={2}
              />
              {(isStart || isEnd) && (
                <circle
                  cx={x(v)}
                  cy={axisY}
                  r={8}
                  fill={isStart ? 'var(--brand)' : 'var(--success)'}
                />
              )}
              <text
                x={x(v)}
                y={axisY + 30}
                textAnchor="middle"
                fontSize={17}
                fontWeight={isStart || isEnd ? 700 : 400}
                fill={isStart ? 'var(--brand-700)' : isEnd ? 'var(--success)' : 'var(--ink)'}
              >
                {v}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
