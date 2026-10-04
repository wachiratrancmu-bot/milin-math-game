import { useEffect, useRef, type ReactNode } from 'react'

// ──────────────────────────────────────────────────────────────
// ส่วนประกอบพื้นฐานที่ใช้ร่วมกัน
// ──────────────────────────────────────────────────────────────

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * กล่องโต้ตอบที่เข้าถึงได้ตาม WCAG: role="dialog", โฟกัสวนอยู่ในกล่อง, ปิดด้วย Esc
 * และคืนโฟกัสไปที่ปุ่มเดิมเมื่อปิด
 */
export function Modal({
  label,
  onClose,
  children,
  wide,
}: {
  label: string
  onClose?: () => void
  children: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const items = () => [...(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    items()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseRef.current) {
        e.preventDefault()
        onCloseRef.current()
      }
      if (e.key === 'Tab') {
        const list = items()
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [])

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current?.()
      }}
    >
      <div
        ref={ref}
        className={`modal ${wide ? 'modalWide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  )
}

/** แถบหัวหน้าจอ: ปุ่มย้อนกลับ ชื่อหน้า และพื้นที่ด้านขวา */
export function TopBar({
  title,
  onBack,
  backLabel = 'กลับ',
  right,
}: {
  title: string
  onBack?: () => void
  backLabel?: string
  right?: ReactNode
}) {
  return (
    <header className="topBar">
      {onBack ? (
        <button className="btn btnGhost btnSmall" onClick={onBack}>
          <span aria-hidden="true">←</span> {backLabel}
        </button>
      ) : (
        <span />
      )}
      <h1 className="topBarTitle">{title}</h1>
      <div className="topBarRight">{right}</div>
    </header>
  )
}

/** แถบความคืบหน้า */
export function ProgressBar({
  value,
  max,
  label,
  tone = 'brand',
}: {
  value: number
  max: number
  label: string
  tone?: 'brand' | 'success' | 'warm'
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div
      className={`progress progress-${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="progressFill" style={{ width: `${pct}%` }} />
    </div>
  )
}
