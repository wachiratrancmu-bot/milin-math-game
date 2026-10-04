import type { KeyboardEvent } from 'react'
import { formatEntry } from '../lib/format'

// ──────────────────────────────────────────────────────────────
// แป้นกดสำหรับข้อเติมคำตอบ: ปุ่มใหญ่สำหรับนิ้วเด็ก และไม่ให้แป้นพิมพ์ของโทรศัพท์บังโจทย์
// ข้อเขียนประโยคสัญลักษณ์มีปุ่ม + − = เพิ่ม · ใช้แป้นพิมพ์จริงได้ด้วยบนคอมพิวเตอร์
// ──────────────────────────────────────────────────────────────

const MAX_LENGTH = 12

export function Keypad({
  id,
  label,
  value,
  onChange,
  onSubmit,
  sentence,
  disabled,
  submitLabel = 'ตรวจคำตอบ',
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  /** ไม่ส่ง = ไม่มีปุ่มยืนยัน (ใช้ในข้อสอบจำลอง) */
  onSubmit?: () => void
  /** เปิดปุ่ม + − = สำหรับเขียนประโยคสัญลักษณ์ */
  sentence?: boolean
  disabled?: boolean
  submitLabel?: string
}) {
  const press = (key: string) => {
    if (disabled) return
    if (key === 'back') return onChange(value.slice(0, -1))
    if (key === 'clear') return onChange('')
    if (value.length >= MAX_LENGTH) return
    onChange(value + key)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (/^[0-9]$/.test(e.key)) press(e.key)
    else if (sentence && e.key === '+') press('+')
    else if (sentence && (e.key === '-' || e.key === '−')) press('−')
    else if (sentence && e.key === '=') press('=')
    else if (e.key === 'Backspace') press('back')
    else if (e.key === 'Enter' && onSubmit && value) onSubmit()
    else return
    e.preventDefault()
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  return (
    <div className={`keypadWrap ${disabled ? 'keypadDisabled' : ''}`}>
      <label className="srOnly" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="keypadDisplay"
        value={formatEntry(value)}
        placeholder={sentence ? 'เช่น 2 + 4 = 6' : 'คำตอบ'}
        inputMode="none"
        readOnly
        disabled={disabled}
        onKeyDown={onKeyDown}
        aria-describedby={`${id}-help`}
      />
      <p id={`${id}-help`} className="srOnly">
        กดปุ่มตัวเลข{sentence ? ' และเครื่องหมาย บวก ลบ เท่ากับ' : ''} หรือพิมพ์จากแป้นพิมพ์
      </p>
      {!disabled && (
        <div className="keypad" role="group" aria-label="แป้นกด">
          {digits.map((d) => (
            <button key={d} type="button" className="key" onClick={() => press(d)}>
              {d}
            </button>
          ))}
          <button
            type="button"
            className="key keyMuted"
            onClick={() => press('clear')}
            aria-label="ล้างทั้งหมด"
          >
            ล้าง
          </button>
          <button type="button" className="key" onClick={() => press('0')}>
            0
          </button>
          <button
            type="button"
            className="key keyMuted"
            onClick={() => press('back')}
            aria-label="ลบตัวสุดท้าย"
          >
            ⌫
          </button>
          {sentence && (
            <>
              <button
                type="button"
                className="key keyOp"
                onClick={() => press('+')}
                aria-label="บวก"
              >
                +
              </button>
              <button
                type="button"
                className="key keyOp"
                onClick={() => press('−')}
                aria-label="ลบ"
              >
                −
              </button>
              <button
                type="button"
                className="key keyOp"
                onClick={() => press('=')}
                aria-label="เท่ากับ"
              >
                =
              </button>
            </>
          )}
        </div>
      )}
      {onSubmit && !disabled && (
        <button
          type="button"
          className="btn btnPrimary btnLarge"
          disabled={!value}
          onClick={onSubmit}
        >
          {submitLabel}
        </button>
      )}
    </div>
  )
}
