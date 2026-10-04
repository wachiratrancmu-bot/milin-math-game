import { Fragment } from 'react'
import { useSettings } from '../state/SettingsContext'

/**
 * คำที่ตัวตัดคำภาษาไทยของเบราว์เซอร์แยกผิด และอาจถูกขึ้นบรรทัดใหม่กลางคำ
 * (ตรวจด้วย Intl.Segmenter: มิลิน → มิ/ลิน, สติกเกอร์ → สติ/ก/เกอร์)
 */
const KEEP_TOGETHER = ['มิลิน', 'สติกเกอร์', 'สตรอว์เบอร์รี', 'ฮินดูอารบิก', 'คัพเค้ก']

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** แสดงข้อความภาษาไทย โดยไม่ให้ชื่อผู้เล่นและคำที่กำหนดถูกตัดกลางคำ */
export function ThaiText({ text }: { text: string }) {
  const { settings } = useSettings()
  const words = [...new Set([settings.playerName, ...KEEP_TOGETHER])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  const parts = text.split(new RegExp(`(${words.map(escapeRegExp).join('|')})`))
  return (
    <>
      {parts.map((p, i) =>
        words.includes(p) ? (
          <span key={i} className="nobr">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}
